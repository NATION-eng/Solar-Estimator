import { useEffect, useRef, useState } from 'react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (address: string, locationData?: LocationData) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface LocationData {
  address: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export default function LocationAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter your location in Nigeria",
  disabled = false 
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMaps = () => {
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        setIsLoaded(true);
        setError(null);
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setError('Failed to load Google Maps. Using manual entry.');
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    try {
      // Initialize Google Places Autocomplete
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'ng' }, // Restrict to Nigeria
        fields: ['formatted_address', 'address_components', 'geometry', 'name'],
        types: ['geocode'], // Only return geocoding results
      });

      // Listen for place selection
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.formatted_address) {
          setError('Please select a valid location from the suggestions');
          return;
        }

        // Extract location data
        const locationData: LocationData = {
          address: place.formatted_address,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        };

        // Parse address components
        if (place.address_components) {
          place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
            const types = component.types;
            
            if (types.includes('locality')) {
              locationData.city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              locationData.state = component.long_name;
            } else if (types.includes('country')) {
              locationData.country = component.long_name;
            }
          });
        }

        onChange(place.formatted_address, locationData);
      });

      autocompleteRef.current = autocomplete;
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
      setError('Autocomplete unavailable. You can still enter your address manually.');
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            paddingLeft: '40px', // Space for icon
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
        />
        
        {/* Location Icon */}
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1.2rem',
          opacity: 0.6,
        }}>
          📍
        </div>

        {/* Loading/Status Indicator */}
        {!isLoaded && !error && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}>
            Loading...
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: '6px',
          fontSize: '0.75rem',
          color: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>ℹ️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {isLoaded && !error && (
        <div style={{
          marginTop: '6px',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>💡</span>
          <span>Start typing your city or address in Nigeria for suggestions</span>
        </div>
      )}
    </div>
  );
}
