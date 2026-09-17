import { useEffect, useRef, useState } from 'react';
import { MapPin, Info, Sparkles } from 'lucide-react';

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
        fields: ['address_components', 'formatted_address', 'geometry'],
        types: ['geocode', 'establishment'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
          // User entered name of a place that was not suggested
          onChange(inputRef.current?.value || '');
          return;
        }

        const address = place.formatted_address || inputRef.current?.value || '';
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Extract city and state
        let city = '';
        let state = '';
        let country = 'Nigeria';

        if (place.address_components) {
          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            }
          }
        }

        onChange(address, {
          address,
          city,
          state,
          country,
          lat,
          lng,
        });
      });

      autocompleteRef.current = autocomplete;
    } catch (err) {
      console.error('Failed to initialize Google Places Autocomplete:', err);
      setError('Autocomplete unavailable. Please type your location manually.');
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange]);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleManualChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-main)',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hairline)';
          }}
        />
        
        {/* Location Icon */}
        <div style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <MapPin size={16} />
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
          gap: '5px',
        }}>
          <Info size={13} />
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
          gap: '5px',
        }}>
          <Sparkles size={12} color="var(--color-primary)" />
          <span>Start typing your city or address in Nigeria for suggestions</span>
        </div>
      )}
    </div>
  );
}
