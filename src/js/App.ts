import '../scss/main.scss';
import points from '../img/1/data.json';
import { Point } from './types/Point';
import { MapService } from './services/MapService';
import { CardService } from './services/CardService';
import { IconService } from './services/IconService';
import { DataValidator, RawPointData } from './utils/DataValidator';

export class App {
  private mapService!: MapService;
  private cardService!: CardService;
  private points: Point[] = [];

  constructor() {
    const initApp = async () => {
      const mapElement = document.querySelector('#leaflet-map');
      const cardsContainer = document.querySelector('.cards-container');

      if (!mapElement || !cardsContainer) {
        setTimeout(initApp, 100);
        return;
      }

      const rect = mapElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(initApp, 100);
        return;
      }

      try {
        await IconService.loadIcons();
        this.mapService = new MapService('#leaflet-map');
        this.cardService = new CardService('.cards-container');
        this.initializeData();
        this.initializeApp();
      } catch (error) {
      }
    };

    setTimeout(initApp, 100);
  }

  private initializeData(): void {
    this.points = points.map((rawPoint: RawPointData) => {
      const validatedData = DataValidator.validatePointData(rawPoint);
      
      return new Point(
        validatedData.latitude,
        validatedData.longitude,
        validatedData.name,
        validatedData.addresses,
        validatedData.emails,
        validatedData.phoneNumbers,
        validatedData.product,
        validatedData.image,
        validatedData.images,
        validatedData.facebook,
        validatedData.webpage,
        validatedData.icon,
        validatedData.legendName,
        validatedData.legendSubName,
        validatedData.description,
        validatedData.color
      );
    });
  }

  private initializeApp(): void {
    this.mapService.addMarkers(this.points);
    this.mapService.createLegend(this.points);
    this.cardService.addCards(this.points);
    this.generateFooter();
  }

  private generateFooter(): void {
    const footer = document.querySelector('.footer');
    if (footer) {
      const footerContent = document.createElement('div');
      footerContent.className = 'footer__content';
      
      const paragraph = document.createElement('p');
      paragraph.textContent = '© 2024 LGD Owocowy Szlak. Wszystkie prawa zastrzeżone.';
      
      footerContent.appendChild(paragraph);
      footer.appendChild(footerContent);
    }
  }

  public getMapService(): MapService {
    return this.mapService;
  }

  public getCardService(): CardService {
    return this.cardService;
  }

  public getPoints(): Point[] {
    return this.points;
  }
}
