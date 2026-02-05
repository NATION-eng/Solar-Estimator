class EnergyModel {
  /**
   * Professional Calculation for Solar System Sizing
   */
  calculateSystem(appliances, dailyHours, peakSunHours) {
    let totalSteadyWatts = 0;
    let maxSurgeWatts = 0;
    let dailyEnergyWh = 0;

    appliances.forEach(app => {
      const steady = app.watt * app.quantity;
      // Surge Factor Matrix: Motor = 5x, Compressor = 3x, Resistive/Elec = 1.2x
      const isMotor = app.name.toLowerCase().includes('pump') || app.name.toLowerCase().includes('fan');
      const isCompressor = app.name.toLowerCase().includes('fridge') || app.name.toLowerCase().includes('ac');
      const factor = isMotor ? 5.0 : (isCompressor ? 3.0 : 1.2);
      
      const surge = (app.watt * factor) * app.quantity;
      
      totalSteadyWatts += steady;
      if (surge > maxSurgeWatts) maxSurgeWatts = surge;
      dailyEnergyWh += (steady * dailyHours);
    });

    // 1. Inverter Sizing (Margin for expansion + surge protection)
    const recommendedInverter = Math.max(totalSteadyWatts * 1.25, maxSurgeWatts);

    // 2. System Voltage Selection (Industry Best Practice)
    let systemVoltage = 12;
    if (recommendedInverter > 1500) systemVoltage = 24;
    if (recommendedInverter > 3000) systemVoltage = 48;

    // 3. Panel Sizing (Wh / PSH / System Efficiency)
    // Efficiency: 0.75 accounts for wiring (3%), mismatch (2%), dirt (5%), and temp (15%)
    const requiredPanelWatts = dailyEnergyWh / peakSunHours / 0.75;
    const panelUnitWattage = 450;
    const panelQuantity = Math.ceil(requiredPanelWatts / panelUnitWattage);

    // 4. Charge Controller Sizing (Amps = Panel Watts / System Voltage)
    const chargeControllerAmps = Math.ceil((panelQuantity * panelUnitWattage) / systemVoltage * 1.2); // 20% margin for MPPT

    // 5. Battery Sizing (Energy Need * Autonomy / DOD / Voltage)
    // Lithium standard: 80% DOD, Lead-Acid: 50%. We assume Lithium for modern "exquisite" systems.
    const batteryCapacityWh = (dailyEnergyWh * 1.25) / 0.8; 
    const batteryAh = Math.ceil(batteryCapacityWh / systemVoltage);

    // 6. Financials (Pricing estimates in Naira based on current market rates)
    const costs = {
      panels: panelQuantity * 280000,
      inverter: recommendedInverter * 550,
      batteries: (batteryAh / 100) * (systemVoltage === 48 ? 1200000 : 450000), // ~200Ah 48V Lithium or 12V Gel
      controller: chargeControllerAmps * 2500,
      installation: (panelQuantity * 25000) + 200000
    };

    const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);

    return {
      technical: {
        totalSteadyWatts,
        maxSurgeWatts,
        dailyEnergyWh,
        recommendedInverter,
        systemVoltage,
        batteryAh,
        chargeControllerAmps,
        panelQuantity,
        panelWattage: panelUnitWattage,
        batteryCapacityWh
      },
      financial: {
        estimatedPriceNaira: totalCost,
        breakdown: costs,
        paybackYears: totalCost / (dailyEnergyWh/1000 * 280 * 365) // Assumes 280 NGN/kWh after recent hikes
      }
    };
  }
}

export const energyModel = new EnergyModel();
