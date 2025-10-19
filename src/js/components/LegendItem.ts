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

  constructor(data: LegendItemData) {
    this.data = data;
    this.element = this.render();
    this.attachEventListeners();
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
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'legend-item__info--name';
    nameDiv.style.color = this.data.color;
    nameDiv.textContent = this.data.legendName;
    
    const subnameDiv = document.createElement('div');
    subnameDiv.className = 'legend-item__info--subname';
    subnameDiv.textContent = this.data.legendSubName;
    
    infoDiv.appendChild(nameDiv);
    infoDiv.appendChild(subnameDiv);
    
    div.appendChild(img);
    div.appendChild(infoDiv);
    
    return div;
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
}
