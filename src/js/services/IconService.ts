export class IconService {
  private static icons: Map<string, string> = new Map();
  private static isLoaded: boolean = false;

  static async loadIcons(): Promise<void> {
    if (this.isLoaded) return;

    const iconPromises: Promise<void>[] = [];

    for (let i = 1; i <= 8; i++) {
      const iconPath = `./img/1/${i}.svg`;
      
      iconPromises.push(
        fetch(iconPath)
          .then(response => response.text())
          .then(svgContent => {
            this.icons.set(iconPath, svgContent);
          })
          .catch(error => {
            this.icons.set(iconPath, '');
          })
      );
    }

    await Promise.all(iconPromises);
    this.isLoaded = true;
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
