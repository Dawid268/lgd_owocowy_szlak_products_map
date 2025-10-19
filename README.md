# Mapa Produktów - Owoce Lubelszczyzny

Interaktywna mapa produktów regionalnych z województwa lubelskiego, prezentująca lokalne firmy, gospodarstwa agroturystyczne, restauracje i inne obiekty związane z produkcją i sprzedażą produktów regionalnych.

## 🚀 Funkcjonalności

- **Interaktywna mapa** z markerami lokalizacji
- **Legenda z kategoriami** - klikalna nawigacja
- **Karty produktów** z opisami i zdjęciami
- **Karuzela zdjęć** z obsługą nawigacji
- **Lightbox** do przeglądania zdjęć w pełnym rozmiarze
- **Responsywny design** dostosowany do różnych urządzeń
- **Optymalizacja obrazów** w formacie WebP

## 🛠️ Technologie

- **TypeScript** - język programowania
- **Leaflet.js** - biblioteka map
- **Webpack** - bundler i build tool
- **SCSS/Sass** - preprocesor CSS
- **HTML5** - struktura strony

## 📦 Instalacja i uruchomienie

### Wymagania
- Node.js (v14 lub nowszy)
- npm lub yarn

### Instalacja zależności
```bash
npm install
```

### Tryb development
```bash
npm start
```
Aplikacja będzie dostępna pod adresem: http://localhost:4000

### Budowanie wersji produkcyjnej
```bash
npm run build:prod
```

### Sprawdzanie typów TypeScript
```bash
npm run type-check
```

### Czyszczenie katalogu dist
```bash
npm run clean
```

## 📁 Struktura projektu

```
src/
├── js/
│   ├── components/          # Komponenty UI
│   │   ├── Carousel.ts      # Karuzela zdjęć
│   │   ├── Card.ts          # Karta produktu
│   │   ├── Lightbox.ts      # Lightbox do zdjęć
│   │   └── LegendItem.ts    # Element legendy
│   ├── services/            # Serwisy aplikacji
│   │   ├── MapService.ts    # Serwis mapy
│   │   ├── CardService.ts   # Serwis kart
│   │   └── IconService.ts   # Serwis ikon
│   ├── templates/           # Szablony HTML
│   │   ├── CardTemplate.ts  # Szablon karty
│   │   ├── PopupTemplate.ts # Szablon popup
│   │   └── CarouselTemplate.ts # Szablon karuzeli
│   ├── types/               # Definicje typów
│   │   └── Point.ts         # Typ punktu na mapie
│   ├── App.ts               # Główna aplikacja
│   └── map.ts               # Entry point
├── scss/                    # Style SCSS
│   ├── _variables.scss      # Zmienne SCSS
│   ├── _base.scss           # Style bazowe
│   ├── _cards.scss          # Style kart
│   ├── _carousel.scss       # Style karuzeli
│   ├── _lightbox.scss       # Style lightbox
│   ├── _legend.scss         # Style legendy
│   ├── _map.scss            # Style mapy
│   ├── _popup.scss          # Style popup
│   ├── _footer.scss         # Style stopki
│   └── main.scss            # Główny plik SCSS
├── img/                     # Obrazy i zasoby
│   └── 1/                   # Obrazy produktów
└── index.html               # Główny plik HTML
```

## 🗂️ Dane

Dane o produktach i lokalizacjach są przechowywane w pliku `src/img/1/data.json`. Każdy obiekt zawiera:

- `name` - nazwa obiektu
- `latitude`, `longitude` - współrzędne geograficzne
- `addresses` - adresy
- `emails`, `phoneNumbers` - dane kontaktowe
- `product` - typ produktu
- `image`, `images` - zdjęcia
- `facebook`, `webpage` - linki do social media i strony WWW
- `icon` - ikona na mapie
- `legendName`, `legendSubName` - nazwy w legendzie
- `description` - opis obiektu
- `color` - kolor markera

## 🎨 Personalizacja

### Zmiana kolorów
Edytuj plik `src/scss/_variables.scss`:

```scss
$primary-color: #f39000;     // Główny kolor
$border-color: rgb(65, 63, 68); // Kolor ramek
$text-color: #333333;        // Kolor tekstu
```

### Dodawanie nowych produktów
1. Dodaj nowy obiekt do `src/img/1/data.json`
2. Dodaj zdjęcia do katalogu `src/img/1/`
3. Uruchom aplikację

### Zmiana wyglądu mapy
Edytuj plik `src/scss/_map.scss`:

```scss
#leaflet-map {
  height: 681px;  // Wysokość mapy
  width: 100%;
}
```

## 🚀 Deployment

### Build produkcyjny
```bash
npm run build:prod
```

### Upload plików
Skopiuj zawartość katalogu `dist/` na serwer web.

### Konfiguracja serwera
Upewnij się, że serwer obsługuje:
- Pliki statyczne (HTML, CSS, JS)
- Routing SPA (jeśli używany)
- Kompresję gzip

## 📝 Licencja

Projekt jest udostępniony na licencji MIT. Zobacz plik LICENSE dla szczegółów.

## 🤝 Współpraca

1. Fork projektu
2. Utwórz branch dla nowej funkcji (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📞 Kontakt

- GitHub: [Dawid268](https://github.com/Dawid268)
- Projekt: [lgd_owocowy_szlak_products_map](https://github.com/Dawid268/lgd_owocowy_szlak_products_map)

---

**Zbudowano z ❤️ dla promocji produktów regionalnych Lubelszczyzny**