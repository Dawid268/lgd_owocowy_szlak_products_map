export interface RawPointData {
  latitude?: number;
  longitude?: number;
  name?: string;
  legendName?: string;
  legendSubName?: string;
  addresses?: string[];
  emails?: string[];
  phoneNumbers?: string[];
  product?: string;
  image?: string;
  images?: string[];
  facebook?: string;
  webpage?: string;
  icon?: string;
  description?: string;
  color?: string;
}

export interface ValidatedPointData {
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

export class DataValidator {
  private static readonly DEFAULT_COLOR = '#000000';
  private static readonly DEFAULT_EMPTY_STRING = '';

  static validatePointData(rawData: RawPointData): ValidatedPointData {
    return {
      latitude: this.validateNumber(rawData.latitude, 0),
      longitude: this.validateNumber(rawData.longitude, 0),
      name: this.validateString(rawData.name),
      legendName: this.validateString(rawData.legendName),
      legendSubName: this.validateString(rawData.legendSubName),
      addresses: this.validateStringArray(rawData.addresses),
      emails: this.validateStringArray(rawData.emails),
      phoneNumbers: this.validateStringArray(rawData.phoneNumbers),
      product: this.validateString(rawData.product),
      image: this.validateString(rawData.image),
      images: this.validateStringArray(rawData.images),
      facebook: this.validateString(rawData.facebook),
      webpage: this.validateString(rawData.webpage),
      icon: this.validateString(rawData.icon),
      description: this.validateString(rawData.description),
      color: this.validateString(rawData.color, this.DEFAULT_COLOR)
    };
  }

  private static validateNumber(value: unknown, defaultValue: number): number {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    return defaultValue;
  }

  private static validateString(value: unknown, defaultValue: string = this.DEFAULT_EMPTY_STRING): string {
    if (typeof value === 'string') {
      return value.trim();
    }
    return defaultValue;
  }

  private static validateStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value
        .filter(item => typeof item === 'string')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    return [];
  }

  static validateLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
  }

  static validateLongitude(lng: number): boolean {
    return lng >= -180 && lng <= 180;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
