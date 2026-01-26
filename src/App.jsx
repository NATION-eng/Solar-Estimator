import Hero from "./components/Hero";
import Estimator from "./components/Estimator";
import "./styles/design-system.css"; // Ensure design system is loaded

function App() {
  return (
    <div className="app-wrapper">
      <main className="container-wide" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <Hero />
        <div style={{ height: '4rem' }}></div> {/* Spacer */}
        <Estimator />
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
  );
}

export default App;
