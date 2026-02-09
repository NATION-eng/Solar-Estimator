import { useState } from 'react';
import type { Appliance } from '../types';

/**
 * Custom hook for managing appliance list state and operations
 * 
 * Handles:
 * - Appliance array state management
 * - Adding new appliances
 * - Updating existing appliances
 * - Removing appliances
 * - Loading preset appliances
 */
export function useAppliances(initialAppliances: Appliance[] = []) {
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);

  /**
   * Add a new appliance to the list
   */
  const addAppliance = (appliance: Appliance) => {
    setAppliances(prev => [...prev, appliance]);
  };

  /**
   * Update a specific field of an appliance at given index
   */
  const updateAppliance = (
    index: number, 
    field: keyof Appliance, 
    value: string | number
  ) => {
    setAppliances(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      return copy;
    });
  };

  /**
   * Remove appliance at given index
   */
  const removeAppliance = (index: number) => {
    setAppliances(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Load preset appliances (replaces current list)
   */
  const loadPresets = (presets: Appliance[]) => {
    setAppliances(presets);
  };

  /**
   * Clear all appliances
   */
  const clearAppliances = () => {
    setAppliances([]);
  };

  /**
   * Get total wattage of all appliances
   */
  const getTotalWattage = () => {
    return appliances.reduce((acc, curr) => acc + (curr.watt * curr.quantity), 0);
  };

  return {
    appliances,
    addAppliance,
    updateAppliance,
    removeAppliance,
    loadPresets,
    clearAppliances,
    getTotalWattage,
    setAppliances
  };
}
