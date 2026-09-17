import { Sun, ShieldCheck, MapPin, FileText, ArrowRight } from 'lucide-react';

export default function Hero({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="glass-panel p-responsive" style={{ 
      borderRadius: 'var(--radius-lg)', 
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Institutional Pill Badge */}
        <div style={{ marginBottom: '18px' }}>
          <span
            style={{
              color: "var(--color-primary)",
              fontWeight: "600",
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              border: '1px solid var(--color-primary-border)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary-subtle)',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }}></span>
            <span>Commercial & Residential Solar Sizing Platform</span>
          </span>
        </div>
        
        <h1 className="hero-title" style={{ 
          fontSize: 'clamp(2rem, 6vw, 3.6rem)', 
          fontWeight: 800, 
          marginBottom: '14px',
          letterSpacing: '-0.025em',
          lineHeight: '1.15',
          color: '#ffffff'
        }}>
          Solar Photovoltaic & Energy <br />
          <span style={{ color: 'var(--color-primary)' }}>Storage Estimator</span>
        </h1>
        
        <p className="hero-subtitle" style={{ 
          fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', 
          maxWidth: '620px', 
          margin: '0 auto 24px',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6
        }}>
          Calibrated engineering algorithms configure your exact PV array, 48V hybrid inverter,
          and LiFePO4 battery capacity based on local irradiance and duty-cycle load profiling.
        </p>

        {/* Technical Trust Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '28px'
        }}>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-surface)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'var(--color-text-body)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <MapPin size={14} color="var(--color-accent)" />
            <span>NIMET & NASA Irradiance Data</span>
          </span>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-surface)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'var(--color-text-body)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>48V DC & Thermal Safety Verified</span>
          </span>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-surface)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'var(--color-text-body)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FileText size={14} color="var(--color-primary)" />
            <span>Bankable Turnkey BoQ</span>
          </span>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={onBegin}
          style={{
            background: 'var(--color-primary)',
            color: '#080c14',
            padding: '13px 26px',
            fontSize: '0.92rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.15s ease',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <span>Start System Assessment</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
