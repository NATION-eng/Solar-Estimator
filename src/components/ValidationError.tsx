export interface ValidationErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function ValidationError({ message, onDismiss }: ValidationErrorProps) {
  return (
    <div 
      role="alert"
      aria-live="polite"
      style={{
        color: '#ef4444',
        fontSize: '0.85rem',
        marginTop: '6px',
        padding: '10px 14px',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '6px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: 'slideIn 0.2s ease-out'
      }}
    >
      <span style={{ fontSize: '1rem' }}>⚠️</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '1.2rem',
            lineHeight: 1,
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          ×
        </button>
      )}
    </div>
  );
}
