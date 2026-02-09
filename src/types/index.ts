// TypeScript type definitions for the Solar Estimator application

export interface Appliance {
  name: string;
  watt: number;
  quantity: number;
  hours?: number;
  surgeFactor?: number;
  category?: string;
}

export interface EstimationResult {
  totalLoadWatts: number;
  dailyEnergyWh: number;
  recommendedInverterW: number;
  batteryCapacityWh: number;
  estimatedPriceNaira?: number;
  maxSurgeWatts?: number;
  panelQuantity?: number;
  panelWattage?: number;
  paybackYears?: number;
  systemVoltage?: number;
  batteryAh?: number;
  chargeControllerAmps?: number;
  location?: {
    address: string;
    psh: number;
  };
}

export interface PropertyType {
  id: string;
  label: string;
  icon: string;
  desc: string;
  presets: Appliance[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface APIError {
  error: string;
  details?: any;
}
