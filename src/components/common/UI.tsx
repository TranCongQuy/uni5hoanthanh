import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  FileQuestion,
  ChevronDown,
} from 'lucide-react';
import type { ApplicationStatus } from '../../types';

// ==========================================
// 1. SAFE IMAGE COMPONENT
// ==========================================
export interface ImageSafeProps extends React.ImgHTMLAttributes<HTMLImageElement> {
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

  useEffect(() => {
    setImgSrc(src);
    setFailed(false);
  }, [src]);

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
// 2. UNIVERSITY AVATAR / MONOGRAM LOGO
// Deterministic SVG/CSS badge based on university code
// ==========================================
export interface UniversityAvatarProps {
  code: string;
  name?: string;
  size?: number;
  className?: string;
}

const UNI_PALETTES: Record<string, { bg: string; border: string; text: string }> = {
  BKA: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
  FTU: { bg: '#FEF2F2', border: '#FCA5A5', text: '#B91C1C' },
  NEU: { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' },
  UET: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0284C7' },
  HMU: { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669' },
  DAV: { bg: '#EEF2FF', border: '#C7D2FE', text: '#4F46E5' },
  PTIT: { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' },
  HNUE: { bg: '#F0FDFA', border: '#99F6E4', text: '#0D9488' },
  HAU: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' },
  HANU: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
  PXU: { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669' },
  DUT: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
  HCE: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
  DUE: { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' },
  UED: { bg: '#F0FDFA', border: '#99F6E4', text: '#0F766E' },
  UFL: { bg: '#EEF2FF', border: '#C7D2FE', text: '#4F46E5' },
  HUMP: { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857' },
  HUSC: { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' },
  QNU: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0284C7' },
  NTU: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0284C7' },
  HCMUT: { bg: '#EEF2FF', border: '#C7D2FE', text: '#1E40AF' },
  HCMUS: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
  UEH: { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' },
  UIT: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0284C7' },
  UMP: { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669' },
  HCMUTE: { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' },
  ULAW: { bg: '#FEFCE8', border: '#FEF08A', text: '#854D0E' },
  UAH: { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
  IU: { bg: '#EEF2FF', border: '#C7D2FE', text: '#4338CA' },
  CTU: { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
};

export const UniversityAvatar: React.FC<UniversityAvatarProps> = ({
  code,
  name,
  size = 48,
  className = '',
}) => {
  const [loadError, setLoadError] = useState(false);
  const cleanCode = code.toUpperCase().trim();
  const lowerCode = cleanCode.toLowerCase();
  const logoExt = lowerCode === 'bka' ? 'svg' : lowerCode === 'pxu' ? 'png' : 'jpg';
  const logoPath = `/images/logo_${lowerCode}.${logoExt}`;

  const palette = UNI_PALETTES[cleanCode] || {
    bg: 'var(--up-student-primary-light, #EEF2FF)',
    border: 'var(--up-student-primary-border, #C7D2FE)',
    text: 'var(--up-student-primary, #4F46E5)',
  };

  useEffect(() => {
    setLoadError(false);
  }, [logoPath]);

  if (!loadError) {
    return (
      <div
        className={`rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-white ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: '1px solid var(--up-color-slate-200, #E2E8F0)',
          boxShadow: 'var(--up-shadow-xs, 0 1px 2px rgba(15,23,42,0.04))',
        }}
      >
        <img
          src={logoPath}
          alt={name || code}
          onError={() => setLoadError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: lowerCode === 'bka' ? '0px' : size >= 48 ? '4px' : '2px',
          }}
        />
      </div>
    );
  }

  // Monogram Fallback: Clean SaaS badge with deterministic color
  return (
    <div
      className={`rounded-2xl shrink-0 flex items-center justify-center font-bold tracking-tight select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: palette.bg,
        border: `1.5px solid ${palette.border}`,
        color: palette.text,
        fontSize: Math.round(size * 0.32),
      }}
      title={name || code}
    >
      {cleanCode.slice(0, 4)}
    </div>
  );
};

// ==========================================
// 3. UNIFIED BUTTON SYSTEM
// ==========================================
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'tonal' | 'ghost' | 'onGradient';
export type ButtonSize = 'L' | 'M' | 'S';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'M',
  icon,
  fullWidth = false,
  loading = false,
  disabled,
  style,
  className = '',
  ...rest
}) => {
  let height = '44px';
  let fontSize = '14px';
  let borderRadius = 'var(--up-radius-md, 12px)';
  let padding = '0 18px';

  if (size === 'L') {
    height = '50px';
    fontSize = '15px';
    borderRadius = 'var(--up-radius-lg, 16px)';
    padding = '0 22px';
  } else if (size === 'S') {
    height = '34px';
    fontSize = '12.5px';
    borderRadius = 'var(--up-radius-sm, 8px)';
    padding = '0 12px';
  }

  let bg = 'var(--up-color-primary, #4F46E5)';
  let color = '#FFFFFF';
  let border = 'none';
  let boxShadow = 'var(--up-shadow-xs, 0 1px 2px rgba(15,23,42,0.04))';

  if (variant === 'secondary') {
    bg = 'var(--up-color-slate-100, #F1F5F9)';
    color = 'var(--up-color-slate-800, #1E293B)';
    border = '1px solid var(--up-color-slate-200, #E2E8F0)';
    boxShadow = 'none';
  } else if (variant === 'danger') {
    bg = 'var(--up-color-danger, #DC2626)';
    color = '#FFFFFF';
    boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
  } else if (variant === 'outline') {
    bg = 'var(--up-color-surface, #FFFFFF)';
    color = 'var(--up-color-primary, #4F46E5)';
    border = '1px solid var(--up-student-primary-border, #C7D2FE)';
    boxShadow = 'none';
  } else if (variant === 'tonal') {
    bg = 'var(--up-student-primary-light, #EEF2FF)';
    color = 'var(--up-student-primary, #4F46E5)';
    border = 'none';
    boxShadow = 'none';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    color = 'var(--up-color-slate-700, #334155)';
    border = 'none';
    boxShadow = 'none';
  } else if (variant === 'onGradient') {
    bg = 'var(--up-color-surface, #FFFFFF)';
    color = 'var(--up-color-primary, #4F46E5)';
    boxShadow = 'var(--up-shadow-sm)';
  }

  if (disabled) {
    bg = 'var(--up-color-slate-100, #F1F5F9)';
    color = 'var(--up-color-slate-400, #94A3B8)';
    border = '1px solid var(--up-color-slate-200, #E2E8F0)';
    boxShadow = 'none';
  }

  return (
    <button
      disabled={disabled || loading}
      className={`font-semibold inline-flex items-center justify-center gap-2 select-none ${className}`}
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
        minHeight: '34px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all var(--up-transition-fast, 150ms ease)',
        opacity: disabled && !loading ? 0.75 : 1,
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
// 4. UNIFIED STATUS CHIP (6 Application Statuses)
// Consistent color, icon, and text across Student, PXU, and Admin portals
// ==========================================
export interface StatusChipProps {
  status: ApplicationStatus | string;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'md',
  className = '',
  style,
}) => {
  let bg = 'var(--up-status-pending-bg, #FFFBEB)';
  let text = 'var(--up-status-pending-text, #B45309)';
  let border = 'var(--up-status-pending-border, #FDE68A)';
  let Icon = Clock;

  const normalized = (status || '').trim();

  if (normalized === 'Hồ sơ hợp lệ') {
    bg = 'var(--up-status-valid-bg, #F0F9FF)';
    text = 'var(--up-status-valid-text, #0369A1)';
    border = 'var(--up-status-valid-border, #BAE6FD)';
    Icon = CheckCircle2;
  } else if (normalized === 'Thiếu hồ sơ') {
    bg = 'var(--up-status-incomplete-bg, #FFF7ED)';
    text = 'var(--up-status-incomplete-text, #C2410C)';
    border = 'var(--up-status-incomplete-border, #FFEDD5)';
    Icon = FileQuestion;
  } else if (normalized === 'Đã trúng tuyển') {
    bg = 'var(--up-status-admitted-bg, #ECFDF5)';
    text = 'var(--up-status-admitted-text, #047857)';
    border = 'var(--up-status-admitted-border, #A7F3D0)';
    Icon = CheckCircle2;
  } else if (normalized === 'Đã hủy' || normalized === 'Đã bị hủy') {
    bg = 'var(--up-status-cancelled-bg, #F1F5F9)';
    text = 'var(--up-status-cancelled-text, #64748B)';
    border = 'var(--up-status-cancelled-border, #E2E8F0)';
    Icon = XCircle;
  } else if (normalized === 'Đang xét duyệt') {
    bg = 'var(--up-status-pending-bg, #FFFBEB)';
    text = 'var(--up-status-pending-text, #B45309)';
    border = 'var(--up-status-pending-border, #FDE68A)';
    Icon = Clock;
  }

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full whitespace-nowrap ${className}`}
      style={{
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        padding: isSmall ? '2px 8px' : '4px 10px',
        fontSize: isSmall ? '11px' : '12px',
        lineHeight: 1.25,
        ...style,
      }}
    >
      <Icon size={isSmall ? 12 : 13} className="shrink-0" />
      <span>{normalized || 'Không xác định'}</span>
    </span>
  );
};

// ==========================================
// 5. GENERIC BADGE
// ==========================================
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  style,
}) => {
  const stylesByVariant: Record<string, { bg: string; text: string; border: string }> = {
    primary: {
      bg: 'var(--up-student-primary-light, #EEF2FF)',
      text: 'var(--up-student-primary, #4F46E5)',
      border: 'var(--up-student-primary-border, #C7D2FE)',
    },
    success: {
      bg: 'var(--up-color-success-light, #ECFDF5)',
      text: 'var(--up-color-success, #059669)',
      border: 'var(--up-color-success-border, #A7F3D0)',
    },
    warning: {
      bg: 'var(--up-color-warning-light, #FFFBEB)',
      text: 'var(--up-color-warning, #D97706)',
      border: 'var(--up-color-warning-border, #FDE68A)',
    },
    danger: {
      bg: 'var(--up-color-danger-light, #FEF2F2)',
      text: 'var(--up-color-danger, #DC2626)',
      border: 'var(--up-color-danger-border, #FECACA)',
    },
    info: {
      bg: 'var(--up-color-info-light, #EFF6FF)',
      text: 'var(--up-color-info, #2563EB)',
      border: 'var(--up-color-info-border, #BFDBFE)',
    },
    neutral: {
      bg: 'var(--up-color-slate-100, #F1F5F9)',
      text: 'var(--up-color-slate-700, #334155)',
      border: 'var(--up-color-slate-200, #E2E8F0)',
    },
  };

  const current = stylesByVariant[variant] || stylesByVariant.neutral;
  const isSmall = size === 'sm';

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold"
      style={{
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
        padding: isSmall ? '2px 7px' : '3px 10px',
        fontSize: isSmall ? '11px' : '12px',
        ...style,
      }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

// ==========================================
// 6. SURFACE CARD
// ==========================================
export interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padding = '20px',
  style,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border ${hoverable ? 'cursor-pointer transition-all' : ''} ${className}`}
      style={{
        borderColor: 'var(--up-color-slate-200, #E2E8F0)',
        boxShadow: 'var(--up-shadow-card, 0 4px 16px -2px rgba(15,23,42,0.06))',
        padding,
        transition: 'transform var(--up-transition-normal, 200ms ease), box-shadow var(--up-transition-normal, 200ms ease)',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--up-shadow-lg, 0 12px 28px -4px rgba(15,23,42,0.1))';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'var(--up-shadow-card, 0 4px 16px -2px rgba(15,23,42,0.06))';
        }
      }}
    >
      {children}
    </div>
  );
};

// ==========================================
// 7. INPUT & SELECT FORM CONTROLS
// ==========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  id,
  style,
  className = '',
  ...rest
}) => {
  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${className}`}
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: error ? 'var(--up-color-danger, #DC2626)' : 'var(--up-color-slate-300, #CBD5E1)',
          boxShadow: 'var(--up-shadow-xs)',
          ...style,
        }}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-rose-600 font-medium inline-flex items-center gap-1">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </span>
      ) : helper ? (
        <span className="text-xs text-slate-500">{helper}</span>
      ) : null}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  id,
  style,
  className = '',
  ...rest
}) => {
  const selectId = id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label htmlFor={selectId} className="text-xs font-bold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-900 outline-none transition-colors ${className}`}
          style={{
            borderColor: error ? 'var(--up-color-danger, #DC2626)' : 'var(--up-color-slate-300, #CBD5E1)',
            boxShadow: 'var(--up-shadow-xs)',
            ...style,
          }}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
      {error && (
        <span className="text-xs text-rose-600 font-medium inline-flex items-center gap-1">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </span>
      )}
    </div>
  );
};

// ==========================================
// 8. TABS COMPONENT
// ==========================================
export interface TabItem {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string | number;
  onChange: (id: string | number) => void;
  variant?: 'underline' | 'pills';
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeId,
  onChange,
  variant = 'pills',
  style,
}) => {
  if (variant === 'underline') {
    return (
      <div
        className="flex items-center gap-6 border-b overflow-x-auto"
        style={{ borderColor: 'var(--up-color-slate-200, #E2E8F0)', ...style }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative py-3 text-sm font-bold transition-colors whitespace-nowrap inline-flex items-center gap-2"
              style={{
                color: isActive ? 'var(--up-student-primary, #4F46E5)' : 'var(--up-color-slate-500, #64748B)',
                borderBottom: isActive ? '2px solid var(--up-student-primary, #4F46E5)' : '2px solid transparent',
              }}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="inline-flex p-1 rounded-xl bg-slate-100 gap-1 overflow-x-auto"
      style={{ ...style }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap inline-flex items-center gap-1.5"
            style={{
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? 'var(--up-color-slate-900, #0F172A)' : 'var(--up-color-slate-600, #475569)',
              boxShadow: isActive ? 'var(--up-shadow-xs)' : 'none',
            }}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className="px-1.5 py-0.2 rounded-full text-[10px]"
                style={{
                  backgroundColor: isActive ? 'var(--up-student-primary, #4F46E5)' : '#CBD5E1',
                  color: isActive ? '#FFFFFF' : '#334155',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ==========================================
// 9. SKELETON LOADING
// ==========================================
export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '18px',
  borderRadius = 'var(--up-radius-sm, 8px)',
  className = '',
  style,
}) => {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        ...style,
      }}
    />
  );
};

// ==========================================
// 10. MODAL / DIALOG COMPONENT
// Centered Dialog on Desktop (max-w-xl), Bottom Sheet on Mobile (< 640px)
// ==========================================
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '540px',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--up-z-modal, 1000)' as unknown as number,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn var(--up-transition-normal, 200ms ease)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--up-radius-2xl, 24px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--up-shadow-modal, 0 20px 48px -8px rgba(15,23,42,0.2))',
          animation: 'popScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          border: '1px solid var(--up-color-slate-200, #E2E8F0)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 22px',
            borderBottom: '1px solid var(--up-color-slate-200, #E2E8F0)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 800,
              color: 'var(--up-color-slate-900, #0F172A)',
              letterSpacing: '-0.2px',
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--up-color-slate-100, #F1F5F9)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--up-color-slate-600, #475569)',
              transition: 'background var(--up-transition-fast)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '22px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '14px 22px',
              borderTop: '1px solid var(--up-color-slate-200, #E2E8F0)',
              backgroundColor: 'var(--up-color-slate-50, #F8FAFC)',
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
// 11. TOAST NOTIFICATION
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
        zIndex: 'var(--up-z-toast, 2000)' as unknown as number,
        backgroundColor: 'var(--up-color-slate-900, #0F172A)',
        color: '#FFFFFF',
        padding: '11px 22px',
        borderRadius: '9999px',
        fontSize: '13.5px',
        fontWeight: 600,
        boxShadow: 'var(--up-shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        maxWidth: '92%',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.12)',
        animation: 'fadeInUp 0.2s ease',
      }}
    >
      {message}
    </div>
  );
};

// ==========================================
// 12. EMPTY STATE VIEW (No Emoji! Pure Lucide)
// ==========================================
export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionText, onAction, icon }) => {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--up-radius-xl, 20px)',
          backgroundColor: 'var(--up-student-primary-light, #EEF2FF)',
          color: 'var(--up-student-primary, #4F46E5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
          border: '1px solid var(--up-student-primary-border, #C7D2FE)',
        }}
      >
        {icon || <Search size={26} />}
      </div>
      <h4
        style={{
          margin: '0 0 6px',
          fontSize: '16px',
          fontWeight: 800,
          color: 'var(--up-color-slate-900, #0F172A)',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          margin: '0 0 18px',
          fontSize: '13.5px',
          color: 'var(--up-color-slate-500, #64748B)',
          maxWidth: '320px',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="secondary" size="M" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

// ==========================================
// 13. APP FOOTER
// ==========================================
export const AppFooter: React.FC<{ text?: string }> = ({
  text = 'Đồng hành cùng học sinh THPT và quý phụ huynh trên hành trình chọn ngành, chọn trường.',
}) => {
  return (
    <div
      style={{
        padding: '32px 20px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        marginTop: 'var(--up-section-gap, 24px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
          src="/images/logo_unipath.png"
          alt="Unipath Logo"
          style={{ width: '22px', height: '22px', objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--up-student-primary, #4F46E5)', letterSpacing: '0.4px' }}>
          HỆ SINH THÁI TUYỂN SINH UNIPATH 2.0
        </span>
      </div>
      <span style={{ fontSize: '12px', color: 'var(--up-color-slate-500, #64748B)', maxWidth: '400px', lineHeight: 1.5 }}>
        {text}
      </span>
      <div style={{ fontSize: '11.5px', color: 'var(--up-student-primary, #4F46E5)', fontWeight: 600, marginTop: '2px' }}>
        Phát triển bởi Trần Công Quý • Trưởng nhóm: Dương Đình Phát • Bản quyền thuộc nhóm UP5 (ĐH Phú Xuân)
      </div>
      <span style={{ fontSize: '10.5px', color: 'var(--up-color-slate-400, #94A3B8)' }}>
        © 2026 Unipath Education Platform. Mọi số liệu được đối soát từ cổng thông tin 30 trường đại học.
      </span>
    </div>
  );
};
