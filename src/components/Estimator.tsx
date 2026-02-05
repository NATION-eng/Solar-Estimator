import { useState } from "react";
import AppResult from "./AppResult";

/* ================= TYPES ================= */

type Appliance = {
  name: string;
  watt: number;
  quantity: number;
};

type EstimationResult = {
  totalLoadWatts: number;
  dailyEnergyWh: number;
  recommendedInverterW: number;
  batteryCapacityWh: number;
  estimatedPriceNaira?: number;
};

/* ================= MOCK LOGIC (DEMO MODE) ================= */
const mockEstimate = (appliances: Appliance[], hours: number): EstimationResult => {
  const totalLoad = appliances.reduce((acc, curr) => acc + (curr.watt * curr.quantity), 0);
  const dailyEnergy = totalLoad * hours;
  
  // Simple heuristic for demo
  const inverter = Math.ceil(totalLoad * 1.5 / 1000) * 1000; 
  const battery = Math.ceil(dailyEnergy * 1.2); 
  
  // Rough price estimation (just for demo visuals)
  const price = (inverter * 150) + (battery * 100) + 50000; 

  return {
    totalLoadWatts: totalLoad,
    dailyEnergyWh: dailyEnergy,
    recommendedInverterW: inverter > 1000 ? inverter : 1000, // min 1kVA
    batteryCapacityWh: battery,
    estimatedPriceNaira: price
  };
};

/* ================= COMPONENT ================= */

export default function Estimator() {
  const [property, setProperty] = useState("");
  const [address, setAddress] = useState("");
  const [appliances, setAppliances] = useState<Appliance[]>([
    { name: "LED TV", watt: 150, quantity: 1 },
    { name: "Refrigerator", watt: 200, quantity: 1 },
    { name: "Lighting Point", watt: 15, quantity: 5 },
  ]);
  const [hours, setHours] = useState(6);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const types = [
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
      setAppliances(selected.presets);
    }
  };

  const runEstimate = async () => {
    if (!property) {
      alert("Please select a property type to proceed.");
      return;
    }
    if (!address) {
      alert("Please enter your installation address.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload = {
        propertyType: property,
        address: address,
        hours: Number(hours),
        appliances: appliances.map((a) => ({
          name: a.name,
          watt: Number(a.watt),
          quantity: Number(a.quantity),
          isSurgeHeavy: a.name.toLowerCase().includes('fridge') || a.name.toLowerCase().includes('ac') || a.name.toLowerCase().includes('pump')
        })),
        contact: {
          name: "Demo User",
          phone: "0000000000",
        },
      };

      const response = await fetch("http://127.0.0.1:5050/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Backend error");
      }

      const data = await response.json();
      setResult(data);

    } catch (error: any) {
      console.error("Estimation error:", error);
      alert(`Estimation failed: ${error.message}`);
      
      // Fallback removed for "Exquisite" mode to ensure reality, 
      // but let's keep a simple fallback if the user is just testing without a local server
      if (error.message.includes('Failed to fetch')) {
         const demoResult = mockEstimate(appliances, hours);
         setResult(demoResult);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateAppliance = (index: number, field: keyof Appliance, value: string | number) => {
    const copy = [...appliances];
    // @ts-ignore
    copy[index][field] = value;
    setAppliances(copy);
  };

  const removeAppliance = (index: number) => {
    setAppliances(appliances.filter((_, i) => i !== index));
  };

  const addAppliance = () => {
    setAppliances([...appliances, { name: "", watt: 0, quantity: 1 }]);
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
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                if (property !== t.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                if (property !== t.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
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
             <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--color-text-muted)' }}>
               Installation Address
             </label>
             <input
                type="text"
                placeholder="Enter city or full address (e.g. Lagos, Nigeria)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
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

          <h3 style={{ fontWeight: "700", marginBottom: "20px", display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span>Appliances</span>
             <span style={{ 
               fontSize: '0.75rem', 
               background: 'rgba(255,255,255,0.1)', 
               padding: '4px 8px', 
               borderRadius: '100px',
               color: 'var(--color-text-muted)'
             }}>{appliances.length} items</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appliances.map((app, index) => (
              <div key={index} className="appliance-row" style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr auto",
                gap: "12px",
                alignItems: "center",
                background: "rgba(0,0,0,0.2)",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(255,255,255,0.05)"
              }}>
                <input
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#fff', 
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    padding: '8px'
                  }}
                  placeholder="Appliance name"
                  value={app.name}
                  onChange={(e) => updateAppliance(index, 'name', e.target.value)}
                />

                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    style={{ 
                      width: '100%',
                      background: 'transparent', 
                      border: 'none', 
                      color: '#fff', 
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      padding: '8px',
                      textAlign: 'center'
                    }}
                    placeholder="0"
                    value={app.watt}
                    onChange={(e) => updateAppliance(index, 'watt', Number(e.target.value))}
                  />
                  <span style={{ position: 'absolute', right: 0, top: '8px', fontSize: '0.8rem', opacity: 0.5 }}>W</span>
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    style={{ 
                      width: '100%',
                      background: 'transparent', 
                      border: 'none', 
                      color: '#fff', 
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      padding: '8px',
                      textAlign: 'center'
                    }}
                    value={app.quantity}
                    onChange={(e) => updateAppliance(index, 'quantity', Number(e.target.value))}
                  />
                   <span style={{ position: 'absolute', right: 0, top: '8px', fontSize: '0.8rem', opacity: 0.5 }}>Qty</span>
                </div>

                <button
                  onClick={() => removeAppliance(index)}
                  className="remove-btn"
                  style={{
                    color: "var(--color-text-muted)",
                    background: "transparent",
                    fontSize: "1.2rem",
                    padding: "0 8px"
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "20px", display: 'flex', gap: '16px' }}>
            <button
              onClick={addAppliance}
              style={{
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.2)",
                color: "var(--color-text-muted)",
                padding: "12px",
                width: "100%",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                cursor: 'pointer'
              }}
            >
              + Add Another Appliance
            </button>
          </div>

          <div style={{ marginTop: "40px", textAlign: 'center' }}>
            <button 
              className="btn-primary" 
              onClick={runEstimate} 
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
