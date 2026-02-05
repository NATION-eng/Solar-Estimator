import axios from 'axios';

class SolarService {
  /**
   * Translates an address to Lat/Lon
   */
  async getCoordinates(address) {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'SolarEstimator/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
          displayName: response.data[0].display_name
        };
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Geocoding error:', error.message);
      return null;
    }
  }

  /**
   * Fetches Peak Sun Hours (PSH) for a location.
   * We use Open-Meteo's solar radiation data and integrate it.
   */
  async getSolarYield(lat, lon) {
    try {
      // Fetching 1 year of historical daily radiation
      const response = await axios.get('https://archive-api.open-meteo.com/v1/archive', {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          daily: 'shortwave_radiation_sum',
          timezone: 'GMT'
        }
      });

      const radiationData = response.data.daily.shortwave_radiation_sum;
      const avgRadiation = radiationData.reduce((a, b) => a + b, 0) / radiationData.length;
      
      // Convert MJ/m² per day to Peak Sun Hours (PSH)
      // 1 kWh/m² = 3.6 MJ/m²
      // PSH is numerically equivalent to kWh/m²/day
      const psh = avgRadiation / 3.6;

      return {
        peakSunHours: parseFloat(psh.toFixed(2)),
        annualYield: radiationData.reduce((a, b) => a + b, 0) / 3.6 // Total kWh/m² per year
      };
    } catch (error) {
      console.warn('Weather API error, using regional defaults:', error.message);
      // Fallback for Lagos if API fails or other errors
      return { peakSunHours: 4.5, annualYield: 1642 }; 
    }
  }
}

export const solarService = new SolarService();
