class EnergyModel {
  /**
   * Professional Calculation for Solar System Sizing
   * Calibrated with real-world duty cycles, 48V bus optimization, and market-accurate Nigerian pricing
   */
  getDutyCycle(nameLower, appHours, dailyHours) {
    const rawHours = Number(appHours) || Number(dailyHours) || 8;
    
    // Air Conditioner (Inverter / Non-inverter)
    if (nameLower.includes('ac') || nameLower.includes('air con') || nameLower.includes('conditioner')) {
      // Thermostat cycling duty cycle ~50-55%. Effective runtime max 12 hours in a 24h period (night sleep + afternoon)
      const hours = Math.min(rawHours, 12);
      return { hours, cycle: 0.55 };
    }
    
    // Refrigerator / Freezer
    if (nameLower.includes('fridge') || nameLower.includes('freezer') || nameLower.includes('refrigerator')) {
      // Refrigerator is connected 24h, but compressor cycles on/off ~35-40% of the time
      const hours = Math.max(rawHours, 24);
      return { hours, cycle: 0.38 };
    }
    
    // Lighting (LED / bulbs)
    if (nameLower.includes('light') || nameLower.includes('lamp') || nameLower.includes('led') || nameLower.includes('bulb')) {
      // Lights are not kept on during daylight; practical usage is 6 to 8 hours/day even in 24h off-grid homes
      const hours = Math.min(rawHours, 8);
      return { hours, cycle: 1.0 };
    }
    
    // Water Pump / Borehole
    if (nameLower.includes('pump') || nameLower.includes('borehole')) {
      // Pumping overhead tanks only takes 1 to 2 hours per day
      const hours = Math.min(rawHours, 2);
      return { hours, cycle: 1.0 };
    }

    // Fans
    if (nameLower.includes('fan')) {
      // Fans may run extensive hours (12 to 18 hours/day)
      const hours = Math.min(rawHours, 18);
      return { hours, cycle: 1.0 };
    }

    // Television / Home Entertainment / Decoders
    if (nameLower.includes('tv') || nameLower.includes('television') || nameLower.includes('decoder')) {
      const hours = Math.min(rawHours, 12);
      return { hours, cycle: 0.9 };
    }

    // High wattage intermittent heating (Iron, Microwave, Kettle)
    if (nameLower.includes('iron') || nameLower.includes('kettle') || nameLower.includes('microwave') || nameLower.includes('cooker')) {
      const hours = Math.min(rawHours, 1.5);
      return { hours, cycle: 0.8 };
    }

    // Default for any other appliances
    const hours = Math.min(rawHours, 24);
    return { hours, cycle: 0.85 };
  }

  calculateSystem(appliances, dailyHours, peakSunHours, batteryType = 'lithium', distanceMeters = 20) {
    let totalSteadyWatts = 0;
    let maxSurgeWatts = 0;
    let dailyEnergyWh = 0;
    let hasHeavyLoadOrAC = false;

    // Process each appliance with realistic operating duty cycles
    appliances.forEach(app => {
      const steady = (Number(app.watt) || 0) * (Number(app.quantity) || 1);
      const nameLower = (app.name || '').toLowerCase();
      
      // Enhanced Surge Factor Matrix
      const surgeFactor = app.surgeFactor || this.calculateSurgeFactor(app.name, app.watt);
      const surge = (app.watt * surgeFactor) * app.quantity;
      
      totalSteadyWatts += steady;
      if (surge > maxSurgeWatts) maxSurgeWatts = surge;

      // Realistic Duty Cycle & Effective Operating Hours
      const effectiveDuty = this.getDutyCycle(nameLower, app.hours, dailyHours);
      if (nameLower.includes('ac') || nameLower.includes('air con') || app.watt >= 800) {
        hasHeavyLoadOrAC = true;
      }

      dailyEnergyWh += (steady * effectiveDuty.hours * effectiveDuty.cycle);
    });

    // 1. Inverter Sizing (Must handle continuous load + inductive surge)
    let continuousRating = totalSteadyWatts * 1.25; // 25% continuous headroom
    let recommendedInverter = Math.max(continuousRating, maxSurgeWatts * 0.55);
    
    // Standard engineering practice: Any system powering an AC requires at least a 3.5 kVA (or 5.0 kVA) inverter
    if (hasHeavyLoadOrAC && recommendedInverter < 3500) {
      recommendedInverter = 3500;
    }
    
    // Standard commercial inverter sizes in Nigeria
    const standardSizes = [1000, 1500, 2000, 2500, 3500, 5000, 7500, 10000, 15000];
    const finalInverter = standardSizes.find(size => size >= recommendedInverter) || Math.ceil(recommendedInverter / 1000) * 1000;

    // 2. System Voltage Selection (Professional Engineering Practice)
    // Avoid thermal melt & huge wire gauges by stepping up to 48V for >= 3kVA or AC loads
    let systemVoltage = 12;
    if (finalInverter >= 1500 || dailyEnergyWh >= 4000) systemVoltage = 24;
    if (finalInverter >= 3000 || dailyEnergyWh >= 7500 || hasHeavyLoadOrAC) systemVoltage = 48;

    // 3. Panel Sizing (Realistic MPPT efficiency model)
    const psh = Number(peakSunHours) > 0 ? Number(peakSunHours) : 4.8;
    const systemEfficiency = 0.82; // MPPT + wiring + temperature coefficient
    const requiredPanelWatts = dailyEnergyWh / psh / systemEfficiency;
    const panelUnitWattage = 450; // Modern Monocrystalline Tier-1
    let panelQuantity = Math.max(2, Math.ceil(requiredPanelWatts / panelUnitWattage));
    if (panelQuantity > 2 && panelQuantity % 2 !== 0) panelQuantity += 1; // Even number of panels for balanced MPPT strings

    // 4. Charge Controller Sizing (MPPT)
    const totalPanelWattage = panelQuantity * panelUnitWattage;
    const chargeControllerAmps = Math.ceil((totalPanelWattage / systemVoltage) * 1.25);

    // 5. Battery Sizing (Commercial Standard kWh sizing)
    const batterySpecs = this.getBatterySpecs(batteryType);
    // Real-world autonomy: ~35% of energy is consumed directly during daylight solar generation.
    // Battery stores for evening, night, and early morning (~65% of daily energy)
    const nightAndBackupEnergyWh = dailyEnergyWh * 0.65;
    const batteryCapacityWh = Math.round(nightAndBackupEnergyWh / batterySpecs.dod / 0.90); // 90% inverter efficiency
    const batteryAh = Math.ceil(batteryCapacityWh / systemVoltage);

    // 6. DC Cable Sizing & Electrical Architecture
    const cableSpec = this.calculateCableSizing(panelQuantity, panelUnitWattage, distanceMeters, systemVoltage);

    // 7. Financials (Calibrated 2026 Nigerian Market Turnkey Pricing)
    const costs = this.calculateCosts(
      panelQuantity, 
      finalInverter, 
      batteryAh, 
      systemVoltage,
      chargeControllerAmps,
      batteryType,
      cableSpec.bosBreakdown.solarCableMeters
    );

    const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
    
    // 8. ROI and Payback
    const gridTariff = 280; // NGN per kWh (Band A average)
    const annualGridCost = (dailyEnergyWh / 1000) * gridTariff * 365;
    const annualMaintenanceCost = totalCost * 0.015;
    const annualSavings = Math.max(annualGridCost - annualMaintenanceCost, 1);
    const paybackYears = parseFloat((totalCost / annualSavings).toFixed(1));

    // 9. Environmental Impact
    const environmental = this.calculateEnvironmentalImpact(dailyEnergyWh);

    // 10. System Recommendations
    const recommendations = this.generateRecommendations(
      totalSteadyWatts,
      dailyEnergyWh,
      maxSurgeWatts,
      finalInverter,
      batteryType
    );

    return {
      technical: {
        totalLoadWatts: totalSteadyWatts,
        totalSteadyWatts,
        maxSurgeWatts,
        dailyEnergyWh: Math.round(dailyEnergyWh),
        recommendedInverter: finalInverter,
        recommendedInverterW: finalInverter,
        systemVoltage,
        batteryAh,
        chargeControllerAmps,
        panelQuantity,
        panelWattage: panelUnitWattage,
        batteryCapacityWh,
        inverterEfficiency: 0.92,
        totalPanelWattage,
        cableDistanceMeters: distanceMeters,
        cableGaugeMm2: cableSpec.recommendedGaugeMm2,
        voltageDropPct: cableSpec.voltageDropPct,
        pvArchitecture: cableSpec.architecture,
        recommendedStringVoc: cableSpec.recommendedStringVoc,
        bosBreakdown: cableSpec.bosBreakdown,
      },
      financial: {
        estimatedPriceNaira: totalCost,
        breakdown: costs,
        paybackYears,
        monthlySavings: Math.round(annualSavings / 12),
        annualSavings: Math.round(annualSavings),
        gridCostComparison: {
          monthlyGridCost: Math.round(annualGridCost / 12),
          monthlySolarCost: Math.round(annualMaintenanceCost / 12),
          savingsPercent: Math.round(((annualSavings / Math.max(annualGridCost, 1)) * 100))
        }
      },
      environmental,
      recommendations,
      warnings: this.generateWarnings(maxSurgeWatts, finalInverter, batteryAh, systemVoltage)
    };
  }

  calculateSurgeFactor(applianceName, wattage) {
    const name = applianceName.toLowerCase();
    
    // High-surge motors and pumps
    if (name.includes('pump') || name.includes('compressor')) return 5.0;
    if (name.includes('drill') || name.includes('grinder')) return 4.5;
    if (name.includes('fan') || name.includes('motor')) return 4.0;
    
    // Refrigeration and AC
    if (name.includes('fridge') || name.includes('freezer')) return 3.0;
    if (name.includes('ac') || name.includes('air con')) return 3.5;
    
    // Heating elements and resistive loads
    if (name.includes('heater') || name.includes('iron') || name.includes('kettle')) return 1.2;
    
    // Electronics (minimal surge)
    if (name.includes('tv') || name.includes('computer') || name.includes('led') || name.includes('laptop')) return 1.1;
    
    // Medical equipment (conservative estimate)
    if (name.includes('medical') || name.includes('oxygen') || name.includes('monitor')) return 1.5;
    
    // Default moderate surge
    return 1.3;
  }

  getBatterySpecs(batteryType) {
    const specs = {
      lithium: { dod: 0.80, cycles: 6000, costPerAh: 1200, warranty: 10 },
      gel: { dod: 0.50, cycles: 1200, costPerAh: 450, warranty: 5 },
      agm: { dod: 0.50, cycles: 800, costPerAh: 380, warranty: 3 },
      tubular: { dod: 0.60, cycles: 1500, costPerAh: 320, warranty: 4 }
    };
    
    return specs[batteryType] || specs.lithium;
  }

  calculateCableSizing(panelCount, panelWattage = 450, distanceMeters = 20, systemVoltage = 24) {
    const totalArrayWatts = panelCount * panelWattage;
    const COPPER_RESISTIVITY = 0.0175;
    const roundTripDistance = 2 * distanceMeters;

    const isHighVoltage = totalArrayWatts >= 1500 || panelCount >= 4;
    const architecture = isHighVoltage ? 'high-voltage' : 'low-voltage';

    const stringVoltage = isHighVoltage 
      ? Math.min(panelCount * 42, 380) 
      : Math.max(systemVoltage * 1.5, 42);

    const operatingCurrent = isHighVoltage 
      ? Math.max(totalArrayWatts / stringVoltage, 10.5) 
      : Math.max(totalArrayWatts / stringVoltage, 18.0);

    const standardGauges = [4, 6, 10, 16, 25];
    let selectedGauge = 4;
    let voltageDropPct = 5.0;

    for (const gauge of standardGauges) {
      const resistance = (COPPER_RESISTIVITY * roundTripDistance) / gauge;
      const voltageDrop = operatingCurrent * resistance;
      const dropPct = (voltageDrop / stringVoltage) * 100;
      selectedGauge = gauge;
      voltageDropPct = parseFloat(dropPct.toFixed(1));
      if (voltageDropPct <= 2.5) break;
    }

    const batteryCableGauge = systemVoltage >= 48 ? '35 mm² Flexible Copper' : (systemVoltage >= 24 ? '50 mm² Flexible Copper' : '70 mm² Flexible Copper');

    return {
      recommendedGaugeMm2: selectedGauge,
      voltageDropPct,
      architecture,
      recommendedStringVoc: Math.round(stringVoltage * 1.18),
      operatingCurrentAmps: parseFloat(operatingCurrent.toFixed(1)),
      bosBreakdown: {
        solarCableMeters: Math.round(distanceMeters * 2 * 1.15),
        solarCableGauge: `${selectedGauge} mm² Double-Insulated PV Cable`,
        batteryCableGauge,
        dcBreakers: `${Math.ceil(operatingCurrent * 1.25)}A DC Breaker & Isolator`,
        acSurgeProtection: 'Type II AC Surge Protection Device (SPD)',
        dcSurgeProtection: `${Math.round(stringVoltage * 1.3)}V DC Surge Protection Device (SPD)`
      }
    };
  }

  calculateCosts(panelQty, inverterW, batteryAh, voltage, controllerA, batteryType, cableMeters = 40) {
    const batteryCapacityKwh = (batteryAh * voltage) / 1000;
    
    // 1. Solar Panels (Tier-1 Monocrystalline 450W - 550W in Nigeria: ~₦135,000 - ₦145,000 each)
    const panelsCost = panelQty * 140000;

    // 2. Hybrid Inverter (Pure sine wave with integrated MPPT in Nigeria: ~₦240 - ₦280 per Watt)
    let inverterCost = 450000;
    if (inverterW <= 1200) inverterCost = 300000;
    else if (inverterW <= 1800) inverterCost = 420000;
    else if (inverterW <= 2600) inverterCost = 620000;
    else if (inverterW <= 3800) inverterCost = 880000;
    else if (inverterW <= 5500) inverterCost = 1250000;
    else inverterCost = Math.round(inverterW * 240);

    // 3. Battery Storage (LiFePO4 wall mount ~₦290,000 per kWh; Tubular ~₦145,000 per gross kWh)
    let batteryCost = 0;
    if (batteryType === 'lithium') {
      batteryCost = Math.round(batteryCapacityKwh * 290000);
    } else {
      batteryCost = Math.round(batteryCapacityKwh * 145000);
    }

    // 4. MPPT Charge Controller (Integrated into Hybrid Inverters >= 2500W; discrete controller for smaller)
    const controllerCost = inverterW >= 2500 ? 0 : Math.round(controllerA * 1200);

    // 5. BoS, DC/AC Switchgear, Breakers, Cables, Surge Protection (SPD)
    const accessoriesCost = Math.round((cableMeters * 2800) + 160000);

    // 6. Professional Installation, Mounting Rails, Earthing & Commissioning
    const installationCost = Math.round((panelQty * 16000) + 180000);

    return {
      panels: panelsCost,
      inverter: inverterCost,
      batteries: batteryCost,
      controller: controllerCost,
      installation: installationCost,
      accessories: accessoriesCost
    };
  }

  calculateEnvironmentalImpact(dailyEnergyWh) {
    const annualEnergyKwh = (dailyEnergyWh / 1000) * 365;
    const co2FactorNigeria = 0.5; // kg CO2 per kWh from grid
    
    return {
      co2SavedAnnually: Math.round(annualEnergyKwh * co2FactorNigeria),
      treesEquivalent: Math.round(annualEnergyKwh * co2FactorNigeria / 21),
      coalAvoided: Math.round(annualEnergyKwh * co2FactorNigeria / 2.5),
      lifetimeOffset: Math.round(annualEnergyKwh * co2FactorNigeria * 25)
    };
  }

  generateRecommendations(steadyW, dailyWh, surgeW, inverterW, batteryType) {
    const recs = [];
    
    if (surgeW > inverterW * 1.8) {
      recs.push('⚠️ High surge load detected. Consider upgrading inverter or using soft-start devices.');
    }
    
    if (dailyWh > 15000) {
      recs.push('💡 High consumption. Energy-efficient appliances (inverter AC, LED) will reduce system cost by 30-40%.');
    }
    
    if (batteryType !== 'lithium' && steadyW > 2000) {
      recs.push('🔋 Lithium batteries recommended for this load - better lifespan and efficiency.');
    }
    
    if (dailyWh > 20000) {
      recs.push('☀️ Large solar array required (~20-30 m² roof space). Confirm structural capacity.');
    }
    
    if (steadyW < 500) {
      recs.push('✅ Excellent! Your low power consumption makes this an ideal solar candidate.');
    }
    
    return recs;
  }

  generateWarnings(surgeW, inverterW, batteryAh, voltage) {
    const warnings = [];
    
    if (surgeW > inverterW * 2) {
      warnings.push('Critical: Surge load exceeds inverter capacity. System may trip on startup.');
    }
    
    if (batteryAh > 400 && voltage === 12) {
      warnings.push('Warning: 12V system with very large battery bank. 24V or 48V recommended.');
    }
    
    return warnings;
  }
}

export const energyModel = new EnergyModel();
