import * as Leaflet from "leaflet";
import { IPoint, Point, PointPosition } from '../types/Point';

export class MapService {
  private map: Leaflet.Map;
  private markers: Leaflet.Marker[] = [];

  constructor(containerId: string) {
    const container = document.querySelector(containerId);
    if (!container) {
      throw new Error(`Map container ${containerId} not found`);
    }
    
    const computedStyle = getComputedStyle(container);
    if (computedStyle.height === '0px' || computedStyle.height === 'auto') {
      (container as HTMLElement).style.height = '500px';
    }
    
    const leafletId = containerId.replace('#', '');
    this.map = Leaflet.map(leafletId).setView([51.24210937175719, 21.825316526477195], 10);
    
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  public addMarker(point: Point): Leaflet.Marker {
    const marker = Leaflet.marker([point.latitude, point.longitude], {
      icon: Leaflet.icon({
        iconUrl: point.icon,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      })
    });

    marker.bindPopup(point.generatePopup());
    marker.addTo(this.map);
    
    this.markers.push(marker);
    return marker;
  }

  public addMarkers(points: Point[]): void {
    points.forEach(point => {
      this.addMarker(point);
    });
  }

  public getMap(): Leaflet.Map {
    return this.map;
  }

  public getMarkers(): Leaflet.Marker[] {
    return this.markers;
  }

  public clearMarkers(): void {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  public createLegend(points: Point[]): void {
    const groupedPoints = points.reduce((acc, point) => {
      if (!acc[point.legendName]) {
        acc[point.legendName] = [];
      }
      acc[point.legendName].push(point);
      return acc;
    }, {} as Record<string, Point[]>);

    const legendHTML = Object.entries(groupedPoints).map(([category, categoryPoints]) => {
      const categoryHTML = categoryPoints.map(point => {
        return `
          <div class="legend-item" data-lat="${point.latitude}" data-lng="${point.longitude}">
            <img class="legend-item--icon" src="${point.icon}" alt="${point.legendName}">
            <div class="legend-item__info">
              <div class="legend-item__info--name" style="color: ${point.color}">${point.legendName}</div>
              <div class="legend-item__info--subname">${point.legendSubName}</div>
            </div>
          </div>
        `;
      }).join('');
      
      return `
        <div class="legend-category">
          <div class="legend-category--name">${category}</div>
          ${categoryHTML}
        </div>
      `;
    }).join('');

    const legendControl = new Leaflet.Control({ position: 'bottomright' });
    
    legendControl.onAdd = () => {
      const div = Leaflet.DomUtil.create('div', 'legend');
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(legendHTML, 'text/html');
      const fragment = document.createDocumentFragment();
      
      Array.from(doc.body.children).forEach(child => {
        fragment.appendChild(child);
      });
      
      div.appendChild(fragment);
      
      div.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const legendItem = target.closest('.legend-item');
        if (legendItem) {
          const lat = parseFloat(legendItem.getAttribute('data-lat') || '0');
          const lng = parseFloat(legendItem.getAttribute('data-lng') || '0');
          this.map.setView([lat, lng], 13);
        }
      });
      
      return div;
    };
    
    legendControl.addTo(this.map);
  }
}
