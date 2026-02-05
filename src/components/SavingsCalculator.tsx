import { useState } from 'react';
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
      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
      padding: '28px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(251, 191, 36, 0.2)',
      marginTop: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <span style={{ fontSize: '2rem' }}>💰</span>
        <h4 style={{
          color: 'var(--color-accent)',
          fontSize: '1.1rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Savings Calculator
        </h4>
      </div>
      
      {/* Interactive Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
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
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontSize: '1rem',
            }}
          />
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
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
              accentColor: 'var(--color-accent)',
              marginTop: '8px',
            }}
          />
          <div style={{
            textAlign: 'center',
            marginTop: '8px',
            color: 'var(--color-accent)',
            fontWeight: 700,
          }}>
            {years} Years
          </div>
        </div>
      </div>
      
      {/* Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Grid Cost */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(239, 68, 68, 0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Grid Electricity
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ef4444', marginBottom: '8px' }}>
            {formatCurrency(monthlyGridCost)}/mo
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {formatCurrency(annualGridCost)}/year
          </div>
        </div>
        
        {/* Solar Cost */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(16, 185, 129, 0.8)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Solar Energy
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>
            {formatCurrency(annualSolarCost / 12)}/mo
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {formatCurrency(annualSolarCost)}/year
          </div>
        </div>
      </div>
      
      {/* Savings Highlight */}
      <div style={{
        background: 'rgba(251, 191, 36, 0.15)',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
          Total Savings Over {years} Years
        </div>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: totalSavings > 0 ? 'var(--color-success)' : '#ef4444',
          marginBottom: '12px',
          textShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
        }}>
          {formatCurrency(Math.abs(totalSavings))}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
        }}>
          {totalSavings > 0 ? '✅ Net Profit' : '⏳ Break-even not yet reached'}
        </div>
      </div>
      
      {/* Timeline Visualization */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Payback Timeline
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            {paybackYears.toFixed(1)} years to break-even
          </div>
        </div>
        
        <div style={{
          height: '8px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Payback marker */}
          <div style={{
            height: '100%',
            width: `${Math.min((paybackYears / years) * 100, 100)}%`,
            background: 'linear-gradient(to right, #ef4444, var(--color-accent))',
            borderRadius: '10px',
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
              background: 'linear-gradient(to right, var(--color-success), #22c55e)',
              borderRadius: '0 10px 10px 0',
            }} />
          )}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
        }}>
          <span>Today</span>
          <span>Year {Math.round(paybackYears)}</span>
          <span>Year {years}</span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            Monthly Savings
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-success)' }}>
            {formatCurrency(annualSavings / 12)}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            Annual Savings
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-success)' }}>
            {formatCurrency(annualSavings)}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            ROI
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: totalSavings > 0 ? 'var(--color-success)' : '#ef4444' }}>
            {roi > 0 ? '+' : ''}{roi.toFixed(0)}%
          </div>
        </div>
      </div>
      
      {/* Info Note */}
      <div style={{
        marginTop: '20px',
        padding: '12px 16px',
        background: 'rgba(59, 130, 246, 0.05)',
        borderLeft: '3px solid var(--color-primary)',
        borderRadius: '4px',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        lineHeight: 1.5,
      }}>
        <strong style={{ color: 'var(--color-primary)' }}>Note:</strong> Calculations assume {gridTariff} ₦/kWh grid tariff. 
        Your actual savings may vary based on tariff changes, system maintenance, and usage patterns.
      </div>
    </div>
  );
}
