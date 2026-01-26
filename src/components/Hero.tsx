export default function Hero() {
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
          fontSize: '4.5rem', 
          fontWeight: 700, 
          marginBottom: '24px',
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
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
          fontSize: '1.25rem', 
          maxWidth: '600px', 
          margin: '0 auto 40px',
          color: 'var(--color-text-muted)'
        }}>
          Define your energy independence. Our proprietary algorithms calculate
          your exact needs based on real-world efficiency standards.
        </p>
        
        <button className="btn-primary" style={{
          background: 'var(--color-primary)',
          color: '#fff',
          padding: '16px 48px',
          fontSize: '1.1rem',
          borderRadius: '100px',
          boxShadow: 'var(--shadow-glow)',
          fontWeight: 600,
          transition: 'var(--transition-fast)'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Begin Assessment
        </button>
      </div>
    </section>
  );
}
