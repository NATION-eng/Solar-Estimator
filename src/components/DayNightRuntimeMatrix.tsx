import { useState, useMemo } from 'react';
import { Sun, Moon, BatteryCharging, Zap, ShieldCheck, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Appliance } from '../types';

interface DayNightRuntimeMatrixProps {
  appliances: Appliance[];
  batteryCapacityWh: number;
  batteryType?: 'lithium' | 'gel' | 'tubular';
  systemVoltage?: number;
  userMode?: 'client' | 'engineer';
}

export default function DayNightRuntimeMatrix({
  appliances,
  batteryCapacityWh,
  batteryType = 'lithium',
  systemVoltage = 48,
  userMode = 'client'
}: DayNightRuntimeMatrixProps) {
  // AC Night setting: 'eco' (6h till midnight), 'full' (12h all night), 'essentials' (AC off at night)
  const [acNightMode, setAcNightMode] = useState<'eco' | 'full' | 'essentials'>('eco');

  // Categorize appliances into daytime-heavy vs night essentials
  const { hasAc, acWatts, essentialNightWatts, daytimeWatts } = useMemo(() => {
    let acTotal = 0;
    let essentialNight = 0;
    let dayTotal = 0;

    appliances.forEach(app => {
      const name = (app.name || '').toLowerCase();
      const totalAppWatts = app.watt * (app.quantity || 1);

      if (name.includes('air conditioner') || name.includes('ac ') || name.includes('a/c')) {
        // Inverter ACs cycle at ~65% average power once room cools
        acTotal += totalAppWatts * 0.7;
        dayTotal += totalAppWatts;
      } else if (name.includes('fridge') || name.includes('freezer') || name.includes('refrigerator')) {
        // Refrigerator compressor cycles 40% of time
        essentialNight += totalAppWatts * 0.45;
        dayTotal += totalAppWatts * 0.5;
      } else if (name.includes('pump') || name.includes('iron') || name.includes('microwave') || name.includes('washing')) {
        // Heavy daytime appliances
        dayTotal += totalAppWatts;
      } else {
        // Lighting, fans, TV, WiFi
        essentialNight += totalAppWatts;
        dayTotal += totalAppWatts * 0.7;
      }
    });

    return {
      hasAc: acTotal > 0,
      acWatts: Math.round(acTotal),
      essentialNightWatts: Math.round(essentialNight),
      daytimeWatts: Math.round(dayTotal)
    };
  }, [appliances]);

  // Usable battery energy
  const dodLimit = batteryType === 'lithium' ? 0.8 : 0.5;
  const usableBatteryWh = batteryCapacityWh * dodLimit;

  // Calculate Night Energy & Morning SoC
  const { nightEnergyWh, estimatedRuntimeHours, morningSocPct, isSustainable } = useMemo(() => {
    let acNightHours = 0;
    if (acNightMode === 'full') acNightHours = 12;
    if (acNightMode === 'eco') acNightHours = 6;
    if (acNightMode === 'essentials') acNightHours = 0;

    const acNightEnergy = hasAc ? acWatts * acNightHours : 0;
    const essentialNightEnergy = essentialNightWatts * 12; // 12 hours night
    const totalNightEnergy = acNightEnergy + essentialNightEnergy;

    // Average hourly night load
    const avgNightWatts = (essentialNightWatts + (acNightHours > 0 ? (acWatts * acNightHours) / 12 : 0)) || 1;
    const runtime = Math.min(24, Number((usableBatteryWh / avgNightWatts).toFixed(1)));

    // Morning SoC: starting from 100%
    const energyUsedFraction = batteryCapacityWh > 0 ? totalNightEnergy / batteryCapacityWh : 0;
    const morningSoc = Math.max(10, Math.round((1 - energyUsedFraction) * 100));
    const safetyFloor = batteryType === 'lithium' ? 20 : 50;

    return {
      nightEnergyWh: Math.round(totalNightEnergy),
      estimatedRuntimeHours: runtime,
      morningSocPct: morningSoc,
      isSustainable: morningSoc >= safetyFloor
    };
  }, [acNightMode, hasAc, acWatts, essentialNightWatts, usableBatteryWh, batteryCapacityWh, batteryType]);

  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'clamp(18px, 4vw, 28px)',
      marginBottom: '32px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-primary)',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '6px'
          }}>
            <Sparkles size={14} />
            <span>24/7 Power Assurance Matrix</span>
          </div>
          <h3 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            {userMode === 'client' ? 'Daylight & Night-time Runtime Simulation' : 'Diurnal Energy Balance & SoC Telemetry'}
          </h3>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          background: isSustainable ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          border: `1px solid ${isSustainable ? 'var(--color-success)' : 'var(--color-primary)'}`,
          color: isSustainable ? 'var(--color-success)' : 'var(--color-primary)',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          {isSustainable ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
          <span>{isSustainable ? 'Guaranteed 24-Hour Coverage' : 'High Night Load - Eco Recommended'}</span>
        </div>
      </div>

      {/* Split Cards: Daylight Window vs Night Window */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* DAYLIGHT WINDOW */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.04)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--color-primary)',
                padding: '6px',
                borderRadius: '6px'
              }}>
                <Sun size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Daylight Window (8 AM &ndash; 5 PM)
                </h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Direct Solar PV Generation</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '10px 0 16px' }}>
              {userMode === 'client'
                ? 'Your solar panels power heavy appliances directly from sunlight. You can run air conditioners, pumping machines, and refrigerators with zero battery drain while the sun is up.'
                : `Solar generation covers ~${daytimeWatts}W peak concurrent daytime loads and simultaneously recharges the ${((batteryCapacityWh) / 1000).toFixed(1)} kWh battery bank.`}
            </p>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid var(--border-hairline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Daytime Running Cost:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-success)' }}>₦0 (100% Free Solar)</span>
          </div>
        </div>

        {/* NIGHT STORAGE WINDOW */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.04)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--color-accent)',
                padding: '6px',
                borderRadius: '6px'
              }}>
                <Moon size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                  Night Storage Window (6 PM &ndash; 7 AM)
                </h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>LiFePO4 Battery Discharge</span>
              </div>
            </div>

            {hasAc ? (
              <div style={{ margin: '12px 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                  Select Overnight AC Usage Preference:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setAcNightMode('eco')}
                    style={{
                      background: acNightMode === 'eco' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                      color: acNightMode === 'eco' ? '#0a0e17' : 'var(--color-text-main)',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    6h Sleep Eco
                  </button>
                  <button
                    type="button"
                    onClick={() => setAcNightMode('full')}
                    style={{
                      background: acNightMode === 'full' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                      color: acNightMode === 'full' ? '#0a0e17' : 'var(--color-text-main)',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    12h Full Night
                  </button>
                  <button
                    type="button"
                    onClick={() => setAcNightMode('essentials')}
                    style={{
                      background: acNightMode === 'essentials' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                      color: acNightMode === 'essentials' ? '#0a0e17' : 'var(--color-text-main)',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Fans & Lights Only
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '10px 0 16px' }}>
                Your night loads (fans, refrigeration, lighting, Wi-Fi, television) are highly efficient and easily sustained by your battery reserve until sunrise.
              </p>
            )}
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid var(--border-hairline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Estimated Night Runtime:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-accent)' }}>
              {estimatedRuntimeHours >= 12 ? '12+ Hours (All Night)' : `${estimatedRuntimeHours} Hours`}
            </span>
          </div>
        </div>
      </div>

      {/* Battery State of Charge (SoC) Projection Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.25)',
        borderRadius: 'var(--radius-sm)',
        padding: '16px 20px',
        border: '1px solid var(--border-hairline)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BatteryCharging size={16} color="var(--color-success)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
              Projected Battery Level at 7:00 AM Sunrise
            </span>
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSustainable ? 'var(--color-success)' : 'var(--color-primary)' }}>
            {morningSocPct}% Remaining Reserve
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div style={{
          height: '10px',
          borderRadius: '5px',
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '10px'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, morningSocPct))}%`,
            background: morningSocPct > 40
              ? 'linear-gradient(90deg, #10b981, #34d399)'
              : morningSocPct > 25
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #ef4444, #f87171)',
            borderRadius: '5px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Status Insight Text */}
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
          {userMode === 'client' ? (
            isSustainable ? (
              <span>
                <strong style={{ color: '#fff' }}>Peace of Mind:</strong> Even after powering your overnight appliances, you will awake with{' '}
                <strong style={{ color: 'var(--color-success)' }}>{morningSocPct}% reserve</strong>, keeping your battery healthy and ready for cloudy morning spells.
              </span>
            ) : (
              <span>
                <strong style={{ color: 'var(--color-primary)' }}>Energy Advisory:</strong> Running continuous heavy loads all 12 hours will deplete the battery to {morningSocPct}%. We recommend the <strong>6h Sleep Eco Timer</strong> or adding an extra battery module for 100% full-night coverage.
              </span>
            )
          ) : (
            <span>
              <strong>DC Telemetry:</strong> Night consumption ~{nightEnergyWh.toLocaleString()} Wh on a {((batteryCapacityWh)/1000).toFixed(1)} kWh bank ({systemVoltage}V). Depth of Discharge: {100 - morningSocPct}% (Recommended maximum: {batteryType === 'lithium' ? '80%' : '50%'}).
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
