import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  FileText,
  School,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { ApplicationRecord, University, ConsultationBooking } from '../../types';

interface AdminGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationRecord[];
  universities: University[];
  bookings: ConsultationBooking[];
  onNavigateToSection: (section: string) => void;
  onSelectApplication?: (app: ApplicationRecord) => void;
}

function removeTones(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export const AdminGlobalSearch: React.FC<AdminGlobalSearchProps> = ({
  isOpen,
  onClose,
  applications,
  universities,
  bookings,
  onNavigateToSection,
  onSelectApplication,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Search results
  const results = useMemo(() => {
    const q = removeTones(query);
    if (!q) {
      return { apps: [], unis: [], bks: [] };
    }

    const matchedApps = applications
      .filter((a) => {
        const hay = removeTones(
          `${a.code} ${a.candidateName} ${a.phone} ${a.major} ${a.uniName} ${a.uniCode}`
        );
        return hay.includes(q);
      })
      .slice(0, 5);

    const matchedUnis = universities
      .filter((u) => {
        const hay = removeTones(`${u.code} ${u.name} ${u.loc}`);
        return hay.includes(q);
      })
      .slice(0, 5);

    const matchedBks = bookings
      .filter((b) => {
        const hay = removeTones(`${b.name} ${b.phone} ${b.uniCode}`);
        return hay.includes(q);
      })
      .slice(0, 5);

    return {
      apps: matchedApps,
      unis: matchedUnis,
      bks: matchedBks,
    };
  }, [query, applications, universities, bookings]);

  const totalResults = results.apps.length + results.unis.length + results.bks.length;

  // Select first result helper (Enter key support)
  const selectFirstResult = useCallback(() => {
    if (results.apps.length > 0) {
      onClose();
      if (onSelectApplication) {
        onSelectApplication(results.apps[0]);
      } else {
        onNavigateToSection('apps');
      }
    } else if (results.unis.length > 0) {
      onClose();
      onNavigateToSection('unis');
    } else if (results.bks.length > 0) {
      onClose();
      onNavigateToSection('bookings');
    }
  }, [results, onClose, onSelectApplication, onNavigateToSection]);

  // Keyboard navigation: Esc to close, Enter to open first result
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      } else if (e.key === 'Enter' && isOpen) {
        e.preventDefault();
        selectFirstResult();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, selectFirstResult]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10080,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px 20px 20px',
      }}
      onClick={onClose}
    >
      <div
        className="up-modal-enter"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FAFAFA',
          }}
        >
          <Search size={20} color="#64748B" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                selectFirstResult();
              }
            }}
            placeholder="Tìm kiếm nhanh hồ sơ, mã thí sinh, trường ĐH, lịch tư vấn... (Esc để đóng, Enter để chọn)"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
              fontWeight: 600,
              color: '#0F172A',
              outline: 'none',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          )}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748B',
              backgroundColor: '#E2E8F0',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            ESC
          </span>
        </div>

        {/* Results Area */}
        <div style={{ overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!query.trim() ? (
            <div style={{ padding: '28px 0', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontWeight: 700, marginBottom: '6px' }}>
                <Sparkles size={14} /> Tìm kiếm không dấu tiếng Việt
              </div>
              <div>Gõ tên thí sinh, mã hồ sơ (HS-2026-PXU01), trường ĐH (Bách Khoa, PXU) hoặc số điện thoại</div>
            </div>
          ) : totalResults === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
              Không tìm thấy kết quả nào khớp với &ldquo;<strong>{query}</strong>&rdquo;
            </div>
          ) : (
            <>
              {/* Category: Applications */}
              {results.apps.length > 0 && (
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={13} color="#2563EB" />
                    <span>Hồ sơ xét tuyển ({results.apps.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results.apps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          onClose();
                          if (onSelectApplication) {
                            onSelectApplication(app);
                          } else {
                            onNavigateToSection('apps');
                          }
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ fontSize: '13px', color: '#1E40AF' }}>{app.code}</strong>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{app.candidateName}</span>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>• {app.phone}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            {app.major} • {app.uniName}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: app.statusColor, backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            {app.status}
                          </span>
                          <ChevronRight size={14} color="#94A3B8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: Universities */}
              {results.unis.length > 0 && (
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <School size={13} color="#059669" />
                    <span>Trường đại học ({results.unis.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results.unis.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          onClose();
                          onNavigateToSection('unis');
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ECFDF5')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ fontSize: '13px', color: '#065F46' }}>{u.code}</strong>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{u.name}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            Miền {u.region} • {u.loc}
                          </div>
                        </div>
                        <ChevronRight size={14} color="#94A3B8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: Bookings */}
              {results.bks.length > 0 && (
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="#7C3AED" />
                    <span>Lịch tư vấn 1-1 ({results.bks.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results.bks.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          onClose();
                          onNavigateToSection('bookings');
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF5FF')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ fontSize: '13px', color: '#6D28D9' }}>{b.name}</strong>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>• {b.phone}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            Trường {b.uniCode} • {b.dateTime}
                          </div>
                        </div>
                        <ChevronRight size={14} color="#94A3B8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
