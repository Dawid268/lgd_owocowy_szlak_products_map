import { LightboxTemplate } from '../templates/LightboxTemplate';

export class Lightbox {
  private container: HTMLElement | null = null;
  private images: string[];
  private currentIndex: number;
  private onCloseCallback?: () => void;

  constructor(images: string[], currentIndex: number = 0) {
    this.images = images;
    this.currentIndex = currentIndex;
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
      existingLightbox.remove();
    }

    this.container = document.createElement('div');
    this.container.className = 'lightbox';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      LightboxTemplate.generate(
        this.images[this.currentIndex],
        this.currentIndex,
        this.images.length,
        this.images.length > 1
      ),
      'text/html'
    );
    const fragment = document.createDocumentFragment();
    
    Array.from(doc.body.children).forEach(child => {
      fragment.appendChild(child);
    });
    
    this.container.appendChild(fragment);

    document.body.appendChild(this.container);
  }

  private attachEventListeners(): void {
    if (!this.container) return;

    const closeButton = this.container.querySelector('.lightbox__close');
    const prevButton = this.container.querySelector('.lightbox__nav--prev');
    const nextButton = this.container.querySelector('.lightbox__nav--next');
    const lightboxImage = this.container.querySelector('.lightbox');

    const closeLightbox = () => {
      this.close();
    };

    closeButton?.addEventListener('click', closeLightbox);
    lightboxImage?.addEventListener('click', closeLightbox);
    
    prevButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.previous();
    });
    
    nextButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
        document.removeEventListener('keydown', handleKeydown);
      } else if (event.key === 'ArrowLeft') {
        this.previous();
      } else if (event.key === 'ArrowRight') {
        this.next();
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
  }

  private previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateImage();
    }
  }

  private next(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.updateImage();
    }
  }

  private updateImage(): void {
    if (!this.container) return;

    const image = this.container.querySelector('.lightbox__image') as HTMLImageElement;
    const counter = this.container.querySelector('.lightbox__counter') as HTMLElement;
    
    if (image) image.src = this.images[this.currentIndex];
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
  }

  public close(): void {
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
