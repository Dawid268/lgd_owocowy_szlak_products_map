import { IPoint } from "./point";

export const generateWebPageHTML = (webpage: IPoint["webpage"]): string => {
  return !!webpage
    ? `<div class="data-container">
    <img class="data-container--icon" src='./img/1/web-svgrepo-com.svg'>
    <a href=${webpage} target="_blank">${webpage}</a>
    </div>`
    : "";
};

export const generateProductHTML = (product: IPoint["product"]): string => {
  return !!product
    ? `<span class="data-container--product">${product}<span>`
    : "";
};

export const generateFacebookHTML = (
  facebook: IPoint["facebook"],
  additionalText = ""
): string => {
  return !!facebook
    ? ` <a  href=${facebook} target="_blank">
    <img class="data-container--facebook" src='./img/1/facebook-svgrepo-com.svg'>
    ${additionalText}
    </a>`
    : "";
};

export const generateImageHTML = (image: IPoint["image"]): string => {
  return !!image ? `<img class="popup-container--image" src=${image}>` : "";
};

export const generateAddressesHTML = (
  addresses: IPoint["addresses"]
): string => {
  if (!addresses && !Array.isArray(addresses)) {
    return "";
  }

  return addresses.reduce((previousAddress, currentAddress) => {
    return `
          ${previousAddress}
          <span>${currentAddress}</span>
        `;
  }, "");
};

export const generateEmailsHTML = (emails: IPoint["emails"]): string => {
  if (!emails && !Array.isArray(emails)) {
    return "";
  }

  return emails?.reduce((previousEmail, currentEmail) => {
    return ` 
        ${previousEmail}
        <div class="data-container">
          <img class="data-container--icon" src='./img/1/email-svgrepo-com.svg'>
          <a href = "mailto: ${currentEmail}" >${currentEmail}</a>
        </div>
        `;
  }, "");
};

export const generatePhoneNumbersHTML = (
  phoneNumbers: IPoint["phoneNumbers"]
): string => {
  if (!phoneNumbers && !Array.isArray(phoneNumbers)) {
    return "";
  }

  return phoneNumbers?.reduce((previousNumber, currentNumber) => {
    return ` 
        ${previousNumber}
        <div class="data-container">
        <img class="data-container--icon" src='./img/1/phone-svgrepo-com.svg'>
        <a href="tel:${currentNumber}" style="">${currentNumber}</a>
        </div>
        `;
  }, "");
};
