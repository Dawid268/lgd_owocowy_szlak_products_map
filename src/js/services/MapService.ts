import * as Leaflet from 'leaflet';
import { Point } from '../types/Point';

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
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  public addMarker(point: Point): Leaflet.Marker {
    const marker = Leaflet.marker([point.latitude, point.longitude], {
      icon: Leaflet.icon({
        iconUrl: point.icon,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      }),
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

  public fitToAllPoints(): void {
    if (this.markers.length === 0) return;

    const bounds = Leaflet.latLngBounds([]);
    this.markers.forEach(marker => {
      bounds.extend(marker.getLatLng());
    });

    this.map.fitBounds(bounds, {
      padding: [10, 10],
      maxZoom: 14,
    });
  }

  public clearMarkers(): void {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  public createLegend(points: Point[]): void {
    const groupedPoints = points.reduce(
      (acc, point) => {
        if (!acc[point.legendName]) {
          acc[point.legendName] = [];
        }
        acc[point.legendName].push(point);
        return acc;
      },
      {} as Record<string, Point[]>
    );

    const legendHTML = Object.entries(groupedPoints)
      .map(([category, categoryPoints]) => {
        const categoryHTML = categoryPoints
          .map(point => {
            return `
          <div class="legend-item" data-lat="${point.latitude}" data-lng="${point.longitude}">
            <img class="legend-item--icon" src="${point.icon}" alt="${point.legendName}">
            <div class="legend-item__info">
              <div class="legend-item__info--subname">${point.legendSubName}</div>
            </div>
          </div>
        `;
          })
          .join('');

        return `
        <div class="legend-category">
          <div class="legend-category--name">${category}</div>
          ${categoryHTML}
        </div>
      `;
      })
      .join('');

    const legendControl = new Leaflet.Control({ position: 'bottomleft' });

    legendControl.onAdd = () => {
      const div = Leaflet.DomUtil.create('div', 'legend');

      const parser = new DOMParser();
      const doc = parser.parseFromString(legendHTML, 'text/html');
      const fragment = document.createDocumentFragment();

      Array.from(doc.body.children).forEach(child => {
        fragment.appendChild(child);
      });

      div.appendChild(fragment);

      div.addEventListener('click', e => {
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

    // Add mobile toggle button
    this.createMobileToggle();

    // Prevent map scroll when hovering over legend
    this.preventMapScrollOnLegendHover();

    // Set map bounds to focus on all points
    this.setMapBounds(points);

    // Add reset view button
    this.addResetViewButton();
  }

  private createMobileToggle(): void {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'legend-toggle';
    toggleButton.innerHTML = '📋';
    toggleButton.setAttribute('aria-label', 'Toggle legend');

    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
      const legend = document.querySelector('.legend');
      if (legend) {
        legend.classList.toggle('legend--open');
        toggleButton.classList.toggle('legend-toggle--open');

        // Change icon with better emojis
        if (legend.classList.contains('legend--open')) {
          toggleButton.innerHTML = '✕';
        } else {
          toggleButton.innerHTML = '📋';
        }
      }
    });

    // Add swipe down gesture to close legend
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const legend = document.querySelector('.legend');
    if (legend) {
      legend.addEventListener('touchstart', (e: Event) => {
        const touchEvent = e as TouchEvent;
        startY = touchEvent.touches[0].clientY;
        isDragging = true;
      });

      legend.addEventListener('touchmove', (e: Event) => {
        if (!isDragging) return;
        const touchEvent = e as TouchEvent;
        currentY = touchEvent.touches[0].clientY;
        const diffY = currentY - startY;

        if (diffY > 50) {
          // Swipe down threshold
          legend.classList.remove('legend--open');
          toggleButton.classList.remove('legend-toggle--open');
          toggleButton.innerHTML = '📋';
          isDragging = false;
        }
      });

      legend.addEventListener('touchend', () => {
        isDragging = false;
      });
    }
  }

  private preventMapScrollOnLegendHover(): void {
    const legend = document.querySelector('.legend');
    if (!legend) return;

    // Disable map scroll when mouse enters legend
    legend.addEventListener('mouseenter', () => {
      this.map.scrollWheelZoom.disable();
      this.map.dragging.disable();
      this.map.doubleClickZoom.disable();
      this.map.touchZoom.disable();
    });

    // Re-enable map scroll when mouse leaves legend
    legend.addEventListener('mouseleave', () => {
      this.map.scrollWheelZoom.enable();
      this.map.dragging.enable();
      this.map.doubleClickZoom.enable();
      this.map.touchZoom.enable();
    });

    // Also handle mobile touch events
    legend.addEventListener('touchstart', () => {
      this.map.scrollWheelZoom.disable();
      this.map.dragging.disable();
      this.map.doubleClickZoom.disable();
      this.map.touchZoom.disable();
    });

    legend.addEventListener('touchend', () => {
      // Small delay to prevent immediate re-enabling
      setTimeout(() => {
        this.map.scrollWheelZoom.enable();
        this.map.dragging.enable();
        this.map.doubleClickZoom.enable();
        this.map.touchZoom.enable();
      }, 100);
    });
  }

  private setMapBounds(points: Point[]): void {
    if (points.length === 0) return;

    // Create bounds from all points
    const bounds = Leaflet.latLngBounds([]);
    points.forEach(point => {
      bounds.extend([point.latitude, point.longitude]);
    });

    // Add minimal padding around the bounds
    const padding = 0.05; // 5% padding (zmniejszone z 10%)
    const boundsWithPadding = bounds.pad(padding);

    // Set map bounds
    this.map.setMaxBounds(boundsWithPadding);

    // Fit map to show all points
    this.map.fitBounds(bounds, {
      padding: [10, 10], // 10px padding on all sides (zmniejszone z 20px)
      maxZoom: 14, // Maximum zoom level reduced from 15
    });

    // Set minimum zoom to prevent too far zoom (zwiększone z 8)
    this.map.setMinZoom(9);

    // Add event listener to prevent panning outside bounds
    this.map.on('drag', () => {
      const currentBounds = this.map.getBounds();
      const maxBounds = (
        this.map as Leaflet.Map & { getMaxBounds: () => Leaflet.LatLngBounds }
      ).getMaxBounds();

      if (!maxBounds.contains(currentBounds)) {
        // If trying to pan outside bounds, reset to valid position
        this.map.setView(this.map.getCenter(), this.map.getZoom(), {
          animate: false,
        });
      }
    });

    // Prevent zoom beyond reasonable limits
    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      const minZoom = 9; // Zwiększone z 8
      const maxZoom = 14; // Zmniejszone z 15

      if (zoom < minZoom) {
        this.map.setZoom(minZoom);
      } else if (zoom > maxZoom) {
        this.map.setZoom(maxZoom);
      }
    });
  }

  private addResetViewButton(): void {
    // Create custom control for reset view
    const ResetViewControl = Leaflet.Control.extend({
      onAdd: () => {
        const button = document.createElement('button');
        button.innerHTML = '🏠';
        button.title = 'Pokaż wszystkie punkty';
        button.className = 'leaflet-bar leaflet-control leaflet-control-custom reset-view-button';
        button.style.cssText = `
          background: white;
          border: 2px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          height: 30px;
          width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 5px rgba(0,0,0,0.4);
          transition: all 0.2s ease;
        `;

        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = '#f4f4f4';
          button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = 'white';
          button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', () => {
          this.fitToAllPoints();
        });

        return button;
      },
    });

    // Add control to map
    this.map.addControl(new ResetViewControl({ position: 'topright' }));
  }
}
