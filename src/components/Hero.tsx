export default function Hero({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="glass-panel p-responsive" style={{ 
      borderRadius: 'var(--radius-lg)', 
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Glow */}
      <div className="animate-float" style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'var(--color-primary-glow)',
        filter: 'blur(70px)',
        opacity: 0.45,
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Live Pill Badge */}
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              border: '1px solid rgba(251, 191, 36, 0.3)',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'rgba(251, 191, 36, 0.08)'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }}></span>
            <span>NIGERIAN IRRADIANCE SIZING ENGINE</span>
          </span>
        </div>
        
        <h1 className="hero-title" style={{ 
          fontSize: 'clamp(2rem, 7vw, 4.2rem)', 
          fontWeight: 800, 
          marginBottom: '14px',
          letterSpacing: '-0.03em',
          lineHeight: '1.12'
        }}>
          <span className="text-gradient">Solar System</span>
          <br />
          <span style={{ 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Estimator</span>
        </h1>
        
        <p className="hero-subtitle" style={{ 
          fontSize: 'clamp(0.88rem, 2.2vw, 1.15rem)', 
          maxWidth: '580px', 
          margin: '0 auto 20px',
          color: 'var(--color-text-muted)',
          lineHeight: 1.55
        }}>
          Define your energy independence. Engineered sizing algorithms calculate
          your exact hardware requirements based on local solar peak sun hours.
        </p>

        {/* Feature Badges - Touch-friendly on mobile */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#cbd5e1'
          }}>
            📍 17+ Nigerian Cities
          </span>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#cbd5e1'
          }}>
            🔋 LiFePO4 & Tubular
          </span>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#cbd5e1'
          }}>
            📄 Instant PDF & WhatsApp
          </span>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={onBegin}
          style={{
            background: 'var(--color-primary)',
            color: '#000',
            padding: '14px 36px',
            fontSize: '0.95rem',
            borderRadius: '100px',
            boxShadow: 'var(--shadow-glow)',
            fontWeight: 800,
            transition: 'var(--transition-fast)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minHeight: '48px',
            cursor: 'pointer'
          }}
        >
          <span>⚡</span>
          <span>Begin Sizing Assessment</span>
        </button>
      </div>
    </section>
  );
}

