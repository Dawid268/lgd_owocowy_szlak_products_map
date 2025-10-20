interface ThemeInfo {
  name: string;
  version: string;
  author: string;
  colors: Record<string, string>;
  typography: Record<string, string>;
}

interface FrontendStrings {
  loading: string;
  error: string;
  noPoints: string;
  close: string;
  next: string;
  prev: string;
}

interface LgdMapData {
  apiUrl: string;
  nonce: string;
  ajaxUrl: string;
  pluginUrl: string;
  theme: ThemeInfo;
  strings: FrontendStrings;
}

interface PointData {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  legendName: string;
  legendSubName: string;
  phone: string;
  website: string;
  image: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

interface MapConfig {
  default_lat: number;
  default_lng: number;
  default_zoom: number;
  show_legend: boolean;
  show_cards: boolean;
  legend_position: string;
}

interface DisplayConfig {
  width: string;
  height: string;
  theme: string;
}

interface MapSettings {
  map: MapConfig;
  display: DisplayConfig;
  categories: Record<string, string>;
}

interface ApiResponseData {
  points?: PointData[];
  settings?: MapSettings;
  total?: number;
  pages?: number;
}

interface AjaxResponse {
  success: boolean;
  data: ApiResponseData;
}

declare const lgdMapData: LgdMapData;

class LgdMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map: any;
  private points: PointData[] = [];
  private settings: MapSettings | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private markers: any[] = [];
  private legend: HTMLElement | null = null;
  private cards: HTMLElement | null = null;
  private lightbox: HTMLElement | null = null;
  private currentIndex: number = 0;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      await this.loadData();
      this.createMap();
      this.createLegend();
      this.createCards();
      this.createLightbox();
      this.addMarkers();
      this.setupEventListeners();
    } catch {
      this.showError(lgdMapData.strings.error);
    }
  }

  /**
   * Load data from API
   */
  private async loadData(): Promise<void> {
    try {
      const [pointsResponse, settingsResponse] = await Promise.all([
        this.fetchData('/wp-json/lgd-map/v1/points'),
        this.fetchData('/wp-json/lgd-map/v1/settings'),
      ]);

      if (pointsResponse.success && pointsResponse.data.points) {
        this.points = pointsResponse.data.points;
      }

      if (settingsResponse.success && settingsResponse.data.settings) {
        this.settings = settingsResponse.data.settings;
      }
    } catch {
      throw new Error('Failed to load data');
    }
  }

  /**
   * Fetch data from API
   */
  private async fetchData(url: string): Promise<AjaxResponse> {
    const response = await fetch(url, {
      headers: {
        'X-WP-Nonce': lgdMapData.nonce,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Create Leaflet map
   */
  private createMap(): void {
    const settings = this.settings?.map || {
      default_lat: 51.2465,
      default_lng: 22.5684,
      default_zoom: 10,
    };

    // eslint-disable-next-line no-undef
    this.map = L.map('lgd-map').setView(
      [settings.default_lat, settings.default_lng],
      settings.default_zoom
    );

    // eslint-disable-next-line no-undef
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  /**
   * Create legend
   */
  private createLegend(): void {
    if (!this.settings?.map.show_legend) return;

    const legendContainer = document.getElementById('lgd-legend');
    if (!legendContainer) return;

    this.legend = legendContainer;

    const categories = this.settings.categories;
    const legendItems = Object.keys(categories)
      .map(categoryId => {
        const categoryName = categories[categoryId];
        const pointsInCategory = this.points.filter(p => p.category === categoryId);

        if (pointsInCategory.length === 0) return '';

        return `
                <div class="lgd-legend-item" data-category="${categoryId}">
                    <span class="lgd-legend-icon">
                        <img src="${lgdMapData.pluginUrl}img/1/${categoryId}.svg" alt="${categoryName}" />
                    </span>
                    <span class="lgd-legend-text">${categoryName}</span>
                    <span class="lgd-legend-count">(${pointsInCategory.length})</span>
                </div>
            `;
      })
      .join('');

    this.legend.innerHTML = `
            <div class="lgd-legend-header">
                <h3>Legend</h3>
            </div>
            <div class="lgd-legend-items">
                ${legendItems}
            </div>
        `;
  }

  /**
   * Create cards container
   */
  private createCards(): void {
    if (!this.settings?.map.show_cards) return;

    const cardsContainer = document.getElementById('lgd-cards');
    if (!cardsContainer) return;

    this.cards = cardsContainer;

    const cardsHtml = this.points.map(point => this.createCardHtml(point)).join('');
    this.cards.innerHTML = `
            <div class="lgd-cards-container">
                ${cardsHtml}
            </div>
        `;
  }

  /**
   * Create card HTML
   */
  private createCardHtml(point: PointData): string {
    const categoryName = this.settings?.categories[point.category] || point.category;

    return `
            <div class="lgd-card" data-point-id="${point.id}">
                <div class="lgd-card-header">
                    <div class="lgd-card-image">
                        <img src="${lgdMapData.pluginUrl}img/1/${point.image}" alt="${point.name}" />
                    </div>
                    <div class="lgd-card-title">
                        <h3>${point.name}</h3>
                        <span class="lgd-card-category">${categoryName}</span>
                    </div>
                </div>
                <div class="lgd-card-content">
                    <p class="lgd-card-description">${point.description}</p>
                    <div class="lgd-card-contact">
                        ${point.phone ? `<div class="lgd-card-phone">📞 ${point.phone}</div>` : ''}
                        ${point.website ? `<div class="lgd-card-website">🌐 <a href="${point.website}" target="_blank">Website</a></div>` : ''}
                    </div>
                </div>
                ${point.images && point.images.length > 0 ? this.createCarouselHtml(point) : ''}
            </div>
        `;
  }

  /**
   * Create carousel HTML
   */
  private createCarouselHtml(point: PointData): string {
    const images = point.images.slice(0, 3);

    return `
            <div class="lgd-carousel" data-point-id="${point.id}">
                <div class="lgd-carousel-container">
                    ${images
                      .map(
                        image => `
                        <div class="lgd-carousel-slide" data-image="${image}">
                            <img src="${lgdMapData.pluginUrl}img/1/${image}" alt="${point.name}" />
                        </div>
                    `
                      )
                      .join('')}
                </div>
                ${
                  images.length > 1
                    ? `
                    <div class="lgd-carousel-arrows">
                        <button class="lgd-carousel-arrow lgd-carousel-arrow--prev" data-point-id="${point.id}">‹</button>
                        <button class="lgd-carousel-arrow lgd-carousel-arrow--next" data-point-id="${point.id}">›</button>
                    </div>
                `
                    : ''
                }
            </div>
        `;
  }

  /**
   * Create lightbox
   */
  private createLightbox(): void {
    const lightboxContainer = document.getElementById('lgd-lightbox');
    if (!lightboxContainer) return;

    this.lightbox = lightboxContainer;

    this.lightbox.innerHTML = `
            <div class="lgd-lightbox-content">
                <button class="lgd-lightbox-close">×</button>
                <div class="lgd-lightbox-image">
                    <img src="" alt="" />
                </div>
                <div class="lgd-lightbox-nav">
                    <button class="lgd-lightbox-nav lgd-lightbox-nav--prev">‹</button>
                    <button class="lgd-lightbox-nav lgd-lightbox-nav--next">›</button>
                </div>
                <div class="lgd-lightbox-counter">
                    <span class="lgd-lightbox-current">1</span> / <span class="lgd-lightbox-total">1</span>
                </div>
            </div>
        `;
  }

  /**
   * Add markers to map
   */
  private addMarkers(): void {
    this.points.forEach(point => {
      const categoryName = this.settings?.categories[point.category] || point.category;

      // eslint-disable-next-line no-undef
      const marker = L.marker([point.latitude, point.longitude])
        .addTo(this.map)
        .bindPopup(this.createPopupHtml(point, categoryName));

      this.markers.push(marker);
    });
  }

  /**
   * Create popup HTML
   */
  private createPopupHtml(point: PointData, categoryName: string): string {
    return `
            <div class="lgd-popup">
                <div class="lgd-popup-header">
                    <div class="lgd-popup-image">
                        <img src="${lgdMapData.pluginUrl}img/1/${point.image}" alt="${point.name}" />
                    </div>
                    <div class="lgd-popup-content">
                        <h3 class="lgd-popup-title">${point.name}</h3>
                        <span class="lgd-popup-category">${categoryName}</span>
                        <p class="lgd-popup-description">${point.description}</p>
                        <div class="lgd-popup-contact">
                            ${point.phone ? `<div class="lgd-popup-phone">📞 ${point.phone}</div>` : ''}
                            ${point.website ? `<div class="lgd-popup-website">🌐 <a href="${point.website}" target="_blank">Website</a></div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Legend item clicks
    if (this.legend) {
      this.legend.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const legendItem = target.closest('.lgd-legend-item');
        if (legendItem) {
          const category = legendItem.getAttribute('data-category');
          this.filterByCategory(category);
        }
      });
    }

    // Card clicks
    if (this.cards) {
      this.cards.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const card = target.closest('.lgd-card');
        if (card) {
          const pointId = parseInt(card.getAttribute('data-point-id') || '0');
          this.focusOnPoint(pointId);
        }
      });
    }

    // Carousel arrow clicks
    document.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('lgd-carousel-arrow')) {
        const pointId = parseInt(target.getAttribute('data-point-id') || '0');
        const direction = target.classList.contains('lgd-carousel-arrow--prev') ? 'prev' : 'next';
        this.handleCarouselArrow(pointId, direction);
      }
    });

    // Lightbox events
    if (this.lightbox) {
      this.lightbox.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('lgd-lightbox-close')) {
          this.closeLightbox();
        } else if (target.classList.contains('lgd-lightbox-nav--prev')) {
          this.previousImage();
        } else if (target.classList.contains('lgd-lightbox-nav--next')) {
          this.nextImage();
        }
      });
    }

    // Keyboard events
    document.addEventListener('keydown', e => {
      if (this.lightbox && this.lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
          this.closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          this.previousImage();
        } else if (e.key === 'ArrowRight') {
          this.nextImage();
        }
      }
    });
  }

  /**
   * Filter points by category
   */
  private filterByCategory(category: string | null): void {
    if (!category) return;

    // Update legend active state
    if (this.legend) {
      this.legend.querySelectorAll('.lgd-legend-item').forEach(item => {
        item.classList.remove('lgd-legend-item--active');
      });
      this.legend
        .querySelector(`[data-category="${category}"]`)
        ?.classList.add('lgd-legend-item--active');
    }

    // Show/hide markers
    this.markers.forEach(marker => {
      const point = this.points.find(
        p => marker.getLatLng().lat === p.latitude && marker.getLatLng().lng === p.longitude
      );

      if (point && point.category === category) {
        marker.addTo(this.map);
      } else {
        marker.remove();
      }
    });

    // Update cards
    if (this.cards) {
      this.cards.querySelectorAll('.lgd-card').forEach(card => {
        const pointId = parseInt(card.getAttribute('data-point-id') || '0');
        const point = this.points.find(p => p.id === pointId);

        if (point && point.category === category) {
          (card as HTMLElement).style.display = 'block';
        } else {
          (card as HTMLElement).style.display = 'none';
        }
      });
    }
  }

  /**
   * Focus on specific point
   */
  private focusOnPoint(pointId: number): void {
    const point = this.points.find(p => p.id === pointId);
    if (point) {
      this.map.setView([point.latitude, point.longitude], 15);

      // Open popup
      const marker = this.markers.find(
        m => m.getLatLng().lat === point.latitude && m.getLatLng().lng === point.longitude
      );
      if (marker) {
        marker.openPopup();
      }
    }
  }

  /**
   * Handle carousel arrow click
   */
  private handleCarouselArrow(pointId: number, direction: 'prev' | 'next'): void {
    const point = this.points.find(p => p.id === pointId);
    if (!point || !point.images || point.images.length === 0) return;

    const carousel = document.querySelector(`[data-point-id="${pointId}"] .lgd-carousel-container`);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.lgd-carousel-slide');
    const currentSlide = carousel.querySelector('.lgd-carousel-slide.active');
    let currentIndex = Array.from(slides).indexOf(currentSlide as Element);

    if (direction === 'prev') {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
    } else {
      currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
    }

    // Update active slide
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
  }

  /**
   * Open lightbox with image
   */
  private openLightbox(imageSrc: string, images: string[], currentIndex: number): void {
    if (!this.lightbox) return;

    this.currentIndex = currentIndex;
    const image = this.lightbox.querySelector('.lgd-lightbox-image img') as HTMLImageElement;
    const currentSpan = this.lightbox.querySelector('.lgd-lightbox-current') as HTMLElement;
    const totalSpan = this.lightbox.querySelector('.lgd-lightbox-total') as HTMLElement;

    if (image) {
      image.src = imageSrc;
      image.alt = 'Lightbox image';
    }

    if (currentSpan) {
      currentSpan.textContent = (currentIndex + 1).toString();
    }

    if (totalSpan) {
      totalSpan.textContent = images.length.toString();
    }

    this.lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close lightbox
   */
  private closeLightbox(): void {
    if (this.lightbox) {
      this.lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  /**
   * Previous image in lightbox
   */
  private previousImage(): void {
    // Implementation for previous image
  }

  /**
   * Next image in lightbox
   */
  private nextImage(): void {
    // Implementation for next image
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    const container = document.querySelector('.lgd-map-container');
    if (container) {
      container.innerHTML = `
                <div class="lgd-error">
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new LgdMap();
});
