import { useState } from 'react';
import { API_ENDPOINTS, apiClient } from '../config/api';
import type { Appliance, EstimationResult } from '../types';
import { calculateEnvironmentalImpact, calculateCableSizing } from '../utils/helpers';

/**
 * Realistic duty cycle helper matching real home and commercial operation
 */
const getDutyCycle = (nameLower: string, appHours?: number, dailyHours: number = 8) => {
  const rawHours = Number(appHours) || Number(dailyHours) || 8;
  
  if (nameLower.includes('ac') || nameLower.includes('air con') || nameLower.includes('conditioner')) {
    const hours = Math.min(rawHours, 12);
    return { hours, cycle: 0.55 };
  }
  if (nameLower.includes('fridge') || nameLower.includes('freezer') || nameLower.includes('refrigerator')) {
    const hours = Math.max(rawHours, 24);
    return { hours, cycle: 0.38 };
  }
  if (nameLower.includes('light') || nameLower.includes('lamp') || nameLower.includes('led') || nameLower.includes('bulb')) {
    const hours = Math.min(rawHours, 8);
    return { hours, cycle: 1.0 };
  }
  if (nameLower.includes('pump') || nameLower.includes('borehole')) {
    const hours = Math.min(rawHours, 2);
    return { hours, cycle: 1.0 };
  }
  if (nameLower.includes('fan')) {
    const hours = Math.min(rawHours, 18);
    return { hours, cycle: 1.0 };
  }
  if (nameLower.includes('tv') || nameLower.includes('television') || nameLower.includes('decoder')) {
    const hours = Math.min(rawHours, 12);
    return { hours, cycle: 0.9 };
  }
  if (nameLower.includes('iron') || nameLower.includes('kettle') || nameLower.includes('microwave') || nameLower.includes('cooker')) {
    const hours = Math.min(rawHours, 1.5);
    return { hours, cycle: 0.8 };
  }
  const hours = Math.min(rawHours, 24);
  return { hours, cycle: 0.85 };
};

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
  let dailyEnergyWh = 0;
  let hasHeavyLoadOrAC = false;

  appliances.forEach(app => {
    const steady = (Number(app.watt) || 0) * (Number(app.quantity) || 1);
    const nameLower = (app.name || '').toLowerCase();
    const isMotor = nameLower.includes('pump') || nameLower.includes('fan') || nameLower.includes('machine');
    const isCompressor = nameLower.includes('fridge') || nameLower.includes('ac') || nameLower.includes('freezer');
    const factor = isMotor ? 4.0 : (isCompressor ? 3.5 : 1.2);
    const surge = steady * factor;

    totalSteadyWatts += steady;
    if (surge > maxSurgeWatts) maxSurgeWatts = surge;

    const duty = getDutyCycle(nameLower, app.hours, hours);
    if (nameLower.includes('ac') || nameLower.includes('air con') || app.watt >= 800) {
      hasHeavyLoadOrAC = true;
    }
    dailyEnergyWh += (steady * duty.hours * duty.cycle);
  });

  dailyEnergyWh = Math.round(dailyEnergyWh);

  // Standard inverter sizing
  let rawInverter = Math.max(totalSteadyWatts * 1.25, maxSurgeWatts * 0.55);
  if (hasHeavyLoadOrAC && rawInverter < 3500) {
    rawInverter = 3500;
  }
  const standardInverters = [1000, 1500, 2000, 2500, 3500, 5000, 7500, 10000, 15000];
  const recommendedInverterW = standardInverters.find(s => s >= rawInverter) || Math.ceil(rawInverter / 1000) * 1000;

  // System Voltage: Auto-select 48V for >= 3kVA or AC loads
  let systemVoltage = 12;
  if (recommendedInverterW >= 1500 || dailyEnergyWh >= 4000) systemVoltage = 24;
  if (recommendedInverterW >= 3000 || dailyEnergyWh >= 7500 || hasHeavyLoadOrAC) systemVoltage = 48;

  // Solar Panels (450W Monocrystalline Tier-1)
  const psh = 4.8;
  const panelWattage = 450;
  const systemEfficiency = 0.82;
  const requiredPanelWatts = dailyEnergyWh / (psh * systemEfficiency);
  let panelQuantity = Math.max(2, Math.ceil(requiredPanelWatts / panelWattage));
  if (panelQuantity > 2 && panelQuantity % 2 !== 0) panelQuantity += 1; // Balance strings

  // Charge controller
  const chargeControllerAmps = Math.ceil(((panelQuantity * panelWattage) / systemVoltage) * 1.25);

  // Battery bank sizing (Daytime direct PV coverage ~35%, night/backup ~65%)
  const dod = batteryType === 'lithium' ? 0.85 : 0.50;
  const nightAndBackupEnergyWh = dailyEnergyWh * 0.65;
  const batteryCapacityWh = Math.round(nightAndBackupEnergyWh / dod / 0.90);
  const batteryAh = Math.ceil(batteryCapacityWh / systemVoltage);

  // Electrical Cabling & BoS Sizing
  const cableSpec = calculateCableSizing(panelQuantity, panelWattage, distanceMeters, systemVoltage);

  // 2026 Nigerian market turnkey pricing
  const batteryCapacityKwh = (batteryAh * systemVoltage) / 1000;
  const batteryCost = batteryType === 'lithium' 
    ? Math.round(batteryCapacityKwh * 290000) 
    : Math.round(batteryCapacityKwh * 145000);
  const panelsCost = panelQuantity * 140000;

  let inverterCost = 450000;
  if (recommendedInverterW <= 1200) inverterCost = 300000;
  else if (recommendedInverterW <= 1800) inverterCost = 420000;
  else if (recommendedInverterW <= 2600) inverterCost = 620000;
  else if (recommendedInverterW <= 3800) inverterCost = 880000;
  else if (recommendedInverterW <= 5500) inverterCost = 1250000;
  else inverterCost = Math.round(recommendedInverterW * 240);

  const controllerCost = recommendedInverterW >= 2500 ? 0 : Math.round(chargeControllerAmps * 1200);
  const cablingCost = Math.round((cableSpec.bosBreakdown.solarCableMeters * 2800) + 160000);
  const installationCost = Math.round((panelQuantity * 16000) + 180000);

  const estimatedPriceNaira = Math.round(batteryCost + panelsCost + inverterCost + controllerCost + cablingCost + installationCost);

  const gridTariff = 280; // NGN/kWh
  const annualGridCost = (dailyEnergyWh / 1000) * gridTariff * 365;
  const annualMaintenanceCost = estimatedPriceNaira * 0.015;
  const annualSavings = Math.max(annualGridCost - annualMaintenanceCost, 1);
  const paybackYears = parseFloat((estimatedPriceNaira / annualSavings).toFixed(1));

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
