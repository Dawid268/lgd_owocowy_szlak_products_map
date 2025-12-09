import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export class Carousel {
  private swiper: Swiper | null = null;
  private images: string[];

  constructor(container: HTMLElement, images: string[]) {
    this.images = images;
    this.initialize(container);
  }

  private initialize(container: HTMLElement): void {
    const swiperEl = container.querySelector('.swiper');
    if (!swiperEl) {
      return;
    }

    setTimeout(() => {
      try {
        const options = {
          modules: [Navigation, Pagination],
          slidesPerView: 3,
          spaceBetween: 8,
          loop: false,
          speed: 400,
          navigation: {
            nextEl: container.querySelector('.swiper-button-next'),
            prevEl: container.querySelector('.swiper-button-prev'),
          },
          pagination: {
            el: container.querySelector('.swiper-pagination'),
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          },
          breakpoints: {
            1024: {
              slidesPerView: 3,
              spaceBetween: 8,
            },
            800: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 1,
              spaceBetween: 8,
            },
          },
        };

        this.swiper = new Swiper(swiperEl as HTMLElement, options);
      } catch (error) {
        console.error('Carousel initialization error:', error);
      }
    }, 50);
  }

  public getImages(): string[] {
    return this.images;
  }

  public destroy(): void {
    this.swiper?.destroy(true, true);
    this.swiper = null;
  }
}
