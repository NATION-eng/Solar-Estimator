// TypeScript type definitions for the Solar Estimator application

export interface Appliance {
  name: string;
  watt: number;
  quantity: number;
  hours?: number;
  surgeFactor?: number;
  category?: string;
  isSurgeHeavy?: boolean;
}

export interface EnvironmentalImpact {
  co2SavedAnnually: number;
  treesEquivalent: number;
  coalAvoided: number;
  lifetimeOffset: number;
}

export interface BatteryHealth {
  cyclesRemaining: number;
  yearsOfLife: number;
  replacementCost: number;
  depthOfDischarge: number;
}

export interface FinancingOption {
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanAmount: number;
  months: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface EstimationResult {
  id?: number | string;
  totalLoadWatts: number;
  totalSteadyWatts?: number;
  dailyEnergyWh: number;
  recommendedInverterW: number;
  recommendedInverter?: number;
  batteryCapacityWh: number;
  estimatedPriceNaira?: number;
  maxSurgeWatts?: number;
  panelQuantity?: number;
  panelWattage?: number;
  paybackYears?: number;
  systemVoltage?: number;
  batteryAh?: number;
  batteryType?: 'lithium' | 'gel' | 'tubular';
  chargeControllerAmps?: number;
  inverterEfficiency?: number;
  breakdown?: Record<string, number>;
  environmental?: EnvironmentalImpact;
  recommendations?: string[];
  appliances?: Appliance[];
  dailyHours?: number;
  location?: {
    address: string;
    psh: number;
  };
  cableDistanceMeters?: number;
  cableGaugeMm2?: number;
  voltageDropPct?: number;
  pvArchitecture?: 'high-voltage' | 'low-voltage';
  recommendedStringVoc?: number;
  bosBreakdown?: {
    solarCableMeters: number;
    solarCableGauge: string;
    batteryCableGauge: string;
    dcBreakers: string;
    acSurgeProtection: string;
    dcSurgeProtection: string;
  };
  inverterBrand?: string;
  overrides?: any;
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
