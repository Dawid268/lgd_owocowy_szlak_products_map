import { IPoint } from '../types/Point';

export class PopupTemplate {
  static generateWebPage(webpage: string | null): string {
    return webpage
      ? `<div class="data-container">
          <img class="data-container--icon" src='./img/1/web-svgrepo-com.svg'>
          <a href=${webpage} target="_blank">${webpage}</a>
        </div>`
      : '';
  }

  static generateProduct(product: string): string {
    return product
      ? `<span class="data-container--product">${product}</span>`
      : '';
  }

  static generateFacebook(facebook: string | null): string {
    return facebook
      ? `<a href=${facebook} target="_blank">
          <img class="data-container--facebook" src='./img/1/facebook-svgrepo-com.svg'>
        </a>`
      : '';
  }

  static generateImage(image: string | null): string {
    return image ? `<img class="popup-container--image" src=${image}>` : '';
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
        <div class="data-container">
          <img class="data-container--icon" src='./img/1/email-svgrepo-com.svg'>
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
        <div class="data-container">
          <img class="data-container--icon" src='./img/1/phone-svgrepo-com.svg'>
          <a href="tel:${curr}">${curr}</a>
        </div>`;
    }, '');
  }

  static generate(point: IPoint): string {
    const addressContainer = this.generateAddresses(point.addresses);
    const emailsContainer = this.generateEmails(point.emails);
    const phoneContainer = this.generatePhones(point.phoneNumbers);
    const webpage = this.generateWebPage(point.webpage);
    const product = this.generateProduct(point.product);
    const facebook = this.generateFacebook(point.facebook);
    const image = this.generateImage(point.image);

    return `
      <div class="popup-container">
        <div class="data__title__container">
          <img class="data__title__container--icon" src="${point.icon}" alt="${point.name}">
          <div class="data__title__container--name" style="color: ${point.color}">${point.name}</div>
          ${addressContainer ? `<div class="data__title__container--address">${addressContainer}</div>` : ''}
          ${phoneContainer ? `<div class="data__title__container--phone">${phoneContainer}</div>` : ''}
          ${emailsContainer ? `<div class="data__title__container--email">${emailsContainer}</div>` : ''}
          ${(webpage || facebook) ? `<div class="data__title__container--social">${webpage} ${facebook}</div>` : ''}
        </div>
        ${image}
      </div>
    `;
  }
}
