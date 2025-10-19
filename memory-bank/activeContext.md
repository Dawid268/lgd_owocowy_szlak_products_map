# Active Context

## Obecny Stan Projektu

Projekt jest **funkcjonalny i kompletny** - interaktywna mapa z 25 punktami biznesowymi działa poprawnie. Aplikacja jest gotowa do produkcji.

## Ostatnie Zmiany

### 🎉 Major Refactoring - 18.10.2025

**Architektura**:
- ✅ Przejście z modułowego do Service Layer pattern
- ✅ Wprowadzenie komponentów UI (Card, Carousel, Lightbox)
- ✅ Separation of concerns: App → Services → Components
- ✅ Entry point: map.ts → App.ts z retry logic

**Nowe Feature: Image Gallery**:
- ✅ Carousel component - slider z miniaturami (max 3 + "+X")
- ✅ Lightbox component - fullscreen viewer z keyboard navigation
- ✅ Dodane pole `images[]` do data model
- ✅ Integration w kartach biznesów

**Struktura Plików**:
- ✅ Nowe: `services/MapService.ts`, `services/CardService.ts`
- ✅ Nowe: `components/Card.ts`, `components/Carousel.ts`, `components/Lightbox.ts`
- ✅ Nowe: `types/Point.ts` (wydzielone type definitions)
- ✅ Zmodyfikowane: `App.ts` (nowy main controller)

**Data Changes**:
- ✅ 13 biznesów ma multiple images w galeriach
- ✅ Format: `"images": ["path1.webp", "path2.webp", ...]`

Stan: Working directory zmodyfikowany - major refactoring completed

## Aktualny Fokus

**Post-Refactoring** - projekt przeszedł znaczący refactoring architektury i dodanie nowej funkcjonalności image gallery. Memory Bank został zaktualizowany aby odzwierciedlić nowy stan.

## Aktywne Decyzje

### 1. Struktura Danych (data.json)
**Decyzja**: Trzymać wszystkie dane biznesowe w jednym pliku JSON
**Status**: ✅ Zaimplementowane
**Kontekst**: 25 punktów, każdy z pełnymi danymi
**Alternatywy rozważane**: Brak - wystarczające dla skali projektu

### 2. Responsywność
**Decyzja**: Stała szerokość 665px (brak mobile responsive)
**Status**: ✅ Zaimplementowane
**Kontekst**: Dedykowane do osadzenia w konkretnym kontekście
**Do rozważenia**: Czy w przyszłości potrzeba wersji mobile?

### 3. Optymalizacja Obrazów
**Decyzja**: WebP z wysoką kompresją (Squoosh)
**Status**: ✅ Zaimplementowane
**Kontekst**: ~50 zdjęć biznesów
**Uwaga**: Wszystkie obrazy ładowane upfront (brak lazy loading)

## Najnowsze Odkrycia

### 1. Technical Debt
Zidentyfikowane obszary do potencjalnej poprawy:
- Leaflet version mismatch (1.6.0 vs 1.7.1)
- Duplicate CopyPlugin w webpack
- jQuery types niewykorzystane
- Brak error handlingu dla network failures
- Popup close button preventDefault (może być celowe?)

### 2. Performance
- Bundle size: ~2-5MB przy pierwszym załadowaniu
- Wszystkie obrazy ładowane od razu
- Możliwość lazy loadingu dla kart biznesów

### 3. Architecture Insights
- Clean separation: Point (model) + utils (view helpers) + map (controller)
- Data-driven rendering - łatwe dodawanie nowych punktów
- Event-driven interaction

## Następne Kroki

### Krótkoterminowe (jeśli potrzebne)
1. **Rozważenie lazy loading obrazów** w kartach (performance win)
2. **Sync wersji Leaflet** - albo update package.json do 1.7.1, albo CDN do 1.6.0
3. **Cleanup webpack config** - usunąć duplicate CopyPlugin
4. **Usunąć jQuery types** jeśli nieużywane

### Średnioterminowe (jeśli wymagane)
1. **Mobile responsiveness** - jeśli będzie potrzeba użycia na urządzeniach mobilnych
2. **Add error handling** - graceful degradation przy błędach sieciowych
3. **Analytics integration** - tracking użycia mapy
4. **SEO optimization** - meta tags, structured data

### Długoterminowe (opcjonalne)
1. **CMS Integration** - łatwiejsza edycja danych przez nie-programistów
2. **Multi-language support** - wersje językowe
3. **Offline support** - Service Worker dla PWA
4. **Advanced filters** - filtrowanie po kategorii, lokalizacji

## Otwarte Pytania

### Techniczne
1. **Czy popup close button**: preventDefault jest celowy czy bug?
   - Kontekst: Obecnie popup nie zamyka się po kliknięciu X
   - Do wyjaśnienia z zespołem/klientem

2. **Leaflet version mismatch**: Czy to świadome?
   - package.json: 1.6.0
   - CDN load: 1.7.1
   - Potencjalny bug source

3. **jQuery types**: Dlaczego zaimportowane?
   - Niewykorzystane w kodzie
   - Legacy z poprzedniej wersji?

### Biznesowe
1. **Czy planowane rozszerzenie**: Więcej niż 25 punktów?
   - Current: 25 punktów
   - Scale concerns przy 100+?

2. **Mobile usage**: Czy użytkownicy potrzebują mobile version?
   - Current: Fixed 665px width
   - Analytics mogą pomóc

3. **Update frequency**: Jak często dane będą aktualizowane?
   - Current: Manual edit data.json
   - CMS needed?

## Kontekst Biznesowy

### Stakeholders
- **LGD Owocowy Szlak** - właściciel projektu
- **Lokalne biznesy** - 25 partnerów prezentowanych na mapie
- **Turyści** - end users
- **UE/PROW** - źródło finansowania

### Timeline
- Projekt PROW 2014-2020 (już zakończony program?)
- Status: Deployed / In Use (assumption based on data completeness)

### Success Metrics (prawdopodobne)
- Liczba odwiedzin mapy
- Click-through rate na linki biznesów
- Czas spędzony na mapie
- Feedback od lokalnych biznesów

## Obszary Uwagi

### 1. Utrzymanie
- **Łatwe**: Dodawanie nowych punktów (edit JSON)
- **Średnie**: Zmiana stylów (SCSS)
- **Trudne**: Zmiany w logice map (TypeScript)

### 2. Skalowanie
- **Current**: 25 punktów - działa świetnie
- **50-100 punktów**: Może wymagać optymalizacji
- **100+**: Potrzeba lazy loading, clustering markers

### 3. Browser Compatibility
- **Wspierane**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Niewspierane**: IE11, stare wersje mobile browsers
- **Risk**: Low (target audience ma nowoczesne przeglądarki)

## Dokumentacja Memory Bank

Utworzone pliki:
- ✅ `projectbrief.md` - cel, funkcje, wymagania
- ✅ `productContext.md` - dlaczego, jak działa, wartość
- ✅ `systemPatterns.md` - architektura, wzorce, decyzje
- ✅ `techContext.md` - stack, konfiguracja, deployment
- ✅ `activeContext.md` - obecny stan, fokus, decyzje (TEN PLIK)
- ⏳ `progress.md` - co działa, co zostało, status

## Potrzeby Współpracy

### Z zespołem
- Wyjaśnienie celowych zachowań (popup close, version mismatch)
- Priorytetyzacja technical debt
- Roadmap na następne features

### Z klientem (LGD)
- Feedback na działającą wersję
- Plany na rozszerzenie (więcej punktów?)
- Analytics requirements
- Mobile version need?

### Z użytkownikami (turyści)
- User testing feedback
- Usability issues?
- Missing features?

## Notatki do Przyszłości

1. **Memory Bank jest świeży** - utworzony właśnie dzisiaj (18.10.2025)
2. **Projekt jest kompletny** - nie ma aktywnego developmentu w tym momencie
3. **Focus na utrzymanie** - nie na rozwój nowych features
4. **Dokumentacja jest baseline** - przyszłe zmiany powinny ją aktualizować
