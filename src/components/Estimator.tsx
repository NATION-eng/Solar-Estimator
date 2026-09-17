import { useState, useRef, useEffect } from "react";
import { 
  Home, 
  Building2, 
  ShoppingBag, 
  Utensils, 
  Stethoscope, 
  GraduationCap, 
  Factory, 
  Church, 
  Hotel,
  Check, 
  Layers, 
  MapPin, 
  Clock, 
  BatteryCharging, 
  Cable, 
  Zap, 
  Plug, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  Share2,
  BarChart3,
  Sliders,
  Sun,
  Moon,
  User,
  Wrench,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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

const renderPropertyIcon = (typeId: string) => {
  const size = 18;
  switch (typeId) {
    case "home": return <Home size={size} />;
    case "office": return <Building2 size={size} />;
    case "retail": return <ShoppingBag size={size} />;
    case "restaurant": return <Utensils size={size} />;
    case "hospital": return <Stethoscope size={size} />;
    case "school": return <GraduationCap size={size} />;
    case "hotel": return <Hotel size={size} />;
    case "industrial": return <Factory size={size} />;
    case "worship": return <Church size={size} />;
    default: return <Building2 size={size} />;
  }
};

export default function Estimator() {
  // Check if viewport is mobile or desktop/tablet (matching 768px CSS breakpoint)
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Dual-Persona State: 'client' (Executive Homeowner) vs 'engineer' (Full Technical Rack)
  const [userMode, setUserMode] = useState<'client' | 'engineer'>('client');
  const [fieldMode, setFieldMode] = useState<boolean>(false);
  const [showAdvancedParams, setShowAdvancedParams] = useState<boolean>(false);

  // Stepper state for mobile wizard (1: Location & Site, 2: Energy Audit, 3: Blueprint)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [property, setProperty] = useState("home");
  const [address, setAddress] = useState("Lagos");
  const [hours, setHours] = useState(8);
  const [batteryType, setBatteryType] = useState<'lithium' | 'gel' | 'tubular'>('lithium');
  const [cableDistance, setCableDistance] = useState<number>(20);
  const [isProMode, setIsProMode] = useState<boolean>(false);

  // Synchronize high-contrast direct-sunlight mode to root HTML element
  useEffect(() => {
    if (fieldMode) {
      document.documentElement.setAttribute('data-theme', 'field-contrast');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [fieldMode]);
  
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
      icon: "home", 
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
      icon: "office", 
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
      icon: "retail", 
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
      icon: "restaurant", 
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
      icon: "hospital", 
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
      icon: "school", 
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
      icon: "hotel", 
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
      icon: "industrial", 
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
      icon: "worship", 
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

    await runEstimate(property, address, hours, appliances, batteryType, cableDistance);
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
        <Home size={18} color="var(--color-primary)" />
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
            <span className={styles.propertyIcon}>
              {renderPropertyIcon(t.id)}
            </span>
            <span className={styles.propertyLabel}>{t.label}</span>
            <span className={styles.propertyDesc}>{t.desc}</span>
            {property === t.id && (
              <span className={styles.propertyCheckmark}>
                <Check size={12} strokeWidth={3} />
              </span>
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
        <Layers size={18} color="var(--color-primary)" />
        <span>2. System Parameters & Site Configuration</span>
      </h3>

      <div className={styles.paramsGrid}>
        {/* Param Box 1: Location */}
        <div className={styles.paramBox}>
          <div>
            <label htmlFor="address-input" className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="var(--color-accent)" />
              <span>Installation City / Region</span>
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
              <label className={styles.label} style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="var(--color-primary)" />
                <span>Daily Backup Target</span>
              </label>
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

        {/* In Client Mode, wrap technical parameters in Progressive Disclosure Accordion */}
        {userMode === 'client' && !showAdvancedParams ? (
          <div style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setShowAdvancedParams(true)}
              className={styles.accordionHeader}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={15} color="var(--color-primary)" />
                <span>Advanced Electrical Parameters (Lithium LiFePO4 & 20m PV Cable auto-selected)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 700 }}>
                <span>Configure</span>
                <ChevronDown size={14} />
              </div>
            </button>
          </div>
        ) : (
          <>
            {userMode === 'client' && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginBottom: '-6px' }}>
                <button
                  type="button"
                  onClick={() => setShowAdvancedParams(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ChevronUp size={13} />
                  <span>Collapse Advanced Options</span>
                </button>
              </div>
            )}

            {/* Param Box 3: Battery Storage Technology */}
            <div className={styles.paramBox}>
              <label className={styles.label} style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <BatteryCharging size={15} color="var(--color-success)" />
                <span>Storage Chemistry</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', height: '100%' }}>
                <button
                  type="button"
                  onClick={() => setBatteryType('lithium')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: batteryType === 'lithium' ? '1.5px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.08)',
                    background: batteryType === 'lithium' ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: batteryType === 'lithium' ? 'var(--color-primary)' : '#fff' }}>
                    Lithium LiFePO4
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    85% DoD • 6,000+ Cycles
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBatteryType('tubular')}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: batteryType === 'tubular' ? '1.5px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.08)',
                    background: batteryType === 'tubular' ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: batteryType === 'tubular' ? 'var(--color-primary)' : '#fff' }}>
                    Deep Cycle Tubular
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    50% DoD • Economical
                  </div>
                </button>
              </div>
            </div>

            {/* Param Box 4: Roof-to-Inverter Cable Distance */}
            <div className={styles.paramBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className={styles.label} style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Cable size={15} color="var(--color-accent)" />
                  <span>Roof to Inverter Distance</span>
                </label>
                <span className={styles.rangeValue}>{cableDistance} Meters</span>
              </div>

              <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginBottom: '10px', lineHeight: 1.3 }}>
                Tap your building height to calculate precise DC cable gauge and prevent power loss:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                {[
                  { label: 'Bungalow', sub: '1-Story (~15m)', val: 15 },
                  { label: 'Duplex', sub: '2-Story (~25m)', val: 25 },
                  { label: 'Detached', sub: '3-Story (~40m)', val: 40 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setCableDistance(preset.val)}
                    style={{
                      padding: '8px 6px',
                      borderRadius: 'var(--radius-sm)',
                      border: cableDistance === preset.val ? '1.5px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
                      background: cableDistance === preset.val ? 'var(--color-accent-subtle)' : 'var(--color-bg-surface)',
                      color: '#fff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.78rem', color: cableDistance === preset.val ? 'var(--color-accent)' : '#fff' }}>
                      {preset.label}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                      {preset.sub}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="5"
                  max="70"
                  step="5"
                  value={cableDistance}
                  onChange={(e) => setCableDistance(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  Custom
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Section 3: Appliance Energy Audit Manager
  const renderAppliances = () => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
          <Zap size={18} color="var(--color-primary)" />
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
                <span className={styles.applianceIcon}>
                  <Plug size={15} />
                </span>
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

        {/* Dual-Persona Bar: Homeowner vs. Field Engineer & Sunlight Mode */}
        <div className={styles.personaBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Mode:
            </span>
            <div className={styles.personaSegmented}>
              <button
                type="button"
                onClick={() => setUserMode('client')}
                className={`${styles.personaBtn} ${userMode === 'client' ? styles.personaBtnActive : ''}`}
              >
                <User size={13} />
                <span>Homeowner View</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserMode('engineer');
                  setShowAdvancedParams(true);
                }}
                className={`${styles.personaBtn} ${userMode === 'engineer' ? styles.personaBtnActive : ''}`}
              >
                <Wrench size={13} />
                <span>Field Engineer View</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFieldMode(!fieldMode)}
            className={`${styles.fieldModeToggle} ${fieldMode ? styles.fieldModeToggleActive : ''}`}
            title="Toggle high-contrast white theme for outdoor direct sunlight readability on roofs"
          >
            {fieldMode ? <Moon size={13} /> : <Sun size={13} />}
            <span>{fieldMode ? 'Dark Studio' : 'Outdoor Sunlight Mode'}</span>
          </button>
        </div>

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
                  maxWidth: '480px',
                  background: 'var(--color-primary)',
                  color: '#080c14',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: 'var(--shadow-subtle)',
                  minHeight: '52px',
                  transition: 'background 0.15s ease'
                }}
              >
                <span>{loading ? "Analyzing Energy Profile..." : "Calculate Solar Blueprint"}</span>
                <ArrowRight size={18} />
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
                  <AppResult data={result} userMode={userMode} />
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
                    <ArrowRight size={16} />
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
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Site</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={handleEstimate}
                    disabled={loading}
                    className={styles.nextBtn}
                  >
                    <span>{loading ? "Analyzing Energy..." : "Calculate Blueprint"}</span>
                    <Zap size={16} />
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
                        border: '1px solid var(--border-hairline)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ArrowLeft size={14} />
                      <span>Edit Loads ({appliances.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEstimate}
                      disabled={loading}
                      style={{
                        background: 'rgba(245, 158, 11, 0.08)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Zap size={14} />
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
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                      <Sun size={40} color="var(--color-primary)" />
                    </div>
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
                      style={{ maxWidth: '280px', margin: '0 auto', display: 'flex', justifyContent: 'center', width: '100%', gap: '8px' }}
                    >
                      <span>Calculate Solar Blueprint</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {!loading && result && (
                  <AppResult data={result} userMode={userMode} />
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
              <span className="mobile-live-val" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {currentStep === 3 && result?.estimatedPriceNaira ? (
                  `₦${(result.estimatedPriceNaira || 0).toLocaleString()}`
                ) : (
                  <>
                    <Zap size={12} color="var(--color-primary)" />
                    <span>{totalSteadyWatts.toLocaleString()}W • {dailyEnergyKwh} kWh/d</span>
                  </>
                )}
              </span>
            </div>

            {currentStep === 1 && (
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="mobile-action-btn"
              >
                <span>Audit Items ({appliances.length})</span>
                <ArrowRight size={14} />
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
                <ArrowRight size={15} />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={() => {
                  if (result) {
                    const summary = `*🌞 MasterviewCEL Solar Blueprint*\n📍 Location: ${result.location?.address || 'Nigeria'}\n⚡ Daily Energy: ${((result.dailyEnergyWh || 0) / 1000).toFixed(1)} kWh/day\n🔌 Inverter: ${((result.recommendedInverterW || 0) / 1000).toFixed(1)} kVA\n🔋 Battery: ${result.batteryAh || 0} Ah\n☀️ Solar Array: ${result.panelQuantity || 0} Panels\n📏 DC Cable: ${result.cableGaugeMm2 || 6}mm² (${result.cableDistanceMeters || 20}m run, ${result.voltageDropPct || 1.8}% drop)\n💰 Investment: ₦${(result.estimatedPriceNaira || 0).toLocaleString()}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank');
                  }
                }}
                className="mobile-action-btn"
                style={{ background: '#25D366', color: '#fff' }}
              >
                <span>Share Quote</span>
                <Share2 size={15} color="#fff" />
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
              <span className="mobile-tab-icon">
                <MapPin size={17} />
              </span>
              <span>Site</span>
            </button>

            <button
              type="button"
              onClick={() => goToStep(2)}
              className={`mobile-tab-btn ${currentStep === 2 ? 'active' : ''}`}
            >
              <span className="mobile-tab-icon">
                <Zap size={17} />
              </span>
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
              <span className="mobile-tab-icon">
                <BarChart3 size={17} />
              </span>
              <span>Blueprint</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
