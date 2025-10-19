import { Carousel } from './Carousel';
import { Lightbox } from './Lightbox';
import { IPoint } from '../types/Point';
import { CardTemplate } from '../templates/CardTemplate';

export class Card {
  private readonly point: IPoint;
  private readonly container: HTMLElement;
  private carousel: Carousel | null = null;

  constructor(point: IPoint) {
    this.point = point;
    this.container = this.createCardElement();
    this.initializeCarousel();
    this.attachEventListeners();
  }

  private createCardElement(): HTMLElement {
    const cardContainer = document.createElement('div');
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(CardTemplate.generate(this.point), 'text/html');
    const fragment = document.createDocumentFragment();
    
    Array.from(doc.body.children).forEach(child => {
      fragment.appendChild(child);
    });
    
    cardContainer.appendChild(fragment);
    return cardContainer;
  }

  private initializeCarousel(): void {
    if (!this.point.images || this.point.images.length <= 1) {
      return;
    }

    const carouselContainer = this.container.querySelector('.cards-container__item__carousel') as HTMLElement;

    if (!carouselContainer) {
      return;
    }

    this.carousel = new Carousel(carouselContainer, this.point.images);
  }

  private attachEventListeners(): void {
    setTimeout(() => {
      const slides = this.container.querySelectorAll('.glide__slide');
      
      slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img) {
          img.addEventListener('click', (event: Event) => {
            event.stopPropagation();
            this.openLightbox(index);
          });
        }
      });
    }, 50);
  }

  private openLightbox(startIndex: number): void {
    if (!this.point.images || this.point.images.length === 0) {
      return;
    }

    new Lightbox(this.point.images, startIndex);
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public getPoint(): IPoint {
    return this.point;
  }

  public getCarousel(): Carousel | null {
    return this.carousel;
  }

  public destroy(): void {
    if (this.carousel) {
      this.carousel.destroy();
      this.carousel = null;
    }

    this.container.remove();
  }
}
