import { useRef, RefObject } from "react";
import Hero from "./components/Hero";
import Estimator from "./components/Estimator";
import { ErrorBoundary } from "./components/ErrorBoundary";
import PWAInstallBanner from "./components/PWAInstallBanner";
import "./styles/design-system.css"; 

function App() {
  const estimatorRef = useRef<HTMLDivElement>(null);

  const scrollToEstimator = () => {
    estimatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="app-wrapper">
        {/* Modern Top App Header with iOS Safe Area Inset */}
        <header style={{
          width: '100%',
          borderBottom: '1px solid var(--border-glass)',
          background: 'rgba(2, 6, 23, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
          paddingBottom: '12px'
        }}>
          <div className="container-wide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>☀️</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>
                Masterview<span style={{ color: 'var(--color-primary)' }}>CEL</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                padding: '4px 10px',
                borderRadius: '100px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }}></span>
                PWA v2.1
              </span>

              <button
                onClick={scrollToEstimator}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Estimate
              </button>
            </div>
          </div>
        </header>

        <main className="container-wide app-main-content" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
          <Hero onBegin={scrollToEstimator} />
          <div style={{ margin: 'clamp(1rem, 3vw, 2.5rem) 0' }}></div>
          <div ref={estimatorRef}>
            <Estimator />
          </div>
        </main>
        
        <footer style={{ 
          textAlign: 'center', 
          padding: '2rem 1rem calc(4rem + env(safe-area-inset-bottom, 0px))', 
          borderTop: 'var(--border-glass)',
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem'
        }}>
          <p>© 2026 MasterviewCEL Energy Solutions. Engineered for Nigeria.</p>
        </footer>
        
        <PWAInstallBanner />
      </div>
    </ErrorBoundary>
  );
}

export default App;
