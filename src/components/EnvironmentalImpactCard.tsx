import { Globe2, Wind, TreePine, Flame, Info } from 'lucide-react';
import type { EnvironmentalImpact } from '../types';

interface EnvironmentalImpactProps {
  impact: EnvironmentalImpact;
}

export default function EnvironmentalImpactCard({ impact }: EnvironmentalImpactProps) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      padding: 'clamp(16px, 4vw, 24px)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-hairline)',
      borderTop: '2px solid var(--color-success)',
      marginTop: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
      }}>
        <Globe2 size={20} color="var(--color-success)" />
        <h4 style={{
          color: 'var(--color-success)',
          fontSize: '0.95rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0,
        }}>
          Environmental Impact & Offset
        </h4>
      </div>
      
      <p style={{
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem',
        marginBottom: '20px',
        lineHeight: 1.5,
      }}>
        By switching to clean solar power, your installation eliminates fossil-fuel reliance and reduces carbon emissions:
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
      }}>
        {/* CO2 Saved */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '16px 12px',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          border: '1px solid var(--border-hairline)',
        }}>
          <div style={{ marginBottom: '8px', color: 'var(--color-accent)' }}>
            <Wind size={22} style={{ margin: '0 auto' }} />
          </div>
          <div style={{
            fontSize: 'clamp(1.2rem, 3.5vw, 1.7rem)',
            fontWeight: 800,
            color: 'var(--color-success)',
            marginBottom: '4px',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.2,
          }}>
            {impact.co2SavedAnnually.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            kg CO₂ Saved/Yr
          </div>
        </div>
        
        {/* Trees Equivalent */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '16px 12px',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          border: '1px solid var(--border-hairline)',
        }}>
          <div style={{ marginBottom: '8px', color: 'var(--color-success)' }}>
            <TreePine size={22} style={{ margin: '0 auto' }} />
          </div>
          <div style={{
            fontSize: 'clamp(1.2rem, 3.5vw, 1.7rem)',
            fontWeight: 800,
            color: 'var(--color-success)',
            marginBottom: '4px',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.2,
          }}>
            {impact.treesEquivalent}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Trees Equivalent
          </div>
        </div>
        
        {/* Coal / Fossil Avoided */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '16px 12px',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          border: '1px solid var(--border-hairline)',
        }}>
          <div style={{ marginBottom: '8px', color: 'var(--color-primary)' }}>
            <Flame size={22} style={{ margin: '0 auto' }} />
          </div>
          <div style={{
            fontSize: 'clamp(1.2rem, 3.5vw, 1.7rem)',
            fontWeight: 800,
            color: 'var(--color-success)',
            marginBottom: '4px',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.2,
          }}>
            {impact.coalAvoided.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            kg Coal Offset/Yr
          </div>
        </div>
      </div>
      
      {/* Lifetime Impact */}
      <div style={{
        marginTop: '18px',
        padding: '14px 18px',
        background: 'rgba(16, 185, 129, 0.04)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            25-Year System Lifetime Offset
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Estimated total emissions avoided across hardware lifecycle
          </div>
        </div>
        <div style={{
          fontSize: '1.3rem',
          fontWeight: 800,
          color: 'var(--color-success)',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {impact.lifetimeOffset.toLocaleString()} kg CO₂
        </div>
      </div>
      
      {/* Technical Footnote */}
      <div style={{
        marginTop: '16px',
        padding: '10px 14px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderLeft: '2px solid var(--color-primary)',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Info size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <div>
          Equal to taking approximately <strong>{Math.max(1, Math.round(impact.co2SavedAnnually / 4600))} internal combustion vehicle(s)</strong> off Nigerian roads every year.
        </div>
      </div>
    </div>
  );
}
