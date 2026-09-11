import { useState, useRef } from "react";
import AppResult from "./AppResult";
import ApplianceSelector from "./ApplianceSelector";
import { LoadingSpinner } from "./LoadingSpinner";
import { ValidationError } from "./ValidationError";
import { useFormValidation } from "../hooks/useFormValidation";
import { useEstimation } from "../hooks/useEstimation";
import { useAppliances } from "../hooks/useAppliances";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { PropertyType } from "../types";
import styles from "./Estimator.module.css";

export default function Estimator() {
  // Check if viewport is mobile or desktop/tablet (matching 768px CSS breakpoint)
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Stepper state for mobile wizard (1: Location & Site, 2: Energy Audit, 3: Blueprint)
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
  const topContainerRef = useRef<HTMLDivElement>(null);

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
    if (isMobile) {
      setCurrentStep(3);
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const goToStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
    topContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  /* ================= REUSABLE RENDER SECTIONS ================= */

  // Section 1: Property Types Selection
  const renderPropertyGrid = () => (
    <div style={{ marginBottom: '28px' }}>
      <h3 className={styles.sectionTitle}>
        <span>🏠</span>
        <span>1. Select Property Type</span>
      </h3>
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
    </div>
  );

  // Section 2: Location, Hours & Battery Parameters
  const renderParameters = () => (
    <div style={{ marginBottom: '32px' }}>
      <h3 className={styles.sectionTitle}>
        <span>⚙️</span>
        <span>2. System Parameters & Site Configuration</span>
      </h3>

      <div className={styles.paramsGrid}>
        {/* Param Box 1: Location */}
        <div className={styles.paramBox}>
          <div>
            <label htmlFor="address-input" className={styles.label}>
              📍 Installation City / Region
            </label>
            <input
              id="address-input"
              type="text"
              placeholder="e.g. Lagos, Abuja, Port Harcourt"
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
          </div>

          {/* Quick City Presets */}
          <div className={styles.presetChipsRow} style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>Popular:</span>
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

        {/* Param Box 2: Target Backup Hours */}
        <div className={styles.paramBox}>
          <div>
            <div className={styles.rangeLabels}>
              <label className={styles.label} style={{ margin: 0 }}>⏱️ Daily Backup Target</label>
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
          </div>

          <div className={styles.presetChipsRow} style={{ marginTop: '12px' }}>
            {[
              { label: '4h Night', val: 4 },
              { label: '8h Business', val: 8 },
              { label: '12h Extended', val: 12 },
              { label: '18h Heavy', val: 18 },
              { label: '24h Off-Grid', val: 24 }
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

        {/* Param Box 3: Battery Storage Technology */}
        <div className={styles.paramBox}>
          <label className={styles.label} style={{ marginBottom: '10px' }}>
            🔋 Storage Technology
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', height: '100%' }}>
            <button
              type="button"
              onClick={() => setBatteryType('lithium')}
              style={{
                padding: '12px 10px',
                borderRadius: 'var(--radius-sm)',
                border: batteryType === 'lithium' ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                background: batteryType === 'lithium' ? 'rgba(251, 191, 36, 0.12)' : 'rgba(0,0,0,0.2)',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: batteryType === 'lithium' ? 'var(--color-primary)' : 'inherit' }}>
                Lithium LiFePO4
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                80% DOD • 10-15yr
              </div>
            </button>

            <button
              type="button"
              onClick={() => setBatteryType('tubular')}
              style={{
                padding: '12px 10px',
                borderRadius: 'var(--radius-sm)',
                border: batteryType === 'tubular' ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                background: batteryType === 'tubular' ? 'rgba(251, 191, 36, 0.12)' : 'rgba(0,0,0,0.2)',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: batteryType === 'tubular' ? 'var(--color-primary)' : 'inherit' }}>
                Deep Cycle Tubular
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                50% DOD • Economical
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Section 3: Appliance Energy Audit Manager
  const renderAppliances = () => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
          <span>⚡</span>
          <span>{isMobile ? `Appliance Energy Audit (${appliances.length} Items)` : `3. Appliance Energy Audit (${appliances.length} Items)`}</span>
        </h3>
      </div>

      {/* Quick Catalog Selector */}
      <ApplianceSelector onAdd={addAppliance} />

      {/* Appliance Cards List */}
      <div className={styles.applianceList}>
        {appliances.map((app, index) => (
          <div key={index} className={styles.applianceCard}>
            {/* Header Row: Icon + Name + Mobile Delete */}
            <div className={styles.applianceHeader}>
              <div className={styles.applianceNameWrap}>
                <span className={styles.applianceIcon}>🔌</span>
                <input
                  className={styles.applianceNameInput}
                  placeholder="Appliance name"
                  value={app.name}
                  onChange={(e) => updateAppliance(index, 'name', e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => removeAppliance(index)}
                className={styles.deleteBtnMobile}
                aria-label={`Remove ${app.name || 'appliance'}`}
              >
                ×
              </button>
            </div>

            {/* Controls Row: Wattage, Quantity, Subtotal, Desktop Delete */}
            <div className={styles.applianceControls}>
              <div className={styles.wattInputGroup}>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={app.watt === 0 ? '' : app.watt}
                  onChange={(e) => updateAppliance(index, 'watt', e.target.value === '' ? 0 : Number(e.target.value))}
                  className={styles.wattInputField}
                />
                <span className={styles.wattLabel}>W</span>
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

              <div className={styles.applianceSubtotal}>
                {(app.watt * app.quantity).toLocaleString()} W
              </div>

              <button
                type="button"
                onClick={() => removeAppliance(index)}
                className={styles.deleteBtnDesktop}
                aria-label={`Remove ${app.name || 'appliance'}`}
              >
                ×
              </button>
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
    </div>
  );

  return (
    <div className={styles.container} ref={topContainerRef}>
      <div className={styles.glassPanel}>

        {/* ========================================================================= */}
        {/* DESKTOP / TABLET VIEW: Expansive High-End Dashboard Flow                  */}
        {/* ========================================================================= */}
        {!isMobile ? (
          <div>
            {/* Live Load Status HUD */}
            <div className={styles.liveLoadBar}>
              <div className={styles.liveLoadMetric}>
                <span className={styles.liveLoadLabel}>Total Steady Load</span>
                <span className={styles.liveLoadValue}>{totalSteadyWatts.toLocaleString()} W</span>
              </div>

              <div className={styles.liveLoadMetric} style={{ textAlign: 'center' }}>
                <span className={styles.liveLoadLabel}>Daily Target</span>
                <span className={styles.liveLoadValue}>{dailyEnergyKwh} kWh/day</span>
              </div>

              <div className={styles.liveLoadMetric} style={{ textAlign: 'right' }}>
                <span className={styles.liveLoadLabel}>Target Backup Hours</span>
                <span className={styles.liveLoadValue}>{hours} Hours</span>
              </div>
            </div>

            {/* 1. Property Type Grid */}
            {renderPropertyGrid()}

            {/* 2. Parameters Grid (3 Columns) */}
            {renderParameters()}

            {/* 3. Appliance Energy Audit */}
            {renderAppliances()}

            {/* Primary Calculate Button */}
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleEstimate}
                disabled={loading}
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  background: 'var(--color-primary)',
                  color: '#000',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '100px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: 'var(--shadow-glow)',
                  minHeight: '56px',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>{loading ? "Analyzing Energy Profile..." : "Calculate Solar Blueprint"}</span>
                <span>🚀</span>
              </button>
            </div>

            {/* Desktop Blueprint Section (Unfolds below) */}
            {(loading || result) && (
              <div ref={resultsRef} style={{ marginTop: '54px', paddingTop: '40px', borderTop: '1px solid rgba(251, 191, 36, 0.25)' }}>
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
        ) : (
          /* ========================================================================= */
          /* MOBILE VIEW: Focused 3-Step Touch-Optimized Mobile App Wizard              */
          /* ========================================================================= */
          <div>
            {/* Mobile Stepper Header */}
            <div className={styles.stepperBar}>
              <button 
                type="button"
                onClick={() => goToStep(1)}
                className={`${styles.stepperTab} ${currentStep === 1 ? styles.stepperTabActive : ''}`}
              >
                <span className={styles.stepNumber}>1</span>
                <span>Site</span>
              </button>

              <button 
                type="button"
                onClick={() => goToStep(2)}
                className={`${styles.stepperTab} ${currentStep === 2 ? styles.stepperTabActive : ''}`}
              >
                <span className={styles.stepNumber}>2</span>
                <span>Audit ({appliances.length})</span>
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
                <span className={styles.liveLoadLabel}>Steady Load</span>
                <span className={styles.liveLoadValue}>{totalSteadyWatts.toLocaleString()} W</span>
              </div>

              <div className={styles.liveLoadMetric} style={{ textAlign: 'center' }}>
                <span className={styles.liveLoadLabel}>Daily Target</span>
                <span className={styles.liveLoadValue}>{dailyEnergyKwh} kWh/d</span>
              </div>

              <div className={styles.liveLoadMetric} style={{ textAlign: 'right' }}>
                <span className={styles.liveLoadLabel}>Backup</span>
                <span className={styles.liveLoadValue}>{hours} hrs</span>
              </div>
            </div>

            {/* Mobile Step 1: Site & Parameters */}
            {currentStep === 1 && (
              <div>
                {renderPropertyGrid()}
                {renderParameters()}

                <div className={styles.stepActions}>
                  <div></div>
                  <button 
                    type="button" 
                    onClick={() => goToStep(2)}
                    className={styles.nextBtn}
                  >
                    <span>Continue to Energy Audit</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Step 2: Energy Audit */}
            {currentStep === 2 && (
              <div>
                {renderAppliances()}

                <div className={styles.stepActions}>
                  <button 
                    type="button" 
                    onClick={() => goToStep(1)}
                    className={styles.backBtn}
                  >
                    ← Back to Site
                  </button>

                  <button 
                    type="button" 
                    onClick={handleEstimate}
                    disabled={loading}
                    className={styles.nextBtn}
                  >
                    <span>{loading ? "Analyzing Energy..." : "Calculate Blueprint"}</span>
                    <span>🚀</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Step 3: Solar Blueprint */}
            {currentStep === 3 && (
              <div ref={resultsRef}>
                {result && !loading && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '16px', 
                    paddingBottom: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--color-text-muted)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>←</span>
                      <span>Edit Loads ({appliances.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEstimate}
                      disabled={loading}
                      style={{
                        background: 'rgba(251, 191, 36, 0.1)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>⚡</span>
                      <span>Recalculate</span>
                    </button>
                  </div>
                )}

                {loading && (
                  <div style={{ padding: '60px 0' }}>
                    <LoadingSpinner message="Calculating your exact solar and storage requirements..." />
                  </div>
                )}

                {!loading && !result && (
                  <div style={{
                    textAlign: 'center',
                    padding: '44px 18px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginTop: '12px'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>☀️</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
                      Ready to Generate Your Solar Blueprint?
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', maxWidth: '360px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                      You have {appliances.length} appliances configured ({totalSteadyWatts.toLocaleString()}W continuous load). Run our calculation engine to size your inverter, batteries, and PV array!
                    </p>
                    <button
                      type="button"
                      onClick={handleEstimate}
                      className={styles.nextBtn}
                      style={{ maxWidth: '280px', margin: '0 auto', display: 'flex', justifyContent: 'center', width: '100%' }}
                    >
                      <span>Calculate Solar Blueprint</span>
                      <span>🚀</span>
                    </button>
                  </div>
                )}

                {!loading && result && (
                  <AppResult data={result} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Fixed Bottom Navigation Bar & Action Dock (Mobile only) */}
      {isMobile && (
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
      )}
    </div>
  );
}
