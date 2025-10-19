# System Patterns

## Architektura Systemu

### Ogólny Przegląd
Aplikacja to single-page application (SPA) oparta na Leaflet.js i TypeScript, budowana przez Webpack. Używa **Service Layer** pattern z komponentami UI.

```
┌─────────────────────────────────────────┐
│         Browser (665px width)           │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │      Leaflet Map Container        │  │
│  │  - OpenStreetMap tiles            │  │
│  │  - 25 markers with custom icons   │  │
│  │  - Popups with business details   │  │
│  │  - Legend panel (bottom-right)    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Cards Container              │  │
│  │  - 25 business cards              │  │
│  │  - Image carousels (3 thumbnails) │  │
│  │  - Lightbox gallery               │  │
│  │  - Full details + descriptions    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Footer                       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Kluczowe Komponenty

### 1. App Class (`App.ts`)
**Odpowiedzialność**: Main application controller, orchestration

**Struktura**:
```typescript
class App {
  private mapService: MapService
  private cardService: CardService
  private points: Point[]
  
  constructor() // Inicjalizacja z retry logic
  initializeData() // Load z JSON → Point instances
  initializeApp() // Setup map, legend, cards, footer
}
```

**Wzorzec**: Application Controller + Dependency Injection

**Kluczowe cechy**:
- Retry logic dla DOM readiness (100ms timeout)
- Centralized initialization
- Service orchestration

### 2. MapService (`services/MapService.ts`)
**Odpowiedzialność**: Zarządzanie mapą Leaflet i markerami

**API**:
```typescript
class MapService {
  constructor(containerId: string) // Tworzy mapę
  addMarker(point: Point): Marker // Dodaje marker
  addMarkers(points: Point[]): void // Bulk add
  createLegend(points: Point[]): void // Tworzy legendę
  clearMarkers(): void // Cleanup
  getMap(): Map
  getMarkers(): Marker[]
}
```

**Wzorzec**: Service Layer

**Kluczowe cechy**:
- Auto-sizing container (min 500px height)
- Grouped legend by category
- Click handlers dla legend items → zoom

### 3. CardService (`services/CardService.ts`)
**Odpowiedzialność**: Zarządzanie kartami biznesów

**API**:
```typescript
class CardService {
  constructor(containerId: string)
  addCard(point: IPoint): Card
  addCards(points: IPoint[]): void
  clearCards(): void
  getCards(): Card[]
  getCardByPoint(point: IPoint): Card | undefined
}
```

**Wzorzec**: Service Layer + Collection Management

### 4. Card Component (`components/Card.ts`)
**Odpowiedzialność**: UI component dla pojedynczej karty biznesu

**API**:
```typescript
class Card {
  constructor(point: IPoint)
  getElement(): HTMLElement
  getPoint(): IPoint
  
  private createCardElement()
  private initializeCarousel()
  private attachEventListeners()
}
```

**Wzorzec**: Component Pattern

**Kluczowe cechy**:
- Generuje HTML dynamically
- Integracja z Carousel (jeśli images exist)
- Event delegation dla lightbox

### 5. Carousel Component (`components/Carousel.ts`)
**Odpowiedzialność**: Slider dla miniatur zdjęć

**API**:
```typescript
class Carousel {
  constructor(container: HTMLElement, images: string[])
  
  private render() // Shows max 3 thumbnails
  private next() // Navigate right
  private previous() // Navigate left
  private updateVisibleImages()
  
  getImages(): string[]
  getCurrentIndex(): number
}
```

**Wzorzec**: Component Pattern

**Kluczowe cechy**:
- Shows max 3 thumbnails + "+X more" indicator
- Arrow navigation
- Updates visible range on scroll

### 6. Lightbox Component (`components/Lightbox.ts`)
**Odpowiedzialność**: Full-screen image viewer

**API**:
```typescript
class Lightbox {
  constructor(images: string[], currentIndex: number)
  
  private render() // Creates fullscreen overlay
  private next() // Next image
  private previous() // Previous image
  private updateImage()
  
  close(): void
  onClose(callback: () => void): void
}
```

**Wzorzec**: Component Pattern + Modal

**Kluczowe cechy**:
- Fullscreen overlay
- Keyboard navigation (←, →, Escape)
- Image counter (X / Y)
- Click to close
- Callback support

### 7. Point Class (`types/Point.ts`)
**Odpowiedzialność**: Model danych dla pojedynczego punktu na mapie

**Struktura**:
```typescript
interface IPoint {
  latitude: number
  longitude: number
  name: string
  legendName: string
  legendSubName: string
  addresses: string[]
  emails: string[]
  phoneNumbers: string[]
  product: string
  image: string
  images: string[]  // NOWE: tablica zdjęć
  facebook: string
  webpage: string
  icon: string
  description: string
  color: string
}

class Point implements IPoint {
  generatePopup(): string  // Generuje HTML dla popup
}
```

**Wzorzec**: Domain Model with View Logic

### 8. Utils Module (`utils.ts`)
**Odpowiedzialność**: Funkcje pomocnicze do generowania HTML

**Funkcje**:
- `generateWebPageHTML()`
- `generateProductHTML()`
- `generateFacebookHTML()`
- `generateImageHTML()`
- `generateImagesHTML()` // NOWE: dla tablicy zdjęć
- `generateAddressesHTML()`
- `generateEmailsHTML()`
- `generatePhoneNumbersHTML()`

**Wzorzec**: Pure Helper Functions

## Wzorce Projektowe

### 1. Data-Driven Rendering
Wszystkie punkty są w `data.json` i renderowane dynamicznie:
```
data.json → Point[] → Markers + Legend + Cards
```

**Zalety**:
- Łatwe dodawanie/usuwanie punktów bez zmian w kodzie
- Jednolita struktura danych
- Centralizacja treści

### 2. Separation of Concerns
- **Model**: `point.ts` - logika danych
- **View Generators**: `utils.ts` - generowanie HTML
- **Controller**: `map.ts` - orkiestracja i logika biznesowa
- **Styles**: `map-style.scss` - stylowanie

### 3. Defensive Programming
Wszędzie sprawdzanie wartości przed użyciem:
```typescript
const htmlImage = !!image 
  ? `<img src=${image}>` 
  : "";

if (!mapContainer) {
  return;
}
```

### 4. Event-Driven Architecture
- Kliknięcie markera → zoom + popup
- Kliknięcie elementu legendy → zoom do punktu
- Kliknięcie X w popup → preventDefault (pozostaw otwarty)

## Kluczowe Decyzje Architektoniczne

### 1. Leaflet.js jako Podstawa
**Dlaczego**: 
- Open source, darmowa biblioteka map
- Lekka i wydajna
- Dobra dokumentacja
- Wsparcie dla custom markerów

**Alternatywy**: Google Maps (płatne), Mapbox (płatne)

### 2. TypeScript
**Dlaczego**:
- Typowanie poprawia jakość kodu
- Lepsze IDE support
- Łatwiejszy refactoring
- Łapie błędy compile-time

### 3. Webpack jako Bundler
**Dlaczego**:
- Kompilacja TypeScript
- Bundling JS + CSS
- Optymalizacja obrazów (squoosh)
- Dev server z hot reload
- Kopiowanie assets

### 4. JSON jako Źródło Danych
**Dlaczego**:
- Łatwa edycja przez nie-programistów
- Możliwość łatwej migracji do CMS
- Prosty format

**Alternatywy**: 
- Hardcoded w JS (słabe dla utrzymania)
- API backend (za duże dla 25 punktów)
- CSV (gorsza struktura dla nested data)

### 5. Brak Responsywności Mobile
**Decyzja**: Stała szerokość 665px

**Dlaczego**:
- Projekt dedykowany do embedowania w konkretnym kontekście
- Uproszcza rozwój
- Wystarczające dla use case

## Struktura Danych

### Format Punktu w JSON
```json
{
  "color": "#f39000",
  "latitude": 51.24210937175719,
  "longitude": 21.825316526477195,
  "name": "Nazwa Miejsca",
  "addresses": ["Adres 1", "Adres 2"],
  "emails": ["email@example.com"],
  "phoneNumbers": ["+48123456789"],
  "product": "kategoria",
  "image": "./img/1/image.jpg",
  "facebook": "https://facebook.com/...",
  "webpage": "https://example.com",
  "icon": "./img/1/icon.svg",
  "legendName": "Nazwa w legendzie",
  "legendSubName": "Podnazwa",
  "description": "Pełny opis..."
}
```

### Znaczenie Pól
- `color` - kolor ramek/nagłówków w kartach
- `latitude/longitude` - współrzędne GPS
- `name` - pełna nazwa biznesu
- `legendName` - kategoria (np. "hotele", "gastronomia")
- `legendSubName` - nazwa wyświetlana w legendzie
- `icon` - SVG ikona markera na mapie
- `product` - typ działalności (używane wewnętrznie)

## Flow Danych

### 1. Inicjalizacja
```
data.json loaded
  ↓
Array.map → Point instances
  ↓
Parallel:
  - generateMapMarkers() → Leaflet markers
  - generateMapLegend() → Legend HTML
  - generateCard() → Cards HTML
  - generateFooter() → Footer HTML
```

### 2. Interakcja Użytkownika
```
User clicks marker/legend item
  ↓
zoomToPoint(event)
  ↓
map.setView(coordinates, zoom: 13)
  ↓
Popup opens (if marker clicked)
```

## Optymalizacja

### 1. Obrazy
- WebP format (lepsza kompresja)
- Squoosh minimizer w webpack
- Quality: 10 dla JPEG
- Lossless: 1 dla WebP

### 2. Bundle
- Minifikacja w production mode
- Tree shaking (webpack)
- Single bundle JS + CSS

### 3. Map Performance
- Lazy loading tiles (OpenStreetMap)
- Custom icons jako lightweight SVG
- Bounded fitBounds dla początkowego widoku

## Zależności między Komponentami

```
map.ts (main entry)
  ├─→ point.ts (Point class)
  ├─→ utils.ts (HTML generators)
  ├─→ data.json (data source)
  ├─→ leaflet (map library)
  └─→ map-style.scss (styles)

point.ts
  └─→ utils.ts (HTML generators)

utils.ts
  └─→ point.ts (IPoint interface)
```

## Konwencje Kodu

### Naming
- camelCase dla funkcji i zmiennych
- PascalCase dla klasy Point
- kebab-case dla plików CSS/SCSS
- Descriptive names (nie skróty)

### HTML Generation
- Template strings dla HTML
- Conditional rendering z ternary operator
- Safe rendering - sprawdzanie wartości przed użyciem

### Event Handling
- Arrow functions dla inline handlers
- Named functions dla głównych event handlers
- stopPropagation() dla zagnieżdżonych eventów

## Wzorce Bezpieczeństwa

### XSS Prevention
Wszystkie dane z JSON są trusted (kontrolowane lokalnie), ale:
- Brak innerHTML z user input
- Wszystkie stringi są escaped przez template literals

### Error Handling
- Defensive checks (`if (!variable) return`)
- Graceful degradation (brak email → nie pokazuj sekcji email)
