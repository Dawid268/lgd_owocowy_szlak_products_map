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
    const config: Leaflet.MapOptions = {
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
    };

    this.map = Leaflet.map(leafletId, config).setView([51.24210937175719, 21.825316526477195], 10);

    Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      // Preload tiles for smoother navigation
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
    // Preload all marker icons first for smoother rendering
    await this.preloadIcons(points);

    // Add markers in batches to avoid blocking UI
    await this.addMarkersInBatches(points, 10);
  }

  private async addMarkersInBatches(points: Point[], batchSize: number): Promise<void> {
    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);

      // Add batch synchronously
      batch.forEach(point => {
        this.addMarker(point);
      });

      // Wait for next frame before adding next batch
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
              ? `<span class="legend-item__info--subname">${point.legendSubName}</span>`
              : '';
            return `
          <div class="legend-item" data-index="${points.indexOf(point)}" style="margin-bottom: 10px;">
            <img src="${point.icon}" alt="svg" class="legend-item--icon">
            <div class="legend-item__info">
              <span class="legend-item__info--name" style="color: ${point.color}">${point.legendName}</span>
              ${subname}
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
          const index = parseInt(legendItem.getAttribute('data-index') || '0', 10);
          const point = points[index];

          if (point) {
            const marker = this.markers[index];

            // Close all open popups first and wait for close animation
            this.map.closePopup();

            // Wait for popup to close before starting zoom
            setTimeout(() => {
              // Add one-time listener for move end (setView triggers moveend)
              const onMoveEnd = () => {
                if (marker) {
                  // Disable autoPan temporarily to prevent map movement
                  const popup = marker.getPopup();
                  if (popup) {
                    const options = popup.options;
                    const originalAutoPan = options.autoPan;
                    options.autoPan = false;

                    marker.openPopup();

                    // Restore autoPan after a short delay
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

      // Prevent dblclick on legend items
      div.addEventListener('dblclick', e => {
        e.stopPropagation();
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

    // Disable only zoom-related features when mouse enters legend, but keep dragging enabled
    legend.addEventListener('mouseenter', () => {
      this.map.scrollWheelZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.touchZoom.disable();
      // Dragging is NOT disabled - panning is allowed
    });

    // Re-enable zoom features when mouse leaves legend
    legend.addEventListener('mouseleave', () => {
      this.map.scrollWheelZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.touchZoom.enable();
    });

    // Also handle mobile touch events - disable zoom only
    legend.addEventListener('touchstart', () => {
      this.map.scrollWheelZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.touchZoom.disable();
      // Dragging is NOT disabled - panning is allowed
    });

    legend.addEventListener('touchend', () => {
      // Small delay to prevent immediate re-enabling
      setTimeout(() => {
        this.map.scrollWheelZoom.enable();
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

    const configBoundsOptions: Leaflet.FitBoundsOptions = {
      padding: [30, 30],
    };

    // Fit map to show all points
    this.map.fitBounds(bounds, configBoundsOptions);
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

  private zoomToPoint(lat: number, lng: number): void {
    // Adjust longitude slightly to offset the popup position
    const modifiedValue = {
      lat: lat,
      lng: lng - 0.015,
    };

    this.map.setView(modifiedValue, 13);
  }
}
