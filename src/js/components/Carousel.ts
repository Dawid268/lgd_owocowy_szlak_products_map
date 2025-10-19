import Glide from '@glidejs/glide';

export class Carousel {
  private glide: Glide | null = null;
  private images: string[];

  constructor(container: HTMLElement, images: string[]) {
    this.images = images;
    this.initialize(container);
  }

  private initialize(container: HTMLElement): void {
    const glideEl = container.querySelector('.glide');
    if (!glideEl) {
      return;
    }

    setTimeout(() => {
      try {
        this.glide = new Glide(glideEl as HTMLElement, {
          type: 'carousel',
          perView: 3,
          gap: 15,
          bound: false,
          rewind: false,
          peek: 0,
          breakpoints: {
            '1024': {
              perView: 3,
              gap: 15,
            },
            '800': {
              perView: 2,
              gap: 15,
            },
            '480': {
              perView: 1,
              gap: 15,
            },
          },
        }).mount();

        window.dispatchEvent(new Event('resize'));
      } catch {
        // Ignore carousel initialization errors
      }
    }, 50);
  }

  public getImages(): string[] {
    return this.images;
  }

  public destroy(): void {
    this.glide?.destroy();
  }
}
