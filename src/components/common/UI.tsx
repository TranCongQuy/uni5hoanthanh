import React, { useState } from 'react';
import { X } from 'lucide-react';

// ==========================================
// 1. SAFE IMAGE COMPONENT
// ==========================================
interface ImageSafeProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  altText?: string;
}

export const ImageSafe: React.FC<ImageSafeProps> = ({
  src,
  fallbackSrc = '/images/campus_default.png',
  altText = '',
  className = '',
  style,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? fallbackSrc : imgSrc}
      alt={altText}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setImgSrc(fallbackSrc);
        }
      }}
      className={className}
      style={{ objectFit: 'cover', ...style }}
      {...rest}
    />
  );
};

// ==========================================
// 2. UNIVERSITY AVATAR / LOGO
// ==========================================
interface UniversityAvatarProps {
  code: string;
  name?: string;
  size?: number;
  className?: string;
}

const UNI_COLORS: Record<string, [string, string]> = {
  BKA: ['#DC2626', '#991B1B'],
  FTU: ['#B91C1C', '#7F1D1D'],
  NEU: ['#2563EB', '#1D4ED8'],
  UET: ['#0284C7', '#0369A1'],
  HMU: ['#059669', '#047857'],
  DAV: ['#4F46E5', '#4338CA'],
  PTIT: ['#EA580C', '#C2410C'],
  HNUE: ['#0D9488', '#0F766E'],
  HAU: ['#D97706', '#B45309'],
  HANU: ['#2563EB', '#1E40AF'],
  PXU: ['#EA580C', '#9A3412'],
  DUT: ['#1E40AF', '#1E3A8A'],
  HCE: ['#0284C7', '#0369A1'],
  DUE: ['#16A34A', '#15803D'],
  UED: ['#0D9488', '#115E59'],
  UFL: ['#6366F1', '#4F46E5'],
  HUMP: ['#059669', '#065F46'],
  HUSC: ['#2563EB', '#1D4ED8'],
  QNU: ['#0284C7', '#075985'],
  NTU: ['#0EA5E9', '#0284C7'],
  HCMUT: ['#1E40AF', '#172554'],
  HCMUS: ['#0369A1', '#075985'],
  UEH: ['#2563EB', '#1E40AF'],
  UIT: ['#0284C7', '#0369A1'],
  UMP: ['#047857', '#064E3B'],
  HCMUTE: ['#C2410C', '#9A3412'],
  ULAW: ['#854D0E', '#713F12'],
  UAH: ['#B45309', '#78350F'],
  IU: ['#4338CA', '#312E81'],
  CTU: ['#15803D', '#14532D'],
};

export const UniversityAvatar: React.FC<UniversityAvatarProps> = ({
  code,
  name,
  size = 52,
  className = '',
}) => {
  const [loadError, setLoadError] = useState(false);
  const cleanCode = code.toLowerCase().trim();
  const logoExt = cleanCode === 'pxu' ? 'png' : 'jpg';
  const logoPath = `/images/logo_${cleanCode}.${logoExt}`;

  const colors = UNI_COLORS[code.toUpperCase()] || ['#2563EB', '#1D4ED8'];

  if (!loadError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-100 flex items-center justify-center bg-white ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={logoPath}
          alt={name || code}
          onError={() => setLoadError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: size >= 48 ? '4px' : '2px' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full shrink-0 shadow-sm flex items-center justify-center font-bold text-white uppercase tracking-wider ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        fontSize: Math.round(size * 0.34),
      }}
    >
      {code.slice(0, 3)}
    </div>
  );
};

// ==========================================
// 3. UNIFIED BUTTON SYSTEM
// ==========================================
export type ButtonVariant = 'primary' | 'danger' | 'outline' | 'tonal' | 'ghost' | 'onGradient';
export type ButtonSize = 'L' | 'M' | 'S';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'L',
  icon,
  fullWidth = false,
  loading = false,
  disabled,
  style,
  className = '',
  ...rest
}) => {
  // Height & padding rules from DESIGN_SPEC:
  // L: 52dp, font 16, radius 26dp
  // M: 44dp, font 14, radius 22dp
  // S: 36dp, font 13, radius 18dp
  let height = '52px';
  let fontSize = '16px';
  let borderRadius = '26px';
  let padding = '0 24px';

  if (size === 'M') {
    height = '44px';
    fontSize = '14px';
    borderRadius = '22px';
    padding = '0 18px';
  } else if (size === 'S') {
    height = '36px';
    fontSize = '13px';
    borderRadius = '18px';
    padding = '0 14px';
  }

  // Variant styles
  let bg = '#2563EB';
  let color = '#FFFFFF';
  let border = 'none';
  let boxShadow = '0 4px 12px rgba(37, 99, 235, 0.25)';

  if (variant === 'danger') {
    bg = '#EF4444';
    color = '#FFFFFF';
    boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
  } else if (variant === 'outline') {
    bg = '#FFFFFF';
    color = '#2563EB';
    border = '1.5px solid #2563EB';
    boxShadow = 'none';
  } else if (variant === 'tonal') {
    bg = '#EFF6FF';
    color = '#2563EB';
    border = 'none';
    boxShadow = 'none';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    color = '#2563EB';
    border = 'none';
    boxShadow = 'none';
  } else if (variant === 'onGradient') {
    bg = '#FFFFFF';
    color = '#2563EB';
    boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  }

  if (disabled) {
    bg = '#E2E8F0';
    color = '#94A3B8';
    border = 'none';
    boxShadow = 'none';
  }

  return (
    <button
      disabled={disabled || loading}
      className={`font-semibold inline-flex items-center justify-center gap-2 transition-all active:scale-95 select-none ${className}`}
      style={{
        height,
        fontSize,
        borderRadius,
        padding,
        backgroundColor: bg,
        color,
        border,
        boxShadow,
        width: fullWidth ? '100%' : 'auto',
        minHeight: '36px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

// ==========================================
// 4. MODAL / BOTTOM SHEET
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 25px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.25s ease-out',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div
            style={{
              width: '40px',
              height: '4px',
              backgroundColor: '#CBD5E1',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid #F1F5F9',
              backgroundColor: '#FFFFFF',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. TOAST NOTIFICATION
// ==========================================
export const Toast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '84px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        color: '#FFFFFF',
        padding: '10px 20px',
        borderRadius: '24px',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        maxWidth: '90%',
        textAlign: 'center',
        animation: 'fadeInUp 0.2s ease',
      }}
    >
      {message}
    </div>
  );
};

// ==========================================
// 6. EMPTY STATE VIEW
// ==========================================
export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, onAction }) => {
  return (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#EFF6FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '32px' }}>🔍</span>
      </div>
      <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#1E293B' }}>
        {title}
      </h4>
      <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748B', maxWidth: '300px', lineHeight: 1.4 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="tonal" size="M" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

// ==========================================
// 7. FOOTER COMPONENT
// ==========================================
export const AppFooter: React.FC<{ text?: string }> = ({
  text = 'Đồng hành cùng học sinh THPT và quý phụ huynh trên hành trình chọn ngành, chọn trường.',
}) => {
  return (
    <div
      style={{
        padding: '28px 20px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.95 }}>
        <img
          src="/images/logo_unipath.png"
          alt="Unipath Logo"
          style={{ width: '22px', height: '22px', objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E3A8A', letterSpacing: '0.4px' }}>
          HỆ SINH THÁI TUYỂN SINH UNIPATH
        </span>
      </div>
      <span style={{ fontSize: '12px', color: '#64748B', maxWidth: '380px', lineHeight: 1.4 }}>
        {text}
      </span>
      <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
        Phát triển bởi Trần Công Quý • Bản quyền dự án thuộc nhóm UP5 (ĐH Phú Xuân)
      </div>
      <span style={{ fontSize: '10px', color: '#94A3B8' }}>
        © 2026 Unipath Education Platform. Bảo lưu mọi quyền.
      </span>
    </div>
  );
};

