import React, { useState } from 'react';
import { MapPin, Star, Heart, Scale, Sparkles } from 'lucide-react';
import type { University } from '../../types';
import { UniversityAvatar, ImageSafe } from './UI';
import { useReveal } from '../../hooks/useAurora';
import { getUniCoverGradient } from '../../utils/auroraThemes';

export interface AuroraHeroMeshProps {
  children: React.ReactNode;
  variant?: 'student' | 'admin' | 'pxu';
  minHeight?: string;
  padding?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const AuroraHeroMesh: React.FC<AuroraHeroMeshProps> = ({
  children,
  variant = 'student',
  minHeight = '480px',
  padding = '40px 48px',
  borderRadius = '24px',
  style,
  className = '',
}) => {
  // Brand color configurations for the 3 slow organic floating orbs
  const orbColors =
    variant === 'admin'
      ? {
          bg: 'linear-gradient(135deg, #050B14 0%, #0B132B 45%, #1C2541 100%)',
          orb1: 'rgba(30, 58, 138, 0.42)', // Navy electric
          orb2: 'rgba(14, 116, 144, 0.32)', // Cyan deep
          orb3: 'rgba(88, 28, 135, 0.22)', // Indigo violet
        }
      : variant === 'pxu'
      ? {
          bg: 'linear-gradient(135deg, #022C22 0%, #064E3B 45%, #0F766E 100%)',
          orb1: 'rgba(5, 150, 105, 0.45)', // Emerald
          orb2: 'rgba(13, 148, 136, 0.35)', // Teal
          orb3: 'rgba(4, 120, 87, 0.28)', // Forest
        }
      : {
          bg: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #1E3A8A 100%)',
          orb1: 'rgba(99, 102, 241, 0.45)', // Indigo
          orb2: 'rgba(6, 182, 212, 0.30)', // Cyan
          orb3: 'rgba(168, 85, 247, 0.25)', // Violet
        };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        color: '#FFFFFF',
        background: orbColors.bg,
        minHeight,
        padding,
        borderRadius,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.25)',
        boxSizing: 'border-box',
        isolation: 'isolate',
        ...style,
      }}
    >
      {/* 3 Slow floating organic orbs (pure CSS, will-change: transform) */}
      <div
        aria-hidden="true"
        className="aurora-orb-1"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${orbColors.orb1} 0%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(54px)',
          top: '-15%',
          left: '-8%',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="aurora-orb-2"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${orbColors.orb2} 0%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(60px)',
          bottom: '-20%',
          right: '-10%',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="aurora-orb-3"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${orbColors.orb3} 0%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(50px)',
          top: '30%',
          left: '45%',
          zIndex: 0,
        }}
      />

      {/* Geometric micro-mesh overlay (pure SVG data-uri pattern) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.08,
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          zIndex: 1,
        }}
      />

      {/* Content slot */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>{children}</div>
    </div>
  );
};

export interface UniversityCardProps {
  uni: University;
  onSelect: (uni: University) => void;
  onCompareToggle?: (id: number) => void;
  isCompared?: boolean;
  onFavoriteToggle?: (id: number) => void;
  isFavorite?: boolean;
  onApply?: (uni: University) => void;
  onConsult?: (uni: University) => void;
  matchingScore?: number;
  highlightMajor?: string;
  staggerIndex?: number;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  uni,
  onSelect,
  onCompareToggle,
  isCompared = false,
  onFavoriteToggle,
  isFavorite = false,
  onApply,
  onConsult,
  matchingScore,
  highlightMajor,
  staggerIndex = 0,
}) => {
  const { ref, revealStyle } = useReveal<HTMLDivElement>({ staggerIndex, staggerStepMs: 40 });
  const [isHovered, setIsHovered] = useState(false);
  const gradient = getUniCoverGradient(uni.code);

  const cutoffScores = Object.values(uni.cutoffScores || {});
  const minCutoff = cutoffScores.length > 0 ? Math.min(...cutoffScores) : uni.score2024;
  const maxCutoff = cutoffScores.length > 0 ? Math.max(...cutoffScores) : uni.score2024;

  return (
    <div
      ref={ref}
      data-uni-card={uni.id}
      style={{
        ...revealStyle,
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: '22px',
        border: isHovered ? '1px solid #C7D2FE' : '1px solid #E2E8F0',
        boxShadow: isHovered
          ? 'var(--up-shadow-glow-indigo, 0 12px 32px -4px rgba(79, 70, 229, 0.14))'
          : 'var(--up-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 140px Campus Cover Photo with Scrim Gradient */}
      <div
        style={{
          position: 'relative',
          height: '140px',
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          overflow: 'hidden',
        }}
      >
        {/* Campus Cover Image */}
        <ImageSafe
          src={`/images/campus_${uni.code.toLowerCase()}.jpg`}
          fallbackSrc="/images/campus_default.png"
          altText={uni.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Linear Scrim Gradient Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.0) 0%, rgba(15, 23, 42, 0.38) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Code & Region Pill Top-Left */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '14px',
            zIndex: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '9999px',
            padding: '3px 10px',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.3px',
          }}
        >
          <span>{uni.code}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>Miền {uni.region}</span>
        </div>

        {/* Matching Pill (If available) */}
        {typeof matchingScore === 'number' && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: onFavoriteToggle ? '50px' : '14px',
              zIndex: 2,
              backgroundColor:
                matchingScore >= 80 ? 'rgba(5, 150, 105, 0.9)' : matchingScore >= 60 ? 'rgba(37, 99, 235, 0.9)' : 'rgba(217, 119, 6, 0.9)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '9999px',
            }}
          >
            {matchingScore}% Phù hợp
          </div>
        )}

        {/* Favorite Heart Button Top-Right */}
        {onFavoriteToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(uni.id);
            }}
            aria-label={`Yêu thích ${uni.name}`}
            style={{
              position: 'absolute',
              top: '10px',
              right: '12px',
              zIndex: 2,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isFavorite ? '#EF4444' : '#64748B',
              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Heart size={15} fill={isFavorite ? '#EF4444' : 'none'} />
          </button>
        )}
      </div>

      {/* Floating Logo Badge Overlapping Cover and Body (Child of Card Root) */}
      <div
        style={{
          position: 'absolute',
          left: '16px',
          top: '119px',
          zIndex: 5,
          borderRadius: '16px',
          border: '2px solid #FFFFFF',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UniversityAvatar code={uni.code} size={42} />
      </div>

      {/* Card Body */}
      <div style={{ padding: '24px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name and Rating */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
          <h3
            onClick={() => onSelect(uni)}
            style={{
              margin: 0,
              fontSize: '15.5px',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.3,
              cursor: 'pointer',
              flex: 1,
            }}
            title={uni.name}
          >
            {uni.name}
          </h3>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#D97706',
              backgroundColor: '#FEF3C7',
              padding: '2px 6px',
              borderRadius: '6px',
              flexShrink: 0,
            }}
          >
            <Star size={11} fill="#D97706" />
            <span>{uni.rating || 4.8}</span>
          </div>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
          <MapPin size={12} color="#94A3B8" />
          <span className="text-ellipsis-single">{uni.loc}</span>
        </div>

        {/* Highlight Major (if search or matching matched) */}
        {highlightMajor && (
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#4338CA',
              backgroundColor: '#EEF2FF',
              padding: '4px 8px',
              borderRadius: '8px',
              marginBottom: '10px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            🎯 Ngành trọng điểm: {highlightMajor}
          </div>
        )}

        {/* Metrics Row (Cutoff & Tuition) */}
        <div
          className="tabular-nums"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            padding: '8px 10px',
            marginBottom: '14px',
            border: '1px solid #F1F5F9',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Điểm chuẩn 2024</div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
              {minCutoff === maxCutoff ? `${minCutoff}đ` : `${minCutoff} – ${maxCutoff}đ`}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Học phí dự kiến</div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
              {uni.tuitionMin} – {uni.tuitionMax} tr/năm
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onSelect(uni)}
            className="up-btn-shine"
            style={{
              flex: 1,
              height: '38px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--up-student-primary, #4F46E5)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease',
            }}
          >
            Xem chi tiết
          </button>

          {onCompareToggle && (
            <button
              type="button"
              onClick={() => onCompareToggle(uni.id)}
              aria-label={`So sánh ${uni.code}`}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: isCompared ? '1.5px solid #4F46E5' : '1px solid #E2E8F0',
                backgroundColor: isCompared ? '#EEF2FF' : '#FFFFFF',
                color: isCompared ? '#4F46E5' : '#64748B',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={isCompared ? 'Bỏ so sánh' : 'Thêm vào so sánh'}
            >
              <Scale size={16} />
            </button>
          )}

          {onApply && (
            <button
              type="button"
              onClick={() => onApply(uni)}
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              Xét tuyển
            </button>
          )}

          {onConsult && (
            <button
              type="button"
              onClick={() => onConsult(uni)}
              style={{
                height: '38px',
                padding: '0 10px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#4338CA',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Đặt lịch tư vấn"
            >
              <Sparkles size={13} />
              <span>Tư vấn</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
