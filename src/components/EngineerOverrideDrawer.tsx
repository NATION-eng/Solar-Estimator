import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wrench, X, Check, RotateCcw, ShieldCheck, Zap, Battery, Sun, Cable } from 'lucide-react';
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
  // Defensive state initialization with safe fallbacks
  const [panelWattage, setPanelWattage] = useState<number>(() => currentResult?.panelWattage || 450);
  const [systemVoltage, setSystemVoltage] = useState<number>(() => currentResult?.systemVoltage || 48);
  const [batteryType, setBatteryType] = useState<'lithium' | 'gel' | 'tubular'>(() => currentResult?.batteryType || 'lithium');
  const [inverterBrand, setInverterBrand] = useState<string>(() => currentResult?.inverterBrand || 'Deye Hybrid');
  const [cableDistance, setCableDistance] = useState<number>(() => currentResult?.cableDistanceMeters || 20);

  // Synchronize state whenever drawer opens or currentResult updates
  useEffect(() => {
    if (isOpen && currentResult) {
      if (currentResult.panelWattage) setPanelWattage(currentResult.panelWattage);
      if (currentResult.systemVoltage) setSystemVoltage(currentResult.systemVoltage);
      if (currentResult.batteryType) setBatteryType(currentResult.batteryType);
      if (currentResult.inverterBrand) setInverterBrand(currentResult.inverterBrand);
      if (currentResult.cableDistanceMeters) setCableDistance(currentResult.cableDistanceMeters);
    }
  }, [isOpen, currentResult]);

  // Handle ESC key press to close drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Safe numerical calculations with rock-solid guards
  const safePanelWattage = Number(panelWattage) > 0 ? Number(panelWattage) : 450;
  const safeSystemVoltage = (Number(systemVoltage) === 24 || Number(systemVoltage) === 48) ? Number(systemVoltage) : 48;
  const safeCableDistance = Number(cableDistance) > 0 ? Number(cableDistance) : 20;
  const safeDailyEnergyWh = Number(currentResult?.dailyEnergyWh) > 0 ? Number(currentResult.dailyEnergyWh) : 12000;
  const safePsh = Number(currentResult?.location?.psh) > 0 ? Number(currentResult.location.psh) : 4.8;
  const safeCableGauge = Number(currentResult?.cableGaugeMm2) > 0 ? Number(currentResult.cableGaugeMm2) : 6;

  // Sizing recalculations based on overrides
  const requiredPanelWatts = safeDailyEnergyWh / (safePsh * 0.82);
  let recalculatedPanels = Math.max(2, Math.ceil(requiredPanelWatts / safePanelWattage));
  if (recalculatedPanels > 2 && recalculatedPanels % 2 !== 0) recalculatedPanels += 1;

  // Voltage drop recalculation
  const pvStringVoltage = safeSystemVoltage === 48 ? 120 : 60; // Assuming balanced series strings
  const pvCurrentAmps = (recalculatedPanels * safePanelWattage) / pvStringVoltage;
  const copperResistivity = 0.0175; // ohm*mm2/m
  const loopDistance = safeCableDistance * 2;
  const resistance = (copperResistivity * loopDistance) / safeCableGauge;
  const rawDropPct = (pvCurrentAmps * resistance) / pvStringVoltage * 100;
  const recalculatedDropPct = Number.isFinite(rawDropPct) ? Math.min(6.0, Number(rawDropPct.toFixed(1))) : 2.1;

  const totalArrayKwp = ((recalculatedPanels * safePanelWattage) / 1000).toFixed(2);

  const handleApply = () => {
    onApplyOverrides({
      panelWattage: safePanelWattage,
      systemVoltage: safeSystemVoltage,
      batteryType,
      inverterBrand,
      cableDistanceMeters: safeCableDistance
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

  const drawerContent = (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 8, 14, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 100000,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'stretch'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0e1422',
          color: '#f8fafc',
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          maxHeight: '100vh',
          overflowY: 'auto',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.7)',
          padding: 'clamp(20px, 4vw, 32px)',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(56, 189, 248, 0.16)',
              color: '#38bdf8',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wrench size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                Hardware & Stock Override
              </h3>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                Field Engineer Telemetry & Warehouse Matching
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close hardware override drawer"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#f8fafc',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
          >
            <X size={16} />
            <span>Close</span>
          </button>
        </div>

        {/* Live System Sizing Pill Summary */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.06)',
          border: '1px solid rgba(56, 189, 248, 0.22)',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8', fontWeight: 700, display: 'block' }}>
              Live Array Output
            </span>
            <strong style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 800 }}>
              {totalArrayKwp} kWp <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#94a3b8' }}>({recalculatedPanels} × {safePanelWattage}W)</span>
            </strong>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10b981', fontWeight: 700, display: 'block' }}>
              DC Loop Loss
            </span>
            <strong style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: recalculatedDropPct <= 2.5 ? '#10b981' : '#f59e0b'
            }}>
              {recalculatedDropPct}% Drop
            </strong>
          </div>
        </div>

        {/* Form Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
          
          {/* Panel Wattage Selector */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              <Sun size={16} color="#f59e0b" />
              <span>Solar PV Module Wattage (Stock Rating)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
              {[400, 450, 550, 600, 650].map((w) => {
                const isSelected = safePanelWattage === w;
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setPanelWattage(w)}
                    style={{
                      padding: '11px 6px',
                      borderRadius: '6px',
                      background: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#080c14' : '#f8fafc',
                      border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>{w}W</div>
                    <div style={{ fontSize: '0.68rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                      {w >= 600 ? 'Bifacial' : 'Mono'}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
              Selected: <strong style={{ color: '#fff' }}>{recalculatedPanels} panels</strong> needed for {totalArrayKwp} kWp array.
            </div>
          </div>

          {/* Inverter Brand Selection */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              <Zap size={16} color="#38bdf8" />
              <span>Inverter Brand & Efficiency Class</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {[
                { brand: 'Deye Hybrid', eff: '97.6%' },
                { brand: 'Growatt SPF', eff: '93.0%' },
                { brand: 'Felicity Solar', eff: '93.0%' },
                { brand: 'Victron MultiPlus', eff: '95.0%' },
                { brand: 'Must PV1800', eff: '88.0%' }
              ].map((item) => {
                const isSelected = inverterBrand === item.brand;
                return (
                  <button
                    key={item.brand}
                    type="button"
                    onClick={() => setInverterBrand(item.brand)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#080c14' : '#f8fafc',
                      border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>{item.brand}</div>
                    <div style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                      {item.eff} Efficiency
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System DC Bus Voltage */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>DC Bus Architecture Voltage</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[24, 48].map((v) => {
                const isSelected = safeSystemVoltage === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSystemVoltage(v)}
                    style={{
                      padding: '11px 12px',
                      borderRadius: '6px',
                      background: isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#080c14' : '#f8fafc',
                      border: isSelected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>{v}V DC Bus</div>
                    <div style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                      {v === 48 ? 'Commercial Standard' : 'Compact 24V'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Battery Chemistry */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              <Battery size={16} color="#10b981" />
              <span>Storage Chemistry & Form Factor</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {[
                { type: 'lithium', label: 'LiFePO4 Rack', desc: '10-Year (80% DoD)' },
                { type: 'tubular', label: 'Tubular Flooded', desc: '4-Year (50% DoD)' },
                { type: 'gel', label: 'Deep Cycle Gel', desc: '3-Year (50% DoD)' }
              ].map((item) => {
                const isSelected = batteryType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setBatteryType(item.type as any)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#10b981' : '#f8fafc',
                      border: isSelected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>{item.label}</div>
                    <div style={{ fontSize: '0.7rem', color: isSelected ? '#a7f3d0' : '#94a3b8', marginTop: '2px' }}>
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DC Cable Distance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                <Cable size={16} color="#38bdf8" />
                <span>Roof-to-Inverter Cable Distance</span>
              </label>
              <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem' }}>
                {safeCableDistance} Meters
              </span>
            </div>

            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={safeCableDistance}
              onChange={(e) => setCableDistance(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#38bdf8',
                cursor: 'pointer',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                margin: '8px 0'
              }}
            />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px',
              fontSize: '0.75rem'
            }}>
              <span style={{ color: '#94a3b8' }}>Calculated DC Voltage Drop:</span>
              <span style={{
                fontWeight: 700,
                color: recalculatedDropPct <= 2.5 ? '#10b981' : '#f59e0b'
              }}>
                {recalculatedDropPct}% {recalculatedDropPct <= 2.5 ? '(Optimal ≤ 3%)' : '(Marginal drop)'}
              </span>
            </div>
          </div>

        </div>

        {/* Drawer Action Footer */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '20px',
          marginTop: '24px',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '12px 18px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#cbd5e1',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
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
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              color: '#080c14',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Check size={17} strokeWidth={2.5} />
            <span>Apply Hardware Overrides</span>
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(drawerContent, document.body) : drawerContent;
}
