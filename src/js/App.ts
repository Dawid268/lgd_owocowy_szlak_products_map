import '../scss/main.scss';
import points from '../img/1/data.json';
import { Point } from './types/Point';
import { MapService } from './services/MapService';
import { CardService } from './services/CardService';
import { IconService } from './services/IconService';
import { DataValidator, RawPointData } from './utils/DataValidator';
import { ErrorHandler } from './utils/ErrorHandler';
import { LazyLoader } from './utils/LazyLoader';
import { ImageLoader } from './utils/ImageLoader';

export class App {
  private mapService!: MapService;
  private cardService!: CardService;
  private points: Point[] = [];

  constructor() {
    const initApp = async () => {
      const mapElement = document.querySelector('#leaflet-map');
      const cardsContainer = document.querySelector('.map-cards-container');

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
        this.cardService = new CardService('.map-cards-container');
        await this.initializeData();
        this.initializeApp();
        LazyLoader.initialize();
      } catch (error) {
        ErrorHandler.handleMapError(error as Error);
      }
    };

    setTimeout(initApp, 100);
  }

  private async initializeData(): Promise<void> {
    try {
      const processedPoints = await Promise.all(
        points.map(async (rawPoint: RawPointData) => {
          const validatedData = DataValidator.validatePointData(rawPoint);

          const folderName =
            ImageLoader.extractFolderName(validatedData.image) ||
            ImageLoader.extractFolderName(validatedData.images[0] || '') ||
            null;

          let resolvedImage = validatedData.image;
          let resolvedImages = validatedData.images;

          if (folderName) {
            const processed = await ImageLoader.processImages(
              folderName,
              validatedData.image || null,
              validatedData.images
            );

            resolvedImage = processed.image || validatedData.image || '';
            resolvedImages = processed.images.length > 0 ? processed.images : validatedData.images;
          }

          return new Point(
            validatedData.latitude,
            validatedData.longitude,
            validatedData.name,
            validatedData.addresses,
            validatedData.emails,
            validatedData.phoneNumbers,
            validatedData.product,
            resolvedImage,
            resolvedImages,
            validatedData.facebook,
            validatedData.webpage,
            validatedData.booking,
            validatedData.icon,
            validatedData.legendName,
            validatedData.legendSubName,
            validatedData.description,
            validatedData.color
          );
        })
      );

      this.points = processedPoints;
    } catch (error) {
      ErrorHandler.handleDataError(error as Error, 'App.initializeData');
    }
  }

  private async initializeApp(): Promise<void> {
    await this.mapService.addMarkers(this.points);
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
