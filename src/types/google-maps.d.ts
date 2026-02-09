// TypeScript declarations for Google Maps API
// This file provides type definitions when @types/google.maps is not installed

declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(
          input: HTMLInputElement,
          opts?: {
            componentRestrictions?: { country: string };
            fields?: string[];
            types?: string[];
          }
        );
        addListener(eventName: string, handler: () => void): void;
        getPlace(): {
          formatted_address?: string;
          address_components?: GeocoderAddressComponent[];
          geometry?: {
            location?: {
              lat(): number;
              lng(): number;
            };
          };
          name?: string;
        };
      }
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    namespace event {
      function clearInstanceListeners(instance: any): void;
    }
  }
}

// Extend Window interface for Google Maps config
interface Window {
  GOOGLE_MAPS_CONFIG?: {
    apiKey: string;
    libraries: string[];
    region: string;
    language: string;
  };
  google?: typeof google;
}
