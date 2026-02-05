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
  // LIGHTING
  { id: 'led-9w', name: 'LED Bulb (9W)', category: 'lighting', wattage: 9, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'led-15w', name: 'LED Bulb (15W)', category: 'lighting', wattage: 15, surgeFactor: 1.1, typicalHours: 6, icon: '💡' },
  { id: 'led-tube', name: 'LED Tube (18W)', category: 'lighting', wattage: 18, surgeFactor: 1.1, typicalHours: 8, icon: '💡' },
  { id: 'outdoor-flood', name: 'Outdoor Floodlight (50W)', category: 'lighting', wattage: 50, surgeFactor: 1.1, typicalHours: 10, icon: '🔦' },
  
  // COOLING & CLIMATE
  { id: 'ceiling-fan', name: 'Ceiling Fan', category: 'cooling', wattage: 75, surgeFactor: 4.5, typicalHours: 8, icon: '🌀' },
  { id: 'standing-fan', name: 'Standing Fan', category: 'cooling', wattage: 55, surgeFactor: 4.0, typicalHours: 6, icon: '🌪️' },
  { id: 'ac-1hp', name: 'AC 1HP Inverter', category: 'cooling', wattage: 746, surgeFactor: 3.5, typicalHours: 5, description: 'Energy-efficient inverter technology' },
  { id: 'ac-1.5hp', name: 'AC 1.5HP Inverter', category: 'cooling', wattage: 1100, surgeFactor: 3.5, typicalHours: 5 },
  { id: 'ac-2hp', name: 'AC 2HP Inverter', category: 'cooling', wattage: 1492, surgeFactor: 3.5, typicalHours: 4 },
  
  // REFRIGERATION
  { id: 'fridge-small', name: 'Small Refrigerator (Inverter)', category: 'kitchen', wattage: 120, surgeFactor: 3.0, typicalHours: 24, icon: '🧊' },
  { id: 'fridge-medium', name: 'Medium Refrigerator', category: 'kitchen', wattage: 200, surgeFactor: 3.0, typicalHours: 24, icon: '❄️' },
  { id: 'fridge-large', name: 'Large Fridge/Freezer', category: 'kitchen', wattage: 350, surgeFactor: 3.2, typicalHours: 24 },
  { id: 'chest-freezer', name: 'Chest Freezer', category: 'kitchen', wattage: 250, surgeFactor: 3.0, typicalHours: 24 },
  { id: 'vaccine-fridge', name: 'Vaccine Refrigerator', category: 'medical', wattage: 300, surgeFactor: 3.0, typicalHours: 24, description: 'Medical-grade cooling' },
  
  // ENTERTAINMENT
  { id: 'tv-32', name: 'LED TV 32"', category: 'entertainment', wattage: 45, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-43', name: 'LED TV 43"', category: 'entertainment', wattage: 65, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-55', name: 'LED TV 55"', category: 'entertainment', wattage: 85, surgeFactor: 1.2, typicalHours: 5, icon: '📺' },
  { id: 'tv-65', name: 'Smart TV 65"', category: 'entertainment', wattage: 120, surgeFactor: 1.2, typicalHours: 4, icon: '📺' },
  { id: 'sound-system', name: 'Home Theater System', category: 'entertainment', wattage: 200, surgeFactor: 1.3, typicalHours: 3 },
  { id: 'decoder', name: 'Satellite Decoder', category: 'entertainment', wattage: 15, surgeFactor: 1.1, typicalHours: 6 },
  
  // COMPUTING
  { id: 'laptop', name: 'Laptop Computer', category: 'computing', wattage: 65, surgeFactor: 1.1, typicalHours: 8, icon: '💻' },
  { id: 'desktop', name: 'Desktop Computer', category: 'computing', wattage: 200, surgeFactor: 1.2, typicalHours: 8, icon: '🖥️' },
  { id: 'workstation', name: 'Workstation PC (High-end)', category: 'computing', wattage: 400, surgeFactor: 1.3, typicalHours: 8 },
  { id: 'monitor', name: 'LCD Monitor 24"', category: 'computing', wattage: 25, surgeFactor: 1.1, typicalHours: 8 },
  { id: 'router', name: 'WiFi Router', category: 'computing', wattage: 12, surgeFactor: 1.1, typicalHours: 24, icon: '📡' },
  { id: 'nas', name: 'NAS Storage Server', category: 'computing', wattage: 60, surgeFactor: 1.2, typicalHours: 24 },
  
  // KITCHEN APPLIANCES
  { id: 'microwave', name: 'Microwave Oven', category: 'kitchen', wattage: 1000, surgeFactor: 1.2, typicalHours: 0.5, icon: '🔥' },
  { id: 'blender', name: 'Blender', category: 'kitchen', wattage: 450, surgeFactor: 2.5, typicalHours: 0.2, icon: '🔄' },
  { id: 'water-dispenser', name: 'Water Dispenser (Hot/Cold)', category: 'kitchen', wattage: 600, surgeFactor: 1.3, typicalHours: 12, icon: '💧' },
  { id: 'kettle', name: 'Electric Kettle', category: 'kitchen', wattage: 1800, surgeFactor: 1.1, typicalHours: 0.3, icon: '☕' },
  { id: 'toaster', name: 'Toaster', category: 'kitchen', wattage: 900, surgeFactor: 1.2, typicalHours: 0.2 },
  { id: 'rice-cooker', name: 'Rice Cooker', category: 'kitchen', wattage: 700, surgeFactor: 1.2, typicalHours: 1 },
  
  // OFFICE EQUIPMENT
  { id: 'printer', name: 'Laser Printer', category: 'office', wattage: 450, surgeFactor: 1.5, typicalHours: 2, icon: '🖨️' },
  { id: 'photocopier', name: 'Photocopier', category: 'office', wattage: 600, surgeFactor: 1.5, typicalHours: 4 },
  { id: 'projector', name: 'Smart Projector', category: 'office', wattage: 250, surgeFactor: 1.2, typicalHours: 3, icon: '📽️' },
  { id: 'scanner', name: 'Document Scanner', category: 'office', wattage: 30, surgeFactor: 1.2, typicalHours: 2 },
  { id: 'shredder', name: 'Paper Shredder', category: 'office', wattage: 200, surgeFactor: 2.0, typicalHours: 0.5 },
  
  // MEDICAL EQUIPMENT
  { id: 'oxygen-concentrator', name: 'Oxygen Concentrator', category: 'medical', wattage: 600, surgeFactor: 2.0, typicalHours: 24, description: 'Critical medical device' },
  { id: 'nebulizer', name: 'Nebulizer', category: 'medical', wattage: 120, surgeFactor: 1.3, typicalHours: 1 },
  { id: 'vital-monitor', name: 'Vital Signs Monitor', category: 'medical', wattage: 150, surgeFactor: 1.2, typicalHours: 24 },
  { id: 'surgical-light', name: 'Surgical Light', category: 'medical', wattage: 100, surgeFactor: 1.1, typicalHours: 6 },
  { id: 'autoclave', name: 'Autoclave Sterilizer', category: 'medical', wattage: 1500, surgeFactor: 1.3, typicalHours: 2 },
  
  // TOOLS & PUMPS
  { id: 'water-pump-0.5hp', name: 'Water Pump 0.5HP', category: 'tools', wattage: 373, surgeFactor: 5.0, typicalHours: 2, description: 'High starting current' },
  { id: 'water-pump-1hp', name: 'Water Pump 1HP', category: 'tools', wattage: 746, surgeFactor: 5.0, typicalHours: 2 },
  { id: 'washing-machine', name: 'Washing Machine', category: 'tools', wattage: 500, surgeFactor: 3.5, typicalHours: 1, icon: '🧺' },
  { id: 'iron', name: 'Electric Iron', category: 'heating', wattage: 1200, surgeFactor: 1.1, typicalHours: 1, icon: '👔' },
  { id: 'vacuum', name: 'Vacuum Cleaner', category: 'tools', wattage: 1000, surgeFactor: 2.0, typicalHours: 0.5 },
  { id: 'drill', name: 'Electric Drill', category: 'tools', wattage: 600, surgeFactor: 2.5, typicalHours: 1 },
  
  // SECURITY & COMMUNICATION
  { id: 'cctv-cam', name: 'CCTV Camera', category: 'office', wattage: 8, surgeFactor: 1.1, typicalHours: 24, icon: '📹' },
  { id: 'cctv-dvr', name: 'CCTV DVR (4CH)', category: 'office', wattage: 40, surgeFactor: 1.2, typicalHours: 24 },
  { id: 'gate-motor', name: 'Automatic Gate Motor', category: 'tools', wattage: 300, surgeFactor: 4.0, typicalHours: 0.2 },
  { id: 'alarm-system', name: 'Security Alarm System', category: 'office', wattage: 15, surgeFactor: 1.1, typicalHours: 24 },
  
  // HEATING & WATER
  { id: 'water-heater-small', name: 'Instant Water Heater', category: 'heating', wattage: 3000, surgeFactor: 1.1, typicalHours: 1, description: 'High power consumption' },
  { id: 'space-heater', name: 'Space Heater', category: 'heating', wattage: 1500, surgeFactor: 1.1, typicalHours: 4 },
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
