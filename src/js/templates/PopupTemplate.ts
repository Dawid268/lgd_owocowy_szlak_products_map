import { IPoint } from '../types/Point';

export class PopupTemplate {
  static generateWebPage(webpage: string | null): string {
    return webpage
      ? `<div class="map-data-container">
          <img class="map-data-container--icon" src='./img/1/web-svgrepo-com.svg'>
          <a href=${webpage} target="_blank">${webpage}</a>
        </div>`
      : '';
  }

  static generateBooking(booking: string | null): string {
    return booking
      ? `<div class="map-data-container">
          <img class="map-data-container--icon" src='./img/1/booking.svg' alt="Booking">
          <a href="${booking}" target="_blank" rel="noopener noreferrer">Booking</a>
        </div>`
      : '';
  }

  static generateProduct(product: string): string {
    return product ? `<span class="map-data-container--product">${product}</span>` : '';
  }

  static generateFacebook(facebook: string | null): string {
    return facebook
      ? `<a href=${facebook} target="_blank">
          <img class="map-data-container--facebook" src='./img/1/facebook-svgrepo-com.svg'>
        </a>`
      : '';
  }

  static generateImage(image: string | null): string {
    return image ? `<img class="map-popup-container--image" src=${image}>` : '';
  }

  static generateAddresses(addresses: string[]): string {
    if (!addresses || !Array.isArray(addresses)) {
      return '';
    }
    return addresses.reduce((prev, curr) => {
      return `${prev}<span>${curr}</span>`;
    }, '');
  }

  static generateEmails(emails: string[] | null): string {
    if (!emails || !Array.isArray(emails)) {
      return '';
    }
    return emails.reduce((prev, curr) => {
      return `${prev}
        <div class="map-data-container">
          <img class="map-data-container--icon" src='./img/1/email-svgrepo-com.svg'>
          <a href="mailto:${curr}">${curr}</a>
        </div>`;
    }, '');
  }

  static generatePhones(phoneNumbers: string[] | null): string {
    if (!phoneNumbers || !Array.isArray(phoneNumbers)) {
      return '';
    }
    return phoneNumbers.reduce((prev, curr) => {
      return `${prev}
        <div class="map-data-container">
          <img class="map-data-container--icon" src='./img/1/phone-svgrepo-com.svg'>
          <a href="tel:${curr}">${curr}</a>
        </div>`;
    }, '');
  }

  static generate(point: IPoint): string {
    const addressContainer = this.generateAddresses(point.addresses);
    const emailsContainer = this.generateEmails(point.emails);
    const phoneContainer = this.generatePhones(point.phoneNumbers);
    const webpage = this.generateWebPage(point.webpage);
    const booking = this.generateBooking(point.booking);
    const facebook = this.generateFacebook(point.facebook);
    const image = this.generateImage(point.image);

    return `
      <div class="map-popup-container">
        <div class="map-data__title__container">
          <div class="map-data__title__container--name" style="color: ${point.color}">${point.name}</div>
          <div class="map-data__title__container--contact" style="margin-bottom: 40px;">
          ${addressContainer ? `<div class="map-data__title__container--address">${addressContainer}</div>` : ''}
          ${phoneContainer ? `<div class="map-data__title__container--phone">${phoneContainer}</div>` : ''}
          ${emailsContainer ? `<div class="map-data__title__container--email">${emailsContainer}</div>` : ''}
          ${webpage || booking || facebook ? `<div class="map-data__title__container--social">${webpage} ${booking} ${facebook}</div>` : ''}
          </div>
        </div>
        ${image}
      </div>
    `;
  }
}
