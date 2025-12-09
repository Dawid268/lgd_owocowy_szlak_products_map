import { IPoint } from '../types/Point';

export class CardTemplate {
  static generate(point: IPoint): string {
    const htmlImage = point.image
      ? `<img class="map-cards-container__item__header--image" src="${point.image}">`
      : '';

    const addressesHtml =
      point.addresses && point.addresses.length > 0
        ? `<div class="map-contact-item">
          <svg class="map-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>${point.addresses.join(', ')}</span>
        </div>`
        : '';

    const phoneHtml =
      point.phoneNumbers && point.phoneNumbers.length > 0
        ? `<div class="map-contact-item">
          <svg class="map-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <span>${point.phoneNumbers.map(p => `<a href="tel:${p}">${p}</a>`).join(', ')}</span>
        </div>`
        : '';

    const emailHtml =
      point.emails && point.emails.length > 0
        ? `<div class="map-contact-item">
          <svg class="map-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span>${point.emails.map(e => `<a href="mailto:${e}">${e}</a>`).join(', ')}</span>
        </div>`
        : '';

    const facebookHtml = point.facebook
      ? `<div class="map-contact-item">
          <svg class="map-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span><a href="${point.facebook}" target="_blank" rel="noopener noreferrer">Facebook</a></span>
        </div>`
      : '';

    const webpageHtml = point.webpage
      ? `<div class="map-contact-item">
          <img class="map-contact-icon" src="./img/1/web-svgrepo-com.svg" alt="Strona WWW" width="16" height="16">
          <span><a href="${point.webpage}" target="_blank" rel="noopener noreferrer">Strona WWW</a></span>
        </div>`
      : '';

    const bookingHtml = point.booking
      ? `<div class="map-contact-item">
          <img class="map-contact-icon" src="./img/1/booking.svg" alt="Booking" width="16" height="16">
          <span><a href="${point.booking}" target="_blank" rel="noopener noreferrer">Booking</a></span>
        </div>`
      : '';

    const carouselHtml =
      point.images && point.images.length > 1
        ? `<div class="map-cards-container__item__carousel">
          <div class="swiper">
            <div class="swiper-wrapper">
              ${point.images
                .map(
                  (img: string, index: number) =>
                    `<div class="swiper-slide" data-index="${index}">
                      <img data-src="${img}" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjkwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00NSA0NUM1MS42MjggNDUgNTcgMzkuNjI4IDU3IDMzQzU3IDI2LjM3MiA1MS42MjggMjEgNDUgMjFDMzguMzcyIDIxIDMzIDI2LjM3MiAzMyAzM0MzMyAzOS42MjggMzguMzcyIDQ1IDQ1IDQ1WiIgZmlsbD0iI0NDQyIvPgo8cGF0aCBkPSJNMjIgNjdMNDUgNDVMNjggNjciIHN0cm9rZT0iI0NDQyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==" alt="Thumbnail" class="lazy-image" />
                    </div>`
                )
                .join('')}
            </div>
            <div class="swiper-button-prev" aria-label="Previous"></div>
            <div class="swiper-button-next" aria-label="Next"></div>
            <div class="swiper-pagination"></div>
          </div>
        </div>`
        : '';

    return `
      <div class="map-cards-container__item">
        <div class="map-cards-container__item__header">
          <div class="map-data__title__container">
            <img class="map-data__title__container--icon" src="${point.icon}" alt="${point.name}">
            <div class="map-data__title__container--name" style="color: ${
              point.color
            }">${point.name}</div>
            <div class="map-data__title__container--contact" style="margin-bottom: 40px;">
            ${
              addressesHtml
                ? `<div class="map-data__title__container--address">${point.addresses.join(
                    '<br>'
                  )}</div>`
                : ''
            }
            ${
              phoneHtml
                ? `<div class="map-data__title__container--phone">${point.phoneNumbers
                    .map(p => `<a href="tel:${p}">${p}</a>`)
                    .join('<br>')}</div>`
                : ''
            }
            ${
              emailHtml
                ? `<div class="map-data__title__container--email">${point.emails
                    .map(e => `<a href="mailto:${e}">${e}</a>`)
                    .join('<br>')}</div>`
                : ''
            }
            ${
              facebookHtml || webpageHtml || bookingHtml
                ? `<div class="map-data__title__container--social">${facebookHtml} ${webpageHtml} ${bookingHtml}</div>`
                : ''
            }
            </div>
          </div>
          ${htmlImage}
        </div>
        <span class="map-cards-container__item--description" style="border-top: 1px solid ${
          point.color
        } !important">
          ${point.description}
        </span>
        ${carouselHtml}

      </div>
    `;
  }
}
