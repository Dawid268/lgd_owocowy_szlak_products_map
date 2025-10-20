declare global {
  interface Window {
    lgdMapAdmin: {
      ajaxUrl: string;
      nonce: string;
      validation: {
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
      };
      messages: {
        saving: string;
        saved: string;
        deleted: string;
        error: string;
        confirmDelete: string;
      };
    };
    lgdMapData: {
      apiUrl: string;
      nonce: string;
      ajaxUrl: string;
      pluginUrl: string;
      theme: {
        name: string;
        version: string;
        author: string;
        colors: Record<string, string>;
        typography: Record<string, string>;
      };
      strings: {
        loading: string;
        error: string;
        noPoints: string;
        close: string;
        next: string;
        prev: string;
      };
    };
    L: typeof import('leaflet');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jQuery: any;
  }
}

export {};
