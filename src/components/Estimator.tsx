import { useState, useRef } from "react";
import AppResult from "./AppResult";
import ApplianceSelector from "./ApplianceSelector";
import { LoadingSpinner } from "./LoadingSpinner";
import { ValidationError } from "./ValidationError";
import { useFormValidation } from "../hooks/useFormValidation";
import { useEstimation } from "../hooks/useEstimation";
import { useAppliances } from "../hooks/useAppliances";
import type { PropertyType } from "../types";
import styles from "./Estimator.module.css";

export default function Estimator() {
  // Stepper state (1: Property & Location, 2: Energy Audit, 3: Blueprint)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [property, setProperty] = useState("home");
  const [address, setAddress] = useState("Lagos");
  const [hours, setHours] = useState(8);
  const [batteryType, setBatteryType] = useState<'lithium' | 'gel' | 'tubular'>('lithium');
  
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
    { name: "LED TV (43\")", watt: 65, quantity: 1 },
    { name: "Inverter Fridge", watt: 120, quantity: 1 },
    { name: "Standing Fan", watt: 55, quantity: 2 },
    { name: "LED Bulbs", watt: 9, quantity: 8 },
  ]);

  const resultsRef = useRef<HTMLDivElement>(null);

  const types: PropertyType[] = [
    { 
      id: "home", 
      label: "Residential", 
      icon: "🏠", 
      desc: "Homes & Flats",
      presets: [
        { name: "LED TV (43\")", watt: 65, quantity: 1 },
        { name: "Inverter Fridge", watt: 120, quantity: 1 },
        { name: "Standing Fan", watt: 55, quantity: 2 },
        { name: "LED Bulbs", watt: 9, quantity: 8 },
      ]
    },
    { 
      id: "office", 
      label: "Corporate", 
      icon: "🏢", 
      desc: "Offices & Studios",
      presets: [
        { name: "Workstation / Laptop", watt: 85, quantity: 4 },
        { name: "Inverter AC (1.5HP)", watt: 1100, quantity: 1 },
        { name: "Office Printer", watt: 450, quantity: 1 },
        { name: "Water Dispenser", watt: 600, quantity: 1 },
      ]
    },
    { 
      id: "retail", 
      label: "Retail", 
      icon: "🛒", 
      desc: "Shops & Stores",
      presets: [
        { name: "Display Chiller", watt: 400, quantity: 1 },
        { name: "POS & Billing", watt: 150, quantity: 2 },
        { name: "Display Lights", watt: 20, quantity: 10 },
        { name: "CCTV System", watt: 30, quantity: 1 },
      ]
    },
    { 
      id: "restaurant", 
      label: "Food Service", 
      icon: "🍽️", 
      desc: "Cafes & Dining",
      presets: [
        { name: "Commercial Freezer", watt: 600, quantity: 2 },
        { name: "Blender / Grinder", watt: 450, quantity: 2 },
        { name: "Exhaust Fan", watt: 150, quantity: 2 },
        { name: "Dining Lighting", watt: 15, quantity: 12 },
      ]
    },
    { 
      id: "hospital", 
      label: "Medical", 
      icon: "🏥", 
      desc: "Clinics & Labs",
      presets: [
        { name: "Vaccine Fridge", watt: 250, quantity: 1 },
        { name: "Sterilizer", watt: 800, quantity: 1 },
        { name: "Examination Light", watt: 80, quantity: 2 },
        { name: "Laboratory PC", watt: 150, quantity: 2 },
      ]
    },
    { 
      id: "school", 
      label: "Education", 
      icon: "🏫", 
      desc: "Schools & Tech",
      presets: [
        { name: "Smart Projector", watt: 250, quantity: 2 },
        { name: "Classroom Fan", watt: 75, quantity: 6 },
        { name: "Computer Lab", watt: 180, quantity: 8 },
        { name: "PA Speaker System", watt: 350, quantity: 1 },
      ]
    },
    { 
      id: "hotel", 
      label: "Hospitality", 
      icon: "🏨", 
      desc: "Hotels & Lodges",
      presets: [
        { name: "Room Mini Fridge", watt: 80, quantity: 6 },
        { name: "LED TV (32\")", watt: 50, quantity: 6 },
        { name: "Lobby Lighting", watt: 150, quantity: 1 },
        { name: "WiFi Infrastructure", watt: 45, quantity: 2 },
      ]
    },
    { 
      id: "industrial", 
      label: "Industrial", 
      icon: "🏭", 
      desc: "Workshops",
      presets: [
        { name: "Drill Press / Lathe", watt: 1200, quantity: 1 },
        { name: "Air Compressor", watt: 1800, quantity: 1 },
        { name: "Industrial Fan", watt: 250, quantity: 3 },
      ]
    },
    { 
      id: "worship", 
      label: "Worship", 
      icon: "🕌", 
      desc: "Churches & Mosques",
      presets: [
        { name: "Audio Amplifier", watt: 800, quantity: 1 },
        { name: "Ceiling Fans", watt: 75, quantity: 8 },
        { name: "Stage Lights", watt: 100, quantity: 6 },
        { name: "HD Projector", watt: 280, quantity: 2 },
      ]
    },
  ];

  // Calculated stats
  const totalSteadyWatts = appliances.reduce((sum, a) => sum + (Number(a.watt) * Number(a.quantity)), 0);
  const dailyEnergyKwh = ((totalSteadyWatts * hours) / 1000).toFixed(1);

  /* ================= HANDLERS ================= */

  const handlePropertyChange = (typeId: string) => {
    setProperty(typeId);
    const selected = types.find(t => t.id === typeId);
    if (selected) {
      loadPresets(selected.presets);
    }
  };

  const handleQtyChange = (index: number, delta: number) => {
    const current = appliances[index].quantity;
    const newQty = Math.max(1, current + delta);
    updateAppliance(index, 'quantity', newQty);
  };

  const handleEstimate = async () => {
    if (!validateEstimation(property, address, appliances)) {
      return;
    }

    await runEstimate(property, address, hours, appliances, batteryType);
    setCurrentStep(3);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const topContainerRef = useRef<HTMLDivElement>(null);

  const goToStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
    topContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className={styles.container} ref={topContainerRef}>
      <div className={styles.glassPanel}>
        {/* Modern Stepper Header */}
        <div className={styles.stepperBar}>
          <button 
            type="button"
            onClick={() => goToStep(1)}
            className={`${styles.stepperTab} ${currentStep === 1 ? styles.stepperTabActive : ''}`}
          >
            <span className={styles.stepNumber}>1</span>
            <span><span className="desktop-only">Location & </span>Site</span>
          </button>

          <button 
            type="button"
            onClick={() => goToStep(2)}
            className={`${styles.stepperTab} ${currentStep === 2 ? styles.stepperTabActive : ''}`}
          >
            <span className={styles.stepNumber}>2</span>
            <span><span className="desktop-only">Energy </span>Audit ({appliances.length})</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (result) goToStep(3);
              else handleEstimate();
            }}
            className={`${styles.stepperTab} ${currentStep === 3 ? styles.stepperTabActive : ''}`}
          >
            <span className={styles.stepNumber}>3</span>
            <span>Blueprint</span>
          </button>
        </div>

        {/* Live Load Status Bar */}
        <div className={styles.liveLoadBar}>
          <div className={styles.liveLoadMetric}>
            <span className={styles.liveLoadLabel}>Total Steady Load</span>
            <span className={styles.liveLoadValue}>{totalSteadyWatts.toLocaleString()} W</span>
          </div>

          <div className={styles.liveLoadMetric} style={{ textAlign: 'center' }}>
            <span className={styles.liveLoadLabel}>Daily Target</span>
            <span className={styles.liveLoadValue}>{dailyEnergyKwh} kWh/d</span>
          </div>

          <div className={styles.liveLoadMetric} style={{ textAlign: 'right' }}>
            <span className={styles.liveLoadLabel}>Backup Hours</span>
            <span className={styles.liveLoadValue}>{hours} hrs</span>
          </div>
        </div>

        {/* ================= STEP 1: PROPERTY & LOCATION ================= */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📍</span>
              <span>Select Property & Target Location</span>
            </h3>

            {/* Property Tiles */}
            <div className={styles.propertyGrid}>
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handlePropertyChange(t.id)}
                  className={`${styles.propertyCard} ${property === t.id ? styles.propertyCardActive : ''}`}
                >
                  <span className={styles.propertyIcon}>{t.icon}</span>
                  <span className={styles.propertyLabel}>{t.label}</span>
                  <span className={styles.propertyDesc}>{t.desc}</span>
                  {property === t.id && (
                    <span className={styles.propertyCheckmark}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Location Input & City Chips */}
            <div className={styles.fieldGroup}>
              <label htmlFor="address-input" className={styles.label}>
                Installation Location in Nigeria
              </label>
              <input
                id="address-input"
                type="text"
                placeholder="Enter city or address (e.g. Lagos, Abuja, Port Harcourt)"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) clearError('address');
                }}
                className={`${styles.inputField} ${errors.address ? styles.inputFieldError : ''}`}
              />
              {errors.address && (
                <div style={{ marginTop: '8px' }}>
                  <ValidationError message={errors.address} onDismiss={() => clearError('address')} />
                </div>
              )}

              {/* Quick City Presets */}
              <div className={styles.presetChipsRow}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>Popular:</span>
                {['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Benin'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setAddress(city);
                      if (errors.address) clearError('address');
                    }}
                    className={`${styles.presetChip} ${address === city ? styles.presetChipActive : ''}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Hours Slider & Presets */}
            <div className={styles.rangeContainer}>
              <div className={styles.rangeLabels}>
                <label className={styles.label} style={{ margin: 0 }}>Daily Target Backup</label>
                <span className={styles.rangeValue}>{hours} Hours / Day</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <div className={styles.presetChipsRow}>
                {[
                  { label: '4h (Night)', val: 4 },
                  { label: '8h (Business)', val: 8 },
                  { label: '12h (Extended)', val: 12 },
                  { label: '18h (Heavy)', val: 18 },
                  { label: '24h (Full Off-Grid)', val: 24 }
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setHours(p.val)}
                    className={`${styles.presetChip} ${hours === p.val ? styles.presetChipActive : ''}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Chemistry */}
            <div style={{ marginBottom: '20px' }}>
              <label className={styles.label}>Storage Technology</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setBatteryType('lithium')}
                  style={{
                    padding: '14px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: batteryType === 'lithium' ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                    background: batteryType === 'lithium' ? 'rgba(251, 191, 36, 0.12)' : 'rgba(0,0,0,0.2)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: batteryType === 'lithium' ? 'var(--color-primary)' : 'inherit' }}>
                    🔋 Lithium LiFePO4
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    80% DOD • 10-15yr lifespan
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBatteryType('tubular')}
                  style={{
                    padding: '14px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: batteryType === 'tubular' ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                    background: batteryType === 'tubular' ? 'rgba(251, 191, 36, 0.12)' : 'rgba(0,0,0,0.2)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: batteryType === 'tubular' ? 'var(--color-primary)' : 'inherit' }}>
                    ⚡ Deep Cycle Tubular
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    50% DOD • Cost-effective
                  </div>
                </button>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className={styles.stepActions}>
              <div></div>
              <button 
                type="button" 
                onClick={() => setCurrentStep(2)}
                className={styles.nextBtn}
              >
                <span>Continue to Energy Audit</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ENERGY AUDIT & APPLIANCES ================= */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡</span>
                <span>Energy Audit ({appliances.length} Appliances)</span>
              </h3>
            </div>

            {/* Quick Catalog Selector */}
            <ApplianceSelector onAdd={addAppliance} />

            {/* Appliance Cards List */}
            <div className={styles.applianceList}>
              {appliances.map((app, index) => (
                <div key={index} className={styles.applianceCard}>
                  {/* Top Row: Name and Delete */}
                  <div className={styles.applianceCardTop}>
                    <input
                      className={styles.applianceNameInput}
                      placeholder="Appliance name"
                      value={app.name}
                      onChange={(e) => updateAppliance(index, 'name', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeAppliance(index)}
                      className={styles.deleteBtn}
                      aria-label="Remove appliance"
                    >
                      ×
                    </button>
                  </div>

                  {/* Bottom Row: Wattage Pill + Touch Stepper Quantity */}
                  <div className={styles.applianceCardBottom}>
                    <div className={styles.wattInputGroup}>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={app.watt === 0 ? '' : app.watt}
                        onChange={(e) => updateAppliance(index, 'watt', e.target.value === '' ? 0 : Number(e.target.value))}
                        className={styles.wattInputField}
                      />
                      <span className={styles.wattLabel}>Watts</span>
                    </div>

                    <div className={styles.qtyStepperGroup}>
                      <button 
                        type="button" 
                        onClick={() => handleQtyChange(index, -1)}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className={styles.qtyValue}>{app.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => handleQtyChange(index, 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Appliance Button */}
            <button
              type="button"
              onClick={() => addAppliance({ name: "", watt: 100, quantity: 1 })}
              className={styles.addCustomBtn}
            >
              <span style={{ fontSize: '1.2rem' }}>+</span>
              <span>Add Custom Appliance</span>
            </button>

            {/* Validation Errors */}
            {(errors.property || errors.appliances) && (
              <div style={{ marginTop: '16px' }}>
                {errors.property && <ValidationError message={errors.property} onDismiss={() => clearError('property')} />}
                {errors.appliances && <ValidationError message={errors.appliances} onDismiss={() => clearError('appliances')} />}
              </div>
            )}

            {/* Step 2 Actions */}
            <div className={styles.stepActions}>
              <button 
                type="button" 
                onClick={() => setCurrentStep(1)}
                className={styles.backBtn}
              >
                ← Back to Location
              </button>

              <button 
                type="button" 
                onClick={handleEstimate}
                disabled={loading}
                className={styles.nextBtn}
              >
                <span>{loading ? "Analyzing Energy Needs..." : "Calculate Solar Blueprint"}</span>
                <span>🚀</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: RESULTS / BLUEPRINT ================= */}
        {currentStep === 3 && (
          <div ref={resultsRef}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  ✓ Calculation Complete
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0 0' }}>
                  Your Solar Blueprint
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ✎ Modify Appliances ({appliances.length})
              </button>
            </div>

            {loading && (
              <div style={{ padding: '40px 0' }}>
                <LoadingSpinner message="Calculating your exact solar and storage requirements..." />
              </div>
            )}

            {!loading && result && (
              <AppResult data={result} />
            )}
          </div>
        )}
      </div>

      {/* Mobile Fixed Bottom Navigation Bar & Action Dock */}
      <div className="mobile-bottom-bar">
        <div className="mobile-bar-action-row">
          <div className="mobile-live-summary">
            <span className="mobile-live-label">
              {currentStep === 1 ? 'Current Load' : currentStep === 2 ? `${appliances.length} Appliances` : 'Turnkey Investment'}
            </span>
            <span className="mobile-live-val">
              {currentStep === 3 && result?.estimatedPriceNaira 
                ? `₦${(result.estimatedPriceNaira || 0).toLocaleString()}`
                : `⚡ ${totalSteadyWatts.toLocaleString()}W • ${dailyEnergyKwh} kWh/d`}
            </span>
          </div>

          {currentStep === 1 && (
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="mobile-action-btn"
            >
              <span>Audit Items ({appliances.length})</span>
              <span>→</span>
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleEstimate}
              disabled={loading}
              className="mobile-action-btn"
            >
              <span>{loading ? 'Analyzing...' : 'Calculate Blueprint'}</span>
              <span>🚀</span>
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={() => {
                if (result) {
                  const summary = `*🌞 MasterviewCEL Solar Blueprint*\n📍 Location: ${result.location?.address || 'Nigeria'}\n⚡ Daily Energy: ${((result.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh/day\n🔌 Inverter: ${((result.recommendedInverterW || 0) / 1000).toFixed(1)} kVA\n🔋 Battery: ${result.batteryAh || 0} Ah\n☀️ Solar Array: ${result.panelQuantity || 0} Panels\n💰 Investment: ₦${(result.estimatedPriceNaira || 0).toLocaleString()}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank');
                }
              }}
              className="mobile-action-btn"
              style={{ background: '#25D366', color: '#fff' }}
            >
              <span>Share Quote</span>
              <span>💬</span>
            </button>
          )}
        </div>

        {/* Bottom Pinned Tabs */}
        <div className="mobile-tabs-row">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`mobile-tab-btn ${currentStep === 1 ? 'active' : ''}`}
          >
            <span className="mobile-tab-icon">📍</span>
            <span>Site</span>
          </button>

          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`mobile-tab-btn ${currentStep === 2 ? 'active' : ''}`}
          >
            <span className="mobile-tab-icon">⚡</span>
            <span>Audit</span>
            <span className="mobile-tab-badge">{appliances.length}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (result) goToStep(3);
              else handleEstimate();
            }}
            className={`mobile-tab-btn ${currentStep === 3 ? 'active' : ''}`}
          >
            <span className="mobile-tab-icon">📊</span>
            <span>Blueprint</span>
          </button>
        </div>
      </div>
    </div>
  );
}
