export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'medium' 
}: LoadingSpinnerProps) {
  const sizes = {
    small: '32px',
    medium: '48px',
    large: '64px',
  };

  const spinnerSize = sizes[size];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '40px',
      minHeight: '200px',
    }}>
      <div 
        className="spinner" 
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} 
      />
      {message && (
        <p style={{ 
          color: 'var(--color-text-muted)',
          fontSize: '0.95rem',
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
