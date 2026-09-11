import type { EnvironmentalImpact } from '../types';
import CustomEmoji from './CustomEmoji';

interface EnvironmentalImpactProps {
  impact: EnvironmentalImpact;
}

export default function EnvironmentalImpactCard({ impact }: EnvironmentalImpactProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
      padding: 'clamp(16px, 4vw, 28px)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      marginTop: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <CustomEmoji name="globe" size={24} />
        <h4 style={{
          color: 'var(--color-success)',
          fontSize: '1.05rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Environmental Impact
        </h4>
      </div>
      
      <p style={{
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem',
        marginBottom: '20px',
        lineHeight: 1.5,
      }}>
        By switching to solar energy, you'll make a significant positive impact on the environment:
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
        gap: '10px',
      }}>
        {/* CO2 Saved */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          padding: 'clamp(12px, 3vw, 20px) 8px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid rgba(16, 185, 129, 0.15)',
        }}>
          <div style={{ marginBottom: '6px' }}>
            <CustomEmoji name="wind" size={26} color="#38bdf8" />
          </div>
          <div style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
            fontWeight: 700,
            color: 'var(--color-success)',
            marginBottom: '4px',
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}>
            {impact.co2SavedAnnually.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
            kg CO₂ Saved/Yr
          </div>
        </div>
        
        {/* Trees Equivalent */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          padding: 'clamp(12px, 3vw, 20px) 8px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid rgba(16, 185, 129, 0.15)',
        }}>
          <div style={{ marginBottom: '6px' }}>
            <CustomEmoji name="tree" size={26} color="#10b981" />
          </div>
          <div style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
            fontWeight: 700,
            color: 'var(--color-success)',
            marginBottom: '4px',
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}>
            {impact.treesEquivalent}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
            Trees Planted
          </div>
        </div>
        
        {/* Coal Avoided */}
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          padding: 'clamp(12px, 3vw, 20px) 8px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid rgba(16, 185, 129, 0.15)',
        }}>
          <div style={{ marginBottom: '6px' }}>
            <CustomEmoji name="coal" size={26} color="#fbbf24" />
          </div>
          <div style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
            fontWeight: 700,
            color: 'var(--color-success)',
            marginBottom: '4px',
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}>
            {impact.coalAvoided.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
            kg Coal Saved/Yr
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
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <CustomEmoji name="lightbulb" size={16} color="var(--color-accent)" />
        <div>
          <strong style={{ color: 'var(--color-accent)' }}>Did you know?</strong> Your solar system's environmental 
          impact is equivalent to taking {Math.round(impact.co2SavedAnnually / 4600)} car(s) off the road annually!
        </div>
      </div>
    </div>
  );
}
