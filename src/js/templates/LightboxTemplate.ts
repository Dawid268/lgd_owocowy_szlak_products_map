export class LightboxTemplate {
  static generate(
    imageSrc: string,
    currentIndex: number,
    totalImages: number,
    showNavigation: boolean
  ): string {
    const navigationHTML = showNavigation
      ? `
      <div class="map-lightbox__nav map-lightbox__nav--prev">&larr;</div>
      <div class="map-lightbox__nav map-lightbox__nav--next">&rarr;</div>
    `
      : `
      <div class="map-lightbox__nav map-lightbox__nav--prev map-lightbox__nav--hidden">&larr;</div>
      <div class="map-lightbox__nav map-lightbox__nav--next map-lightbox__nav--hidden">&rarr;</div>
    `;

    return `
      <div class="map-lightbox__close">&times;</div>
      ${navigationHTML}
      <img class="map-lightbox__image" src="${imageSrc}" alt="Full size image">
      <div class="map-lightbox__counter">${currentIndex + 1} / ${totalImages}</div>
    `;
  }
}
