import { useRef, RefObject } from "react";
import Hero from "./components/Hero";
import Estimator from "./components/Estimator";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles/design-system.css"; 

function App() {
  const estimatorRef = useRef<HTMLDivElement>(null);

  const scrollToEstimator = () => {
    estimatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="app-wrapper">
        <main className="container-wide" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <Hero onBegin={scrollToEstimator} />
          <div style={{ height: '4rem' }}></div> {/* Spacer */}
          <div ref={estimatorRef}>
            <Estimator />
          </div>
        </main>
        
        <footer style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          borderTop: 'var(--border-glass)',
          color: 'var(--color-text-muted)',
          fontSize: '0.9rem'
        }}>
          <p>© 2026 MasterviewCEL. All rights reserved.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
