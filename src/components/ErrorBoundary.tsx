import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="glass-panel p-responsive" style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          maxWidth: '600px',
          margin: '100px auto',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>⚠️</div>
          <h2 style={{ 
            color: 'var(--color-primary)', 
            marginBottom: '16px',
            fontSize: '1.8rem',
            fontWeight: 700
          }}>
            Something went wrong
          </h2>
          <p style={{ 
            marginBottom: '24px',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6
          }}>
            We encountered an unexpected error. Please try reloading the page.
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              textAlign: 'left',
              fontSize: '0.85rem'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: 600,
                marginBottom: '8px',
                color: '#ef4444'
              }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                overflow: 'auto',
                padding: '12px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button 
            onClick={this.handleReload}
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
