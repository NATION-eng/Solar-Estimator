import { useState } from 'react';
import { API_ENDPOINTS, apiClient } from '../config/api';
import type { Appliance, EstimationResult } from '../types';

/**
 * Mock estimation function for fallback when backend is unavailable
 */
const mockEstimate = (appliances: Appliance[], hours: number): EstimationResult => {
  const totalLoad = appliances.reduce((acc, curr) => acc + (curr.watt * curr.quantity), 0);
  const dailyEnergy = totalLoad * hours;
  
  const inverter = Math.ceil(totalLoad * 1.5 / 1000) * 1000; 
  const battery = Math.ceil(dailyEnergy * 1.2); 
  
  const price = (inverter * 150) + (battery * 100) + 50000; 

  return {
    totalLoadWatts: totalLoad,
    dailyEnergyWh: dailyEnergy,
    recommendedInverterW: inverter > 1000 ? inverter : 1000,
    batteryCapacityWh: battery,
    estimatedPriceNaira: price
  };
};

/**
 * Detect if an appliance is surge-heavy (requires higher inverter capacity)
 */
const detectSurgeHeavy = (name: string): boolean => {
  const keywords = ['fridge', 'ac', 'pump', 'compressor', 'motor', 'freezer'];
  return keywords.some(k => name.toLowerCase().includes(k));
};

/**
 * Custom hook for managing solar estimation logic
 * 
 * Handles:
 * - API calls to backend estimation service
 * - Loading and error states
 * - Fallback to mock data when backend unavailable
 * - Surge-heavy appliance detection
 */
export function useEstimation() {
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runEstimate = async (
    property: string,
    address: string,
    hours: number,
    appliances: Appliance[]
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        propertyType: property,
        address: address,
        hours: Number(hours),
        appliances: appliances.map((a) => ({
          name: a.name,
          watt: Number(a.watt),
          quantity: Number(a.quantity),
          isSurgeHeavy: detectSurgeHeavy(a.name)
        })),
        contact: {
          name: "Demo User",
          phone: "0000000000",
        },
      };

      const data = await apiClient.post<EstimationResult>(
        API_ENDPOINTS.estimate,
        payload
      );

      setResult(data);

    } catch (err: any) {
      console.error("Estimation error:", err);
      setError(err.message);
      
      // Fallback to mock if backend unavailable
      if (err.message.includes('Unable to connect')) {
         const demoResult = mockEstimate(appliances, hours);
         setResult(demoResult);
      } else {
        // Show error to user
        alert(`Estimation failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return { 
    result, 
    loading, 
    error, 
    runEstimate,
    clearResult
  };
}
