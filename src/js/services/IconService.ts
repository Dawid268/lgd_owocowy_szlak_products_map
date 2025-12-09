import { ErrorHandler } from '../utils/ErrorHandler';

export class IconService {
  private static icons: Map<string, string> = new Map();
  private static isLoaded: boolean = false;

  static async loadIcons(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const iconPromises: Promise<void>[] = [];

      for (let i = 1; i <= 8; i++) {
        const iconPath = `./img/1/${i}.svg`;

        iconPromises.push(
          fetch(iconPath)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to load icon: ${iconPath}`);
              }
              return response.text();
            })
            .then(svgContent => {
              this.icons.set(iconPath, svgContent);
            })
            .catch(() => {
              ErrorHandler.handleImageError(iconPath);
              this.icons.set(iconPath, '');
            })
        );
      }

      await Promise.all(iconPromises);
      this.isLoaded = true;
    } catch (error) {
      ErrorHandler.handleDataError(error as Error, 'IconService.loadIcons');
    }
  }

  static getIcon(iconPath: string): string {
    return this.icons.get(iconPath) || '';
  }

  static getColoredIcon(iconPath: string, color: string): string {
    const svgContent = this.getIcon(iconPath);
    if (!svgContent) {
      return '';
    }

    let coloredSvg = svgContent;
    coloredSvg = coloredSvg.replace(/fill:#[0-9A-Fa-f]{6}/g, `fill:${color}`);
    coloredSvg = coloredSvg.replace(/fill:#[0-9A-Fa-f]{6};/g, `fill:${color};`);

    return coloredSvg;
  }
}
