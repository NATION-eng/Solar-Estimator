import React, { useState } from 'react';
import { Wrench, X, Check, RotateCcw, AlertTriangle, ShieldCheck, Zap, Battery, Sun, Cable } from 'lucide-react';
import type { EstimationResult } from '../types';

export interface HardwareOverrides {
  panelWattage?: number;
  systemVoltage?: number;
  batteryType?: 'lithium' | 'gel' | 'tubular';
  batteryRackKwh?: number;
  inverterBrand?: string;
  cableDistanceMeters?: number;
}

interface EngineerOverrideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: EstimationResult;
  onApplyOverrides: (overrides: HardwareOverrides) => void;
}

export default function EngineerOverrideDrawer({
  isOpen,
  onClose,
  currentResult,
  onApplyOverrides
}: EngineerOverrideDrawerProps) {
  const [panelWattage, setPanelWattage] = useState<number>(currentResult.panelWattage || 450);
  const [systemVoltage, setSystemVoltage] = useState<number>(currentResult.systemVoltage || 48);
  const [batteryType, setBatteryType] = useState<'lithium' | 'gel' | 'tubular'>(currentResult.batteryType || 'lithium');
  const [inverterBrand, setInverterBrand] = useState<string>(currentResult.inverterBrand || 'Deye Hybrid');
  const [cableDistance, setCableDistance] = useState<number>(currentResult.cableDistanceMeters || 20);

  if (!isOpen) return null;

  // Sizing recalculations based on overrides
  const dailyEnergyWh = currentResult.dailyEnergyWh || 12000;
  const psh = currentResult.location?.psh || 4.8;
  const requiredPanelWatts = dailyEnergyWh / (psh * 0.82);
  let recalculatedPanels = Math.max(2, Math.ceil(requiredPanelWatts / panelWattage));
  if (recalculatedPanels > 2 && recalculatedPanels % 2 !== 0) recalculatedPanels += 1;

  // Voltage drop recalculation
  const pvCurrentAmps = (recalculatedPanels * panelWattage) / (systemVoltage === 48 ? 120 : 60); // Assuming string voltage
  const cableGaugeMm2 = currentResult.cableGaugeMm2 || 6;
  const copperResistivity = 0.0175; // ohm*mm2/m
  const loopDistance = cableDistance * 2;
  const resistance = (copperResistivity * loopDistance) / cableGaugeMm2;
  const recalculatedDropPct = Math.min(6.0, Number(((pvCurrentAmps * resistance) / (systemVoltage === 48 ? 120 : 60) * 100).toFixed(1)));

  const handleApply = () => {
    onApplyOverrides({
      panelWattage,
      systemVoltage,
      batteryType,
      inverterBrand,
      cableDistanceMeters: cableDistance
    });
    onClose();
  };

  const handleReset = () => {
    setPanelWattage(450);
    setSystemVoltage(48);
    setBatteryType('lithium');
    setInverterBrand('Deye Hybrid');
    setCableDistance(20);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 14, 0.82)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        background: 'var(--color-bg-surface)',
        width: '100%',
        maxWidth: '520px',
        height: '100%',
        overflowY: 'auto',
        borderLeft: '1px solid var(--border-hairline)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        padding: 'clamp(20px, 4vw, 32px)'
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--color-accent)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <Wrench size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                Hardware & Inventory Override
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                Field Engineer Telemetry & Warehouse Matching
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-hairline)',
              color: 'var(--color-text-muted)',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
          {/* Panel Wattage Selector */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              <Sun size={15} color="var(--color-primary)" />
              <span>Solar PV Module Wattage (Stock Rating)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
              {[400, 450, 550, 600, 650].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setPanelWattage(w)}
                  style={{
                    padding: '10px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: panelWattage === w ? 'var(--color-primary)' : 'rgba(255,255,255,0.04)',
                    color: panelWattage === w ? '#0a0e17' : 'var(--color-text-main)',
                    border: `1px solid ${panelWattage === w ? 'var(--color-primary)' : 'var(--border-hairline)'}`,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {w}W {w >= 600 ? 'Bifacial' : 'Mono'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              Selected: <strong>{recalculatedPanels} panels</strong> needed for {(recalculatedPanels * panelWattage / 1000).toFixed(2)} kWp array.
            </div>
          </div>

          {/* Inverter Brand Selection */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              <Zap size={15} color="var(--color-accent)" />
              <span>Inverter Brand & Efficiency Class</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {[
                { brand: 'Deye Hybrid', eff: '97.6%' },
                { brand: 'Growatt SPF', eff: '93.0%' },
                { brand: 'Felicity Solar', eff: '93.0%' },
                { brand: 'Victron MultiPlus', eff: '95.0%' },
                { brand: 'Must PV1800', eff: '88.0%' }
              ].map((item) => (
                <button
                  key={item.brand}
                  type="button"
                  onClick={() => setInverterBrand(item.brand)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: inverterBrand === item.brand ? 'var(--color-accent)' : 'rgba(255,255,255,0.04)',
                    color: inverterBrand === item.brand ? '#0a0e17' : 'var(--color-text-main)',
                    border: `1px solid ${inverterBrand === item.brand ? 'var(--color-accent)' : 'var(--border-hairline)'}`,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>{item.brand}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{item.eff} Efficiency</div>
                </button>
              ))}
            </div>
          </div>

          {/* System DC Bus Voltage */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              <ShieldCheck size={15} color="var(--color-success)" />
              <span>DC Bus Architecture Voltage</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[24, 48].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSystemVoltage(v)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: systemVoltage === v ? 'var(--color-success)' : 'rgba(255,255,255,0.04)',
                    color: systemVoltage === v ? '#0a0e17' : 'var(--color-text-main)',
                    border: `1px solid ${systemVoltage === v ? 'var(--color-success)' : 'var(--border-hairline)'}`,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {v}V DC Bus {v === 48 ? '(Commercial Standard)' : '(Compact 24V)'}
                </button>
              ))}
            </div>
          </div>

          {/* Battery Chemistry */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              <Battery size={15} color="var(--color-success)" />
              <span>Storage Chemistry & Form Factor</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {[
                { type: 'lithium', label: 'LiFePO4 Rack', desc: '10-Year (80% DoD)' },
                { type: 'tubular', label: 'Tubular Flooded', desc: '4-Year (50% DoD)' },
                { type: 'gel', label: 'Deep Cycle Gel', desc: '3-Year (50% DoD)' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setBatteryType(item.type as any)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: batteryType === item.type ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.04)',
                    color: batteryType === item.type ? 'var(--color-success)' : 'var(--color-text-main)',
                    border: `1px solid ${batteryType === item.type ? 'var(--color-success)' : 'var(--border-hairline)'}`,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>{item.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* DC Cable Distance */}
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cable size={15} color="var(--color-accent)" />
                <span>Roof-to-Inverter Cable Distance</span>
              </span>
              <span style={{ color: 'var(--color-accent)' }}>{cableDistance} Meters</span>
            </label>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={cableDistance}
              onChange={(e) => setCableDistance(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '6px',
              fontSize: '0.74rem'
            }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Calculated Voltage Drop:</span>
              <span style={{
                fontWeight: 700,
                color: recalculatedDropPct <= 2.5 ? 'var(--color-success)' : 'var(--color-primary)'
              }}>
                {recalculatedDropPct}% {recalculatedDropPct <= 2.5 ? '(Optimal ≤ 3%)' : '(Marginal drop)'}
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '20px', marginTop: '24px', display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-hairline)',
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary)',
              border: 'none',
              color: '#0a0e17',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Check size={16} />
            <span>Apply Hardware Overrides</span>
          </button>
        </div>
      </div>
    </div>
  );
}
