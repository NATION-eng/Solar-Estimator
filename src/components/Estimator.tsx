import { useState } from "react";
import AppResult from "./AppResult";
import ApplianceSelector from "./ApplianceSelector";
import { LoadingSpinner } from "./LoadingSpinner";
import { ValidationError } from "./ValidationError";
import { useFormValidation } from "../hooks/useFormValidation";
import { useEstimation } from "../hooks/useEstimation";
import { useAppliances } from "../hooks/useAppliances";
import type { PropertyType } from "../types";

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

  /* ================= UI ================= */

  return (
    <div className="container-wide" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="glass-panel p-responsive" style={{ 
        borderRadius: 'var(--radius-lg)',
        borderTop: '1px solid rgba(255,255,255,0.1)' 
      }}>
        {/* PROGRESS INDICATOR (Dope Feature) */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
             <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assessment Progress</span>
             <span>{property ? (address ? (appliances.length > 0 ? "100%" : "75%") : "50%") : "25%"}</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
             <div style={{ 
               height: '100%', 
               background: 'var(--color-primary)', 
               width: property ? (address ? (appliances.length > 0 ? "100%" : "75%") : "50%") : "25%",
               transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
               boxShadow: '0 0 10px var(--color-primary)'
             }}></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "8px" }}>
            Configuration
          </h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            Select your property type to load optimized energy presets.
          </p>
        </div>

        {/* PROPERTY SELECTOR */}
        <div className="grid-property" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '40px' 
        }}>
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
              style={{
                background: property === t.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                border: property === t.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: property === t.id ? '#fff' : 'var(--color-text-muted)',
                padding: '24px 20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                if (property !== t.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                if (property !== t.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '2rem' }}>{t.icon}</span>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 700, display: 'block' }}>{t.label}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{t.desc}</span>
              </div>
              {property === t.id && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-4px', 
                  right: '-4px', 
                  background: '#fff', 
                  color: 'var(--color-primary)', 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>✓</div>
              )}
            </button>
          ))}
        </div>

        {/* DETAILS FORM */}
        <div style={{ 
          opacity: property ? 1 : 0.5, 
          pointerEvents: property ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}>
          
          <div style={{ marginBottom: '24px' }}>
             <label 
               htmlFor="address-input"
               style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--color-text-muted)' }}
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
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: errors.address ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = errors.address ? '#ef4444' : 'var(--color-primary)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.address ? '#ef4444' : 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
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

          <div style={{ marginBottom: '32px' }}>
             <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
               Daily Usage Target (Hours)
             </label>
             <input
                type="range"
                min="1"
                max="24"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                <span>1 hr</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{hours} hours / day</span>
                <span>24 hrs</span>
              </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontWeight: "700", marginBottom: "20px", display: 'flex', alignItems: 'center', gap: '12px' }}>
               <span>⚡ Your Appliances</span>
               <span style={{ 
                 fontSize: '0.75rem', 
                 background: 'rgba(251, 191, 36, 0.15)', 
                 padding: '4px 12px', 
                 borderRadius: '100px',
                 color: 'var(--color-primary)',
                 fontWeight: 600
               }}>{appliances.length} items</span>
            </h3>

            {/* Appliance Database Selector */}
            <ApplianceSelector onAdd={addAppliance} />

            {/* Manual Appliance List */}
            <div style={{ marginTop: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                fontWeight: 600,
                color: 'var(--color-text-main)',
                fontSize: '0.9rem'
              }}>
                Your Appliance List
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appliances.map((app, index) => (
                  <div key={index} className="appliance-row" style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr auto",
                    gap: "12px",
                    alignItems: "center",
                    background: "linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(251, 191, 36, 0.2)",
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    {/* Appliance Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <input
                        style={{ 
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          borderRadius: '6px',
                          padding: '10px 12px',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                        placeholder="Appliance name"
                        value={app.name}
                        onChange={(e) => updateAppliance(index, 'name', e.target.value)}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--color-primary)';
                          e.target.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.target.style.background = 'rgba(255,255,255,0.05)';
                        }}
                      />
                    </div>

                    {/* Wattage Input */}
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        style={{ 
                          width: '100%',
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          borderRadius: '6px',
                          padding: '10px 28px 10px 12px',
                          textAlign: 'center',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                        placeholder="Watts"
                        value={app.watt === 0 ? '' : app.watt}
                        onChange={(e) => updateAppliance(index, 'watt', e.target.value === '' ? 0 : Number(e.target.value))}
                        onFocus={(e) => {
                          e.target.select();
                          e.target.style.borderColor = 'var(--color-primary)';
                          e.target.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.target.style.background = 'rgba(255,255,255,0.05)';
                        }}
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
                        style={{ 
                          width: '100%',
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: '#fff', 
                          borderRadius: '6px',
                          padding: '10px 32px 10px 12px',
                          textAlign: 'center',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          outline: 'none',
                          transition: 'all 0.2s'
                        }}
                        value={app.quantity === 0 ? '' : app.quantity}
                        onChange={(e) => updateAppliance(index, 'quantity', e.target.value === '' ? 1 : Number(e.target.value))}
                        onFocus={(e) => {
                          e.target.select();
                          e.target.style.borderColor = 'var(--color-primary)';
                          e.target.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.target.style.background = 'rgba(255,255,255,0.05)';
                        }}
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
                      className="remove-btn"
                      aria-label="Remove appliance"
                      style={{
                        color: "#ff6b6b",
                        background: "rgba(255, 107, 107, 0.1)",
                        fontSize: "1.3rem",
                        padding: "8px 12px",
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 107, 107, 0.2)',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        position: 'relative',
                        zIndex: 10,
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.2)';
                      }}
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
                style={{
                  background: "transparent",
                  border: "2px dashed rgba(251, 191, 36, 0.3)",
                  color: "var(--color-primary)",
                  padding: "14px",
                  width: "100%",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.95rem",
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.background = 'rgba(251, 191, 36, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>+</span>
                <span>Add Custom Appliance</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: "40px", textAlign: 'center' }}>
            <button 
              className="btn-primary" 
              onClick={handleEstimate} 
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                color: '#fff',
                padding: '18px 60px',
                fontSize: '1.1rem',
                borderRadius: '100px',
                boxShadow: 'var(--shadow-glow)',
                fontWeight: 700,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'wait' : 'pointer'
              }}
            >
              {loading ? "Analyzing Energy Profile..." : "Calculate Solar Needs"}
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {result && <AppResult data={result} />}
    </div>
  );
}
