/**
 * Utility Functions for Solar Estimator
 */

import type { Appliance, EnvironmentalImpact, BatteryHealth, FinancingOption } from '../types';

// ==================== FORMATTING ====================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatEnergy(wh: number): string {
  if (wh >= 1000) {
    return `${(wh / 1000).toFixed(2)} kWh`;
  }
  return `${wh.toFixed(0)} Wh`;
}

export function formatPower(watts: number): string {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(1)} kW`;
  }
  return `${watts.toFixed(0)} W`;
}

// ==================== VALIDATION ====================

export function validateAppliance(appliance: Appliance): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!appliance.name || appliance.name.trim() === '') {
    errors.push('Appliance name is required');
  }
  
  if (appliance.watt <= 0) {
    errors.push('Wattage must be greater than 0');
  }
  
  if (appliance.watt > 10000) {
    errors.push('Wattage seems unrealistic (max 10,000W per appliance)');
  }
  
  if (appliance.quantity <= 0) {
    errors.push('Quantity must be at least 1');
  }
  
  if (appliance.quantity > 100) {
    errors.push('Quantity seems too high (max 100)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateEstimationInput(
  propertyType: string,
  address: string,
  appliances: Appliance[],
  hours: number
): { valid: boolean; message?: string } {
  if (!propertyType) {
    return { valid: false, message: 'Please select a property type' };
  }
  
  if (!address || address.trim().length < 3) {
    return { valid: false, message: 'Please enter a valid address (min 3 characters)' };
  }
  
  if (appliances.length === 0) {
    return { valid: false, message: 'Please add at least one appliance' };
  }
  
  // Validate each appliance
  for (let i = 0; i < appliances.length; i++) {
    const validation = validateAppliance(appliances[i]);
    if (!validation.valid) {
      return { 
        valid: false, 
        message: `Appliance ${i + 1}: ${validation.errors.join(', ')}` 
      };
    }
  }
  
  if (hours < 1 || hours > 24) {
    return { valid: false, message: 'Daily hours must be between 1 and 24' };
  }
  
  return { valid: true };
}

// ==================== CALCULATIONS ====================

export function calculateTotalLoad(appliances: Appliance[]): number {
  return appliances.reduce((total, app) => {
    return total + (app.watt * app.quantity);
  }, 0);
}

export function calculatePeakSurge(appliances: Appliance[]): number {
  let maxSurge = 0;
  
  appliances.forEach(app => {
    const factor = app.surgeFactor || getSurgeFactor(app.name);
    const surge = app.watt * factor * app.quantity;
    if (surge > maxSurge) maxSurge = surge;
  });
  
  return maxSurge;
}

function getSurgeFactor(applianceName: string): number {
  const name = applianceName.toLowerCase();
  
  // Motors have highest surge
  if (name.includes('pump') || name.includes('compressor')) return 5.0;
  if (name.includes('fan') || name.includes('motor')) return 4.0;
  
  // Refrigeration
  if (name.includes('fridge') || name.includes('freezer') || name.includes('ac')) return 3.0;
  
  // Heating elements
  if (name.includes('heater') || name.includes('iron')) return 1.2;
  
  // Electronics (minimal surge)
  if (name.includes('tv') || name.includes('computer') || name.includes('led')) return 1.1;
  
  // Default
  return 1.3;
}

export function calculateDailyEnergy(appliances: Appliance[], hours: number): number {
  return appliances.reduce((total, app) => {
    const appHours = app.hours || hours;
    return total + (app.watt * app.quantity * appHours);
  }, 0);
}

// ==================== ENVIRONMENTAL IMPACT ====================

export function calculateEnvironmentalImpact(dailyEnergyWh: number): EnvironmentalImpact {
  const annualEnergyKwh = (dailyEnergyWh / 1000) * 365;
  
  // Nigeria grid emission factor: ~0.5 kg CO2/kWh (varies by region)
  const co2SavedAnnually = annualEnergyKwh * 0.5;
  
  // One tree absorbs ~21 kg CO2/year
  const treesEquivalent = Math.round(co2SavedAnnually / 21);
  
  // Coal equivalent (1 kg coal = ~2.5 kg CO2)
  const coalAvoided = Math.round(co2SavedAnnually / 2.5);
  
  // Lifetime offset (assuming 25-year system life)
  const lifetimeOffset = Math.round(co2SavedAnnually * 25);
  
  return {
    co2SavedAnnually: Math.round(co2SavedAnnually),
    treesEquivalent,
    coalAvoided,
    lifetimeOffset,
  };
}

// ==================== BATTERY CALCULATIONS ====================

export function calculateBatteryHealth(
  batteryAh: number,
  dailyEnergyWh: number,
  systemVoltage: number,
  batteryType: 'lithium' | 'gel' | 'agm' = 'lithium'
): BatteryHealth {
  const batteryCapacityWh = batteryAh * systemVoltage;
  
  // Depth of discharge varies by battery type
  const dodLimits = {
    lithium: 0.8,
    gel: 0.5,
    agm: 0.5,
  };
  
  const cycleLimits = {
    lithium: 6000,
    gel: 1200,
    agm: 800,
  };
  
  const dod = dodLimits[batteryType];
  const dailyDod = dailyEnergyWh / batteryCapacityWh;
  
  // Adjust cycle life based on actual DoD
  let cyclesRemaining = cycleLimits[batteryType];
  if (dailyDod > dod) {
    cyclesRemaining = Math.floor(cyclesRemaining * 0.7); // Penalty for over-discharge
  }
  
  const yearsOfLife = (cyclesRemaining / 365);
  
  // Replacement cost (varies by type and size)
  const costPerAh = {
    lithium: 1200,
    gel: 450,
    agm: 380,
  };
  
  const replacementCost = batteryAh * costPerAh[batteryType];
  
  return {
    cyclesRemaining,
    yearsOfLife: Math.round(yearsOfLife * 10) / 10,
    replacementCost,
    depthOfDischarge: dailyDod,
  };
}

// ==================== FINANCING ====================

export function calculateFinancingOptions(totalCost: number): FinancingOption[] {
  const options: FinancingOption[] = [];
  
  // Option 1: 20% down, 12 months
  options.push(calculateFinancing(totalCost, 0.2, 12, 0.18));
  
  // Option 2: 30% down, 24 months
  options.push(calculateFinancing(totalCost, 0.3, 24, 0.16));
  
  // Option 3: 40% down, 36 months
  options.push(calculateFinancing(totalCost, 0.4, 36, 0.14));
  
  return options;
}

function calculateFinancing(
  principal: number,
  downPaymentPercent: number,
  months: number,
  annualRate: number
): FinancingOption {
  const downPayment = principal * downPaymentPercent;
  const loanAmount = principal - downPayment;
  const monthlyRate = annualRate / 12;
  
  // EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyPayment = 
    loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
    (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalCost = downPayment + (monthlyPayment * months);
  
  return {
    name: `${downPaymentPercent * 100}% Down, ${months} months`,
    downPayment,
    monthlyPayment,
    duration: months,
    totalCost,
    interestRate: annualRate,
  };
}

// ==================== GRID COMPARISON ====================

export function calculateGridComparison(dailyEnergyWh: number, systemCost: number) {
  const monthlyEnergyKwh = (dailyEnergyWh / 1000) * 30;
  
  // Current Nigerian tariff (varies by band, using average)
  const gridTariffPerKwh = 280; // NGN (recent hike)
  
  const monthlyGridCost = monthlyEnergyKwh * gridTariffPerKwh;
  
  // Solar operating cost (maintenance + inverter replacement fund)
  const monthlySolarCost = systemCost * 0.01 / 12; // 1% annual maintenance
  
  const savingsPercent = ((monthlyGridCost - monthlySolarCost) / monthlyGridCost) * 100;
  
  return {
    monthlyGridCost,
    monthlySolarCost,
    savingsPercent: Math.round(savingsPercent),
    monthlySavings: monthlyGridCost - monthlySolarCost,
    annualSavings: (monthlyGridCost - monthlySolarCost) * 12,
  };
}

// ==================== LOAD PROFILING ====================

export function generateLoadProfile(appliances: Appliance[], hours: number): { hour: number; load: number }[] {
  const profile = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    load: 0,
  }));
  
  // Distribute load based on typical usage patterns
  appliances.forEach(app => {
    const appHours = app.hours || hours;
    const appLoad = app.watt * app.quantity;
    
    // Determine usage pattern by appliance type
    const name = app.name.toLowerCase();
    let startHour = 0;
    
    if (name.includes('light')) {
      startHour = 18; // Evening lights
    } else if (name.includes('fridge') || name.includes('router')) {
      startHour = 0; // 24/7 appliances
    } else if (name.includes('ac') || name.includes('fan')) {
      startHour = 13; // Afternoon cooling
    } else if (name.includes('tv')) {
      startHour = 19; // Evening entertainment
    } else if (name.includes('computer') || name.includes('laptop')) {
      startHour = 9; // Work hours
    } else {
      startHour = 8; // Default morning
    }
    
    // Distribute load across usage hours
    for (let i = 0; i < appHours; i++) {
      const hour = (startHour + i) % 24;
      profile[hour].load += appLoad;
    }
  });
  
  return profile;
}

// ==================== RECOMMENDATIONS ====================

export function generateRecommendations(
  totalLoad: number,
  dailyEnergy: number,
  maxSurge: number,
  inverterRating: number
): string[] {
  const recommendations: string[] = [];
  
  // Inverter sizing
  if (maxSurge > inverterRating * 2) {
    recommendations.push(
      '⚠️ Consider upgrading inverter capacity to handle surge loads safely'
    );
  }
  
  // Energy efficiency
  if (dailyEnergy > 15000) {
    recommendations.push(
      '💡 High energy consumption detected. Consider LED lighting and inverter appliances to reduce load'
    );
  }
  
  // Battery recommendation
  if (totalLoad > 3000) {
    recommendations.push(
      '🔋 Lithium batteries recommended for this load to maximize lifespan and efficiency'
    );
  }
  
  // Solar array
  if (dailyEnergy > 20000) {
    recommendations.push(
      '☀️ Consider roof space requirements for solar array - approximately 15-20 m² needed'
    );
  }
  
  // Grid tie
  if (dailyEnergy > 10000) {
    recommendations.push(
      '🔌 Grid-tie option available to sell excess power back to utility (where permitted)'
    );
  }
  
  return recommendations;
}

// ==================== EXPORT UTILITIES ====================

export function generatePDFMetadata() {
  return {
    generatedDate: new Date().toISOString(),
    version: '2.0',
    company: 'MasterviewCEL Energy Solutions',
    website: 'www.masterviewcel.com',
  };
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

// ==================== DATE & TIME ====================

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
