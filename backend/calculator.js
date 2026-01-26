export default function calculator(data) {
  const { appliances, hours } = data;

  if (!appliances || appliances.length === 0) {
    throw new Error("No appliances provided");
  }

  let totalWattage = 0;

  appliances.forEach((item) => {
    totalWattage += item.watt * item.quantity;
  });

  const dailyEnergy = totalWattage * hours;

  const inverterSize = Math.ceil(totalWattage * 1.3);
  const batteryCapacity = Math.ceil(dailyEnergy / 0.8);

  // 💰 SIMPLE PRICE MODEL
  const panelCost = Math.ceil((dailyEnergy / 1000) * 350000);
  const inverterCost = inverterSize * 400;
  const batteryCost = Math.ceil(batteryCapacity / 1000) * 250000;

  const estimatedPrice = panelCost + inverterCost + batteryCost;

  return {
    totalLoadWatts: totalWattage,
    dailyEnergyWh: dailyEnergy,
    recommendedInverterW: inverterSize,
    batteryCapacityWh: batteryCapacity,
    estimatedPriceNaira: estimatedPrice,
  };
}
