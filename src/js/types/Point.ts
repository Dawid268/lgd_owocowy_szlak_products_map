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
  images: string[];
  facebook: string;
  webpage: string;
  icon: string;
  description: string;
  color: string;
}

import { PopupTemplate } from '../templates/PopupTemplate';

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
  images: string[];
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
    images: string[],
    facebook: string,
    webpage: string,
    icon: string,
    legendName: string,
    legendSubName: string,
    description: string,
    color = '#000000'
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.addresses = addresses;
    this.emails = emails;
    this.phoneNumbers = phoneNumbers;
    this.product = product;
    this.image = image;
    this.images = images;
    this.facebook = facebook;
    this.webpage = webpage;
    this.icon = icon;
    this.legendName = legendName;
    this.legendSubName = legendSubName;
    this.description = description;
    this.color = color;
  }

  public generatePopup(): string {
    return PopupTemplate.generate(this);
  }
}

export type PointPosition = {
  latitude: number;
  longitude: number;
};
