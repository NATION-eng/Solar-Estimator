/**
 * TypeScript Types & Interfaces for Solar Estimator
 */

export interface Appliance {
  id?: string;
  name: string;
  watt: number;
  quantity: number;
  hours?: number; // Optional individual hours
  surgeFactor?: number;
  category?: string;
}

export interface EstimationInput {
  propertyType: string;
  address: string;
  hours: number;
  appliances: Appliance[];
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  preferences?: {
    batteryType?: 'lithium' | 'gel' | 'agm';
    backupDays?: number;
    gridTiedOption?: boolean;
  };
}

export interface Location {
  address: string;
  lat?: number;
  lon?: number;
  psh: number; // Peak Sun Hours
  displayName?: string;
}

export interface TechnicalSpecs {
  totalLoadWatts: number;
  totalSteadyWatts?: number;
  maxSurgeWatts: number;
  dailyEnergyWh: number;
  recommendedInverterW?: number;
  recommendedInverter: number;
  systemVoltage: number;
  batteryAh: number;
  batteryCapacityWh: number;
  chargeControllerAmps: number;
  panelQuantity: number;
  panelWattage: number;
  inverterEfficiency?: number;
  totalPanelWattage?: number;
}

export interface FinancialData {
  estimatedPriceNaira: number;
  breakdown?: {
    panels: number;
    inverter: number;
    batteries: number;
    controller: number;
    installation: number;
    accessories?: number;
  };
  paybackYears: number;
  monthlySavings?: number;
  annualSavings?: number;
  roi?: number;
  gridCostComparison?: {
    monthlyGridCost: number;
    monthlySolarCost: number;
    savingsPercent: number;
  };
}

export interface EnvironmentalImpact {
  co2SavedAnnually: number; // kg
  treesEquivalent: number;
  coalAvoided: number; // kg
  lifetimeOffset: number; // Total kg CO2 over 25 years
}

export interface EstimationResult extends TechnicalSpecs, FinancialData {
  id?: string;
  location?: Location;
  timestamp?: string;
  environmental?: EnvironmentalImpact;
  recommendations?: string[];
  warnings?: string[];
}

export interface ComparisonScenario {
  name: string;
  backupHours: number;
  result: EstimationResult;
}

export interface LoadProfile {
  hour: number;
  load: number;
  category?: string;
}

export interface BatteryHealth {
  cyclesRemaining: number;
  yearsOfLife: number;
  replacementCost: number;
  depthOfDischarge: number;
}

export interface WeatherData {
  temperature: number;
  cloudCover: number;
  humidity: number;
  recommendation: string;
}

export interface FinancingOption {
  name: string;
  downPayment: number;
  monthlyPayment: number;
  duration: number; // months
  totalCost: number;
  interestRate: number;
}

export interface ExportData {
  estimation: EstimationResult;
  appliances: Appliance[];
  metadata: {
    generatedDate: string;
    version: string;
    company: string;
  };
}

// Utility Types
export type PropertyType = 'home' | 'office' | 'school' | 'hospital' | 'commercial' | 'industrial';

export type SystemSize = 'small' | 'medium' | 'large' | 'enterprise';

export type BatteryType = 'lithium' | 'gel' | 'agm' | 'tubular';

export type InstallationType = 'rooftop' | 'ground' | 'hybrid';

// Constants
export const PROPERTY_TYPES = {
  home: { label: 'Residential', icon: '🏠', desc: 'Homes & Apartments' },
  office: { label: 'Corporate', icon: '🏢', desc: 'Offices & Studios' },
  school: { label: 'Education', icon: '🏫', desc: 'Schools & Labs' },
  hospital: { label: 'Medical', icon: '🏥', desc: 'Clinics & Pharmacies' },
  commercial: { label: 'Commercial', icon: '🏪', desc: 'Shops & Restaurants' },
  industrial: { label: 'Industrial', icon: '🏭', desc: 'Warehouses & Factories' },
} as const;

export const BATTERY_TYPES = {
  lithium: { label: 'Lithium-Ion', dod: 0.8, cycles: 6000, costPerAh: 1200 },
  gel: { label: 'Gel Battery', dod: 0.5, cycles: 1200, costPerAh: 450 },
  agm: { label: 'AGM Battery', dod: 0.5, cycles: 800, costPerAh: 380 },
  tubular: { label: 'Tubular Battery', dod: 0.6, cycles: 1500, costPerAh: 320 },
} as const;

export const SYSTEM_EFFICIENCY = {
  inverter: 0.92,
  wiring: 0.97,
  battery: 0.85,
  mppt: 0.98,
  panel: 0.95, // temperature & dirt loss
} as const;
