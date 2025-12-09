# Tech Context

## Stack Technologiczny

### Frontend
- **TypeScript 4.8.3** - główny język
- **Leaflet 1.6.0** - biblioteka map
- **Leaflet Legend 1.0.2** - rozszerzenie do legend
- **SCSS/Sass** - preprocessing CSS
- **jQuery** (types only) - legacy types

### Build Tools
- **Webpack 5.74.0** - bundler
- **Webpack Dev Server 4.11.0** - dev environment
- **ts-loader 9.3.1** - kompilator TypeScript dla Webpack
- **sass-loader 13.0.2** - kompilator SCSS

### Optymalizacja
- **@squoosh/lib 0.4.0** - kompresja obrazów
- **image-minimizer-webpack-plugin 3.6.0** - optymalizacja w build
- **css-minimizer-webpack-plugin 4.1.0** - minifikacja CSS
- **json-minimizer-webpack-plugin 4.0.0** - minifikacja JSON
- **mini-css-extract-plugin 2.6.1** - ekstrakcja CSS

### Utilities
- **copy-webpack-plugin 11.0.0** - kopiowanie assets
- **html-webpack-plugin 5.5.0** - generowanie HTML
- **fs-extra 10.1.0** - operacje na plikach
- **globby 13.1.2** - pattern matching

## Struktura Projektu

```
lgd_owocowy_szlak_products_map/
├── src/                          # Kod źródłowy
│   ├── index.html                # Template HTML
│   ├── js/                       # TypeScript modules
│   │   ├── map.ts               # Main entry point
│   │   ├── point.ts             # Point class
│   │   └── utils.ts             # Helper functions
│   └── img/1/                    # Assets folder
│       ├── data.json            # Business data (25 points)
│       ├── map-style.scss       # Styles
│       ├── *.svg                # Icons (8 types)
│       └── *.webp               # Photos (~50 images)
├── types/                        # TypeScript declarations
│   ├── custom.d.ts
│   └── declaration.d.ts
├── dist/                         # Build output
├── node_modules/                 # Dependencies
├── package.json                  # NPM config
├── tsconfig.json                 # TypeScript config
└── webpack.config.js             # Webpack config
```

## Konfiguracja Środowiska

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    // Standard config for modern TS
  }
}
```

### Webpack Config Highlights

**Entry Point**: `./src/js/map.ts`

**Output**: 
- JS: `dist/js/map.js`
- CSS: `dist/img/1/map-style.css`
- HTML: `dist/index.html`

**Loaders**:
- TypeScript: `ts-loader`
- SCSS: `sass-loader` → `css-loader` → `MiniCssExtractPlugin.loader`
- Images: `type: "asset"`

**Plugins**:
1. **AutomaticPrefetchPlugin** - prefetch modules
2. **BannerPlugin** - adds repo URL to bundle
3. **HtmlWebpackPlugin** - generates HTML with injected assets
4. **MiniCssExtractPlugin** - extracts CSS to separate file
5. **CopyPlugin** (x2) - copies images and data.json to dist
6. **ImageMinimizerPlugin** - compresses images with Squoosh

**Dev Server**:
- Port: 4000
- Static: `dist/`
- Compress: true

## Zależności Zewnętrzne

### Runtime Dependencies
1. **Leaflet** (1.6.0)
   - Purpose: Map rendering, markers, popups
   - CDN Load: `https://unpkg.com/leaflet@1.7.1/dist/leaflet.js`
   - License: BSD-2-Clause
   - Note: Używana wersja 1.7.1 z CDN (różnica od package.json 1.6.0)

2. **Leaflet Legend** (1.0.2)
   - Purpose: Legend control extension
   - Note: Może być niewykorzystana (custom legend implementation)

3. **OpenStreetMap Tiles**
   - Provider: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
   - License: Open Data Commons Open Database License
   - Free for non-commercial use

### Dev Dependencies (kluczowe)
- **TypeScript Compiler**: Transpilacja TS → JS
- **Webpack**: Module bundler + dev server
- **Sass**: CSS preprocessing
- **Squoosh**: Advanced image compression

## Build Process

### Development
```bash
npm run start
```
1. Webpack dev server starts na porcie 4000
2. TypeScript kompilowany w locie
3. Hot reload enabled
4. Source maps dostępne
5. No optimizations

### Production
```bash
npm run build
```
1. Clean `dist/` directory
2. Compile TypeScript → JavaScript
3. Compile SCSS → CSS
4. Minimize JavaScript (default Webpack)
5. Minimize CSS (CssMinimizerPlugin)
6. Minimize JSON (JsonMinimizerPlugin)
7. Compress images (Squoosh)
   - JPEG: quality 10
   - WebP: lossless
   - AVIF: cqLevel 0
8. Copy assets to dist/img/1/
9. Generate index.html with asset links
10. Add banner with repo URL

### Output Structure (dist/)
```
dist/
├── index.html                    # Main HTML file
├── js/
│   └── map.js                   # Bundled JS (minified)
└── img/1/
    ├── map-style.css            # Extracted CSS (minified)
    ├── data.json                # Business data
    ├── *.svg                    # Icons
    ├── *.webp                   # Compressed images
    └── *.png                    # Logos (UE, PROW, etc.)
```

## Constraints & Limitations

### Browser Support
- Modern browsers only (ES6+ required)
- No IE11 support
- Chrome, Firefox, Safari, Edge (latest versions)

### Performance Constraints
- **Fixed Width**: 665px (no responsive layout)
- **25 Points Limit**: Current implementation assumes ~25 points
- **Image Loading**: All images loaded upfront (no lazy loading)
- **Memory**: 25 markers + 25 cards = ~50 DOM elements per point

### Technical Debt
1. **Leaflet Version Mismatch**: package.json says 1.6.0, CDN loads 1.7.1
2. **jQuery Types**: Imported but not used in code
3. **Duplicate CopyPlugin**: Two separate copy configs for same source
4. **No Mobile Responsiveness**: Fixed width design
5. **No State Management**: Global variables and module-level state
6. **Mixed Concerns**: map.ts handles both logic and rendering

## Development Setup

### Prerequisites
- Node.js (version compatible with npm 8+)
- npm or yarn
- Modern code editor (VS Code recommended)

### Installation
```bash
npm install
```

### Running Dev Server
```bash
npm run start
# App available at http://localhost:4000
```

### Building for Production
```bash
npm run build
# Output in dist/ directory
```

### Hot to Add New Business
1. Edit `src/img/1/data.json`
2. Add new object with all required fields
3. Add icon SVG to `src/img/1/`
4. (Optional) Add photo WebP to `src/img/1/`
5. Run dev server or build

## Deployment

### Requirements
- Static file hosting (Nginx, Apache, S3, Netlify, etc.)
- No server-side processing needed
- HTTPS recommended (for OpenStreetMap)

### Deploy Process
1. Run `npm run build`
2. Upload entire `dist/` directory
3. Serve `index.html` as entry point
4. Ensure MIME types configured:
   - `.js` → `application/javascript`
   - `.css` → `text/css`
   - `.json` → `application/json`
   - `.webp` → `image/webp`
   - `.svg` → `image/svg+xml`

### Embedding
Aplikacja zaprojektowana do embedowania:
```html
<iframe 
  src="https://your-domain.com/dist/index.html" 
  width="665" 
  height="800" 
  frameborder="0">
</iframe>
```

## Environment Variables
Brak - wszystko hardcoded lub z data.json

## Configuration Files

### package.json
- Scripts: `start`, `build`
- Dependencies: listed above
- No custom config fields

### tsconfig.json
- Target: ES6+
- Module: ES6
- Strict mode recommended (check actual config)

### webpack.config.js
- Mode: passed via CLI (`--mode development/production`)
- Entry: `src/js/map.ts`
- Output: `dist/`
- Plugins and loaders configured as listed above

## Security Considerations

### Data Security
- All data in public JSON file (no sensitive data)
- No authentication/authorization needed
- Read-only application

### XSS Prevention
- Using template literals (escaped by default)
- No `eval()` or `innerHTML` with user input
- All data from trusted source (local JSON)

### CORS
- OpenStreetMap tiles loaded from external domain
- May require CORS headers if hosted on different domain

### HTTPS
- Recommended for production
- Required for modern browser features
- Leaflet works over HTTP but HTTPS preferred

## Performance Metrics

### Bundle Size (estimated)
- JS: ~150KB (with Leaflet)
- CSS: ~30KB
- Images: ~2-5MB (25 photos + icons)
- Total: ~2.2-5.2MB first load

### Load Time (estimated)
- First paint: <1s (on good connection)
- Full interactive: 1-3s
- Map tiles: lazy loaded as needed

### Optimization Opportunities
1. Lazy load images for cards
2. Progressive image loading
3. Code splitting (separate vendor bundle)
4. Service Worker for offline support
5. Image sprites for icons
6. WebP with fallback to JPEG

## Monitoring & Debugging

### Development
- Chrome DevTools
- Source maps enabled in dev mode
- Console logging for debugging
- Webpack dev server logs

### Production
- Browser console for client errors
- No server-side logging (static site)
- Consider adding analytics (Google Analytics, Plausible)

## Known Issues

1. **Popup Close Button**: preventDefault prevents closing
2. **Legend Scroll**: May need scrollbar if more items
3. **Image Loading**: All loaded upfront (performance impact)
4. **Leaflet Version**: Mismatch between package.json and CDN
5. **No Error Handling**: Network failures not handled gracefully
