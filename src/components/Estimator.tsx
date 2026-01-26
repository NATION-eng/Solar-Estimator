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
  const [appliances, setAppliances] = useState<Appliance[]>([
    { name: "LED TV", watt: 150, quantity: 1 },
    { name: "Refrigerator", watt: 200, quantity: 1 },
    { name: "Lighting Point", watt: 15, quantity: 5 },
  ]);
  const [hours, setHours] = useState(6);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const types = [
    { id: "home", label: "Residential", icon: "🏠" },
    { id: "office", label: "Corporate", icon: "🏢" },
    { id: "school", label: "Education", icon: "🏫" },
    { id: "hospital", label: "Medical", icon: "🏥" },
  ];

  /* ================= HANDLERS ================= */

  const runEstimate = async () => {
    if (!property) {
      alert("Please select a property type to proceed.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate network delay for effect
    await new Promise(r => setTimeout(r, 1500));

    try {
      const payload = {
        propertyType: property,
        hours: Number(hours),
        appliances: appliances.map((a) => ({
          name: a.name,
          watt: Number(a.watt),
          quantity: Number(a.quantity),
        })),
        contact: {
          name: "Demo User",
          phone: "0000000000",
          location: "Demo Location",
        },
      };

      // Try backend first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const response = await fetch("http://localhost:5000/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Backend error");

      const data = await response.json();
      setResult({
        totalLoadWatts: data.totalLoadWatts || 0,
        dailyEnergyWh: data.dailyEnergyWh || 0,
        recommendedInverterW: data.recommendedInverterW || 0,
        batteryCapacityWh: data.batteryCapacityWh || 0,
        estimatedPriceNaira: data.estimatedPriceNaira || 0,
      });

    } catch (error) {
      console.warn("Backend unavailable, switching to Demo Mode", error);
      // Fallback to local calculation
      const demoResult = mockEstimate(appliances, hours);
      setResult(demoResult);
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
      <div className="glass-panel" style={{ 
        padding: '40px', 
        borderRadius: 'var(--radius-lg)',
        borderTop: '1px solid rgba(255,255,255,0.1)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "8px" }}>
            Configuration
          </h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            Select your property type and list your improved appliances.
          </p>
        </div>

        {/* PROPERTY SELECTOR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setProperty(t.id)}
              style={{
                background: property === t.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                border: property === t.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: property === t.id ? '#fff' : 'var(--color-text-muted)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* DETAILS FORM */}
        <div style={{ 
          opacity: property ? 1 : 0.5, 
          pointerEvents: property ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}>
          
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
              <div key={index} style={{
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
                fontSize: "0.9rem"
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
