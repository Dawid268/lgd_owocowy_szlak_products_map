export class LazyLoader {
  private static observer: IntersectionObserver | null = null;
  private static loadedImages = new Set<string>();

  public static initialize(): void {
    if (this.observer) {
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );
  }

  public static observeImage(img: HTMLImageElement): void {
    if (this.loadedImages.has(img.src)) {
      return;
    }

    this.initialize();
    this.observer?.observe(img);
  }

  private static loadImage(img: HTMLImageElement): void {
    if (this.loadedImages.has(img.src)) {
      return;
    }

    const originalSrc = img.dataset.src || img.src;
    const normalizedSrc = this.normalizeImagePath(originalSrc);

    if (normalizedSrc && normalizedSrc !== img.src) {
      img.src = normalizedSrc;
      img.classList.add('lazy-loaded');
      this.loadedImages.add(normalizedSrc);
    }
  }

  private static normalizeImagePath(path: string): string {
    return path.replace('./img/', '/img/');
  }

  public static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.loadedImages.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  public static destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
