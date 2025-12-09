import { Swiper } from 'swiper';
import { Navigation, Pagination, Keyboard, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

export class Lightbox {
  private container: HTMLElement | null = null;
  private swiper: Swiper | null = null;
  private images: string[];
  private currentIndex: number;
  private onCloseCallback?: () => void;

  constructor(images: string[], currentIndex: number = 0) {
    this.images = images;
    this.currentIndex = currentIndex;

    if (this.currentIndex >= this.images.length) {
      this.currentIndex = 0;
    }
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }

    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    const existingLightbox = document.querySelector('.map-lightbox');
    if (existingLightbox) {
      existingLightbox.remove();
    }

    if (!this.images || this.images.length === 0) {
      return;
    }

    this.container = document.createElement('div');
    this.container.className = 'map-lightbox';

    const swiperHTML = `
      <div class="map-lightbox__close">&times;</div>
      <div class="swiper map-lightbox__swiper">
        <div class="swiper-wrapper">
          ${this.images
            .map(
              (img, index) => `
            <div class="swiper-slide">
              <div class="swiper-zoom-container">
                <img src="${this.normalizeImagePath(img)}" alt="Image ${index + 1}" class="map-lightbox__image" />
              </div>
            </div>
          `
            )
            .join('')}
        </div>
        ${
          this.images.length > 1
            ? `
          <div class="swiper-button-prev map-lightbox__nav--prev"></div>
          <div class="swiper-button-next map-lightbox__nav--next"></div>
          <div class="swiper-pagination map-lightbox__pagination"></div>
        `
            : ''
        }
      </div>
    `;

    this.container.innerHTML = swiperHTML;
    document.body.appendChild(this.container);

    setTimeout(() => {
      this.initializeSwiper();
    }, 50);
  }

  private initializeSwiper(): void {
    if (!this.container) return;

    const swiperEl = this.container.querySelector('.map-lightbox__swiper') as HTMLElement;
    if (!swiperEl) return;

    this.swiper = new Swiper(swiperEl, {
      modules: [Navigation, Pagination, Keyboard, Zoom],
      initialSlide: this.currentIndex,
      slidesPerView: 1,
      spaceBetween: 20,
      zoom: {
        maxRatio: 3,
        minRatio: 1,
      },
      navigation: {
        nextEl: this.container.querySelector('.swiper-button-next') as HTMLElement,
        prevEl: this.container.querySelector('.swiper-button-prev') as HTMLElement,
      },
      pagination: {
        el: this.container.querySelector('.swiper-pagination') as HTMLElement,
        type: 'fraction',
        clickable: true,
      },
      keyboard: {
        enabled: true,
      },
      loop: false,
      speed: 300,
    });
  }

  private attachEventListeners(): void {
    if (!this.container) return;

    const closeButton = this.container.querySelector('.map-lightbox__close');
    const lightbox = this.container;

    const closeLightbox = () => {
      this.close();
    };

    closeButton?.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox || (e.target as HTMLElement).classList.contains('map-lightbox')) {
        closeLightbox();
      }
    });

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
        document.removeEventListener('keydown', handleKeydown);
      }
    };

    document.addEventListener('keydown', handleKeydown);
  }

  private normalizeImagePath(path: string | undefined): string {
    if (!path) {
      return '';
    }
    return path.replace('./img/', '/img/');
  }

  public close(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  public onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }
}
