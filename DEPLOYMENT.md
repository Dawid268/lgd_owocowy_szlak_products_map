# Instrukcje Deployment

## 🚀 Przygotowanie do produkcji

### 1. Build produkcyjny
```bash
npm run build:prod
```

### 2. Sprawdzenie build
```bash
# Sprawdź czy wszystkie pliki zostały wygenerowane
ls -la dist/

# Sprawdź rozmiary plików
du -sh dist/*
```

## 📁 Struktura plików produkcyjnych

```
dist/
├── index.html                    # Główny plik HTML
├── css/
│   └── styles.[hash].css        # Zminifikowane style
├── js/
│   ├── map.[hash].js            # Główny bundle aplikacji
│   └── vendors.[hash].js        # Bundle z bibliotekami zewnętrznymi
└── img/
    └── 1/
        └── data.json            # Dane aplikacji
```

## 🌐 Deployment na serwer

### Opcja 1: Upload przez FTP/SFTP
1. Połącz się z serwerem przez FTP/SFTP
2. Przejdź do katalogu publicznego (np. `/public_html/`, `/www/`)
3. Skopiuj wszystkie pliki z katalogu `dist/`
4. Upewnij się, że uprawnienia są ustawione na 644 dla plików i 755 dla katalogów

### Opcja 2: Deployment przez Git
```bash
# Na serwerze
git clone https://github.com/Dawid268/lgd_owocowy_szlak_products_map.git
cd lgd_owocowy_szlak_products_map
npm install
npm run build:prod
# Skopiuj zawartość dist/ do katalogu publicznego
```

### Opcja 3: CI/CD (GitHub Actions)
Utwórz plik `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build:prod
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/website
          git pull origin main
          npm install
          npm run build:prod
          # Restart serwera jeśli potrzebne
```

## ⚙️ Konfiguracja serwera

### Apache (.htaccess)
```apache
RewriteEngine On

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔍 Weryfikacja deployment

### Sprawdzenie działania
1. Otwórz stronę w przeglądarce
2. Sprawdź czy mapa się ładuje
3. Sprawdź czy wszystkie zdjęcia się wyświetlają
4. Sprawdź czy legenda działa
5. Sprawdź czy karuzela zdjęć działa

### Sprawdzenie wydajności
```bash
# Sprawdź rozmiary plików
curl -I https://your-domain.com/css/styles.[hash].css
curl -I https://your-domain.com/js/map.[hash].js

# Sprawdź czy gzip działa
curl -H "Accept-Encoding: gzip" -I https://your-domain.com/css/styles.[hash].css
```

### Narzędzia do testowania
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## 🐛 Rozwiązywanie problemów

### Problem: Mapa się nie ładuje
**Rozwiązanie:**
- Sprawdź czy wszystkie pliki JS zostały załadowane
- Sprawdź console w przeglądarce pod kątem błędów
- Upewnij się, że serwer obsługuje pliki JS

### Problem: Zdjęcia się nie wyświetlają
**Rozwiązanie:**
- Sprawdź ścieżki do zdjęć w `data.json`
- Upewnij się, że wszystkie pliki obrazów zostały skopiowane
- Sprawdź uprawnienia do plików

### Problem: Style nie działają
**Rozwiązanie:**
- Sprawdź czy plik CSS został załadowany
- Sprawdź ścieżki do plików CSS
- Sprawdź czy serwer obsługuje pliki CSS

## 📊 Monitoring

### Logi serwera
Monitoruj logi serwera pod kątem:
- Błędów 404 (brakujące pliki)
- Błędów 500 (błędy serwera)
- Wolnych zapytań

### Analytics
Dodaj Google Analytics lub inne narzędzie do śledzenia:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Aktualizacje

### Automatyczne aktualizacje
```bash
# Skrypt do automatycznego deployment
#!/bin/bash
cd /path/to/project
git pull origin main
npm install
npm run build:prod
# Skopiuj pliki do katalogu publicznego
cp -r dist/* /path/to/public/
echo "Deployment completed at $(date)"
```

### Backup
```bash
# Backup przed aktualizacją
cp -r /path/to/public /path/to/backup/$(date +%Y%m%d_%H%M%S)
```

---

**Uwaga:** Zawsze testuj deployment na środowisku staging przed wdrożeniem na produkcję!
