interface AdminValidation {
  required: string;
  invalidEmail: string;
  invalidUrl: string;
  invalidPhone: string;
  invalidCoordinates: string;
  latitudeRange: string;
  longitudeRange: string;
  nameMinLength: string;
  nameMaxLength: string;
  descriptionMaxLength: string;
}

interface AdminMessages {
  saving: string;
  saved: string;
  deleted: string;
  error: string;
  confirmDelete: string;
}

interface AdminData {
  ajaxUrl: string;
  nonce: string;
  validation: AdminValidation;
  messages: AdminMessages;
}

interface ThemeData {
  name: string;
  version: string;
  author: string;
  colors: Record<string, string>;
  typography: Record<string, string>;
}

interface FrontendData {
  apiUrl: string;
  nonce: string;
  ajaxUrl: string;
  pluginUrl: string;
  theme: ThemeData;
  strings: {
    loading: string;
    error: string;
    noPoints: string;
    close: string;
    next: string;
    prev: string;
  };
}

declare global {
  interface Window {
    lgdMapAdmin: AdminData;
    lgdMapData: FrontendData;
    L: typeof import('leaflet');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jQuery: any;
  }
}

export {};
