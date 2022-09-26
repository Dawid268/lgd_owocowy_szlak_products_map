import "../img/1/map-style.scss";
import points from "../img/1/data.json";
import Leaflet, { LeafletEvent } from "leaflet";
import { IPoint, Point, PointPosition } from "./point";
import {
  generateAddressesHTML,
  generateEmailsHTML,
  generateFacebookHTML,
  generatePhoneNumbersHTML,
  generateWebPageHTML,
} from "./utils";

const legendElements: string[] = [];
const markers: Leaflet.Marker[] = [];
const zoomToPointValue = 13;

const config: Leaflet.MapOptions = {
  minZoom: 10,
  maxZoom: 18,
  zoomControl: false,
};

const configBoundsOptions: Leaflet.FitBoundsOptions = {
  padding: [30, 30],
};

const popupConfig: Leaflet.PopupOptions = {
  className: "popup-main-container",
  autoPanPaddingTopLeft: Leaflet.point(100, 1000),
};

const legend: Leaflet.Control = new Leaflet.Control({
  position: "bottomleft",
});
const div = Leaflet.DomUtil.create("div", "legend");
let map: Leaflet.Map;

const legendItems: {
  icon: IPoint["icon"];
  legendName: IPoint["legendName"];
  legendSubName: IPoint["legendSubName"];
  color: IPoint["color"];
}[] = [];

const pointsArray: Point[] = (points as unknown as Point[]).map(
  ({
    latitude,
    longitude,
    addresses,
    emails,
    facebook,
    icon,
    image,
    name,
    phoneNumbers,
    product,
    webpage,
    legendName,
    legendSubName,
    description,
    color,
  }) =>
    new Point(
      latitude,
      longitude,
      name,
      addresses,
      emails,
      phoneNumbers,
      product,
      image,
      facebook,
      webpage,
      icon,
      legendName,
      legendSubName,
      description,
      color
    )
);

function initializeMap(): void {
  const mapContainer = window.document.getElementById("leaflet-map");

  if (!mapContainer) {
    return;
  }

  map = Leaflet.map("leaflet-map", config);
  Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  generateMapMarkers();
  generateMapLegend();
  configureFeatureGroups();
  toggleLegend();
}

function generateIcon(icon: string) {
  return Leaflet.divIcon({
    className: "marker",
    html: `<img src="${icon}" class="map-icon" alt="svg">`,
    iconSize: [5, 5],
    iconAnchor: [2, 2],
    popupAnchor: [12, -5],
  });
}

function generateMapMarkers(): void {
  pointsArray.forEach((point) => {
    const { latitude, longitude, icon, legendName, legendSubName, color } =
      point;
    const marker: Leaflet.Marker = Leaflet.marker([latitude, longitude], {
      icon: generateIcon(icon),
    })
      .bindPopup(point.generatePopup(), { ...popupConfig })
      .on("click", zoomToPoint);
    markers.push(marker);
    legendItems.push({ icon, legendName, legendSubName, color });
  });
}

function generateMapLegend(): void {
  legend.onAdd = function () {
    return generateLegendHTMLElement();
  };
  legend.addTo(map);
}

function generateLegendHTMLElement(): HTMLDivElement {
  legendItems.map(({ icon, legendName, legendSubName, color }) => {
    legendElements.push(
      generateLegendItem(icon, legendName, legendSubName, color)
    );
  });
  div.innerHTML = legendElements.join("");
  return div;
}

function generateLegendItem(
  icon: IPoint["icon"],
  legendName: IPoint["legendName"],
  legendSubName: IPoint["legendSubName"],
  color: IPoint["color"]
): string {
  const subname = !!legendSubName
    ? `<span class="legend-item__info--subname">${legendSubName}</span>`
    : "";
  return ` <div class="legend-item">
    <img src="${icon}" alt="svg" class="legend-item--icon">
    <div class="legend-item__info">
    <span class="legend-item__info--name" style="color: ${color}">${legendName}</span>
    <span class="legend-item__info--subname">${subname}</span>
    </div>
    </div>  
`;
}

function configureFeatureGroups(): void {
  const featureGroup = Leaflet.featureGroup(markers);
  featureGroup.addTo(map);
  map.fitBounds(featureGroup.getBounds(), { ...configBoundsOptions });
}

function zoomToPoint(event: LeafletEvent): void {
  const eventLocation: PointPosition = event.target.getLatLng();
  const modifiedValue: PointPosition = {
    lat: eventLocation.lat,
    lng: eventLocation.lng - 0.015,
  };

  map.setView(modifiedValue, zoomToPointValue);
  const closeButton = document.getElementsByClassName(
    "leaflet-popup-close-button"
  )?.[0];

  if (!closeButton) {
    return;
  }
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
  });
}

function toggleLegend(): void {
  document.addEventListener("DOMContentLoaded", () => {
    const markersDiv = document.querySelectorAll(".legend-item");

    markersDiv.forEach((marker, index) => {
      marker.addEventListener("click", (event) => {
        map.setView(
          { lat: points[index].latitude, lng: points[index].longitude },
          zoomToPointValue
        );
        event.stopPropagation();
      });
      marker.addEventListener("dblclick", (event) => {
        event.stopPropagation();
      });
    });
  });
}

initializeMap();

function generateFooter(): void {
  const message = `„Europejski Fundusz Rolny na rzecz Rozwoju Obszarów Wiejskich: Europa inwestująca w obszary wiejskie”.
  Publikacja współfinansowana ze środków Unii Europejskiej w ramach Schematu II Pomocy Technicznej
  „Krajowa Sieć Obszarów Wiejskich” Programu Rozwoju Obszarów Wiejskich na lata 2014-2020.
  Instytucja Zarządzająca Programem Rozwoju Obszarów Wiejskich na lata 2014-2020 – Minister Rolnictwa i
  Rozwoju Wsi.<br/>Materiał opracowany przy współpracy JR KSOW Województwa Lubelskiego.`;

  const footer = document.querySelector(".map-footer") as Element;

  if (!footer) {
    return;
  }

  footer.innerHTML = `<div class="map-footer-container">
    <div class="map-footer-container__logo">
      <img class="map-footer-container__logo--item" src=./img/1/ue.png>
      <img class="map-footer-container__logo--item map-footer-container__logo--item--ksow" src=./img/1/ksow.png>
      <img class="map-footer-container__logo--item" src=./img/1/prow.png>
    </div>
    <span class="map-footer-container__message">
      ${message}
    </span>
  </div>`;
}

function generateCard(): void {
  const cardsContainer = document.querySelector(".cards-container");

  pointsArray.forEach(
    ({
      description,
      image,
      icon,
      legendName,
      legendSubName,
      addresses,
      phoneNumbers,
      emails,
      webpage,
      facebook,
      color,
    }) => {
      const htmlImage = !!image
        ? `<img class="cards-container__item__header--image" src=${image}>`
        : "";
      const subName = !!legendSubName
        ? `<span class="data__title__container--subname"> ${legendSubName} </span>`
        : "";

      let cardContainer = document.createElement("div");
      cardContainer.innerHTML = `
      <div class="cards-container__item">
        <div class="cards-container__item__header">
          <div class="cards-container__item__header__container">
            <div class="cards-container__item__header__container__data">
              <div class="data__title" style="border-bottom: 1px solid ${color} !important;">
                <img src="${icon}" alt="svg" class="data__title--icon">
                <div class="data__title__container">
                  <span class="data__title__container--name" style="color:${color}"> ${legendName} </span>
                  ${subName}
                </div>
              </div>
              <div class="cards-container__item__header__container__data__information">
                <div class="information__basic">
                  ${generateAddressesHTML(addresses)}
                  ${generatePhoneNumbersHTML(phoneNumbers)}
                </div>
                <div class="information__basic">
                ${generateEmailsHTML(emails)}
                ${generateWebPageHTML(webpage)}
                ${generateFacebookHTML(facebook, "Facebook")}
                </div>
              </div>
            </div>
            <div>
            </div>
          </div>
            ${htmlImage}
        </div>
        <span class="cards-container__item--description" style="border-top: 1px solid ${color} !important">${description}</span>
      </div
    `;

      if (!!cardsContainer) {
        cardsContainer.appendChild(cardContainer);
      }
    }
  );
}

generateCard();
generateFooter();
