/**
 * Comprehensive Appliance Database
 * Real-world power consumption data with surge factors
 */

export type ApplianceCategory = 
  | 'lighting' 
  | 'cooling' 
  | 'heating' 
  | 'kitchen' 
  | 'entertainment' 
  | 'computing' 
  | 'medical' 
  | 'tools'
  | 'office';

export interface ApplianceSpec {
  id: string;
  name: string;
  category: ApplianceCategory;
  wattage: number;
  surgeFactor: number;
  typicalHours: number;
  description?: string;
  icon?: string;
}

export const APPLIANCE_DATABASE: ApplianceSpec[] = [
  // ==================== LIGHTING (20+ items) ====================
  { id: 'led-5w', name: 'LED Bulb (5W)', category: 'lighting', wattage: 5, surgeFactor: 1.1, typicalHours: 6, icon: '💡', description: 'Energy-saving LED' },
  { id: 'led-9w', name: 'LED Bulb (9W)', category: 'lighting', wattage: 9, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'led-12w', name: 'LED Bulb (12W)', category: 'lighting', wattage: 12, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'led-15w', name: 'LED Bulb (15W)', category: 'lighting', wattage: 15, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'led-20w', name: 'LED Bulb (20W)', category: 'lighting', wattage: 20, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'led-tube-18w', name: 'LED Tube (18W)', category: 'lighting', wattage: 18, surgeFactor: 1.1, typicalHours: 8, icon: '💡' },
  { id: 'led-tube-36w', name: 'LED Tube (36W)', category: 'lighting', wattage: 36, surgeFactor: 1.1, typicalHours: 8, icon: '💡' },
  { id: 'cfl-15w', name: 'CFL Bulb (15W)', category: 'lighting', wattage: 15, surgeFactor: 1.2, typicalHours: 6, icon: '💡' },
  { id: 'cfl-25w', name: 'CFL Bulb (25W)', category: 'lighting', wattage: 25, surgeFactor: 1.2, typicalHours: 6, icon: '💡' },
  { id: 'outdoor-flood-30w', name: 'LED Floodlight (30W)', category: 'lighting', wattage: 30, surgeFactor: 1.1, typicalHours: 10, icon: '🔦' },
  { id: 'outdoor-flood-50w', name: 'LED Floodlight (50W)', category: 'lighting', wattage: 50, surgeFactor: 1.1, typicalHours: 10, icon: '🔦' },
  { id: 'outdoor-flood-100w', name: 'LED Floodlight (100W)', category: 'lighting', wattage: 100, surgeFactor: 1.1, typicalHours: 10, icon: '🔦' },
  { id: 'security-light', name: 'Motion Security Light', category: 'lighting', wattage: 20, surgeFactor: 1.1, typicalHours: 4, icon: '🔦' },
  { id: 'street-light', name: 'Street Light LED', category: 'lighting', wattage: 60, surgeFactor: 1.1, typicalHours: 12, icon: '🔦' },
  { id: 'chandelier', name: 'LED Chandelier', category: 'lighting', wattage: 80, surgeFactor: 1.1, typicalHours: 5, icon: '💡' },
  { id: 'desk-lamp', name: 'Desk Lamp LED', category: 'lighting', wattage: 10, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'reading-lamp', name: 'Reading Lamp', category: 'lighting', wattage: 8, surgeFactor: 1.1, typicalHours: 4, icon: '💡' },
  { id: 'strip-lights', name: 'LED Strip Lights (5m)', category: 'lighting', wattage: 24, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'emergency-light', name: 'Emergency Light', category: 'lighting', wattage: 15, surgeFactor: 1.1, typicalHours: 1, icon: '🔦' },
  { id: 'solar-light', name: 'Solar Garden Light', category: 'lighting', wattage: 5, surgeFactor: 1.0, typicalHours: 8, icon: '☀️' },
  
  // ==================== COOLING & CLIMATE (25+ items) ====================
  { id: 'ceiling-fan-small', name: 'Ceiling Fan (Small)', category: 'cooling', wattage: 60, surgeFactor: 4.5, typicalHours: 8, icon: '🌀' },
  { id: 'ceiling-fan', name: 'Ceiling Fan (Standard)', category: 'cooling', wattage: 75, surgeFactor: 4.5, typicalHours: 8, icon: '🌀' },
  { id: 'ceiling-fan-large', name: 'Ceiling Fan (Large)', category: 'cooling', wattage: 90, surgeFactor: 4.5, typicalHours: 8, icon: '🌀' },
  { id: 'standing-fan-12', name: 'Standing Fan 12"', category: 'cooling', wattage: 45, surgeFactor: 4.0, typicalHours: 6, icon: '🌪️' },
  { id: 'standing-fan-16', name: 'Standing Fan 16"', category: 'cooling', wattage: 55, surgeFactor: 4.0, typicalHours: 6, icon: '🌪️' },
  { id: 'standing-fan-18', name: 'Standing Fan 18"', category: 'cooling', wattage: 65, surgeFactor: 4.0, typicalHours: 6, icon: '🌪️' },
  { id: 'table-fan', name: 'Table Fan', category: 'cooling', wattage: 35, surgeFactor: 3.5, typicalHours: 6, icon: '🌪️' },
  { id: 'wall-fan', name: 'Wall Fan', category: 'cooling', wattage: 50, surgeFactor: 4.0, typicalHours: 8, icon: '🌪️' },
  { id: 'exhaust-fan', name: 'Exhaust Fan', category: 'cooling', wattage: 40, surgeFactor: 3.5, typicalHours: 4, icon: '🌪️' },
  { id: 'ac-0.75hp', name: 'AC 0.75HP Window', category: 'cooling', wattage: 560, surgeFactor: 3.5, typicalHours: 5, icon: '❄️' },
  { id: 'ac-1hp-window', name: 'AC 1HP Window', category: 'cooling', wattage: 746, surgeFactor: 3.5, typicalHours: 5, icon: '❄️' },
  { id: 'ac-1hp', name: 'AC 1HP Inverter', category: 'cooling', wattage: 746, surgeFactor: 3.5, typicalHours: 5, icon: '❄️', description: 'Energy-efficient inverter' },
  { id: 'ac-1.5hp-window', name: 'AC 1.5HP Window', category: 'cooling', wattage: 1119, surgeFactor: 3.5, typicalHours: 5, icon: '❄️' },
  { id: 'ac-1.5hp', name: 'AC 1.5HP Inverter', category: 'cooling', wattage: 1100, surgeFactor: 3.5, typicalHours: 5, icon: '❄️' },
  { id: 'ac-2hp-window', name: 'AC 2HP Window', category: 'cooling', wattage: 1492, surgeFactor: 3.5, typicalHours: 4, icon: '❄️' },
  { id: 'ac-2hp', name: 'AC 2HP Inverter', category: 'cooling', wattage: 1400, surgeFactor: 3.5, typicalHours: 4, icon: '❄️' },
  { id: 'ac-2.5hp', name: 'AC 2.5HP Inverter', category: 'cooling', wattage: 1865, surgeFactor: 3.5, typicalHours: 4, icon: '❄️' },
  { id: 'ac-3hp', name: 'AC 3HP Inverter', category: 'cooling', wattage: 2238, surgeFactor: 3.5, typicalHours: 4, icon: '❄️' },
  { id: 'portable-ac', name: 'Portable AC Unit', category: 'cooling', wattage: 1000, surgeFactor: 3.0, typicalHours: 4, icon: '❄️' },
  { id: 'air-cooler', name: 'Air Cooler/Humidifier', category: 'cooling', wattage: 150, surgeFactor: 2.0, typicalHours: 6, icon: '💨' },
  { id: 'dehumidifier', name: 'Dehumidifier', category: 'cooling', wattage: 300, surgeFactor: 2.0, typicalHours: 4, icon: '💧' },
  
  // ==================== REFRIGERATION (15+ items) ====================
  { id: 'fridge-mini', name: 'Mini Fridge', category: 'kitchen', wattage: 80, surgeFactor: 3.0, typicalHours: 24, icon: '🧊' },
  { id: 'fridge-small', name: 'Small Refrigerator (Inverter)', category: 'kitchen', wattage: 120, surgeFactor: 3.0, typicalHours: 24, icon: '🧊' },
  { id: 'fridge-medium', name: 'Medium Refrigerator', category: 'kitchen', wattage: 200, surgeFactor: 3.0, typicalHours: 24, icon: '❄️' },
  { id: 'fridge-large', name: 'Large Fridge/Freezer', category: 'kitchen', wattage: 350, surgeFactor: 3.2, typicalHours: 24, icon: '❄️' },
  { id: 'fridge-double-door', name: 'Double Door Refrigerator', category: 'kitchen', wattage: 400, surgeFactor: 3.2, typicalHours: 24, icon: '❄️' },
  { id: 'fridge-side-by-side', name: 'Side-by-Side Refrigerator', category: 'kitchen', wattage: 500, surgeFactor: 3.2, typicalHours: 24, icon: '❄️' },
  { id: 'chest-freezer-small', name: 'Chest Freezer (Small)', category: 'kitchen', wattage: 150, surgeFactor: 3.0, typicalHours: 24, icon: '🧊' },
  { id: 'chest-freezer', name: 'Chest Freezer (Medium)', category: 'kitchen', wattage: 250, surgeFactor: 3.0, typicalHours: 24, icon: '🧊' },
  { id: 'chest-freezer-large', name: 'Chest Freezer (Large)', category: 'kitchen', wattage: 400, surgeFactor: 3.2, typicalHours: 24, icon: '🧊' },
  { id: 'upright-freezer', name: 'Upright Freezer', category: 'kitchen', wattage: 300, surgeFactor: 3.0, typicalHours: 24, icon: '🧊' },
  { id: 'wine-cooler', name: 'Wine Cooler', category: 'kitchen', wattage: 100, surgeFactor: 2.5, typicalHours: 24, icon: '🍷' },
  { id: 'ice-maker', name: 'Ice Maker Machine', category: 'kitchen', wattage: 200, surgeFactor: 2.5, typicalHours: 8, icon: '🧊' },
  { id: 'vaccine-fridge', name: 'Vaccine Refrigerator', category: 'medical', wattage: 300, surgeFactor: 3.0, typicalHours: 24, icon: '⚕️', description: 'Medical-grade' },
  { id: 'display-fridge', name: 'Display Refrigerator', category: 'kitchen', wattage: 350, surgeFactor: 3.0, typicalHours: 24, icon: '🏪' },
  
  // ==================== ENTERTAINMENT (20+ items) ====================
  { id: 'tv-24', name: 'LED TV 24"', category: 'entertainment', wattage: 35, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-32', name: 'LED TV 32"', category: 'entertainment', wattage: 45, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-40', name: 'LED TV 40"', category: 'entertainment', wattage: 55, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-43', name: 'LED TV 43"', category: 'entertainment', wattage: 65, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-50', name: 'LED TV 50"', category: 'entertainment', wattage: 75, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-55', name: 'LED TV 55"', category: 'entertainment', wattage: 85, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-65', name: 'Smart TV 65"', category: 'entertainment', wattage: 120, surgeFactor: 1.2, typicalHours: 4, icon: '📺' },
  { id: 'tv-75', name: 'Smart TV 75"', category: 'entertainment', wattage: 180, surgeFactor: 1.2, typicalHours: 4, icon: '📺' },
  { id: 'sound-system-small', name: 'Soundbar', category: 'entertainment', wattage: 80, surgeFactor: 1.2, typicalHours: 3, icon: '🔊' },
  { id: 'sound-system', name: 'Home Theater System', category: 'entertainment', wattage: 200, surgeFactor: 1.3, typicalHours: 3, icon: '🔊' },
  { id: 'sound-system-large', name: 'Professional Sound System', category: 'entertainment', wattage: 500, surgeFactor: 1.5, typicalHours: 3, icon: '🔊' },
  { id: 'decoder-dstv', name: 'DSTV Decoder', category: 'entertainment', wattage: 15, surgeFactor: 1.1, typicalHours: 6, icon: '📡' },
  { id: 'decoder-gotv', name: 'GOtv Decoder', category: 'entertainment', wattage: 12, surgeFactor: 1.1, typicalHours: 6, icon: '📡' },
  { id: 'decoder-startimes', name: 'StarTimes Decoder', category: 'entertainment', wattage: 10, surgeFactor: 1.1, typicalHours: 6, icon: '📡' },
  { id: 'game-console', name: 'Gaming Console (PS/Xbox)', category: 'entertainment', wattage: 150, surgeFactor: 1.2, typicalHours: 3, icon: '🎮' },
  { id: 'dvd-player', name: 'DVD/Blu-ray Player', category: 'entertainment', wattage: 25, surgeFactor: 1.1, typicalHours: 2, icon: '📀' },
  { id: 'amplifier', name: 'Audio Amplifier', category: 'entertainment', wattage: 300, surgeFactor: 1.3, typicalHours: 3, icon: '🔊' },
  { id: 'subwoofer', name: 'Powered Subwoofer', category: 'entertainment', wattage: 150, surgeFactor: 1.2, typicalHours: 3, icon: '🔊' },
  { id: 'karaoke', name: 'Karaoke Machine', category: 'entertainment', wattage: 100, surgeFactor: 1.2, typicalHours: 2, icon: '🎤' },
  
  // ==================== COMPUTING (20+ items) ====================
  { id: 'laptop-basic', name: 'Laptop (Basic)', category: 'computing', wattage: 45, surgeFactor: 1.1, typicalHours: 8, icon: '💻' },
  { id: 'laptop', name: 'Laptop (Standard)', category: 'computing', wattage: 65, surgeFactor: 1.1, typicalHours: 8, icon: '💻' },
  { id: 'laptop-gaming', name: 'Gaming Laptop', category: 'computing', wattage: 180, surgeFactor: 1.2, typicalHours: 6, icon: '💻' },
  { id: 'desktop-basic', name: 'Desktop PC (Basic)', category: 'computing', wattage: 150, surgeFactor: 1.2, typicalHours: 8, icon: '🖥️' },
  { id: 'desktop', name: 'Desktop Computer', category: 'computing', wattage: 200, surgeFactor: 1.2, typicalHours: 8, icon: '🖥️' },
  { id: 'desktop-gaming', name: 'Gaming PC', category: 'computing', wattage: 350, surgeFactor: 1.3, typicalHours: 6, icon: '🖥️' },
  { id: 'workstation', name: 'Workstation PC (High-end)', category: 'computing', wattage: 400, surgeFactor: 1.3, typicalHours: 8, icon: '🖥️' },
  { id: 'all-in-one', name: 'All-in-One PC', category: 'computing', wattage: 120, surgeFactor: 1.2, typicalHours: 8, icon: '🖥️' },
  { id: 'monitor-19', name: 'LCD Monitor 19"', category: 'computing', wattage: 20, surgeFactor: 1.1, typicalHours: 8, icon: '🖥️' },
  { id: 'monitor-24', name: 'LCD Monitor 24"', category: 'computing', wattage: 25, surgeFactor: 1.1, typicalHours: 8, icon: '🖥️' },
  { id: 'monitor-27', name: 'LCD Monitor 27"', category: 'computing', wattage: 35, surgeFactor: 1.1, typicalHours: 8, icon: '🖥️' },
  { id: 'monitor-32', name: 'LCD Monitor 32"', category: 'computing', wattage: 50, surgeFactor: 1.1, typicalHours: 8, icon: '🖥️' },
  { id: 'router-basic', name: 'WiFi Router (Basic)', category: 'computing', wattage: 8, surgeFactor: 1.1, typicalHours: 24, icon: '📡' },
  { id: 'router', name: 'WiFi Router (Standard)', category: 'computing', wattage: 12, surgeFactor: 1.1, typicalHours: 24, icon: '📡' },
  { id: 'router-mesh', name: 'Mesh WiFi System', category: 'computing', wattage: 20, surgeFactor: 1.1, typicalHours: 24, icon: '📡' },
  { id: 'modem', name: 'Internet Modem', category: 'computing', wattage: 10, surgeFactor: 1.1, typicalHours: 24, icon: '📡' },
  { id: 'nas', name: 'NAS Storage Server', category: 'computing', wattage: 60, surgeFactor: 1.2, typicalHours: 24, icon: '💾' },
  { id: 'external-hdd', name: 'External Hard Drive', category: 'computing', wattage: 10, surgeFactor: 1.1, typicalHours: 8, icon: '💾' },
  { id: 'ups-small', name: 'UPS (650VA)', category: 'computing', wattage: 50, surgeFactor: 1.1, typicalHours: 24, icon: '🔋' },
  { id: 'ups-medium', name: 'UPS (1000VA)', category: 'computing', wattage: 80, surgeFactor: 1.1, typicalHours: 24, icon: '🔋' },
  
  // ==================== KITCHEN APPLIANCES (30+ items) ====================
  { id: 'microwave-small', name: 'Microwave (20L)', category: 'kitchen', wattage: 800, surgeFactor: 1.2, typicalHours: 0.5, icon: '🔥' },
  { id: 'microwave', name: 'Microwave (28L)', category: 'kitchen', wattage: 1000, surgeFactor: 1.2, typicalHours: 0.5, icon: '🔥' },
  { id: 'microwave-large', name: 'Microwave (42L)', category: 'kitchen', wattage: 1400, surgeFactor: 1.2, typicalHours: 0.5, icon: '🔥' },
  { id: 'oven-electric', name: 'Electric Oven', category: 'kitchen', wattage: 2400, surgeFactor: 1.2, typicalHours: 1, icon: '🔥' },
  { id: 'gas-cooker-electric', name: 'Gas Cooker (Electric Ignition)', category: 'kitchen', wattage: 50, surgeFactor: 1.1, typicalHours: 2, icon: '🔥' },
  { id: 'induction-cooker', name: 'Induction Cooker', category: 'kitchen', wattage: 2000, surgeFactor: 1.1, typicalHours: 1, icon: '🔥' },
  { id: 'electric-stove-single', name: 'Electric Stove (Single)', category: 'kitchen', wattage: 1000, surgeFactor: 1.1, typicalHours: 1, icon: '🔥' },
  { id: 'electric-stove-double', name: 'Electric Stove (Double)', category: 'kitchen', wattage: 2000, surgeFactor: 1.1, typicalHours: 1, icon: '🔥' },
  { id: 'blender-small', name: 'Blender (Small)', category: 'kitchen', wattage: 300, surgeFactor: 2.5, typicalHours: 0.2, icon: '🔄' },
  { id: 'blender', name: 'Blender (Standard)', category: 'kitchen', wattage: 450, surgeFactor: 2.5, typicalHours: 0.2, icon: '🔄' },
  { id: 'blender-commercial', name: 'Commercial Blender', category: 'kitchen', wattage: 1000, surgeFactor: 2.5, typicalHours: 0.5, icon: '🔄' },
  { id: 'food-processor', name: 'Food Processor', category: 'kitchen', wattage: 600, surgeFactor: 2.0, typicalHours: 0.3, icon: '🔄' },
  { id: 'mixer', name: 'Stand Mixer', category: 'kitchen', wattage: 300, surgeFactor: 2.0, typicalHours: 0.5, icon: '🔄' },
  { id: 'juicer', name: 'Juice Extractor', category: 'kitchen', wattage: 400, surgeFactor: 2.0, typicalHours: 0.2, icon: '🥤' },
  { id: 'water-dispenser-cold', name: 'Water Dispenser (Cold Only)', category: 'kitchen', wattage: 80, surgeFactor: 1.2, typicalHours: 12, icon: '💧' },
  { id: 'water-dispenser', name: 'Water Dispenser (Hot/Cold)', category: 'kitchen', wattage: 600, surgeFactor: 1.3, typicalHours: 12, icon: '💧' },
  { id: 'kettle-small', name: 'Electric Kettle (1.5L)', category: 'kitchen', wattage: 1500, surgeFactor: 1.1, typicalHours: 0.3, icon: '☕' },
  { id: 'kettle', name: 'Electric Kettle (1.8L)', category: 'kitchen', wattage: 1800, surgeFactor: 1.1, typicalHours: 0.3, icon: '☕' },
  { id: 'kettle-large', name: 'Electric Kettle (2.5L)', category: 'kitchen', wattage: 2200, surgeFactor: 1.1, typicalHours: 0.3, icon: '☕' },
  { id: 'toaster-2slice', name: 'Toaster (2-Slice)', category: 'kitchen', wattage: 800, surgeFactor: 1.2, typicalHours: 0.2, icon: '🍞' },
  { id: 'toaster', name: 'Toaster (4-Slice)', category: 'kitchen', wattage: 900, surgeFactor: 1.2, typicalHours: 0.2, icon: '🍞' },
  { id: 'sandwich-maker', name: 'Sandwich Maker', category: 'kitchen', wattage: 750, surgeFactor: 1.2, typicalHours: 0.2, icon: '🥪' },
  { id: 'rice-cooker-small', name: 'Rice Cooker (1.5L)', category: 'kitchen', wattage: 500, surgeFactor: 1.2, typicalHours: 1, icon: '🍚' },
  { id: 'rice-cooker', name: 'Rice Cooker (2.8L)', category: 'kitchen', wattage: 700, surgeFactor: 1.2, typicalHours: 1, icon: '🍚' },
  { id: 'rice-cooker-large', name: 'Rice Cooker (5L)', category: 'kitchen', wattage: 1000, surgeFactor: 1.2, typicalHours: 1, icon: '🍚' },
  { id: 'slow-cooker', name: 'Slow Cooker', category: 'kitchen', wattage: 200, surgeFactor: 1.1, typicalHours: 6, icon: '🍲' },
  { id: 'pressure-cooker', name: 'Electric Pressure Cooker', category: 'kitchen', wattage: 1000, surgeFactor: 1.2, typicalHours: 1, icon: '🍲' },
  { id: 'air-fryer', name: 'Air Fryer', category: 'kitchen', wattage: 1400, surgeFactor: 1.2, typicalHours: 0.5, icon: '🍟' },
  { id: 'deep-fryer', name: 'Deep Fryer', category: 'kitchen', wattage: 1800, surgeFactor: 1.2, typicalHours: 0.5, icon: '🍟' },
  { id: 'coffee-maker', name: 'Coffee Maker', category: 'kitchen', wattage: 900, surgeFactor: 1.2, typicalHours: 0.5, icon: '☕' },
  { id: 'dishwasher', name: 'Dishwasher', category: 'kitchen', wattage: 1800, surgeFactor: 1.3, typicalHours: 1, icon: '🍽️' },
  { id: 'garbage-disposal', name: 'Garbage Disposal', category: 'kitchen', wattage: 500, surgeFactor: 3.0, typicalHours: 0.1, icon: '🗑️' },
  
  // ==================== OFFICE EQUIPMENT (15+ items) ====================
  { id: 'printer-inkjet', name: 'Inkjet Printer', category: 'office', wattage: 30, surgeFactor: 1.2, typicalHours: 2, icon: '🖨️' },
  { id: 'printer', name: 'Laser Printer', category: 'office', wattage: 450, surgeFactor: 1.5, typicalHours: 2, icon: '🖨️' },
  { id: 'printer-color', name: 'Color Laser Printer', category: 'office', wattage: 600, surgeFactor: 1.5, typicalHours: 2, icon: '🖨️' },
  { id: 'photocopier-small', name: 'Photocopier (Small)', category: 'office', wattage: 400, surgeFactor: 1.5, typicalHours: 4, icon: '📄' },
  { id: 'photocopier', name: 'Photocopier (Standard)', category: 'office', wattage: 600, surgeFactor: 1.5, typicalHours: 4, icon: '📄' },
  { id: 'photocopier-large', name: 'Photocopier (Large)', category: 'office', wattage: 1500, surgeFactor: 1.5, typicalHours: 6, icon: '📄' },
  { id: 'projector-portable', name: 'Portable Projector', category: 'office', wattage: 150, surgeFactor: 1.2, typicalHours: 3, icon: '📽️' },
  { id: 'projector', name: 'Smart Projector', category: 'office', wattage: 250, surgeFactor: 1.2, typicalHours: 3, icon: '📽️' },
  { id: 'projector-commercial', name: 'Commercial Projector', category: 'office', wattage: 400, surgeFactor: 1.2, typicalHours: 4, icon: '📽️' },
  { id: 'scanner', name: 'Document Scanner', category: 'office', wattage: 30, surgeFactor: 1.2, typicalHours: 2, icon: '📄' },
  { id: 'shredder-small', name: 'Paper Shredder (Small)', category: 'office', wattage: 150, surgeFactor: 2.0, typicalHours: 0.5, icon: '📄' },
  { id: 'shredder', name: 'Paper Shredder (Standard)', category: 'office', wattage: 200, surgeFactor: 2.0, typicalHours: 0.5, icon: '📄' },
  { id: 'laminator', name: 'Laminating Machine', category: 'office', wattage: 400, surgeFactor: 1.2, typicalHours: 1, icon: '📄' },
  { id: 'binding-machine', name: 'Binding Machine', category: 'office', wattage: 300, surgeFactor: 1.3, typicalHours: 1, icon: '📚' },
  { id: 'label-printer', name: 'Label Printer', category: 'office', wattage: 50, surgeFactor: 1.2, typicalHours: 2, icon: '🏷️' },
  
  // ==================== MEDICAL EQUIPMENT (10+ items) ====================
  { id: 'oxygen-concentrator', name: 'Oxygen Concentrator', category: 'medical', wattage: 600, surgeFactor: 2.0, typicalHours: 24, icon: '⚕️', description: 'Critical medical device' },
  { id: 'nebulizer', name: 'Nebulizer', category: 'medical', wattage: 120, surgeFactor: 1.3, typicalHours: 1, icon: '⚕️' },
  { id: 'vital-monitor', name: 'Vital Signs Monitor', category: 'medical', wattage: 150, surgeFactor: 1.2, typicalHours: 24, icon: '⚕️' },
  { id: 'surgical-light', name: 'Surgical Light', category: 'medical', wattage: 100, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'autoclave', name: 'Autoclave Sterilizer', category: 'medical', wattage: 1500, surgeFactor: 1.3, typicalHours: 2, icon: '⚕️' },
  { id: 'ultrasound', name: 'Ultrasound Machine', category: 'medical', wattage: 500, surgeFactor: 1.2, typicalHours: 4, icon: '⚕️' },
  { id: 'xray-portable', name: 'Portable X-Ray', category: 'medical', wattage: 1000, surgeFactor: 1.5, typicalHours: 2, icon: '⚕️' },
  { id: 'dental-chair', name: 'Dental Chair Unit', category: 'medical', wattage: 800, surgeFactor: 1.3, typicalHours: 6, icon: '🦷' },
  { id: 'blood-analyzer', name: 'Blood Analyzer', category: 'medical', wattage: 200, surgeFactor: 1.2, typicalHours: 8, icon: '⚕️' },
  { id: 'incubator', name: 'Medical Incubator', category: 'medical', wattage: 400, surgeFactor: 1.2, typicalHours: 24, icon: '⚕️' },
  
  // ==================== TOOLS & MOTORS (25+ items) ====================
  { id: 'water-pump-0.5hp', name: 'Water Pump 0.5HP', category: 'tools', wattage: 373, surgeFactor: 5.0, typicalHours: 2, icon: '💧', description: 'High starting current' },
  { id: 'water-pump-1hp', name: 'Water Pump 1HP', category: 'tools', wattage: 746, surgeFactor: 5.0, typicalHours: 2, icon: '💧' },
  { id: 'water-pump-1.5hp', name: 'Water Pump 1.5HP', category: 'tools', wattage: 1119, surgeFactor: 5.0, typicalHours: 2, icon: '💧' },
  { id: 'water-pump-2hp', name: 'Water Pump 2HP', category: 'tools', wattage: 1492, surgeFactor: 5.0, typicalHours: 2, icon: '💧' },
  { id: 'submersible-pump', name: 'Submersible Pump', category: 'tools', wattage: 800, surgeFactor: 5.0, typicalHours: 3, icon: '💧' },
  { id: 'pressure-washer', name: 'Pressure Washer', category: 'tools', wattage: 1500, surgeFactor: 3.0, typicalHours: 1, icon: '💦' },
  { id: 'washing-machine-semi', name: 'Washing Machine (Semi-Auto)', category: 'tools', wattage: 400, surgeFactor: 3.5, typicalHours: 1, icon: '🧺' },
  { id: 'washing-machine', name: 'Washing Machine (Automatic)', category: 'tools', wattage: 500, surgeFactor: 3.5, typicalHours: 1, icon: '🧺' },
  { id: 'washing-machine-front', name: 'Washing Machine (Front Load)', category: 'tools', wattage: 600, surgeFactor: 3.5, typicalHours: 1, icon: '🧺' },
  { id: 'dryer', name: 'Clothes Dryer', category: 'tools', wattage: 3000, surgeFactor: 1.2, typicalHours: 1, icon: '🧺' },
  { id: 'iron-basic', name: 'Electric Iron (Basic)', category: 'heating', wattage: 1000, surgeFactor: 1.1, typicalHours: 1, icon: '👔' },
  { id: 'iron', name: 'Electric Iron (Steam)', category: 'heating', wattage: 1200, surgeFactor: 1.1, typicalHours: 1, icon: '👔' },
  { id: 'iron-commercial', name: 'Commercial Iron', category: 'heating', wattage: 1800, surgeFactor: 1.1, typicalHours: 4, icon: '👔' },
  { id: 'vacuum-handheld', name: 'Handheld Vacuum', category: 'tools', wattage: 500, surgeFactor: 2.0, typicalHours: 0.5, icon: '🧹' },
  { id: 'vacuum', name: 'Vacuum Cleaner', category: 'tools', wattage: 1000, surgeFactor: 2.0, typicalHours: 0.5, icon: '🧹' },
  { id: 'vacuum-wet-dry', name: 'Wet/Dry Vacuum', category: 'tools', wattage: 1400, surgeFactor: 2.5, typicalHours: 1, icon: '🧹' },
  { id: 'drill', name: 'Electric Drill', category: 'tools', wattage: 600, surgeFactor: 2.5, typicalHours: 1, icon: '🔧' },
  { id: 'grinder', name: 'Angle Grinder', category: 'tools', wattage: 900, surgeFactor: 2.5, typicalHours: 1, icon: '🔧' },
  { id: 'saw-circular', name: 'Circular Saw', category: 'tools', wattage: 1200, surgeFactor: 2.5, typicalHours: 1, icon: '🔧' },
  { id: 'compressor', name: 'Air Compressor', category: 'tools', wattage: 1500, surgeFactor: 4.0, typicalHours: 2, icon: '🔧' },
  { id: 'welder', name: 'Electric Welder', category: 'tools', wattage: 3000, surgeFactor: 1.5, typicalHours: 2, icon: '🔧' },
  { id: 'sewing-machine', name: 'Sewing Machine', category: 'tools', wattage: 100, surgeFactor: 1.5, typicalHours: 3, icon: '🧵' },
  { id: 'lawn-mower', name: 'Electric Lawn Mower', category: 'tools', wattage: 1500, surgeFactor: 2.5, typicalHours: 1, icon: '🌱' },
  { id: 'hedge-trimmer', name: 'Hedge Trimmer', category: 'tools', wattage: 500, surgeFactor: 2.0, typicalHours: 1, icon: '🌿' },
  
  // ==================== SECURITY & COMMUNICATION (10+ items) ====================
  { id: 'cctv-cam', name: 'CCTV Camera', category: 'office', wattage: 8, surgeFactor: 1.1, typicalHours: 24, icon: '📹' },
  { id: 'cctv-cam-ptz', name: 'PTZ CCTV Camera', category: 'office', wattage: 15, surgeFactor: 1.2, typicalHours: 24, icon: '📹' },
  { id: 'cctv-dvr-4ch', name: 'CCTV DVR (4CH)', category: 'office', wattage: 40, surgeFactor: 1.2, typicalHours: 24, icon: '📹' },
  { id: 'cctv-dvr-8ch', name: 'CCTV DVR (8CH)', category: 'office', wattage: 60, surgeFactor: 1.2, typicalHours: 24, icon: '📹' },
  { id: 'cctv-nvr', name: 'CCTV NVR System', category: 'office', wattage: 80, surgeFactor: 1.2, typicalHours: 24, icon: '📹' },
  { id: 'gate-motor-single', name: 'Single Gate Motor', category: 'tools', wattage: 300, surgeFactor: 4.0, typicalHours: 0.2, icon: '🚪' },
  { id: 'gate-motor', name: 'Automatic Gate Motor (Double)', category: 'tools', wattage: 500, surgeFactor: 4.0, typicalHours: 0.2, icon: '🚪' },
  { id: 'alarm-system', name: 'Security Alarm System', category: 'office', wattage: 15, surgeFactor: 1.1, typicalHours: 24, icon: '🚨' },
  { id: 'intercom', name: 'Intercom System', category: 'office', wattage: 20, surgeFactor: 1.1, typicalHours: 24, icon: '📞' },
  { id: 'pa-system', name: 'PA System', category: 'office', wattage: 400, surgeFactor: 1.3, typicalHours: 4, icon: '📢' },
  
  // ==================== HEATING & WATER (10+ items) ====================
  { id: 'water-heater-instant', name: 'Instant Water Heater (Small)', category: 'heating', wattage: 2000, surgeFactor: 1.1, typicalHours: 1, icon: '🚿', description: 'High power' },
  { id: 'water-heater-small', name: 'Instant Water Heater (Medium)', category: 'heating', wattage: 3000, surgeFactor: 1.1, typicalHours: 1, icon: '🚿' },
  { id: 'water-heater-large', name: 'Instant Water Heater (Large)', category: 'heating', wattage: 4500, surgeFactor: 1.1, typicalHours: 1, icon: '🚿' },
  { id: 'water-heater-storage', name: 'Storage Water Heater', category: 'heating', wattage: 1500, surgeFactor: 1.2, typicalHours: 3, icon: '🚿' },
  { id: 'space-heater-small', name: 'Space Heater (Small)', category: 'heating', wattage: 800, surgeFactor: 1.1, typicalHours: 4, icon: '🔥' },
  { id: 'space-heater', name: 'Space Heater (Standard)', category: 'heating', wattage: 1500, surgeFactor: 1.1, typicalHours: 4, icon: '🔥' },
  { id: 'space-heater-large', name: 'Space Heater (Large)', category: 'heating', wattage: 2000, surgeFactor: 1.1, typicalHours: 4, icon: '🔥' },
  { id: 'oil-heater', name: 'Oil-Filled Radiator', category: 'heating', wattage: 1500, surgeFactor: 1.1, typicalHours: 6, icon: '🔥' },
  { id: 'heat-pump', name: 'Heat Pump Water Heater', category: 'heating', wattage: 1200, surgeFactor: 2.5, typicalHours: 4, icon: '🚿' },
  { id: 'towel-warmer', name: 'Towel Warmer', category: 'heating', wattage: 100, surgeFactor: 1.1, typicalHours: 2, icon: '🧖' },
];

export const CATEGORIES = {
  lighting: { label: 'Lighting', icon: '💡', color: '#fbbf24' },
  cooling: { label: 'Cooling & Fans', icon: '🌀', color: '#38bdf8' },
  heating: { label: 'Heating', icon: '🔥', color: '#f97316' },
  kitchen: { label: 'Kitchen', icon: '🍳', color: '#10b981' },
  entertainment: { label: 'Entertainment', icon: '📺', color: '#a855f7' },
  computing: { label: 'Computing', icon: '💻', color: '#06b6d4' },
  medical: { label: 'Medical', icon: '⚕️', color: '#ef4444' },
  tools: { label: 'Tools & Motors', icon: '🔧', color: '#f59e0b' },
  office: { label: 'Office', icon: '📋', color: '#6366f1' },
};

export function searchAppliances(query: string): ApplianceSpec[] {
  const q = query.toLowerCase();
  return APPLIANCE_DATABASE.filter(app => 
    app.name.toLowerCase().includes(q) || 
    app.category.includes(q)
  );
}

export function getAppliancesByCategory(category: ApplianceCategory): ApplianceSpec[] {
  return APPLIANCE_DATABASE.filter(app => app.category === category);
}

export function getApplianceById(id: string): ApplianceSpec | undefined {
  return APPLIANCE_DATABASE.find(app => app.id === id);
}
