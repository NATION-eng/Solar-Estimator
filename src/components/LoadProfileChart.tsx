import { useMemo } from 'react';
import type { Appliance } from '../types';
import { generateLoadProfile, formatPower } from '../utils/helpers';

interface LoadProfileChartProps {
  appliances: Appliance[];
  hours: number;
}

export default function LoadProfileChart({ appliances, hours }: LoadProfileChartProps) {
  const profile = useMemo(() => 
    generateLoadProfile(appliances, hours),
    [appliances, hours]
  );
  
  const maxLoad = Math.max(...profile.map(p => p.load));
  const avgLoad = profile.reduce((sum, p) => sum + p.load, 0) / 24;
  
  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      padding: '24px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(255,255,255,0.05)',
    }}>
      <h4 style={{
        color: 'var(--color-primary)',
        fontSize: '0.9rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: '16px',
        letterSpacing: '0.1em',
      }}>
        24-Hour Load Profile
      </h4>
      
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        height: '200px',
        marginBottom: '16px',
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        {profile.map((item, index) => {
          const height = maxLoad > 0 ? (item.load / maxLoad) * 100 : 0;
          const isActive = item.load > 0;
          
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${height}%`,
                background: isActive
                  ? index >= 6 && index <= 18
                    ? 'linear-gradient(to top, var(--color-accent), var(--color-primary))'
                    : 'linear-gradient(to top, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.9))'
                  : 'rgba(255,255,255,0.05)',
                borderRadius: '4px 4px 0 0',
                position: 'relative',
                transition: 'all 0.3s',
                cursor: 'pointer',
                minHeight: isActive ? '8px' : '2px',
              }}
              title={`${item.hour}:00 - ${formatPower(item.load)}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scaleY(1.05)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scaleY(1)';
                e.currentTarget.style.opacity = isActive ? '0.9' : '1';
              }}
            />
          );
        })}
      </div>
      
      {/* Time Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.7rem',
        color: 'var(--color-text-muted)',
        marginBottom: '16px',
      }}>
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
      
      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '12px',
        marginTop: '16px',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            Peak Load
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatPower(maxLoad)}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            Average Load
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)' }}>
            {formatPower(avgLoad)}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            Active Hours
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {profile.filter(p => p.load > 0).length}h
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div style={{
        marginTop: '16px',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: 'linear-gradient(to right, var(--color-accent), var(--color-primary))',
            borderRadius: '2px',
          }} />
          <span>Daytime (6am-6pm)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            background: 'rgba(59, 130, 246, 0.8)',
            borderRadius: '2px',
          }} />
          <span>Nighttime</span>
        </div>
      </div>
    </div>
  );
}
