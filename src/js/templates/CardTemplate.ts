import { IPoint } from '../types/Point';

export class CardTemplate {
  static generate(point: IPoint): string {
    const htmlImage = point.image
      ? `<img class="cards-container__item__header--image" src="${point.image}">`
      : '';

    // Dane kontaktowe
    const addressesHtml =
      point.addresses && point.addresses.length > 0
        ? `<div class="contact-item">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>${point.addresses.join(', ')}</span>
        </div>`
        : '';

    const phoneHtml =
      point.phoneNumbers && point.phoneNumbers.length > 0
        ? `<div class="contact-item">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <span>${point.phoneNumbers.map(p => `<a href="tel:${p}">${p}</a>`).join(', ')}</span>
        </div>`
        : '';

    const emailHtml =
      point.emails && point.emails.length > 0
        ? `<div class="contact-item">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span>${point.emails.map(e => `<a href="mailto:${e}">${e}</a>`).join(', ')}</span>
        </div>`
        : '';

    const facebookHtml = point.facebook
      ? `<div class="contact-item">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span><a href="${point.facebook}" target="_blank">Facebook</a></span>
        </div>`
      : '';

    const webpageHtml = point.webpage
      ? `<div class="contact-item">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <span><a href="${point.webpage}" target="_blank">Strona WWW</a></span>
        </div>`
      : '';

    const carouselHtml =
      point.images && point.images.length > 1
        ? `<div class="cards-container__item__carousel">
          <div class="glide">
            <div class="glide__track" data-glide-el="track">
              <ul class="glide__slides">
                ${point.images
                  .map(
                    (img: string, index: number) =>
                      `<li class="glide__slide" data-index="${index}"><img data-src="${img}" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA0MEM0Ni4wNjI3IDQwIDUxIDM1LjA2MjcgNTEgMjlDNTAgMjIuOTM3MyA0Ni4wNjI3IDE4IDQwIDE4QzMzLjkzNzMgMTggMzAgMjIuOTM3MyAzMCAyOUMzMCAzNS4wNjI3IDMzLjkzNzMgNDAgNDAgNDBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yMCA2MEw0MCA0MEw2MCA2MCIgc3Ryb2tlPSIjQ0NDIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K" alt="Thumbnail" class="lazy-image" /></li>`
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        </div>`
        : '';

    return `
      <div class="cards-container__item">
        <div class="cards-container__item__header">
          <div class="data__title__container">
            <img class="data__title__container--icon" src="${point.icon}" alt="${point.name}">
            <div class="data__title__container--name" style="color: ${
              point.color
            }">${point.name}</div>
            <div class="data__title__container--contact" style="margin-bottom: 40px;">
            ${
              addressesHtml
                ? `<div class="data__title__container--address">${point.addresses.join(
                    '<br>'
                  )}</div>`
                : ''
            }
            ${
              phoneHtml
                ? `<div class="data__title__container--phone">${point.phoneNumbers
                    .map(p => `<a href="tel:${p}">${p}</a>`)
                    .join('<br>')}</div>`
                : ''
            }
            ${
              emailHtml
                ? `<div class="data__title__container--email">${point.emails
                    .map(e => `<a href="mailto:${e}">${e}</a>`)
                    .join('<br>')}</div>`
                : ''
            }
            ${
              facebookHtml || webpageHtml
                ? `<div class="data__title__container--social">${facebookHtml} ${webpageHtml}</div>`
                : ''
            }
            </div>
          </div>
          ${htmlImage}
        </div>
        <span class="cards-container__item--description" style="border-top: 1px solid ${
          point.color
        } !important">
          ${point.description}
        </span>
        ${carouselHtml}

      </div>
    `;
  }
}
