import React from 'react';
import { AlertCircle, X } from 'lucide-react';

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
        color: '#f87171',
        fontSize: '0.82rem',
        marginTop: '6px',
        padding: '10px 14px',
        background: 'rgba(239, 68, 68, 0.08)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: 'slideIn 0.2s ease-out'
      }}
    >
      <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{
            background: 'none',
            border: 'none',
            color: '#f87171',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
