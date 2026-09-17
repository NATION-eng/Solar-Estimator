import { useEffect, useRef, useState } from 'react';
import { MapPin, Info, Sparkles, Navigation, Loader2 } from 'lucide-react';

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

function matchNigerianCoordinates(lat: number, lng: number) {
  const hubs = [
    { name: "Port Harcourt, Rivers", psh: 4.1, lat: 4.8156, lng: 7.0498, city: "Port Harcourt", state: "Rivers" },
    { name: "Lagos (Ikeja / Lekki)", psh: 4.4, lat: 6.5244, lng: 3.3792, city: "Lagos", state: "Lagos" },
    { name: "Ibadan, Oyo", psh: 4.6, lat: 7.3775, lng: 3.9470, city: "Ibadan", state: "Oyo" },
    { name: "Enugu, Enugu", psh: 4.5, lat: 6.4584, lng: 7.5464, city: "Enugu", state: "Enugu" },
    { name: "Warri, Delta", psh: 4.2, lat: 5.5167, lng: 5.7500, city: "Warri", state: "Delta" },
    { name: "Benin City, Edo", psh: 4.3, lat: 6.3350, lng: 5.6037, city: "Benin City", state: "Edo" },
    { name: "Abuja, FCT", psh: 5.1, lat: 9.0765, lng: 7.3986, city: "Abuja", state: "FCT" },
    { name: "Jos, Plateau", psh: 5.3, lat: 9.8965, lng: 8.8583, city: "Jos", state: "Plateau" },
    { name: "Ilorin, Kwara", psh: 4.9, lat: 8.4799, lng: 4.5418, city: "Ilorin", state: "Kwara" },
    { name: "Kaduna, Kaduna", psh: 5.6, lat: 10.5105, lng: 7.4165, city: "Kaduna", state: "Kaduna" },
    { name: "Kano, Kano", psh: 6.2, lat: 12.0022, lng: 8.5920, city: "Kano", state: "Kano" },
    { name: "Sokoto, Sokoto", psh: 6.3, lat: 13.0059, lng: 5.2476, city: "Sokoto", state: "Sokoto" },
    { name: "Maiduguri, Borno", psh: 6.4, lat: 11.8311, lng: 13.1510, city: "Maiduguri", state: "Borno" },
  ];

  let closest = hubs[0];
  let minDistance = Infinity;

  hubs.forEach(h => {
    const d = Math.hypot(lat - h.lat, lng - h.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = h;
    }
  });

  return closest;
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
  const [isLocating, setIsLocating] = useState<boolean>(false);

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

  const handleGpsLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser.');
      return;
    }
    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const hub = matchNigerianCoordinates(lat, lng);
        onChange(hub.name, {
          address: hub.name,
          city: hub.city,
          state: hub.state,
          country: 'Nigeria',
          lat,
          lng
        });
      },
      (err) => {
        setIsLocating(false);
        setError('Could not access GPS. Please type your city manually.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
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
            padding: '12px 105px 12px 42px',
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

        {/* GPS Locate Button */}
        <button
          type="button"
          onClick={handleGpsLocate}
          disabled={isLocating}
          title="Use Rooftop GPS (Auto-detect Nigerian Solar Irradiance)"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--color-primary)',
            borderRadius: '4px',
            padding: '5px 8px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: isLocating ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease'
          }}
        >
          {isLocating ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={12} />}
          <span>{isLocating ? 'Locating...' : 'GPS Audit'}</span>
        </button>
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
