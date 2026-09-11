import axios from 'axios';

// Fast local solar irradiance and coordinate lookup for key Nigerian regions
const REGIONAL_SOLAR_DB = [
  { keywords: ['lagos', 'ikeja', 'lekki', 'victoria island', 'ikoyi', 'surulere', 'yaba', 'epe'], name: 'Lagos, Nigeria', lat: 6.5244, lon: 3.3792, psh: 4.65 },
  { keywords: ['abuja', 'fct', 'garki', 'wuse', 'maitama', 'asokoro', 'kubwa', 'gwagwalada'], name: 'Abuja, FCT, Nigeria', lat: 9.0765, lon: 7.3986, psh: 5.42 },
  { keywords: ['port harcourt', 'rivers', 'phc', 'diobu'], name: 'Port Harcourt, Rivers, Nigeria', lat: 4.8156, lon: 7.0498, psh: 4.25 },
  { keywords: ['kano'], name: 'Kano, Nigeria', lat: 12.0022, lon: 8.5920, psh: 6.18 },
  { keywords: ['ibadan', 'oyo'], name: 'Ibadan, Oyo, Nigeria', lat: 7.3775, lon: 3.9470, psh: 4.85 },
  { keywords: ['benin', 'edo'], name: 'Benin City, Edo, Nigeria', lat: 6.3350, lon: 5.6037, psh: 4.40 },
  { keywords: ['enugu'], name: 'Enugu, Nigeria', lat: 6.4584, lon: 7.5464, psh: 4.72 },
  { keywords: ['kaduna'], name: 'Kaduna, Nigeria', lat: 10.5105, lon: 7.4165, psh: 5.80 },
  { keywords: ['maiduguri', 'borno'], name: 'Maiduguri, Borno, Nigeria', lat: 11.8311, lon: 13.1510, psh: 6.50 },
  { keywords: ['calabar', 'cross river'], name: 'Calabar, Cross River, Nigeria', lat: 4.9757, lon: 8.3417, psh: 4.15 },
  { keywords: ['jos', 'plateau'], name: 'Jos, Plateau, Nigeria', lat: 9.8965, lon: 8.8583, psh: 5.70 },
  { keywords: ['owerri', 'imo'], name: 'Owerri, Imo, Nigeria', lat: 5.4836, lon: 7.0333, psh: 4.35 },
  { keywords: ['asaba', 'warri', 'delta'], name: 'Delta State, Nigeria', lat: 6.1982, lon: 6.7329, psh: 4.48 },
  { keywords: ['ilorin', 'kwara'], name: 'Ilorin, Kwara, Nigeria', lat: 8.4966, lon: 4.5421, psh: 5.10 },
  { keywords: ['abeokuta', 'ogun'], name: 'Abeokuta, Ogun, Nigeria', lat: 7.1475, lon: 3.3619, psh: 4.75 },
  { keywords: ['akure', 'ondo'], name: 'Akure, Ondo, Nigeria', lat: 7.2571, lon: 5.2058, psh: 4.60 },
  { keywords: ['sokoto'], name: 'Sokoto, Nigeria', lat: 13.0059, lon: 5.2476, psh: 6.35 },
];

class SolarService {
  constructor() {
    this.geocodeCache = new Map();
    this.solarYieldCache = new Map();
  }

  /**
   * Translates an address to Lat/Lon with local priority and external fallback
   */
  async getCoordinates(address) {
    if (!address || typeof address !== 'string') return null;
    const cleanAddress = address.trim().toLowerCase();

    // Check in-memory cache
    if (this.geocodeCache.has(cleanAddress)) {
      return this.geocodeCache.get(cleanAddress);
    }

    // Check regional database match
    const regionalMatch = REGIONAL_SOLAR_DB.find(region =>
      region.keywords.some(k => cleanAddress.includes(k))
    );

    if (regionalMatch) {
      const matchData = {
        lat: regionalMatch.lat,
        lon: regionalMatch.lon,
        displayName: regionalMatch.name,
        cachedPsh: regionalMatch.psh
      };
      this.geocodeCache.set(cleanAddress, matchData);
      return matchData;
    }

    // Otherwise attempt geocoding with timeout & polite headers
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: `${address}, Nigeria`,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'MasterviewCELSolarEstimator/2.0 (contact@masterviewcel.com)'
        },
        timeout: 4000
      });

      if (response.data && response.data.length > 0) {
        const result = {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
          displayName: response.data[0].display_name
        };
        this.geocodeCache.set(cleanAddress, result);
        return result;
      }
    } catch (error) {
      console.warn('External geocoding warning, falling back to nationwide default:', error.message);
    }

    // Default Nigerian geographic anchor (Lagos/Federal Center)
    const fallback = {
      lat: 6.5244,
      lon: 3.3792,
      displayName: `${address} (Estimated, Nigeria)`,
      cachedPsh: 4.8
    };
    this.geocodeCache.set(cleanAddress, fallback);
    return fallback;
  }

  /**
   * Fetches Peak Sun Hours (PSH) for a location with caching and safety bounds
   */
  async getSolarYield(lat, lon, presetPsh) {
    if (presetPsh) {
      return { peakSunHours: presetPsh, annualYield: Math.round(presetPsh * 365) };
    }

    const cacheKey = `${lat.toFixed(1)}_${lon.toFixed(1)}`;
    if (this.solarYieldCache.has(cacheKey)) {
      return this.solarYieldCache.get(cacheKey);
    }

    try {
      const response = await axios.get('https://archive-api.open-meteo.com/v1/archive', {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          daily: 'shortwave_radiation_sum',
          timezone: 'GMT'
        },
        timeout: 5000
      });

      const radiationData = response.data?.daily?.shortwave_radiation_sum;
      if (radiationData && radiationData.length > 0) {
        const avgRadiation = radiationData.reduce((a, b) => a + b, 0) / radiationData.length;
        const psh = parseFloat((avgRadiation / 3.6).toFixed(2));
        const result = {
          peakSunHours: psh > 3.0 ? psh : 4.8,
          annualYield: Math.round((avgRadiation / 3.6) * 365)
        };
        this.solarYieldCache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn('Weather API warning, using latitude-based calculation:', error.message);
    }

    // Latitude-based Nigerian solar approximation: Northern Nigeria gets higher irradiance
    const estimatedPsh = lat > 9.0 ? 5.8 : (lat > 7.0 ? 5.1 : 4.6);
    const fallbackResult = {
      peakSunHours: estimatedPsh,
      annualYield: Math.round(estimatedPsh * 365)
    };
    this.solarYieldCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }
}

export const solarService = new SolarService();
