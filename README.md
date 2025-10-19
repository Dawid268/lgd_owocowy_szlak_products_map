# 🗺️ LGD Owocowy Szlak - Interactive Products Map

[![TypeScript](https://img.shields.io/badge/TypeScript-4.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.6.0-green.svg)](https://leafletjs.com/)
[![Webpack](https://img.shields.io/badge/Webpack-5.74.0-orange.svg)](https://webpack.js.org/)
[![SCSS](https://img.shields.io/badge/SCSS-1.54.9-pink.svg)](https://sass-lang.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Production Build](#production-build)
- [Configuration](#configuration)
- [Data Structure](#data-structure)
- [Architecture](#architecture)
- [Components](#components)
- [Styling](#styling)
- [Security](#security)
- [Performance](#performance)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**LGD Owocowy Szlak - Interactive Products Map** is a modern, responsive web application that showcases local businesses and attractions in the LGD Owocowy Szlak region. The application features an interactive map with clickable markers, detailed business cards, image carousels, and a comprehensive legend system.

### Key Highlights

- 🗺️ **Interactive Leaflet Map** with custom markers and popups
- 🏢 **22 Local Businesses** including restaurants, accommodations, and attractions
- 🖼️ **Image Carousels** with lightbox functionality
- 🎨 **Modern UI/UX** with responsive design
- 🔒 **Security-First** approach with data validation and XSS protection
- ⚡ **High Performance** with optimized assets and lazy loading
- 📱 **Mobile-First** responsive design

## ✨ Features

### 🗺️ Interactive Map

- **Leaflet.js Integration**: High-performance mapping with custom tiles
- **Custom Markers**: 22 business locations with unique icons and colors
- **Clickable Popups**: Detailed business information with images
- **Legend System**: Categorized business types with navigation

### 🏢 Business Cards

- **Detailed Information**: Names, addresses, contact details, descriptions
- **Image Galleries**: Multiple photos per business with carousel navigation
- **Contact Integration**: Direct links to phone, email, and social media
- **Responsive Layout**: Optimized for all device sizes

### 🖼️ Image Management

- **WebP Optimization**: Modern image format for better performance
- **Carousel Navigation**: Glide.js-powered image carousels
- **Lightbox Viewing**: Full-screen image viewing with keyboard navigation
- **Lazy Loading**: Efficient image loading for better performance

### 🎨 User Interface

- **Modern Design**: Clean, professional appearance
- **BEM Methodology**: Consistent CSS naming conventions
- **SCSS Architecture**: Modular styling with variables and mixins
- **Responsive Design**: Mobile-first approach with breakpoints

## 🛠️ Technology Stack

### Core Technologies

- **TypeScript 4.8.3**: Type-safe JavaScript development
- **Leaflet.js 1.6.0**: Interactive mapping library
- **Webpack 5.74.0**: Module bundler and build tool
- **SCSS 1.54.9**: CSS preprocessor for styling

### Build Tools

- **Webpack Dev Server**: Development server with hot reload
- **TypeScript Compiler**: Type checking and compilation
- **Sass Loader**: SCSS compilation
- **CSS Loader**: CSS processing and optimization
- **Copy Plugin**: Asset copying and optimization

### Libraries

- **@glidejs/glide 3.7.1**: Carousel/slider functionality
- **Mini CSS Extract Plugin**: CSS extraction and optimization
- **HTML Webpack Plugin**: HTML template processing

## 📁 Project Structure

```
lgd_owocowy_szlak_products_map/
├── 📁 src/                          # Source code
│   ├── 📁 js/                       # TypeScript source files
│   │   ├── 📄 App.ts                # Main application class
│   │   ├── 📄 map.ts                # Application entry point
│   │   ├── 📁 components/           # UI components
│   │   │   ├── 📄 Card.ts           # Business card component
│   │   │   ├── 📄 Carousel.ts       # Image carousel component
│   │   │   ├── 📄 LegendItem.ts     # Legend item component
│   │   │   └── 📄 Lightbox.ts       # Image lightbox component
│   │   ├── 📁 services/             # Business logic services
│   │   │   ├── 📄 CardService.ts    # Card management service
│   │   │   ├── 📄 IconService.ts    # Icon loading service
│   │   │   └── 📄 MapService.ts     # Map management service
│   │   ├── 📁 templates/            # HTML template generators
│   │   │   ├── 📄 CardTemplate.ts   # Card HTML templates
│   │   │   ├── 📄 LightboxTemplate.ts # Lightbox HTML templates
│   │   │   └── 📄 PopupTemplate.ts  # Popup HTML templates
│   │   ├── 📁 types/                # TypeScript type definitions
│   │   │   └── 📄 Point.ts          # Point/business data types
│   │   └── 📁 utils/                # Utility functions
│   │       └── 📄 DataValidator.ts  # Data validation utilities
│   ├── 📁 scss/                     # SCSS stylesheets
│   │   ├── 📄 main.scss             # Main stylesheet entry point
│   │   ├── 📄 _variables.scss       # SCSS variables and constants
│   │   ├── 📄 _base.scss            # Base styles and resets
│   │   ├── 📄 _map.scss             # Map-specific styles
│   │   ├── 📄 _legend.scss          # Legend-specific styles
│   │   ├── 📄 _popup.scss           # Popup-specific styles
│   │   ├── 📄 _cards.scss           # Card-specific styles
│   │   ├── 📄 _carousel.scss        # Carousel-specific styles
│   │   ├── 📄 _lightbox.scss        # Lightbox-specific styles
│   │   └── 📄 _footer.scss          # Footer-specific styles
│   ├── 📁 img/                      # Image assets
│   │   └── 📁 1/                    # Business images and icons
│   │       ├── 📄 data.json         # Business data (22 entries)
│   │       ├── 📄 1.svg - 8.svg     # Category icons
│   │       └── 📄 *.webp            # Business images (36 files)
│   └── 📄 index.html                # HTML template
├── 📁 dist/                         # Production build output
├── 📁 types/                        # Global TypeScript declarations
│   ├── 📄 custom.d.ts               # Custom module declarations
│   └── 📄 declaration.d.ts          # SCSS module declarations
├── 📁 memory-bank/                  # Project documentation
├── 📄 package.json                  # Dependencies and scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 webpack.config.js             # Development webpack config
├── 📄 webpack.prod.js               # Production webpack config
└── 📄 README.md                     # This file
```

## 🚀 Installation

### Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** for version control

### Clone Repository

```bash
git clone https://github.com/Dawid268/lgd_owocowy_szlak_products_map.git
cd lgd_owocowy_szlak_products_map
```

### Install Dependencies

```bash
npm install
```

### Verify Installation

```bash
npm run type-check
```

## 🔧 Development

### Start Development Server

```bash
npm start
```

This command:

- Starts webpack dev server on `http://localhost:4000`
- Enables hot module replacement (HMR)
- Provides live reloading for development
- Serves the application with source maps

### Development Features

- **Hot Module Replacement**: Instant updates without page refresh
- **Source Maps**: Debug TypeScript code directly in browser
- **Live Reloading**: Automatic browser refresh on file changes
- **Type Checking**: Real-time TypeScript error detection

### Available Scripts

```bash
# Development server
npm start                    # Start dev server on port 4000

# Build commands
npm run build               # Production build
npm run build:dev           # Development build
npm run build:prod          # Production build (alias)

# Utility commands
npm run clean               # Clean dist directory
npm run type-check          # TypeScript type checking
```

## 🏗️ Production Build

### Build for Production

```bash
npm run build:prod
```

### Production Features

- **Asset Optimization**: Minified CSS and JavaScript
- **Image Compression**: Optimized WebP images
- **Code Splitting**: Vendor and application bundles
- **Source Map Removal**: Clean production code
- **Cache Busting**: Content-based hashing for assets

### Build Output

The production build creates optimized files in the `dist/` directory:

```
dist/
├── 📄 index.html              # Optimized HTML
├── 📁 js/
│   ├── 📄 map.[hash].js       # Application bundle
│   └── 📄 vendors.[hash].js   # Vendor bundle
├── 📁 css/
│   └── 📄 styles.[hash].css   # Optimized CSS
└── 📁 img/                    # Optimized images
```

## ⚙️ Configuration

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true
  }
}
```

### Webpack Configuration

#### Development (`webpack.config.js`)

- Development server configuration
- Source maps enabled
- Hot module replacement
- Asset copying and processing

#### Production (`webpack.prod.js`)

- Code minification and optimization
- Asset optimization
- Bundle splitting
- Cache busting

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
# Development
NODE_ENV=development
PORT=4000

# Production
NODE_ENV=production
```

## 📊 Data Structure

### Business Data Format (`src/img/1/data.json`)

Each business entry contains the following structure:

```typescript
interface BusinessData {
  color: string; // Business color theme
  latitude: number; // GPS latitude
  longitude: number; // GPS longitude
  name: string; // Business name
  addresses: string[]; // Address lines
  emails: string[] | null; // Email addresses
  phoneNumbers: string[]; // Phone numbers
  product: string; // Business category
  image: string; // Main image path
  images: string[]; // All image paths
  facebook: string | null; // Facebook URL
  webpage: string | null; // Website URL
  icon: string; // Category icon path
  legendName: string; // Legend category name
  legendSubName: string; // Legend subcategory name
  description: string; // Business description
}
```

### Data Validation

The application includes comprehensive data validation:

- **Type Safety**: All data is validated against TypeScript interfaces
- **Data Sanitization**: Input data is cleaned and validated
- **Error Handling**: Graceful handling of missing or invalid data
- **Default Values**: Fallback values for missing properties

## 🏛️ Architecture

### Application Architecture

The application follows a **Service-Oriented Architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │    Services     │    │   Templates     │
│                 │    │                 │    │                 │
│ • Card          │◄──►│ • MapService    │◄──►│ • CardTemplate  │
│ • Carousel      │    │ • CardService   │    │ • PopupTemplate │
│ • Lightbox      │    │ • IconService   │    │ • LightboxTemplate│
│ • LegendItem    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Application   │
                    │                 │
                    │ • App.ts        │
                    │ • DataValidator │
                    │ • Point Types   │
                    └─────────────────┘
```

### Design Patterns

- **Service Layer Pattern**: Business logic separated from UI components
- **Template Method Pattern**: Consistent HTML generation
- **Observer Pattern**: Event-driven component communication
- **Factory Pattern**: Component creation and management

## 🧩 Components

### Core Components

#### 🏢 Card Component (`Card.ts`)

- **Purpose**: Displays business information in card format
- **Features**: Image carousel, contact information, responsive layout
- **Dependencies**: CardTemplate, Carousel, Lightbox

#### 🖼️ Carousel Component (`Carousel.ts`)

- **Purpose**: Image carousel functionality
- **Features**: Glide.js integration, responsive breakpoints, touch support
- **Configuration**: 3 images visible, 15px gaps, navigation arrows

#### 🔍 Lightbox Component (`Lightbox.ts`)

- **Purpose**: Full-screen image viewing
- **Features**: Keyboard navigation, image counter, close functionality
- **Controls**: Arrow keys, Escape key, click to close

#### 🗺️ Legend Item Component (`LegendItem.ts`)

- **Purpose**: Individual legend entries
- **Features**: Click navigation, category grouping, responsive design

### Services

#### 🗺️ Map Service (`MapService.ts`)

- **Purpose**: Leaflet map management
- **Features**: Marker creation, popup generation, legend integration
- **Methods**: `addMarker()`, `createLegend()`, `clearMarkers()`

#### 🏢 Card Service (`CardService.ts`)

- **Purpose**: Card management and lifecycle
- **Features**: Card creation, DOM management, event handling
- **Methods**: `addCard()`, `clearCards()`, `getCardByPoint()`

#### 🎨 Icon Service (`IconService.ts`)

- **Purpose**: SVG icon loading and coloring
- **Features**: Dynamic loading, color customization, caching
- **Methods**: `loadIcons()`, `getIcon()`, `getColoredIcon()`

### Templates

#### 📄 Card Template (`CardTemplate.ts`)

- **Purpose**: HTML generation for business cards
- **Features**: BEM methodology, responsive design, accessibility

#### 🗺️ Popup Template (`PopupTemplate.ts`)

- **Purpose**: HTML generation for map popups
- **Features**: Compact layout, contact integration, image display

#### 🔍 Lightbox Template (`LightboxTemplate.ts`)

- **Purpose**: HTML generation for lightbox
- **Features**: Navigation controls, image counter, responsive design

## 🎨 Styling

### SCSS Architecture

The styling system follows **BEM (Block Element Modifier)** methodology:

```scss
// Block
.cards-container {
  // Element
  &__item {
    // Modifier
    &--description {
      // Styles
    }
  }
}
```

### Variable System

All design tokens are centralized in `_variables.scss`:

```scss
// Colors
$primary-color: #f39000;
$border-color: rgb(65, 63, 68);
$text-color: #333333;

// Spacing
$spacing-xs: 5px;
$spacing-sm: 5px;
$spacing-md: 10px;
$spacing-lg: 20px;

// Typography
$font-size-xs: 0.975em;
$font-size-sm: 1em;
$font-size-md: 1.2em;
```

### Responsive Design

The application uses mobile-first responsive design:

```scss
// Mobile first
.carousel {
  perview: 1;

  @media (min-width: 480px) {
    perview: 2;
  }

  @media (min-width: 800px) {
    perview: 3;
  }
}
```

### Component Styling

Each component has its own SCSS file:

- `_cards.scss`: Business card styles
- `_carousel.scss`: Image carousel styles
- `_lightbox.scss`: Lightbox modal styles
- `_legend.scss`: Map legend styles
- `_popup.scss`: Map popup styles

## 🔒 Security

### Security Measures

The application implements comprehensive security measures:

#### XSS Prevention

- **No innerHTML**: All DOM manipulation uses safe methods
- **DOMParser**: Safe HTML parsing with sanitization
- **textContent**: Safe text insertion without HTML interpretation

#### Data Validation

- **Input Sanitization**: All user input is validated and sanitized
- **Type Safety**: TypeScript provides compile-time type checking
- **Runtime Validation**: DataValidator ensures data integrity

#### Secure Coding Practices

- **No eval()**: No dynamic code execution
- **Safe DOM Manipulation**: Using createElement and textContent
- **Content Security Policy**: Ready for CSP implementation

### Security Checklist

- ✅ No `innerHTML` usage
- ✅ Data validation and sanitization
- ✅ Type-safe data handling
- ✅ No dynamic code execution
- ✅ Safe DOM manipulation
- ✅ Input validation

## ⚡ Performance

### Performance Optimizations

#### Asset Optimization

- **WebP Images**: Modern image format for better compression
- **Code Splitting**: Separate vendor and application bundles
- **Minification**: Compressed CSS and JavaScript
- **Tree Shaking**: Unused code elimination

#### Loading Performance

- **Lazy Loading**: Images loaded on demand
- **Preloading**: Critical assets preloaded
- **Caching**: Browser caching with content hashing
- **Compression**: Gzip compression enabled

#### Runtime Performance

- **Event Delegation**: Efficient event handling
- **Debouncing**: Optimized scroll and resize events
- **Memory Management**: Proper cleanup and garbage collection
- **DOM Optimization**: Minimal DOM manipulation

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🌐 Browser Support

### Supported Browsers

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: 14+
- **Chrome Mobile**: 90+

### Feature Support

- **ES6 Modules**: Supported in all target browsers
- **CSS Grid**: Fallback for older browsers
- **WebP Images**: Fallback to JPEG for unsupported browsers
- **Touch Events**: Mobile-optimized interactions

### Polyfills

The application includes necessary polyfills for:

- **ES6 Features**: Arrow functions, template literals, destructuring
- **CSS Features**: Flexbox, Grid, custom properties
- **API Features**: Fetch, Promise, Map, Set

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards
4. **Run tests**: `npm run type-check`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Coding Standards

#### TypeScript

- Use strict type checking
- Prefer interfaces over types
- Use meaningful variable names
- Add JSDoc comments for public methods

#### SCSS

- Follow BEM methodology
- Use variables for all values
- Organize imports logically
- Use meaningful class names

#### Git

- Use conventional commit messages
- Keep commits atomic
- Write descriptive commit messages
- Use meaningful branch names

### Pull Request Process

1. **Update README.md** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Request review** from maintainers
5. **Address feedback** promptly

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary

- ✅ **Commercial use** allowed
- ✅ **Modification** allowed
- ✅ **Distribution** allowed
- ✅ **Private use** allowed
- ❌ **Liability** not covered
- ❌ **Warranty** not provided

## 📞 Support

### Getting Help

- **Documentation**: Check this README and code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainer for urgent issues

### Reporting Bugs

When reporting bugs, please include:

1. **Browser and version**
2. **Operating system**
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Screenshots** if applicable

### Feature Requests

For feature requests, please include:

1. **Use case description**
2. **Proposed solution**
3. **Alternative solutions**
4. **Additional context**
