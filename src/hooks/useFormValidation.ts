import { useState } from 'react';
import type { ValidationErrors } from '../types';

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEstimation = (
    property: string,
    address: string,
    appliances: any[]
  ): boolean => {
    const newErrors: ValidationErrors = {};

    if (!property || property.trim().length === 0) {
      newErrors.property = 'Please select a property type to continue';
    }

    if (!address || address.trim().length < 3) {
      newErrors.address = 'Please enter a valid installation address';
    }

    if (appliances.length === 0) {
      newErrors.appliances = 'Please add at least one appliance to your list';
    } else {
      // Validate individual appliances
      const invalidAppliances = appliances.filter(
        app => !app.name || app.watt <= 0 || app.quantity <= 0
      );
      if (invalidAppliances.length > 0) {
        newErrors.appliances = 'Some appliances have invalid values. Please check name, wattage, and quantity.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return { 
    errors, 
    validateEstimation, 
    clearError, 
    clearAllErrors,
    setErrors 
  };
}
