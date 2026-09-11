import { useEffect, useState } from 'react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if dismissed in this session
    if (sessionStorage.getItem('pwa_dismissed')) {
      return;
    }

    // iOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);

    if (isIosDevice && isSafari) {
      setIsIOS(true);
      setShowBanner(true);
    }

    // Android/Desktop Chrome beforeinstallprompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="pwa-install-banner-wrapper" style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img 
          src="/icons/icon-192.png" 
          alt="Solar Estimator" 
          style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} 
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', lineHeight: 1.2 }}>
            Install Solar App
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Instant offline access & fast assessment
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleInstallClick}
          style={{
            background: 'var(--color-primary)',
            color: '#000',
            border: 'none',
            borderRadius: '100px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          {isIOS ? 'Install' : 'Install'}
        </button>

        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '4px 6px',
            lineHeight: 1
          }}
        >
          ×
        </button>
      </div>

      {/* iOS Instructions Modal Overlay */}
      {showIOSGuide && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--color-bg-deep)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            maxWidth: '360px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📲</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>
              Add to iPhone Home Screen
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              1. Tap the <strong>Share</strong> button (box with upward arrow) in Safari.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
              3. Tap <strong>Add</strong> in the top right corner.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              style={{
                background: 'var(--color-primary)',
                color: '#000',
                fontWeight: 700,
                padding: '10px 24px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
