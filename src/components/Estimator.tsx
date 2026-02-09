import { useState } from "react";
import AppResult from "./AppResult";
import ApplianceSelector from "./ApplianceSelector";
import { LoadingSpinner } from "./LoadingSpinner";
import { ValidationError } from "./ValidationError";
import { useFormValidation } from "../hooks/useFormValidation";
import { useEstimation } from "../hooks/useEstimation";
import { useAppliances } from "../hooks/useAppliances";
import type { PropertyType } from "../types";
import styles from "./Estimator.module.css";

/* ================= COMPONENT ================= */

export default function Estimator() {
  // Form state
  const [property, setProperty] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState(6);
  
  // Custom hooks
  const { errors, validateEstimation, clearError } = useFormValidation();
  const { result, loading, runEstimate } = useEstimation();
  const { 
    appliances, 
    addAppliance, 
    updateAppliance, 
    removeAppliance, 
    loadPresets 
  } = useAppliances([
    { name: "LED TV", watt: 150, quantity: 1 },
    { name: "Refrigerator", watt: 200, quantity: 1 },
    { name: "Lighting Point", watt: 15, quantity: 5 },
  ]);

  const types: PropertyType[] = [
    { 
      id: "home", 
      label: "Residential", 
      icon: "🏠", 
      desc: "Homes & Apartments",
      presets: [
        { name: "LED TV (43\")", watt: 65, quantity: 1 },
        { name: "Inverter Fridge", watt: 120, quantity: 1 },
        { name: "Standing Fan", watt: 55, quantity: 2 },
        { name: "LED Bulbs", watt: 9, quantity: 10 },
      ]
    },
    { 
      id: "office", 
      label: "Corporate", 
      icon: "🏢", 
      desc: "Offices & Studios",
      presets: [
        { name: "Workstation/Laptop", watt: 85, quantity: 5 },
        { name: "Inverter AC (1.5HP)", watt: 1100, quantity: 1 },
        { name: "Office Printer", watt: 450, quantity: 1 },
        { name: "Water Dispenser", watt: 600, quantity: 1 },
      ]
    },
    { 
      id: "school", 
      label: "Education", 
      icon: "🏫", 
      desc: "Schools & Labs",
      presets: [
        { name: "Classroom Fan", watt: 75, quantity: 8 },
        { name: "Smart Projector", watt: 250, quantity: 2 },
        { name: "Desktop Computer", watt: 200, quantity: 10 },
        { name: "PA System", watt: 400, quantity: 1 },
      ]
    },
    { 
      id: "hospital", 
      label: "Medical", 
      icon: "🏥", 
      desc: "Clinics & Pharmacies",
      presets: [
        { name: "Vaccine Fridge", watt: 300, quantity: 1 },
        { name: "Vital Monitor", watt: 150, quantity: 2 },
        { name: "Surgical Light", watt: 100, quantity: 3 },
        { name: "Oxygen Concentrator", watt: 600, quantity: 1 },
      ]
    },
    { 
      id: "retail", 
      label: "Retail", 
      icon: "🛒", 
      desc: "Shops & Stores",
      presets: [
        { name: "Display Fridge", watt: 400, quantity: 2 },
        { name: "POS System", watt: 150, quantity: 3 },
        { name: "LED Display Lights", watt: 20, quantity: 15 },
        { name: "Security Camera", watt: 15, quantity: 4 },
      ]
    },
    { 
      id: "hotel", 
      label: "Hospitality", 
      icon: "🏨", 
      desc: "Hotels & Lodges",
      presets: [
        { name: "Room AC (1HP)", watt: 900, quantity: 10 },
        { name: "Mini Fridge", watt: 80, quantity: 10 },
        { name: "LED TV (32\")", watt: 50, quantity: 10 },
        { name: "Lobby Lighting", watt: 200, quantity: 1 },
      ]
    },
    { 
      id: "restaurant", 
      label: "Food Service", 
      icon: "🍽️", 
      desc: "Restaurants & Cafes",
      presets: [
        { name: "Commercial Fridge", watt: 600, quantity: 2 },
        { name: "Microwave Oven", watt: 1200, quantity: 1 },
        { name: "Blender", watt: 400, quantity: 2 },
        { name: "Exhaust Fan", watt: 200, quantity: 2 },
      ]
    },
    { 
      id: "industrial", 
      label: "Industrial", 
      icon: "🏭", 
      desc: "Factories & Workshops",
      presets: [
        { name: "Welding Machine", watt: 3000, quantity: 1 },
        { name: "Air Compressor", watt: 2200, quantity: 1 },
        { name: "Industrial Fan", watt: 300, quantity: 4 },
        { name: "Grinder", watt: 1500, quantity: 2 },
      ]
    },
  ];

  /* ================= HANDLERS ================= */

  const handlePropertyChange = (typeId: string) => {
    setProperty(typeId);
    const selected = types.find(t => t.id === typeId);
    if (selected) {
      loadPresets(selected.presets);
    }
  };

  const handleEstimate = async () => {
    // Validate form before submission
    if (!validateEstimation(property, address, appliances)) {
      return; // Errors will be displayed in UI
    }

    // Use the custom hook to run estimation
    await runEstimate(property, address, hours, appliances);
  };

  // Appliance management now handled by useAppliances hook
  const handleAddManualAppliance = () => {
    addAppliance({ name: "", watt: 0, quantity: 1 });
  };

  /* ================= PROGRESS CALCULATION ================= */
  const progress = property ? (address ? (appliances.length > 0 ? 100 : 66) : 33) : 0;

  /* ================= UI ================= */

  return (
    <div className={styles.container}>
      <div className={styles.glassPanel}>
        {/* Progress Indicator */}
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Configuration Progress</span>
            <span className={styles.progressLabel}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Property Type Selection */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontWeight: "700", marginBottom: "20px" }}>
            1️⃣ Select Property Type
          </h3>
          
          <div className={styles.propertyGrid}>
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => handlePropertyChange(t.id)}
                aria-label={`Select ${t.label} property type`}
                aria-pressed={property === t.id}
                role="radio"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePropertyChange(t.id);
                  }
                }}
                className={`${styles.propertyCard} ${property === t.id ? styles.propertyCardActive : ''}`}
              >
                <span className={styles.propertyIcon}>{t.icon}</span>
                <div>
                  <span className={styles.propertyLabel}>{t.label}</span>
                  <div className={styles.propertyDesc}>{t.desc}</div>
                </div>
                {property === t.id && (
                  <span className={styles.propertyCheckmark}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Section */}
        <div 
          className={`${styles.formSection} ${!property ? styles.formSectionDisabled : ''}`}
        >
          <h3 style={{ fontWeight: "700", marginBottom: "20px" }}>
            2️⃣ Installation Details
          </h3>
          
          <div className={styles.fieldGroup}>
             <label 
               htmlFor="address-input"
               className={styles.label}
             >
               Installation Address
             </label>
             <input
                id="address-input"
                type="text"
                placeholder="Enter your location in Nigeria (e.g., Lagos, Abuja, Port Harcourt)"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) clearError('address');
                }}
                disabled={!property}
                aria-label="Installation address"
                aria-required="true"
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? 'address-error' : undefined}
                className={`${styles.inputField} ${errors.address ? styles.inputFieldError : ''}`}
              />
              {errors.address && (
                <div id="address-error">
                  <ValidationError 
                    message={errors.address} 
                    onDismiss={() => clearError('address')}
                  />
                </div>
              )}
          </div>

          <div className={styles.rangeContainer}>
              <label className={styles.label}>
                Daily Usage Target (Hours)
              </label>
              <input
                 type="range"
                 min="1"
                 max="24"
                 value={hours}
                 onChange={(e) => setHours(Number(e.target.value))}
                 className={styles.rangeSlider}
               />
               <div className={styles.rangeLabels}>
                 <span>1 hr</span>
                 <span className={styles.rangeValue}>{hours} hours / day</span>
                 <span>24 hrs</span>
               </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 className={styles.appliancesHeader}>
               <span>⚡ Your Appliances</span>
               <span className={styles.applianceCount}>{appliances.length} items</span>
            </h3>

            {/* Appliance Database Selector */}
            <ApplianceSelector onAdd={addAppliance} />

            {/* Manual Appliance List */}
            <div style={{ marginTop: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--color-text-muted)'
              }}>
                Appliance List
              </label>

              <div className={styles.applianceList}>
                {appliances.map((app, index) => (
                  <div key={index} className={styles.applianceRow}>
                    {/* Appliance Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <input
                        className={styles.applianceInput}
                        placeholder="Appliance name"
                        value={app.name}
                        onChange={(e) => updateAppliance(index, 'name', e.target.value)}
                      />
                    </div>

                    {/* Wattage Input */}
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        className={styles.applianceInput}
                        style={{ textAlign: 'center' }}
                        placeholder="Watts"
                        value={app.watt === 0 ? '' : app.watt}
                        onChange={(e) => updateAppliance(index, 'watt', e.target.value === '' ? 0 : Number(e.target.value))}
                      />
                       <span style={{ 
                         position: 'absolute', 
                         right: '10px', 
                         top: '50%', 
                         transform: 'translateY(-50%)',
                         fontSize: '0.75rem', 
                         opacity: 0.6,
                         color: 'var(--color-primary)',
                         fontWeight: 600
                       }}>W</span>
                    </div>

                    {/* Quantity Input */}
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className={styles.applianceInput}
                        style={{ textAlign: 'center' }}
                        value={app.quantity === 0 ? '' : app.quantity}
                        onChange={(e) => updateAppliance(index, 'quantity', e.target.value === '' ? 1 : Number(e.target.value))}
                      />
                       <span style={{ 
                         position: 'absolute', 
                         right: '10px', 
                         top: '50%', 
                         transform: 'translateY(-50%)',
                         fontSize: '0.75rem', 
                         opacity: 0.6,
                         color: 'var(--color-accent)',
                         fontWeight: 600
                       }}>Qty</span>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeAppliance(index)}
                      className={styles.removeButton}
                      aria-label="Remove appliance"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Manual Appliance Button */}
            <div style={{ marginTop: "20px", display: 'flex', gap: '16px' }}>
              <button
                onClick={handleAddManualAppliance}
                className={styles.addButton}
              >
                <span style={{ fontSize: '1.2rem' }}>+</span>
                <span>Add Custom Appliance</span>
              </button>
            </div>
          </div>

          <div className={styles.submitContainer}>
            <button 
              className={`btn-primary ${styles.submitButton}`}
              onClick={handleEstimate} 
              disabled={loading}
            >
              {loading ? "Analyzing Energy Profile..." : "Calculate Solar Needs"}
            </button>
          </div>

          {/* VALIDATION ERRORS SUMMARY */}
          {(errors.property || errors.appliances) && !loading && (
            <div style={{ marginTop: '24px' }}>
              {errors.property && (
                <ValidationError 
                  message={errors.property} 
                  onDismiss={() => clearError('property')}
                />
              )}
              {errors.appliances && (
                <div style={{ marginTop: '8px' }}>
                  <ValidationError 
                    message={errors.appliances} 
                    onDismiss={() => clearError('appliances')}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div style={{ marginTop: '40px' }}>
          <LoadingSpinner message="Calculating your solar system requirements..." />
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {!loading && result && <AppResult data={result} />}
    </div>
  );
}
