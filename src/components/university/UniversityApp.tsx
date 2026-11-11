import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  User,
  LogOut,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Award,
  Briefcase,
  MapPin,
  Star,
  School,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ApplicationRecord, ApplicationStatus } from '../../types';
import { UniversityAvatar } from '../common/UI';

// =========================================================================
// UNIVERSITY APP — Cổng tuyển sinh ĐH Phú Xuân (khung giao diện riêng)
// Chỉ hiển thị dữ liệu của PXU (uniCode === 'PXU'). Điều hướng riêng:
// Tổng quan / Hồ sơ PXU / Ngành đào tạo / Tài khoản.
// =========================================================================

type UniSection = 'dashboard' | 'apps' | 'programs' | 'account';

const NAV_ITEMS: { id: UniSection; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
  { id: 'apps', label: 'Hồ sơ PXU', icon: <FileText size={20} /> },
  { id: 'programs', label: 'Ngành học', icon: <GraduationCap size={20} /> },
  { id: 'account', label: 'Tài khoản', icon: <User size={20} /> },
];

const PXU_STATUSES: ApplicationStatus[] = ['Đang xét duyệt', 'Hồ sơ hợp lệ', 'Thiếu hồ sơ', 'Đã trúng tuyển', 'Đã hủy', 'Đã bị hủy'];

const statusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case 'Đã trúng tuyển':
      return '#059669';
    case 'Hồ sơ hợp lệ':
      return '#0EA5E9';
    case 'Thiếu hồ sơ':
      return '#2563EB';
    case 'Đang xét duyệt':
      return '#D97706';
    case 'Đã bị hủy':
      return '#DC2626';
    default:
      return '#64748B';
  }
};

const StatusChip: React.FC<{ status: ApplicationStatus }> = ({ status }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 800,
      color: statusColor(status),
      backgroundColor: `${statusColor(status)}1A`,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}
  >
    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor(status) }} />
    {status}
  </span>
);

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #DCE8E1',
  boxShadow: '0 4px 18px rgba(6, 78, 59, 0.05)',
  padding: '20px',
};

const EMERALD = '#059669';
const EMERALD_DARK = '#064E3B';

export const UniversityApp: React.FC = () => {
  const {
    user,
    profile,
    applications,
    universitiesList,
    updateApplicationStatus,
    openApplicationDetail,
    switchRole,
    logout,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [section, setSection] = useState<UniSection>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState<string>('Tất cả');

  // --- Dữ liệu riêng của PXU (phân lập theo uniCode) ---
  const pxuUni = universitiesList.find((u) => u.code === 'PXU');
  const pxuApps = applications.filter((a) => a.uniCode === 'PXU');
  const countByStatus = (s: ApplicationStatus) => pxuApps.filter((a) => a.status === s).length;
  const pendingApps = pxuApps.filter((a) => a.status === 'Đang xét duyệt');
  const missingApps = pxuApps.filter((a) => a.status === 'Thiếu hồ sơ');

  const majorCount = (major: string) =>
    pxuApps.filter((a) => a.major.toLowerCase().includes(major.toLowerCase())).length;

  const filteredApps = pxuApps.filter((a) => {
    const matchStatus = appStatus === 'Tất cả' || a.status === appStatus;
    const kw = appSearch.trim().toLowerCase();
    const matchKw =
      !kw ||
      a.candidateName.toLowerCase().includes(kw) ||
      a.code.toLowerCase().includes(kw) ||
      a.major.toLowerCase().includes(kw);
    return matchStatus && matchKw;
  });

  const selectedApp: ApplicationRecord | null =
    pxuApps.find((a) => a.id === selectedAppId) || pendingApps[0] || pxuApps[0] || null;

  const goHandleApp = (app: ApplicationRecord) => {
    setSelectedAppId(app.id);
    setSection('apps');
  };

  // ---------------------------------------------------------------------
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Hero của trường */}
      <div
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: isDesktop ? '190px' : '160px',
          display: 'flex',
          alignItems: 'flex-end',
          backgroundColor: EMERALD_DARK,
        }}
      >
        <img
          src="/images/campus_pxu.jpg"
          alt="Đại học Phú Xuân"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(6,60,44,0.92) 0%, rgba(6,95,70,0.65) 55%, rgba(6,95,70,0.15) 100%)',
          }}
        />
        <div style={{ position: 'relative', padding: isDesktop ? '26px' : '20px', color: '#FFFFFF', maxWidth: '640px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#A7F3D0', marginBottom: '6px' }}>
            Cổng tuyển sinh · Mùa tuyển sinh 2026
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: isDesktop ? '27px' : '22px', fontWeight: 900, lineHeight: 1.25 }}>
            Trường Đại học Phú Xuân (PXU)
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.55, color: '#D1FAE5' }}>
            {pxuUni?.desc || 'Trường đại học tiên phong đào tạo theo mô hình thực chiến gắn liền doanh nghiệp tại cố đô Huế.'}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {[
              `Học phí ${pxuUni ? `${pxuUni.tuitionMin}–${pxuUni.tuitionMax}` : '18–22'} triệu/năm`,
              `Việc làm sau tốt nghiệp ${pxuUni?.employmentRate ?? 92}%`,
              'TP. Huế, Thừa Thiên Huế',
            ].map((chip) => (
              <span key={chip} style={{ fontSize: '11.5px', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 11px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KPI của trường */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Hồ sơ vào PXU', value: pxuApps.length, icon: <FileText size={20} color={EMERALD} />, bg: '#ECFDF5' },
          { label: 'Đang chờ duyệt', value: countByStatus('Đang xét duyệt'), icon: <Clock size={20} color="#D97706" />, bg: '#FFFBEB' },
          { label: 'Thiếu hồ sơ', value: countByStatus('Thiếu hồ sơ'), icon: <AlertCircle size={20} color="#2563EB" />, bg: '#EFF6FF' },
          { label: 'Đã trúng tuyển PXU', value: countByStatus('Đã trúng tuyển'), icon: <CheckCircle2 size={20} color={EMERALD} />, bg: '#ECFDF5' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ ...cardStyle, padding: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              {kpi.icon}
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>{kpi.value}</div>
            <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.35fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
        {/* Hàng đợi của trường */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ chờ duyệt vào PXU</h2>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', backgroundColor: '#FFFBEB', padding: '3px 10px', borderRadius: '999px' }}>
              {pendingApps.length} hồ sơ
            </span>
          </div>
          {pendingApps.length === 0 ? (
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>Hiện không có hồ sơ nào chờ PXU duyệt.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {pendingApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => goHandleApp(app)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 4px',
                    border: 'none',
                    borderBottom: '1px solid #EEF4F0',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <UniversityAvatar code="PXU" size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.candidateName} · {app.code}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.major} · Nộp {app.submittedAt}
                    </div>
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: EMERALD, whiteSpace: 'nowrap' }}>{app.score}đ</span>
                  <ChevronRight size={16} color="#94A3B8" />
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setSection('apps')}
            style={{ marginTop: '14px', padding: '10px 16px', borderRadius: '12px', border: 'none', backgroundColor: EMERALD, color: '#FFFFFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
          >
            Xem tất cả hồ sơ PXU
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Theo ngành */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ theo ngành của PXU</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(pxuUni?.majors || []).map((major) => {
                const c = majorCount(major);
                const pct = pxuApps.length > 0 ? Math.round((c / pxuApps.length) * 100) : 0;
                return (
                  <div key={major}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#334155', fontWeight: 600 }}>{major}</span>
                      <span style={{ color: '#64748B', fontWeight: 700 }}>{c} hồ sơ</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#EEF4F0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: EMERALD, borderRadius: '999px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setSection('programs')}
              style={{ marginTop: '12px', padding: 0, border: 'none', background: 'none', color: EMERALD, fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
            >
              Xem chi tiết ngành & điểm chuẩn →
            </button>
          </div>

          {/* Nhắc bổ sung */}
          <div style={{ ...cardStyle, border: '1px solid #BFDBFE', backgroundColor: '#F8FBFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <AlertCircle size={17} color="#2563EB" />
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ cần bổ sung</h2>
            </div>
            {missingApps.length === 0 ? (
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Không có hồ sơ PXU nào đang thiếu giấy tờ.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {missingApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => goHandleApp(app)}
                    style={{ textAlign: 'left', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                      {app.candidateName} · {app.code}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{app.notes || 'Cần bổ sung giấy tờ theo yêu cầu của Hội đồng tuyển sinh.'}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderApps = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ nộp vào ĐH Phú Xuân</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          {filteredApps.length}/{pxuApps.length} hồ sơ · Dữ liệu phân lập: cổng này chỉ thấy hồ sơ đăng ký vào PXU
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #DCE8E1', borderRadius: '14px', padding: '0 14px', height: '46px' }}>
          <Search size={18} color="#94A3B8" />
          <input
            value={appSearch}
            onChange={(e) => setAppSearch(e.target.value)}
            placeholder="Tìm theo tên thí sinh, mã hồ sơ, ngành..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13.5px', color: '#0F172A', backgroundColor: 'transparent', minWidth: 0 }}
          />
          {appSearch && (
            <button onClick={() => setAppSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <X size={16} color="#94A3B8" />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Tất cả', ...PXU_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setAppStatus(s)}
              style={{
                padding: '7px 13px',
                borderRadius: '999px',
                border: appStatus === s ? `1.5px solid ${EMERALD}` : '1px solid #DCE8E1',
                backgroundColor: appStatus === s ? '#ECFDF5' : '#FFFFFF',
                color: appStatus === s ? EMERALD_DARK : '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.55fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredApps.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>Không có hồ sơ PXU nào khớp bộ lọc hiện tại.</div>
          )}
          {filteredApps.map((app) => {
            const isSelected = selectedApp?.id === app.id;
            return (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                style={{
                  ...cardStyle,
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  border: isSelected ? `2px solid ${EMERALD}` : '1px solid #DCE8E1',
                  backgroundColor: isSelected ? '#F7FCF9' : '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <UniversityAvatar code="PXU" size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.candidateName}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                      {app.code} · {app.submittedAt}
                    </div>
                  </div>
                  <StatusChip status={app.status} />
                </div>
                <div style={{ fontSize: '12.5px', color: '#334155' }}>{app.major} — Đại học Phú Xuân</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Điểm xét tuyển: <strong style={{ color: EMERALD }}>{app.score}</strong> · {app.phone} · {app.email}
                </div>
              </button>
            );
          })}
        </div>

        {selectedApp && (
          <div style={{ ...cardStyle, position: isDesktop ? 'sticky' : 'static', top: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.6px', color: EMERALD, textTransform: 'uppercase', marginBottom: '8px' }}>
              Hội đồng tuyển sinh PXU xử lý
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <UniversityAvatar code="PXU" size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>{selectedApp.candidateName}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{selectedApp.code}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#334155', marginBottom: '12px' }}>
              <div>Ngành đăng ký: <strong>{selectedApp.major}</strong></div>
              <div>Điểm xét tuyển: <strong style={{ color: EMERALD }}>{selectedApp.score}</strong></div>
              <div>Liên hệ: {selectedApp.phone} · {selectedApp.email}</div>
              <div>Nộp lúc: {selectedApp.submittedAt}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Trạng thái: <StatusChip status={selectedApp.status} />
              </div>
              {selectedApp.notes && (
                <div style={{ fontSize: '12.5px', color: '#64748B', backgroundColor: '#F7FAF8', borderRadius: '10px', padding: '10px', lineHeight: 1.5 }}>
                  {selectedApp.notes}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => updateApplicationStatus(selectedApp.id, 'Đã trúng tuyển')}
                disabled={selectedApp.status === 'Đã trúng tuyển'}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: selectedApp.status === 'Đã trúng tuyển' ? '#A7F3D0' : EMERALD,
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: selectedApp.status === 'Đã trúng tuyển' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                }}
              >
                <CheckCircle2 size={17} /> Duyệt trúng tuyển PXU
              </button>
              <button
                onClick={() => updateApplicationStatus(selectedApp.id, 'Thiếu hồ sơ')}
                disabled={selectedApp.status === 'Thiếu hồ sơ'}
                style={{
                  padding: '11px',
                  borderRadius: '12px',
                  border: '1.5px solid #2563EB',
                  backgroundColor: '#FFFFFF',
                  color: '#2563EB',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: selectedApp.status === 'Thiếu hồ sơ' ? 'default' : 'pointer',
                  opacity: selectedApp.status === 'Thiếu hồ sơ' ? 0.5 : 1,
                }}
              >
                Yêu cầu bổ sung hồ sơ
              </button>
              <button
                onClick={() => updateApplicationStatus(selectedApp.id, 'Đã bị hủy')}
                disabled={selectedApp.status === 'Đã bị hủy'}
                style={{
                  padding: '11px',
                  borderRadius: '12px',
                  border: '1.5px solid #FECACA',
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: selectedApp.status === 'Đã bị hủy' ? 'default' : 'pointer',
                  opacity: selectedApp.status === 'Đã bị hủy' ? 0.5 : 1,
                }}
              >
                Từ chối hồ sơ
              </button>
              <button
                onClick={() => openApplicationDetail(selectedApp)}
                style={{ padding: '8px', border: 'none', background: 'none', color: '#475569', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Xem biên nhận chi tiết
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPrograms = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Ngành đào tạo & chỉ tiêu PXU</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          {pxuUni ? `${pxuUni.majors.length} ngành đào tạo · Điểm chuẩn 2024 theo từng ngành` : 'Đang tải dữ liệu trường...'}
        </p>
      </div>

      {pxuUni && (
        <div style={{ ...cardStyle, display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <UniversityAvatar code="PXU" size={52} />
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>{pxuUni.name}</div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{pxuUni.desc}</div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '10px', fontSize: '12.5px', color: '#334155' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} color={EMERALD} /> {pxuUni.loc}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Star size={14} color="#D97706" /> {pxuUni.rating} / 5
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Briefcase size={14} color={EMERALD} /> Việc làm {pxuUni.employmentRate}%
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <School size={14} color={EMERALD} /> Học phí {pxuUni.tuitionMin}–{pxuUni.tuitionMax} triệu/năm
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
        {pxuUni &&
          Object.entries(pxuUni.cutoffScores).map(([major, cutoff]) => (
            <div key={major} style={{ ...cardStyle, padding: '18px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <GraduationCap size={20} color={EMERALD} />
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{major}</div>
              <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.7 }}>
                Điểm chuẩn 2024: <strong style={{ color: EMERALD, fontSize: '14px' }}>{cutoff}</strong>
                <br />
                Hồ sơ đã nộp vào ngành: <strong style={{ color: '#0F172A' }}>{majorCount(major)}</strong>
              </div>
            </div>
          ))}
      </div>

      <div
        style={{
          borderRadius: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)',
          color: '#FFFFFF',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ width: '42px', height: '42px', borderRadius: '13px', backgroundColor: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Award size={22} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ fontSize: '15.5px', fontWeight: 900, marginBottom: '4px' }}>Học bổng OJT & cam kết việc làm</div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.65, color: '#D1FAE5' }}>
            PXU áp dụng mô hình đào tạo thực chiến OJT gắn liền doanh nghiệp: thí sinh khối ngành Công nghệ & Thiết kế được xét học bổng tài trợ 50–100% học phí, sinh viên thực tập tại doanh nghiệp đối tác ngay trong quá trình học và {pxuUni?.employmentRate ?? 92}% có việc làm sau tốt nghiệp.
          </p>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
      <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Tài khoản tuyển sinh PXU</h1>
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <UniversityAvatar code="PXU" size={56} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A' }}>{user.name}</div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>{user.title}</div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>
              {user.email} · {user.organization}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
          Vai trò hiện tại: <strong style={{ color: EMERALD }}>Ban Tuyển sinh ĐH Phú Xuân (university_pxu)</strong> — cổng phân lập dữ liệu: chỉ xem và duyệt hồ sơ nộp vào PXU ({pxuApps.length} hồ sơ), không thấy hồ sơ của {universitiesList.length - 1} trường còn lại. Hồ sơ cá nhân liên kết: {profile.name}.
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Chuyển vai trò kiểm thử</h2>
        <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748B' }}>Chuyển nhanh để kiểm tra giao diện của từng vai trò. Mỗi vai trò có khung giao diện riêng.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(
            [
              { role: 'student' as const, label: '⚡ Thí sinh (Trần Công Quý)', desc: 'App hướng nghiệp của học sinh' },
              { role: 'admin' as const, label: '👑 Admin Hệ Thống UniPath', desc: 'Trung tâm điều hành toàn quốc' },
              { role: 'university_pxu' as const, label: '🏛️ ĐH Phú Xuân (PXU)', desc: 'Cổng tuyển sinh của trường (đang dùng)' },
            ]
          ).map((item) => (
            <button
              key={item.role}
              onClick={() => switchRole(item.role)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                border: user.role === item.role ? `2px solid ${EMERALD}` : '1px solid #DCE8E1',
                backgroundColor: user.role === item.role ? '#ECFDF5' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>
                <span style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>{item.label}</span>
                <span style={{ display: 'block', fontSize: '12px', color: '#64748B' }}>{item.desc}</span>
              </span>
              {user.role === item.role && <Check size={17} color={EMERALD} />}
            </button>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 18px',
              borderRadius: '12px',
              border: '1.5px solid #FECACA',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} /> Đăng xuất tài khoản
          </button>
        ) : (
          <div>
            <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#334155', fontWeight: 600 }}>Bạn chắc chắn muốn đăng xuất khỏi Cổng tuyển sinh PXU?</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={logout} style={{ padding: '10px 18px', borderRadius: '11px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                Đăng xuất
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ padding: '10px 18px', borderRadius: '11px', border: '1px solid #DCE8E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // Shell: header emerald + tab bar (desktop) / bottom nav (mobile)
  // ---------------------------------------------------------------------

  const content = (
    <main
      style={{
        flex: 1,
        width: '100%',
        maxWidth: '1160px',
        margin: '0 auto',
        padding: isDesktop ? '26px 28px 40px' : '18px 16px 96px',
        boxSizing: 'border-box',
      }}
    >
      {section === 'dashboard' && renderDashboard()}
      {section === 'apps' && renderApps()}
      {section === 'programs' && renderPrograms()}
      {section === 'account' && renderAccount()}
    </main>
  );

  const tabButton = (item: (typeof NAV_ITEMS)[number]) => {
    const active = section === item.id;
    if (isDesktop) {
      return (
        <button
          key={item.id}
          onClick={() => setSection(item.id)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: active ? EMERALD : 'transparent',
            color: active ? '#FFFFFF' : '#475569',
            fontSize: '13.5px',
            fontWeight: active ? 800 : 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {item.icon}
          {item.label}
        </button>
      );
    }
    return (
      <button
        key={item.id}
        onClick={() => setSection(item.id)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '6px 2px',
          border: 'none',
          backgroundColor: 'transparent',
          color: active ? EMERALD : '#64748B',
          fontSize: '10.5px',
          fontWeight: active ? 800 : 600,
          cursor: 'pointer',
          flex: 1,
        }}
      >
        {item.icon}
        {item.label}
        {active && <span style={{ width: '18px', height: '3px', borderRadius: '999px', backgroundColor: EMERALD }} />}
      </button>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F6F2', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', maxWidth: isDesktop ? undefined : '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <header
          style={{
            background: `linear-gradient(135deg, ${EMERALD_DARK} 0%, ${EMERALD} 100%)`,
            color: '#FFFFFF',
            padding: isDesktop ? '16px 28px' : '15px 18px 13px',
          }}
        >
          <div style={{ maxWidth: isDesktop ? '1160px' : undefined, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/images/logo_pxu.png" alt="PXU" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isDesktop ? '17px' : '15.5px', fontWeight: 900, lineHeight: 1.2 }}>Cổng Tuyển Sinh ĐH Phú Xuân</div>
              <div style={{ fontSize: '11.5px', color: '#A7F3D0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name} · {user.email}
              </div>
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 800, backgroundColor: '#F59E0B', color: '#451A03', padding: '4px 9px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
              {pendingApps.length} chờ duyệt
            </span>
          </div>
        </header>

        {isDesktop && (
          <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DCE8E1', position: 'sticky', top: 0, zIndex: 40 }}>
            <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '8px 28px', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {NAV_ITEMS.map(tabButton)}
            </div>
          </div>
        )}

        {content}

        {!isDesktop && (
          <nav
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxWidth: '520px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #DCE8E1',
              boxShadow: '0 -4px 24px rgba(6,78,59,0.08)',
              display: 'flex',
              paddingTop: '6px',
              paddingBottom: 'max(10px, env(safe-area-inset-bottom, 12px))',
              boxSizing: 'border-box',
              zIndex: 80,
            }}
          >
            {NAV_ITEMS.map(tabButton)}
          </nav>
        )}
      </div>
    </div>
  );
};
