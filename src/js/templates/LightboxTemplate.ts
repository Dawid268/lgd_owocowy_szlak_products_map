export class LightboxTemplate {
  static generate(imageSrc: string, currentIndex: number, totalImages: number, showNavigation: boolean): string {
    const navigationHTML = showNavigation ? `
      <div class="lightbox__nav lightbox__nav--prev">&larr;</div>
      <div class="lightbox__nav lightbox__nav--next">&rarr;</div>
    ` : `
      <div class="lightbox__nav lightbox__nav--prev lightbox__nav--hidden">&larr;</div>
      <div class="lightbox__nav lightbox__nav--next lightbox__nav--hidden">&rarr;</div>
    `;

    return `
      <div class="lightbox__close">&times;</div>
      ${navigationHTML}
      <img class="lightbox__image" src="${imageSrc}" alt="Full size image">
      <div class="lightbox__counter">${currentIndex + 1} / ${totalImages}</div>
    `;
  }
}
