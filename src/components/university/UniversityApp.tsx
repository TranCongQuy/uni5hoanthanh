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
  X,
  ChevronRight,
  Award,
  Briefcase,
  MapPin,
  Star,
  School,
  Bell,
  Settings,
  Calendar,
  Download,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ApplicationRecord, ApplicationStatus } from '../../types';
import { UniversityAvatar } from '../common/UI';

// =========================================================================
// UNIVERSITY APP v2 — Cổng tuyển sinh ĐH Phú Xuân (khung giao diện riêng)
// Điều hướng riêng: Tổng quan / Hồ sơ PXU / Tư vấn / Ngành học / Tài khoản.
// Dữ liệu phân lập tuyệt đối theo uniCode 'PXU': hồ sơ, lịch tư vấn và nhật
// ký xử lý chỉ của PXU; hệ thống tự chặn thao tác trái quyền ở tầng xử lý.
// =========================================================================

type UniSection = 'dashboard' | 'apps' | 'bookings' | 'programs' | 'account';
type AppSort = 'list' | 'scoreDesc' | 'scoreAsc' | 'nameAsc';

const NAV_ITEMS: { id: UniSection; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
  { id: 'apps', label: 'Hồ sơ PXU', icon: <FileText size={20} /> },
  { id: 'bookings', label: 'Tư vấn', icon: <Calendar size={20} /> },
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
    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor(status), flexShrink: 0 }} />
    {status}
  </span>
);

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #DCE8E1',
  boxShadow: '0 4px 18px rgba(6, 78, 59, 0.05)',
  padding: '20px',
  boxSizing: 'border-box',
  minWidth: 0,
};

const EMERALD = '#059669';
const EMERALD_DARK = '#064E3B';

const exportAppsCsv = (rows: ApplicationRecord[], filename: string) => {
  const header = 'Mã hồ sơ,Thí sinh,Trường,Ngành,Điểm,Trạng thái,SĐT,Email,Ngày nộp';
  const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = rows.map((a) =>
    [a.code, a.candidateName, a.uniName, a.major, a.score, a.status, a.phone, a.email, a.submittedAt].map(esc).join(',')
  );
  const blob = new Blob(['\uFEFF' + header + '\n' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const UniversityApp: React.FC = () => {
  const {
    user,
    profile,
    applications,
    bookings,
    universitiesList,
    updateApplicationStatus,
    processingLog,
    openApplicationDetail,
    openNotifications,
    openSettings,
    logout,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [section, setSection] = useState<UniSection>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState<string>('Tất cả');
  const [appSort, setAppSort] = useState<AppSort>('list');

  // --- Dữ liệu riêng của PXU (phân lập theo uniCode) ---
  const pxuUni = universitiesList.find((u) => u.code === 'PXU');
  const pxuApps = applications.filter((a) => a.uniCode === 'PXU');
  const pxuBookings = bookings.filter((b) => b.uniCode === 'PXU');
  const pxuLog = processingLog.filter((l) => l.uniCode === 'PXU');
  const countByStatus = (s: ApplicationStatus) => pxuApps.filter((a) => a.status === s).length;
  const pendingApps = pxuApps.filter((a) => a.status === 'Đang xét duyệt');
  const missingApps = pxuApps.filter((a) => a.status === 'Thiếu hồ sơ');

  const majorApps = (major: string) => pxuApps.filter((a) => a.major.toLowerCase().includes(major.toLowerCase()));
  const majorCount = (major: string) => majorApps(major).length;

  const filteredApps = pxuApps.filter((a) => {
    const matchStatus = appStatus === 'Tất cả' || a.status === appStatus;
    const kw = appSearch.trim().toLowerCase();
    const matchKw = !kw || a.candidateName.toLowerCase().includes(kw) || a.code.toLowerCase().includes(kw) || a.major.toLowerCase().includes(kw);
    return matchStatus && matchKw;
  });
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (appSort === 'scoreDesc') return b.score - a.score;
    if (appSort === 'scoreAsc') return a.score - b.score;
    if (appSort === 'nameAsc') return a.candidateName.localeCompare(b.candidateName, 'vi');
    return 0;
  });

  const selectedApp: ApplicationRecord | null =
    pxuApps.find((a) => a.id === selectedAppId) || pendingApps[0] || pxuApps[0] || null;

  const selectApp = (app: ApplicationRecord, goToApps: boolean) => {
    setSelectedAppId(app.id);
    if (goToApps) setSection('apps');
    if (!isDesktop) {
      window.setTimeout(() => {
        document.getElementById("app-inspector")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, goToApps ? 180 : 80);
    }
  };

  const selectStyle: React.CSSProperties = {
    padding: '9px 12px',
    borderRadius: '11px',
    border: '1px solid #DCE8E1',
    backgroundColor: '#FFFFFF',
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#334155',
    outline: 'none',
    cursor: 'pointer',
    maxWidth: '100%',
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
        <img src="/images/campus_pxu.jpg" alt="Đại học Phú Xuân" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,60,44,0.92) 0%, rgba(6,95,70,0.65) 55%, rgba(6,95,70,0.15) 100%)' }} />
        <div style={{ position: 'relative', padding: isDesktop ? '26px' : '20px', color: '#FFFFFF', maxWidth: '640px', minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#A7F3D0', marginBottom: '6px' }}>
            Cổng tuyển sinh · Mùa tuyển sinh 2026
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: isDesktop ? '27px' : '22px', fontWeight: 900, lineHeight: 1.25 }}>Trường Đại học Phú Xuân (PXU)</h1>
          <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.55, color: '#D1FAE5' }}>
            {pxuUni?.desc || 'Trường đại học tiên phong đào tạo theo mô hình thực chiến gắn liền doanh nghiệp tại cố đô Huế.'}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {[
              `Học phí ${pxuUni ? `${pxuUni.tuitionMin}–${pxuUni.tuitionMax}` : '18–22'} triệu/năm`,
              `Việc làm sau tốt nghiệp ${pxuUni?.employmentRate ?? 92}%`,
              `${pxuBookings.length} lịch tư vấn đã đặt`,
            ].map((chip) => (
              <span key={chip} style={{ fontSize: '11.5px', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 11px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KPI của trường */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Hồ sơ vào PXU', value: pxuApps.length, icon: <FileText size={19} color={EMERALD} />, bg: '#ECFDF5' },
          { label: 'Đang chờ duyệt', value: countByStatus('Đang xét duyệt'), icon: <Clock size={19} color="#D97706" />, bg: '#FFFBEB' },
          { label: 'Thiếu hồ sơ', value: countByStatus('Thiếu hồ sơ'), icon: <AlertCircle size={19} color="#2563EB" />, bg: '#EFF6FF' },
          { label: 'Đã trúng tuyển PXU', value: countByStatus('Đã trúng tuyển'), icon: <CheckCircle2 size={19} color={EMERALD} />, bg: '#ECFDF5' },
          { label: 'Lịch tư vấn PXU', value: pxuBookings.length, icon: <Calendar size={19} color="#7C3AED" />, bg: '#F5F3FF' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ ...cardStyle, padding: '15px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '9px' }}>
              {kpi.icon}
            </div>
            <div style={{ fontSize: '25px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>{kpi.value}</div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.35fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          {/* Hàng đợi */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ chờ duyệt vào PXU</h2>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', backgroundColor: '#FFFBEB', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>{pendingApps.length} hồ sơ</span>
            </div>
            {pendingApps.length === 0 ? (
              <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>Hiện không có hồ sơ nào chờ PXU duyệt.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {pendingApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => selectApp(app, true)}
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
                      minWidth: 0,
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
                    <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
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

          {/* Phễu tuyển sinh PXU */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Phễu tuyển sinh PXU</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(
                [
                  { label: 'Tổng hồ sơ nộp vào PXU', value: pxuApps.length, color: EMERALD },
                  { label: 'Đang xét duyệt', value: countByStatus('Đang xét duyệt'), color: '#D97706' },
                  { label: 'Hồ sơ hợp lệ', value: countByStatus('Hồ sơ hợp lệ'), color: '#0EA5E9' },
                  { label: 'Đã trúng tuyển', value: countByStatus('Đã trúng tuyển'), color: EMERALD },
                ] as const
              ).map((step) => {
                const pct = pxuApps.length > 0 ? Math.round((step.value / pxuApps.length) * 100) : 0;
                return (
                  <div key={step.label} style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#334155', fontWeight: 600 }}>{step.label}</span>
                      <span style={{ color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {step.value} · {pct}%
                      </span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#EEF4F0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: step.color, borderRadius: '999px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          {/* Theo ngành */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ theo ngành của PXU</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(pxuUni?.majors || []).map((major) => {
                const c = majorCount(major);
                const pct = pxuApps.length > 0 ? Math.round((c / pxuApps.length) * 100) : 0;
                return (
                  <div key={major} style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#334155', fontWeight: 600 }}>{major}</span>
                      <span style={{ color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>{c} hồ sơ</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#EEF4F0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: EMERALD, borderRadius: '999px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setSection('programs')} style={{ marginTop: '12px', padding: 0, border: 'none', background: 'none', color: EMERALD, fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}>
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
                  <button key={app.id} onClick={() => selectApp(app, true)} style={{ textAlign: 'left', border: 'none', background: 'none', padding: 0, cursor: 'pointer', minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                      {app.candidateName} · {app.code}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{app.notes || 'Cần bổ sung giấy tờ theo yêu cầu của Hội đồng tuyển sinh.'}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lịch tư vấn sắp tới */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Lịch tư vấn PXU</h2>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#7C3AED', backgroundColor: '#F5F3FF', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>{pxuBookings.length} lịch</span>
            </div>
            {pxuBookings.length === 0 ? (
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Chưa có thí sinh nào đặt lịch tư vấn với PXU.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {pxuBookings.slice(0, 3).map((bk) => (
                  <div key={bk.id} style={{ fontSize: '12.5px', color: '#334155', minWidth: 0 }}>
                    <strong style={{ color: '#0F172A' }}>{bk.name}</strong> · {bk.major}
                    <div style={{ color: '#64748B' }}>
                      {bk.dateTime} · {bk.phone}
                    </div>
                  </div>
                ))}
                <button onClick={() => setSection('bookings')} style={{ padding: 0, border: 'none', background: 'none', color: EMERALD, fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}>
                  Xem tất cả lịch tư vấn →
                </button>
              </div>
            )}
          </div>

          {/* Nhật ký PXU */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Nhật ký xử lý hồ sơ PXU</h2>
            <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748B' }}>Các quyết định đã thực hiện trên hồ sơ nộp vào PXU trong phiên này.</p>
            {pxuLog.length === 0 ? (
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Chưa có lượt xử lý nào. Vào mục Hồ sơ PXU để duyệt hồ sơ đang chờ.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {pxuLog.slice(0, 6).map((log) => (
                  <div key={log.id} style={{ padding: '9px 2px', borderBottom: '1px solid #EEF4F0' }}>
                    <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>{log.time}</div>
                    <div style={{ fontSize: '13px', color: '#334155' }}>
                      <strong style={{ color: '#0F172A' }}>{log.actorName}</strong> · {log.appCode} · {log.candidateName}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>
                      <span style={{ color: statusColor(log.fromStatus) }}>{log.fromStatus}</span>
                      <span style={{ color: '#94A3B8' }}> → </span>
                      <span style={{ color: statusColor(log.toStatus) }}>{log.toStatus}</span>
                    </div>
                  </div>
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
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ nộp vào ĐH Phú Xuân</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
            {sortedApps.length}/{pxuApps.length} hồ sơ · Dữ liệu phân lập: cổng này chỉ thấy hồ sơ đăng ký vào PXU
          </p>
        </div>
        <button
          onClick={() => exportAppsCsv(sortedApps, 'ho-so-pxu.csv')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 15px', borderRadius: '12px', border: `1.5px solid ${EMERALD}`, backgroundColor: '#FFFFFF', color: EMERALD, fontSize: '13px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <Download size={15} /> Xuất CSV ({sortedApps.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #DCE8E1', borderRadius: '14px', padding: '0 14px', height: '46px', flex: '1 1 260px', minWidth: 0, boxSizing: 'border-box' }}>
            <Search size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
            <input
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
              placeholder="Tìm tên thí sinh, mã hồ sơ, ngành..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13.5px', color: '#0F172A', backgroundColor: 'transparent', minWidth: 0 }}
            />
            {appSearch && (
              <button onClick={() => setAppSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                <X size={16} color="#94A3B8" />
              </button>
            )}
          </div>
          <select value={appSort} onChange={(e) => setAppSort(e.target.value as AppSort)} style={{ ...selectStyle, height: '46px' }} aria-label="Sắp xếp hồ sơ">
            <option value="list">Thứ tự danh sách</option>
            <option value="scoreDesc">Điểm cao → thấp</option>
            <option value="scoreAsc">Điểm thấp → cao</option>
            <option value="nameAsc">Tên thí sinh A–Z</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Tất cả', ...PXU_STATUSES].map((s) => {
            const count = s === 'Tất cả' ? pxuApps.length : countByStatus(s as ApplicationStatus);
            return (
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
                {s} · {count}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.55fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          {sortedApps.length === 0 && <div style={{ ...cardStyle, textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>Không có hồ sơ PXU nào khớp bộ lọc hiện tại.</div>}
          {sortedApps.map((app) => {
            const isSelected = selectedApp?.id === app.id;
            return (
              <button
                key={app.id}
                onClick={() => selectApp(app, false)}
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
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.candidateName}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                      {app.code} · {app.submittedAt}
                    </div>
                  </div>
                  <StatusChip status={app.status} />
                </div>
                <div style={{ fontSize: '12.5px', color: '#334155' }}>{app.major} — Đại học Phú Xuân</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Điểm: <strong style={{ color: EMERALD }}>{app.score}</strong> · {app.phone} · {app.email}
                </div>
              </button>
            );
          })}
        </div>

        {selectedApp && (
          <div id="app-inspector" style={{ ...cardStyle, position: isDesktop ? 'sticky' : 'static', top: '24px', scrollMarginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.6px', color: EMERALD, textTransform: 'uppercase', marginBottom: '8px' }}>Hội đồng tuyển sinh PXU xử lý</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <UniversityAvatar code="PXU" size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedApp.candidateName}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{selectedApp.code}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#334155', marginBottom: '12px' }}>
              <div>Ngành đăng ký: <strong>{selectedApp.major}</strong></div>
              <div>Điểm xét tuyển: <strong style={{ color: EMERALD }}>{selectedApp.score}</strong></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <Phone size={13} color="#64748B" /> {selectedApp.phone} · {selectedApp.email}
              </div>
              <div>Nộp lúc: {selectedApp.submittedAt}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                Trạng thái: <StatusChip status={selectedApp.status} />
              </div>
              {selectedApp.notes && <div style={{ fontSize: '12.5px', color: '#64748B', backgroundColor: '#F7FAF8', borderRadius: '10px', padding: '10px', lineHeight: 1.5 }}>{selectedApp.notes}</div>}
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

  const renderBookings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Lịch tư vấn với ĐH Phú Xuân</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          {pxuBookings.length} lịch hẹn thí sinh đã đặt riêng với PXU (cổng này không thấy lịch của trường khác)
        </p>
      </div>
      {pxuBookings.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>Chưa có lịch tư vấn nào được đặt với PXU.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(258px, 1fr))', gap: '12px' }}>
          {pxuBookings.map((bk) => (
            <div key={bk.id} style={{ ...cardStyle, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <UniversityAvatar code="PXU" size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bk.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>Ngành quan tâm: {bk.major}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#334155' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={13} color="#7C3AED" /> <strong>{bk.dateTime}</strong>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="#64748B" /> {bk.phone}
                </span>
                {bk.notes && <span style={{ color: '#64748B', lineHeight: 1.5 }}>{bk.notes}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPrograms = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Ngành đào tạo & chỉ tiêu PXU</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          {pxuUni ? `${pxuUni.majors.length} ngành đào tạo · Điểm chuẩn 2024 và tình hình hồ sơ theo từng ngành` : 'Đang tải dữ liệu trường...'}
        </p>
      </div>

      {pxuUni && (
        <div style={{ ...cardStyle, display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <UniversityAvatar code="PXU" size={52} />
          <div style={{ flex: 1, minWidth: '210px' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {pxuUni &&
          Object.entries(pxuUni.cutoffScores).map(([major, cutoff]) => {
            const appsOfMajor = majorApps(major);
            const pending = appsOfMajor.filter((a) => a.status === 'Đang xét duyệt').length;
            const approved = appsOfMajor.filter((a) => a.status === 'Đã trúng tuyển').length;
            return (
              <div key={major} style={{ ...cardStyle, padding: '18px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <GraduationCap size={20} color={EMERALD} />
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{major}</div>
                <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.8 }}>
                  Điểm chuẩn 2024: <strong style={{ color: EMERALD, fontSize: '14px' }}>{cutoff}</strong>
                  <br />
                  Hồ sơ đã nộp: <strong style={{ color: '#0F172A' }}>{appsOfMajor.length}</strong> · Chờ duyệt: <strong style={{ color: '#D97706' }}>{pending}</strong>
                  <br />
                  Đã trúng tuyển: <strong style={{ color: EMERALD }}>{approved}</strong>
                </div>
              </div>
            );
          })}
      </div>

      <div style={{ borderRadius: '20px', padding: '20px', background: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)', color: '#FFFFFF', display: 'flex', gap: '14px', alignItems: 'flex-start', boxSizing: 'border-box', minWidth: 0 }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '13px', backgroundColor: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Award size={22} color="#FFFFFF" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '15.5px', fontWeight: 900, marginBottom: '4px' }}>Học bổng OJT & cam kết việc làm</div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.65, color: '#D1FAE5' }}>
            PXU áp dụng mô hình đào tạo thực chiến OJT gắn liền doanh nghiệp: thí sinh khối ngành Công nghệ & Thiết kế được xét học bổng tài trợ 50–100% học phí, sinh viên thực tập tại doanh nghiệp đối tác ngay trong quá trình học và {pxuUni?.employmentRate ?? 92}% có việc làm sau tốt nghiệp.
          </p>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '680px' }}>
      <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Tài khoản tuyển sinh PXU</h1>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
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
          Vai trò hiện tại: <strong style={{ color: EMERALD }}>Ban Tuyển sinh ĐH Phú Xuân (university_pxu)</strong> — cổng phân lập dữ liệu: chỉ xem và duyệt hồ sơ nộp vào PXU ({pxuApps.length} hồ sơ) và lịch tư vấn với PXU ({pxuBookings.length} lịch), không thấy dữ liệu của {universitiesList.length - 1} trường còn lại. Hồ sơ cá nhân liên kết: {profile.name}.
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <button
            onClick={openNotifications}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 14px', borderRadius: '11px', border: '1px solid #DCE8E1', backgroundColor: '#FFFFFF', color: '#334155', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
          >
            <Bell size={14} /> Thông báo
          </button>
          <button
            onClick={openSettings}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 14px', borderRadius: '11px', border: '1px solid #DCE8E1', backgroundColor: '#FFFFFF', color: '#334155', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
          >
            <Settings size={14} /> Cài đặt
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <ShieldCheck size={17} color={EMERALD} />
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Quyền của PXU so với các user khác</h2>
        </div>
        <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
          Vai trò được xác định bằng <strong>tài khoản đăng nhập</strong>, không tự đổi giữa chừng:
          <ul style={{ margin: '8px 0', paddingLeft: '18px' }}>
            <li><strong>PXU được:</strong> xem & xử lý hồ sơ nộp vào PXU, xem lịch tư vấn với PXU, xem nhật ký xử lý của PXU, xuất CSV hồ sơ PXU</li>
            <li><strong>PXU không được:</strong> xem/xử lý hồ sơ của trường khác (hệ thống tự chặn ở tầng xử lý), sửa CSDL điểm chuẩn & học phí (quyền Admin), hủy hồ sơ thay thí sinh</li>
            <li><strong>Admin được:</strong> toàn quyền hồ sơ {universitiesList.length} trường + sửa CSDL + xem người dùng toàn hệ thống</li>
            <li><strong>Thí sinh được:</strong> nộp hồ sơ, đặt lịch tư vấn và tự hủy hồ sơ của chính mình</li>
          </ul>
          Muốn dùng vai trò khác: đăng xuất ở dưới rồi đăng nhập bằng tài khoản của vai trò đó (mật khẩu xem trong README dự án).
        </div>
      </div>

      <div style={cardStyle}>
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 18px', borderRadius: '12px', border: '1.5px solid #FECACA', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer' }}
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

  const utilityButtons = (
    <>
      <button
        onClick={openNotifications}
        aria-label="Thông báo"
        style={{ width: '38px', height: '38px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <Bell size={17} />
      </button>
      <button
        onClick={openSettings}
        aria-label="Cài đặt"
        style={{ width: '38px', height: '38px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <Settings size={17} />
      </button>
    </>
  );

  const tabButton = (item: (typeof NAV_ITEMS)[number]) => {
    const active = section === item.id;
    const badge = item.id === 'apps' && pendingApps.length > 0 ? pendingApps.length : null;
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
          {badge !== null && (
            <span style={{ minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '999px', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              {badge}
            </span>
          )}
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
          padding: '6px 1px',
          border: 'none',
          backgroundColor: 'transparent',
          color: active ? EMERALD : '#64748B',
          fontSize: '10px',
          fontWeight: active ? 800 : 600,
          cursor: 'pointer',
          flex: 1,
          minWidth: 0,
        }}
      >
        <span style={{ position: 'relative', display: 'flex' }}>
          {item.icon}
          {badge !== null && (
            <span style={{ position: 'absolute', top: '-6px', right: '-9px', minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '999px', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '9.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              {badge}
            </span>
          )}
        </span>
        <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
        {active && <span style={{ width: '18px', height: '3px', borderRadius: '999px', backgroundColor: EMERALD }} />}
      </button>
    );
  };

  const content = (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        width: '100%',
        maxWidth: '1160px',
        margin: '0 auto',
        padding: isDesktop ? '26px 28px 40px' : '18px 16px 96px',
        boxSizing: 'border-box',
      }}
    >
      {section === 'dashboard' && renderDashboard()}
      {section === 'apps' && renderApps()}
      {section === 'bookings' && renderBookings()}
      {section === 'programs' && renderPrograms()}
      {section === 'account' && renderAccount()}
    </main>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F6F2', width: '100%', display: 'flex', flexDirection: 'column', overflowX: 'clip' }}>
      <div style={{ width: '100%', maxWidth: isDesktop ? undefined : '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <header style={{ background: `linear-gradient(135deg, ${EMERALD_DARK} 0%, ${EMERALD} 100%)`, color: '#FFFFFF', padding: isDesktop ? '16px 28px' : '15px 16px 13px' }}>
          <div style={{ maxWidth: isDesktop ? '1160px' : undefined, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/images/logo_pxu.png" alt="PXU" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isDesktop ? '17px' : '15px', fontWeight: 900, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isDesktop ? 'Cổng Tuyển Sinh ĐH Phú Xuân' : 'Cổng Tuyển Sinh PXU'}</div>
              <div style={{ fontSize: '11.5px', color: '#A7F3D0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name} · {user.email}
              </div>
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 800, backgroundColor: '#F59E0B', color: '#451A03', padding: '4px 9px', borderRadius: '999px', whiteSpace: 'nowrap', flexShrink: 0 }}>{pendingApps.length} chờ duyệt</span>
            {utilityButtons}
          </div>
        </header>

        {isDesktop && (
          <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DCE8E1', position: 'sticky', top: 0, zIndex: 40 }}>
            <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '8px 28px', display: 'flex', gap: '6px', overflowX: 'auto', boxSizing: 'border-box' }}>
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
