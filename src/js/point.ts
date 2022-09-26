import {
  generateAddressesHTML,
  generateEmailsHTML,
  generateFacebookHTML,
  generateImageHTML,
  generatePhoneNumbersHTML,
  generateProductHTML,
  generateWebPageHTML,
} from "./utils";

export interface PointPosition {
  lat: number;
  lng: number;
}

export interface IPoint {
  latitude: number;
  longitude: number;
  name: string;
  legendName: string;
  legendSubName: string;
  addresses: string[];
  emails: string[];
  phoneNumbers: string[];
  product: string;
  image: string;
  facebook: string;
  webpage: string;
  icon: string;
  description: string;
  color: string;
}

export class Point implements IPoint {
  latitude: number;
  longitude: number;
  name: string;
  legendName: string;
  legendSubName: string;
  addresses: string[];
  emails: string[];
  phoneNumbers: string[];
  product: string;
  image: string;
  facebook: string;
  webpage: string;
  icon: string;
  description: string;
  color: string;

  constructor(
    latitude: number,
    longitude: number,
    name: string,
    addresses: string[],
    emails: string[],
    phoneNumbers: string[],
    product: string,
    image: string,
    facebook: string,
    webpage: string,
    icon: string,
    legendName: string,
    legendSubName: string,
    description: string,
    color = "#000000"
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.addresses = addresses;
    this.emails = emails;
    this.phoneNumbers = phoneNumbers;
    this.product = product;
    this.image = image;
    this.facebook = facebook;
    this.webpage = webpage;
    this.icon = icon;
    this.legendName = legendName;
    this.legendSubName = legendSubName;
    this.description = description;
    this.color = color;
  }

  public generatePopup(): string {
    const addressContainer = generateAddressesHTML(this.addresses);
    let emailsContainer = generateEmailsHTML(this.emails);
    let phoneContainer = `
      <div class="popup-container__information__data__container">
        ${generatePhoneNumbersHTML(this.phoneNumbers)}
      </div>`;
    const webpage = `
      <div class="popup-item-container">
        ${generateWebPageHTML(this.webpage)}
      </div>`;
    const product = generateProductHTML(this.product);
    const facebook = generateFacebookHTML(this.facebook);
    const image = generateImageHTML(this.image);

    return `
    <div class="popup-container">
      <div class="popup-container__information">
        <div class="popup-container__information__data">
          <h2 class="popup-container__information__data--name" style="color: ${this.color}">${this.name}</h2>
          <div class="popup-container__information__data__container">
            ${addressContainer}
          </div>

          <div class="popup-container__information__data__container">
            <div class="popup-container__information__data__container">
              ${phoneContainer}
            </div>
            <div class="popup-container__information__data__container">
              ${emailsContainer}
            </div>
          </div>
          <div class="popup-container__information__data__container">
            ${webpage}
            ${facebook}
          </div>
        
          <div class="popup-container__information__data__container">
            ${product}
          </div>
        </div>
      </div>
      ${image}
    </div>
    `;
  }
}
