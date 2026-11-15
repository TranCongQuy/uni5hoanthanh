import type { FC } from 'react';
import { Compass } from 'lucide-react';

export const AppLoadingScreen: FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      <style>{`
        @keyframes upAppLoadingSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes upAppPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(0.98); }
        }
      `}</style>

      {/* Brand Logo & Name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
          animation: 'upAppPulse 2s ease-in-out infinite',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.35)',
          }}
        >
          <Compass size={26} />
        </div>
        <div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}
          >
            UniPath <span style={{ color: '#4F46E5', fontSize: '18px' }}>2.0</span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.2px' }}>
            Cổng Tuyển sinh & Hướng nghiệp
          </div>
        </div>
      </div>

      {/* Simple CSS Spinner */}
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid #E2E8F0',
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'upAppLoadingSpin 0.85s linear infinite',
          marginBottom: '16px',
        }}
      />

      {/* Loading Text */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#334155',
          marginBottom: '4px',
        }}
      >
        Đang tải UniPath...
      </div>
      <div
        style={{
          fontSize: '12px',
          color: '#94A3B8',
        }}
      >
        Vui lòng đợi trong giây lát
      </div>
    </div>
  );
};
