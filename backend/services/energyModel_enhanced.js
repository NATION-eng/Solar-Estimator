class EnergyModel {
  /**
   * Professional Calculation for Solar System Sizing
   * Enhanced with surge logic, battery chemistry, DC cable sizing and environmental metrics
   */
  calculateSystem(appliances, dailyHours, peakSunHours, batteryType = 'lithium', distanceMeters = 20) {
    let totalSteadyWatts = 0;
    let maxSurgeWatts = 0;
    let dailyEnergyWh = 0;

    // Process each appliance with enhanced surge detection
    appliances.forEach(app => {
      const steady = app.watt * app.quantity;
      
      // Enhanced Surge Factor Matrix
      const surgeFactor = app.surgeFactor || this.calculateSurgeFactor(app.name, app.watt);
      const surge = (app.watt * surgeFactor) * app.quantity;
      
      totalSteadyWatts += steady;
      if (surge > maxSurgeWatts) maxSurgeWatts = surge;
      
      // Use individual hours if specified, otherwise use global
      const hours = app.hours || dailyHours;
      dailyEnergyWh += (steady * hours);
    });

    // 1. Inverter Sizing (Must handle both continuous and surge loads)
    const continuousRating = totalSteadyWatts * 1.25; // 25% safety margin
    const recommendedInverter = Math.max(continuousRating, maxSurgeWatts * 0.6); // Surge should be within 60% of peak
    
    // Round to nearest standard inverter size
    const standardSizes = [1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 20000];
    const finalInverter = standardSizes.find(size => size >= recommendedInverter) || Math.ceil(recommendedInverter / 1000) * 1000;

    // 2. System Voltage Selection (Industry Best Practice)
    let systemVoltage = 12;
    if (finalInverter > 1500) systemVoltage = 24;
    if (finalInverter > 3000) systemVoltage = 48;

    // 3. Panel Sizing (Comprehensive efficiency model)
    const systemEfficiency = 0.92 * 0.97 * 0.98 * 0.95; // inverter * wiring * mppt * panel losses
    const requiredPanelWatts = dailyEnergyWh / peakSunHours / systemEfficiency;
    const panelUnitWattage = 450; // Modern monocrystalline
    const panelQuantity = Math.ceil(requiredPanelWatts / panelUnitWattage);

    // 4. Charge Controller Sizing (MPPT with safety margin)
    const totalPanelWattage = panelQuantity * panelUnitWattage;
    const chargeControllerAmps = Math.ceil((totalPanelWattage / systemVoltage) * 1.25);

    // 5. Battery Sizing (Depends on chemistry)
    const batterySpecs = this.getBatterySpecs(batteryType);
    const autonomyDays = 1.25; // ~30 hours backup
    const batteryCapacityWh = (dailyEnergyWh * autonomyDays) / batterySpecs.dod / 0.85; // 85% inverter efficiency
    const batteryAh = Math.ceil(batteryCapacityWh / systemVoltage);

    // 6. DC Cable Sizing & Electrical Architecture
    const cableSpec = this.calculateCableSizing(panelQuantity, panelUnitWattage, distanceMeters, systemVoltage);

    // 7. Financials (Market-accurate Nigerian pricing 2026)
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
    const gridTariff = 280; // NGN per kWh (Q1 2026 average)
    const annualGridCost = (dailyEnergyWh / 1000) * gridTariff * 365;
    const annualMaintenanceCost = totalCost * 0.015;
    const annualSavings = annualGridCost - annualMaintenanceCost;
    const paybackYears = totalCost / annualSavings;

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
        dailyEnergyWh,
        recommendedInverter: finalInverter,
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
        monthlySavings: annualSavings / 12,
        annualSavings,
        gridCostComparison: {
          monthlyGridCost: annualGridCost / 12,
          monthlySolarCost: annualMaintenanceCost / 12,
          savingsPercent: ((annualSavings / annualGridCost) * 100)
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
    const batterySpec = this.getBatterySpecs(batteryType);
    
    return {
      panels: panelQty * 280000, // 450W monocrystalline panel
      inverter: inverterW * 550, // Pure sine wave inverter
      batteries: (batteryAh * batterySpec.costPerAh * voltage) / 100,
      controller: controllerA * 2500, // MPPT charge controller
      installation: Math.max((panelQty * 25000) + 200000, 350000), // Labor + mounting
      accessories: Math.round((cableMeters * 3200) + 120000) // Cables, breakers, disconnect switches, SPD
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
