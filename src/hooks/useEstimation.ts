import { useState } from 'react';
import { API_ENDPOINTS, apiClient } from '../config/api';
import type { Appliance, EstimationResult } from '../types';
import { calculateEnvironmentalImpact, calculateCableSizing } from '../utils/helpers';

/**
 * Realistic offline fallback estimation when backend server is unavailable
 */
const mockEstimate = (
  appliances: Appliance[], 
  hours: number, 
  address: string = 'Nigeria',
  batteryType: 'lithium' | 'gel' | 'tubular' = 'lithium',
  distanceMeters: number = 20
): EstimationResult => {
  let totalSteadyWatts = 0;
  let maxSurgeWatts = 0;

  appliances.forEach(app => {
    const steady = (Number(app.watt) || 0) * (Number(app.quantity) || 1);
    const nameLower = (app.name || '').toLowerCase();
    const isMotor = nameLower.includes('pump') || nameLower.includes('fan') || nameLower.includes('machine');
    const isCompressor = nameLower.includes('fridge') || nameLower.includes('ac') || nameLower.includes('freezer');
    const factor = isMotor ? 4.5 : (isCompressor ? 3.0 : 1.2);
    const surge = steady * factor;

    totalSteadyWatts += steady;
    if (surge > maxSurgeWatts) maxSurgeWatts = surge;
  });

  const dailyEnergyWh = totalSteadyWatts * hours;
  
  // Standard inverter sizing
  const rawInverter = Math.max(totalSteadyWatts * 1.25, maxSurgeWatts * 0.6);
  const standardInverters = [1000, 1500, 2500, 3500, 5000, 7500, 10000, 15000];
  const recommendedInverterW = standardInverters.find(s => s >= rawInverter) || Math.ceil(rawInverter / 1000) * 1000;

  // System Voltage
  let systemVoltage = 12;
  if (recommendedInverterW > 1500) systemVoltage = 24;
  if (recommendedInverterW > 3500) systemVoltage = 48;

  // Solar Panels (450W Monocrystalline)
  const psh = 4.8;
  const panelWattage = 450;
  const systemEfficiency = 0.78;
  const requiredPanelWatts = dailyEnergyWh / (psh * systemEfficiency);
  const panelQuantity = Math.max(2, Math.ceil(requiredPanelWatts / panelWattage));

  // Charge controller
  const chargeControllerAmps = Math.ceil(((panelQuantity * panelWattage) / systemVoltage) * 1.25);

  // Battery bank (80% DOD for Lithium, 50% for tubular/gel)
  const dod = batteryType === 'lithium' ? 0.8 : 0.5;
  const batteryCapacityWh = Math.round((dailyEnergyWh * 1.2) / dod);
  const batteryAh = Math.ceil(batteryCapacityWh / systemVoltage);

  // Electrical Cabling & BoS Sizing
  const cableSpec = calculateCableSizing(panelQuantity, panelWattage, distanceMeters, systemVoltage);

  // 2026 Nigerian market pricing
  const batteryCost = (batteryAh / 100) * (systemVoltage === 48 ? 1250000 : 480000);
  const panelsCost = panelQuantity * 240000;
  const inverterCost = recommendedInverterW * 520;
  const controllerCost = chargeControllerAmps * 2400;
  const cablingCost = cableSpec.bosBreakdown.solarCableMeters * 3200 + 45000;
  const installationCost = (panelQuantity * 22000) + 180000;
  const estimatedPriceNaira = Math.round(batteryCost + panelsCost + inverterCost + controllerCost + cablingCost + installationCost);

  const gridTariff = 280; // NGN/kWh
  const annualGridCost = (dailyEnergyWh / 1000) * gridTariff * 365;
  const paybackYears = parseFloat((estimatedPriceNaira / Math.max(annualGridCost, 1)).toFixed(1));

  const environmental = calculateEnvironmentalImpact(dailyEnergyWh);

  return {
    totalLoadWatts: totalSteadyWatts,
    totalSteadyWatts,
    maxSurgeWatts: Math.round(maxSurgeWatts),
    dailyEnergyWh,
    recommendedInverterW,
    recommendedInverter: recommendedInverterW,
    batteryCapacityWh,
    batteryAh,
    batteryType,
    systemVoltage,
    panelQuantity,
    panelWattage,
    chargeControllerAmps,
    estimatedPriceNaira,
    paybackYears,
    location: {
      address: address || 'Nigeria',
      psh
    },
    environmental,
    appliances,
    dailyHours: hours,
    cableDistanceMeters: distanceMeters,
    cableGaugeMm2: cableSpec.recommendedGaugeMm2,
    voltageDropPct: cableSpec.voltageDropPct,
    pvArchitecture: cableSpec.architecture,
    recommendedStringVoc: cableSpec.recommendedStringVoc,
    bosBreakdown: cableSpec.bosBreakdown
  };
};

/**
 * Detect if an appliance is surge-heavy
 */
const detectSurgeHeavy = (name: string): boolean => {
  const keywords = ['fridge', 'ac', 'pump', 'compressor', 'motor', 'freezer', 'washing'];
  return keywords.some(k => name.toLowerCase().includes(k));
};

export function useEstimation() {
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runEstimate = async (
    property: string,
    address: string,
    hours: number,
    appliances: Appliance[],
    batteryType: 'lithium' | 'gel' | 'tubular' = 'lithium',
    distanceMeters: number = 20
  ) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        propertyType: property,
        address: address,
        hours: Number(hours),
        batteryType,
        distanceMeters: Number(distanceMeters) || 20,
        appliances: appliances.map((a) => ({
          name: a.name,
          watt: Number(a.watt),
          quantity: Number(a.quantity),
          hours: a.hours || Number(hours),
          isSurgeHeavy: detectSurgeHeavy(a.name)
        })),
        contact: {
          name: "Solar Estimator User",
          phone: "0000000000",
        },
      };

      const data = await apiClient.post<EstimationResult>(
        API_ENDPOINTS.estimate,
        payload
      );

      const panelQty = data.panelQuantity || Math.ceil((data.dailyEnergyWh || 5000) / (4.8 * 450 * 0.78));
      const sysVolt = data.systemVoltage || 24;
      const cableSpec = calculateCableSizing(panelQty, data.panelWattage || 450, distanceMeters, sysVolt);

      // Attach client-side appliances, hours, cable specs so charts and models render properly
      const enrichedResult: EstimationResult = {
        ...data,
        appliances,
        dailyHours: hours,
        batteryType: data.batteryType || batteryType,
        cableDistanceMeters: distanceMeters,
        cableGaugeMm2: data.cableGaugeMm2 || cableSpec.recommendedGaugeMm2,
        voltageDropPct: data.voltageDropPct || cableSpec.voltageDropPct,
        pvArchitecture: data.pvArchitecture || cableSpec.architecture,
        recommendedStringVoc: data.recommendedStringVoc || cableSpec.recommendedStringVoc,
        bosBreakdown: data.bosBreakdown || cableSpec.bosBreakdown,
        environmental: data.environmental || calculateEnvironmentalImpact(data.dailyEnergyWh || (appliances.reduce((s, a) => s + (a.watt * a.quantity), 0) * hours))
      };

      setResult(enrichedResult);

    } catch (err: any) {
      console.warn("API request fallback:", err.message);
      // Seamlessly fall back to engineering calculation model
      const fallback = mockEstimate(appliances, hours, address, batteryType, distanceMeters);
      setResult(fallback);
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
