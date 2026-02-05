import type { EnvironmentalImpact } from '../types';

interface EnvironmentalImpactProps {
  impact: EnvironmentalImpact;
}

export default function EnvironmentalImpactCard({ impact }: EnvironmentalImpactProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
      padding: '28px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      marginTop: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <span style={{ fontSize: '2rem' }}>🌍</span>
        <h4 style={{
          color: 'var(--color-success)',
          fontSize: '1.1rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Environmental Impact
        </h4>
      </div>
      
      <p style={{
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
        marginBottom: '24px',
        lineHeight: 1.6,
      }}>
        By switching to solar energy, you'll make a significant positive impact on the environment. 
        Here's what your system will accomplish:
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
      }}>
        {/* CO2 Saved */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid rgba(16, 185, 129, 0.1)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💨</div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--color-success)',
            marginBottom: '4px',
          }}>
            {impact.co2SavedAnnually.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            kg CO₂ Saved/Year
          </div>
        </div>
        
        {/* Trees Equivalent */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid rgba(16, 185, 129, 0.1)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌳</div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--color-success)',
            marginBottom: '4px',
          }}>
            {impact.treesEquivalent}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Trees Planted Equivalent
          </div>
        </div>
        
        {/* Coal Avoided */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid rgba(16, 185, 129, 0.1)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⛏️</div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--color-success)',
            marginBottom: '4px',
          }}>
            {impact.coalAvoided.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            kg Coal Avoided/Year
          </div>
        </div>
      </div>
      
      {/* Lifetime Impact */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(16, 185, 129, 0.08)',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
          25-Year System Lifetime
        </div>
        <div style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--color-success)',
        }}>
          {impact.lifetimeOffset.toLocaleString()} kg CO₂
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Total Emissions Prevented
        </div>
      </div>
      
      {/* Fun Fact */}
      <div style={{
        marginTop: '20px',
        padding: '12px 16px',
        background: 'rgba(251, 191, 36, 0.05)',
        borderLeft: '3px solid var(--color-accent)',
        borderRadius: '4px',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
      }}>
        <strong style={{ color: 'var(--color-accent)' }}>💡 Did you know?</strong> Your solar system's environmental 
        impact is equivalent to taking {Math.round(impact.co2SavedAnnually / 4600)} car(s) off the road annually!
      </div>
    </div>
  );
}
