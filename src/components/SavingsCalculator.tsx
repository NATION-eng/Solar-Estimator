import { useState } from 'react';
import { TrendingUp, CheckCircle2, Clock, Coins } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface SavingsCalculatorProps {
  systemCost: number;
  dailyEnergyWh: number;
  paybackYears: number;
}

export default function SavingsCalculator({ systemCost, dailyEnergyWh, paybackYears }: SavingsCalculatorProps) {
  const [gridTariff, setGridTariff] = useState(280); // NGN per kWh
  const [years, setYears] = useState(10);
  
  const monthlyEnergyKwh = (dailyEnergyWh / 1000) * 30;
  const monthlyGridCost = monthlyEnergyKwh * gridTariff;
  const annualGridCost = monthlyGridCost * 12;
  
  // Solar operating costs (maintenance, cleaning, occasional repairs)
  const annualMaintenanceCost = systemCost * 0.015; // 1.5% annually
  const annualSolarCost = annualMaintenanceCost;
  
  const annualSavings = annualGridCost - annualSolarCost;
  const totalSavings = (annualSavings * years) - systemCost;
  const roi = ((totalSavings / systemCost) * 100);
  
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      padding: 'clamp(16px, 4vw, 24px)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-hairline)',
      borderTop: '2px solid var(--color-primary)',
      marginTop: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '18px',
      }}>
        <TrendingUp size={20} color="var(--color-primary)" />
        <h4 style={{
          color: 'var(--color-primary)',
          fontSize: '0.95rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0,
        }}>
          Financial Savings & Tariff Sensitivity
        </h4>
      </div>
      
      {/* Interactive Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
            marginBottom: '8px',
            fontWeight: 500,
          }}>
            Grid Tariff (₦/kWh)
          </label>
          <input
            type="number"
            value={gridTariff}
            onChange={(e) => setGridTariff(Number(e.target.value))}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              color: '#fff',
              fontSize: '0.95rem',
            }}
          />
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
            marginBottom: '8px',
            fontWeight: 500,
          }}>
            Projection Period (Years)
          </label>
          <input
            type="range"
            min="5"
            max="25"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--color-primary)',
              marginTop: '8px',
            }}
          />
          <div style={{
            textAlign: 'center',
            marginTop: '6px',
            color: 'var(--color-primary)',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            {years} Years
          </div>
        </div>
      </div>
      
      {/* Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px',
        marginBottom: '20px',
      }}>
        {/* Grid Cost */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.06)',
          padding: '14px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(239, 68, 68, 0.85)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Grid Electricity
          </div>
          <div style={{ fontSize: 'clamp(0.95rem, 3.2vw, 1.25rem)', fontWeight: 800, color: '#f87171', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(monthlyGridCost)}/mo
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {formatCurrency(annualGridCost)}/year
          </div>
        </div>
        
        {/* Solar Cost */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          padding: '14px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(16, 185, 129, 0.85)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Solar Energy
          </div>
          <div style={{ fontSize: 'clamp(0.95rem, 3.2vw, 1.25rem)', fontWeight: 800, color: '#34d399', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(annualSolarCost / 12)}/mo
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {formatCurrency(annualSolarCost)}/year
          </div>
        </div>
      </div>
      
      {/* Savings Highlight */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        padding: 'clamp(16px, 4vw, 22px)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-hairline)',
        textAlign: 'center',
        marginBottom: '22px',
      }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Estimated Net Savings Over {years} Years
        </div>
        <div style={{
          fontSize: 'clamp(1.5rem, 5.5vw, 2.2rem)',
          fontWeight: 800,
          color: totalSavings > 0 ? 'var(--color-success)' : '#ef4444',
          marginBottom: '8px',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.15,
          wordBreak: 'break-word'
        }}>
          {formatCurrency(Math.abs(totalSavings))}
        </div>
        <div style={{
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}>
          {totalSavings > 0 ? (
            <>
              <CheckCircle2 size={14} color="var(--color-success)" />
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Net Capital Return Realized</span>
            </>
          ) : (
            <>
              <Clock size={14} color="var(--color-text-muted)" />
              <span>Break-even projection in progress</span>
            </>
          )}
        </div>
      </div>
      
      {/* Timeline Visualization */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Payback Timeline
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            {paybackYears.toFixed(1)} years to break-even
          </div>
        </div>
        
        <div style={{
          height: '6px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Payback marker */}
          <div style={{
            height: '100%',
            width: `${Math.min((paybackYears / years) * 100, 100)}%`,
            background: '#ef4444',
            borderRadius: '4px',
            transition: 'width 0.5s ease',
          }} />
          
          {/* Profit zone */}
          {paybackYears < years && (
            <div style={{
              position: 'absolute',
              left: `${(paybackYears / years) * 100}%`,
              right: 0,
              top: 0,
              bottom: 0,
              background: 'var(--color-success)',
              borderRadius: '0 4px 4px 0',
            }} />
          )}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px',
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
        }}>
          <span>Commissioning</span>
          <span>Break-Even ({Math.round(paybackYears)}y)</span>
          <span>Horizon ({years}y)</span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '12px 8px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-hairline)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Monthly Savings
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-success)', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(annualSavings / 12)}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '12px 8px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-hairline)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Annual Savings
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-success)', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(annualSavings)}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '12px 8px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-hairline)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Projected ROI
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: totalSavings > 0 ? 'var(--color-success)' : '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
            {roi > 0 ? '+' : ''}{roi.toFixed(0)}%
          </div>
        </div>
      </div>
      
      {/* Info Note */}
      <div style={{
        marginTop: '16px',
        padding: '10px 14px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderLeft: '2px solid var(--color-primary)',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        fontSize: '0.78rem',
        color: 'var(--color-text-muted)',
        lineHeight: 1.4,
      }}>
        <strong style={{ color: 'var(--color-primary)' }}>Tariff Context:</strong> Model calculated at {gridTariff} ₦/kWh. Actual savings increase as utility grid tariffs or diesel generator fuel costs escalate.
      </div>
    </div>
  );
}
