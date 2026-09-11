export default function Hero({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="glass-panel p-responsive" style={{ 
      borderRadius: 'var(--radius-lg)', 
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Elements */}
      <div className="animate-float" style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'var(--color-primary-glow)',
        filter: 'blur(80px)',
        opacity: 0.5,
        zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <span
          style={{
            color: "var(--color-accent)",
            fontWeight: "700",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            marginBottom: "24px",
            display: "inline-block",
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '8px 16px',
            borderRadius: '100px',
            background: 'rgba(245, 158, 11, 0.05)'
          }}
        >
          MasterviewCEL 2026
        </span>
        
        <h1 className="hero-title" style={{ 
          fontSize: 'clamp(2.2rem, 8vw, 4.4rem)', 
          fontWeight: 800, 
          marginBottom: '20px',
          letterSpacing: '-0.03em',
          lineHeight: '1.15'
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
          fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', 
          maxWidth: '600px', 
          margin: '0 auto 32px',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6
        }}>
          Define your energy independence. Engineered sizing algorithms calculate
          your exact hardware requirements based on Nigerian irradiance standards.
        </p>
        
        <button 
          className="btn-primary" 
          onClick={onBegin}
          style={{
            background: 'var(--color-primary)',
            color: '#000',
            padding: '16px 44px',
            fontSize: '1rem',
            borderRadius: '100px',
            boxShadow: 'var(--shadow-glow)',
            fontWeight: 700,
            transition: 'var(--transition-fast)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>⚡</span>
          <span>Begin Assessment</span>
        </button>
      </div>
    </section>
  );
}
