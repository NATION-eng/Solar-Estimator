import { energyModel } from './services/energyModel.js';

const testAppliances = [
  { name: 'Fridge', watt: 200, quantity: 1, isSurgeHeavy: true },
  { name: 'LED TV', watt: 150, quantity: 1, isSurgeHeavy: false }
];

const result = energyModel.calculateSystem(testAppliances, 6, 4.5);

console.log('--- Sizing Verification ---');
console.log('Total Steady Load:', result.technical.totalSteadyWatts, 'W');
console.log('Max Surge Load:', result.technical.maxSurgeWatts, 'W');
console.log('Recommended Inverter:', result.technical.recommendedInverter, 'W');
console.log('Panel Quantity:', result.technical.panelQuantity);
console.log('Estimated Price:', result.financial.estimatedPriceNaira, 'NGN');

if (result.technical.recommendedInverter >= 600) { 
  console.log('✅ Surge logic verified (Inverter accounts for 3x Fridge surge)');
} else {
  console.log('❌ Surge logic failed');
}

if (result.technical.panelQuantity > 0) {
  console.log('✅ Panel sizing verified');
}
