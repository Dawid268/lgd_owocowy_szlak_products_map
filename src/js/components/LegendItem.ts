import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export interface LegendItemData {
  latitude: number;
  longitude: number;
  icon: string;
  legendName: string;
  legendSubName: string;
  color: string;
}

export class LegendItem {
  private data: LegendItemData;
  private element: HTMLElement;
  private onClickCallback?: (lat: number, lng: number) => void;
  private tooltipInstance: Instance | null = null;

  constructor(data: LegendItemData) {
    this.data = data;
    this.element = this.render();
    this.attachEventListeners();
    this.initializeTooltip();
  }

  private render(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'legend-item';
    div.setAttribute('data-lat', this.data.latitude.toString());
    div.setAttribute('data-lng', this.data.longitude.toString());

    const img = document.createElement('img');
    img.className = 'legend-item--icon';
    img.src = this.data.icon;
    img.alt = this.data.legendName;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'legend-item__info';

    const subnameDiv = document.createElement('div');
    subnameDiv.className = 'legend-item__info--subname';
    subnameDiv.textContent = this.data.legendSubName;

    infoDiv.appendChild(subnameDiv);

    div.appendChild(img);
    div.appendChild(infoDiv);

    return div;
  }

  private initializeTooltip(): void {
    const subnameElement = this.element.querySelector('.legend-item__info--subname') as HTMLElement;

    if (!subnameElement || !this.data.legendSubName) {
      return;
    }

    const isTruncated = subnameElement.scrollWidth > subnameElement.clientWidth;

    if (isTruncated) {
      this.tooltipInstance = tippy(subnameElement, {
        content: this.data.legendSubName,
        placement: 'top',
        theme: 'light',
        arrow: true,
        delay: [200, 0],
        duration: [200, 150],
      });
    }
  }

  private attachEventListeners(): void {
    this.element.addEventListener('click', () => {
      if (this.onClickCallback) {
        this.onClickCallback(this.data.latitude, this.data.longitude);
      }
    });
  }

  public onClick(callback: (lat: number, lng: number) => void): void {
    this.onClickCallback = callback;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getData(): LegendItemData {
    return this.data;
  }

  public destroy(): void {
    if (this.tooltipInstance) {
      this.tooltipInstance.destroy();
      this.tooltipInstance = null;
    }
  }
}
