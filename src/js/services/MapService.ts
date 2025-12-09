import * as Leaflet from 'leaflet';
import { Point } from '../types/Point';
import tippy from 'tippy.js';

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
    const config: Leaflet.MapOptions = {
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
    };

    this.map = Leaflet.map(leafletId, config).setView([51.24210937175719, 21.825316526477195], 10);

    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

      updateWhenZooming: true,
      updateWhenIdle: true,
      keepBuffer: 2,
    }).addTo(this.map);
  }

  public addMarker(point: Point): Leaflet.Marker {
    const marker = Leaflet.marker([point.latitude, point.longitude], {
      icon: this.generateIcon(point.icon),
    });

    marker.bindPopup(point.generatePopup(), {
      className: 'popup-main-container',
      autoPanPaddingTopLeft: Leaflet.point(100, 1000),
    });

    marker.on('click', () => {
      this.zoomToPoint(point.latitude, point.longitude);
    });

    marker.addTo(this.map);

    this.markers.push(marker);
    return marker;
  }

  private generateIcon(iconPath: string): Leaflet.DivIcon {
    return Leaflet.divIcon({
      className: 'marker',
      html: `<img src="${iconPath}" class="map-icon" alt="svg">`,
      iconSize: [5, 5],
      iconAnchor: [2, 2],
      popupAnchor: [12, -5],
    });
  }

  public async addMarkers(points: Point[]): Promise<void> {
    await this.preloadIcons(points);

    await this.addMarkersInBatches(points, 10);
  }

  private async addMarkersInBatches(points: Point[], batchSize: number): Promise<void> {
    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);

      batch.forEach(point => {
        this.addMarker(point);
      });

      await new Promise(resolve => requestAnimationFrame(resolve));
    }
  }

  private async preloadIcons(points: Point[]): Promise<void> {
    const iconPromises = points.map(point => {
      return new Promise<void>(resolve => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue even if icon fails to load
        img.src = point.icon;
      });
    });

    await Promise.all(iconPromises);
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

    const configBoundsOptions: Leaflet.FitBoundsOptions = {
      padding: [30, 30],
    };

    this.map.fitBounds(bounds, configBoundsOptions);
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
            const subname = point.legendSubName
              ? `<span class="map-legend-item__info--subname">${point.legendSubName}</span>`
              : '';
            return `
          <div class="map-legend-item" data-index="${points.indexOf(point)}" style="margin-bottom: 10px;">
            <img src="${point.icon}" alt="svg" class="map-legend-item--icon">
            <div class="map-legend-item__info">
              ${subname}
            </div>
          </div>
        `;
          })
          .join('');

        const firstPointColor = categoryPoints[0]?.color || '#000000';

        return `
        <div class="map-legend-category">
          <div class="map-legend-category--name" style="color: ${firstPointColor}">${category}</div>
          ${categoryHTML}
        </div>
      `;
      })
      .join('');

    const legendControl = new Leaflet.Control({ position: 'bottomleft' });

    legendControl.onAdd = () => {
      const div = Leaflet.DomUtil.create('div', 'map-legend');

      const parser = new DOMParser();
      const doc = parser.parseFromString(legendHTML, 'text/html');
      const fragment = document.createDocumentFragment();

      Array.from(doc.body.children).forEach(child => {
        fragment.appendChild(child);
      });

      div.appendChild(fragment);

      Leaflet.DomEvent.disableScrollPropagation(div);
      Leaflet.DomEvent.on(div, 'wheel', Leaflet.DomEvent.stopPropagation);

      setTimeout(() => {
        const subnameElements = Array.from(
          div.querySelectorAll('.map-legend-item__info--subname')
        ) as HTMLElement[];

        subnameElements.forEach(element => {
          const isTruncated = element.scrollWidth > element.clientWidth;

          if (isTruncated && element.textContent) {
            tippy(element, {
              content: element.textContent,
              placement: 'top',
              theme: 'light',
              arrow: true,
              delay: [200, 0],
              duration: [200, 150],
            });
          }
        });
      }, 0);

      div.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const legendItem = target.closest('.map-legend-item');
        if (legendItem) {
          const index = parseInt(legendItem.getAttribute('data-index') || '0', 10);
          const point = points[index];

          if (point) {
            const marker = this.markers[index];

            this.map.closePopup();

            setTimeout(() => {
              const onMoveEnd = () => {
                if (marker) {
                  const popup = marker.getPopup();
                  if (popup) {
                    const options = popup.options;
                    const originalAutoPan = options.autoPan;
                    options.autoPan = false;

                    marker.openPopup();

                    setTimeout(() => {
                      options.autoPan = originalAutoPan;
                    }, 100);
                  } else {
                    marker.openPopup();
                  }
                }
                this.map.off('moveend', onMoveEnd);
              };

              this.map.on('moveend', onMoveEnd);
              this.zoomToPoint(point.latitude, point.longitude);
            }, 100);
          }
        }
      });

      div.addEventListener('dblclick', e => {
        e.stopPropagation();
      });

      return div;
    };

    legendControl.addTo(this.map);

    this.createMobileToggle();

    this.preventMapScrollOnLegendHover();

    this.setMapBounds(points);

    this.addResetViewButton();
  }

  private createMobileToggle(): void {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'map-legend-toggle';
    toggleButton.innerHTML = '📋';
    toggleButton.setAttribute('aria-label', 'Toggle legend');

    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
      const legend = document.querySelector('.map-legend');
      if (legend) {
        legend.classList.toggle('map-legend--open');
        toggleButton.classList.toggle('map-legend-toggle--open');

        if (legend.classList.contains('map-legend--open')) {
          toggleButton.innerHTML = '✕';
        } else {
          toggleButton.innerHTML = '📋';
        }
      }
    });

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
          legend.classList.remove('map-legend--open');
          toggleButton.classList.remove('map-legend-toggle--open');
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

    legend.addEventListener('mouseenter', () => {
      this.map.scrollWheelZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.touchZoom.disable();
    });

    legend.addEventListener('mouseleave', () => {
      this.map.scrollWheelZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.touchZoom.enable();
    });

    legend.addEventListener('touchstart', () => {
      this.map.scrollWheelZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.touchZoom.disable();
    });

    legend.addEventListener('touchend', () => {
      setTimeout(() => {
        this.map.scrollWheelZoom.enable();
        this.map.doubleClickZoom.enable();
        this.map.touchZoom.enable();
      }, 100);
    });
  }

  private setMapBounds(points: Point[]): void {
    if (points.length === 0) return;

    const bounds = Leaflet.latLngBounds([]);
    points.forEach(point => {
      bounds.extend([point.latitude, point.longitude]);
    });

    const configBoundsOptions: Leaflet.FitBoundsOptions = {
      padding: [30, 30],
    };

    this.map.fitBounds(bounds, configBoundsOptions);
  }

  private addResetViewButton(): void {
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

    this.map.addControl(new ResetViewControl({ position: 'topright' }));
  }

  private zoomToPoint(lat: number, lng: number): void {
    const modifiedValue = {
      lat: lat,
      lng: lng - 0.015,
    };

    this.map.setView(modifiedValue, 13);
  }
}
