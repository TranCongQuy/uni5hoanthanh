import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  ShieldCheck,
  Search,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  Award,
  Briefcase,
  Bell,
  Calendar,
  Download,
  Phone,
  Mail,
  Edit2,
  Check,
  Lock,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { BookingState } from '../../context/AppContext';
import {
  CANCELLED_STATUS_FILTER_LABEL,
  getStatusMeta,
  isCancelledStatus,
  isTerminalStatus,
} from '../../types';
import type { ApplicationRecord, ApplicationStatus } from '../../types';
import {
  ALLOWED_REVIEWER_TRANSITIONS,
  getMajorCutoffForApp,
} from '../../services/ApplicationWorkflow';
import {
  formatCleanDecimal,
  formatTuitionRange,
  parseViDateTimeToMs,
  sanitizeCsvCell,
} from '../../utils/validation';
import { getCutoffRangeText } from '../../data/MockData';
import { UniversityAvatar } from '../common/UI';
import { AccountRoleMenu } from '../common/AccountRoleMenu';

type UniSection = 'dashboard' | 'apps' | 'bookings' | 'programs' | 'account';
type AppSort = 'list' | 'scoreDesc' | 'scoreAsc' | 'nameAsc';

const EMERALD = '#059669';
const EMERALD_DARK = '#064E3B';

const NAV_ITEMS: { id: UniSection; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Tổng quan Tuyển sinh', shortLabel: 'Tổng quan', icon: <LayoutDashboard size={19} /> },
  { id: 'apps', label: 'Hồ sơ nộp vào PXU', shortLabel: 'Hồ sơ PXU', icon: <FileText size={19} /> },
  { id: 'bookings', label: 'Lịch tư vấn 1-1 PXU', shortLabel: 'Tư vấn 1-1', icon: <Calendar size={19} /> },
  { id: 'programs', label: 'Ngành học & Chỉ tiêu OJT', shortLabel: 'Ngành học', icon: <GraduationCap size={19} /> },
  { id: 'account', label: 'Phân quyền Đơn vị', shortLabel: 'Đơn vị', icon: <ShieldCheck size={19} /> },
];

const PXU_QUICK_NOTES = [
  'Chúc mừng em đủ điều kiện Trúng tuyển sớm đợt 1 vào ĐH Phú Xuân!',
  'Đề xuất xét cấp Học bổng Doanh nghiệp OJT 50% học phí học kỳ đầu.',
  'Vui lòng bổ sung ảnh chụp Học bạ THPT học kỳ 1 lớp 12 rõ nét.',
  'Vui lòng bổ sung ảnh chụp CCCD 2 mặt để hoàn tất hồ sơ xét tuyển.',
];

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const m = getStatusMeta(status);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '11.5px',
        fontWeight: 800,
        color: m.color,
        backgroundColor: m.bg,
        border: `1px solid ${m.border}`,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  );
};

const exportAppsCsv = (rows: ApplicationRecord[], filename: string) => {
  const header = 'Mã hồ sơ,Thí sinh,Trường,Ngành,Điểm,Trạng thái,SĐT,Email,Ngày nộp';
  const lines = rows.map((a) =>
    [
      a.code,
      a.candidateName,
      a.uniName,
      a.major,
      formatCleanDecimal(a.score, 2),
      getStatusMeta(a.status).label,
      a.phone,
      a.email,
      a.submittedAt,
    ]
      .map(sanitizeCsvCell)
      .join(',')
  );
  const blob = new Blob(['\uFEFF' + header + '\n' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const surfaceCard: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '18px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
  padding: '20px',
  boxSizing: 'border-box',
  minWidth: 0,
};

export const UniversityApp: React.FC = () => {
  const {
    user,
    applications,
    bookings,
    universitiesList,
    updateUniversityMetrics,
    updateApplicationStatus,
    processingLog,
    bookingStates,
    updateBookingState,
    openApplicationDetail,
    openNotifications,
    unreadNotificationCount,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [section, setSection] = useState<UniSection>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [reviewerNote, setReviewerNote] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState<string>('Tất cả');
  const [appMajor, setAppMajor] = useState<string>('Tất cả');
  const [appSort, setAppSort] = useState<AppSort>('list');
  const [mobileBkTab, setMobileBkTab] = useState<BookingState>('pending');

  // PXU Cutoff & Tuition inline editor (decimal text inputs supporting both . and ,)
  const [isEditingPxu, setIsEditingPxu] = useState(false);
  const [pxuScoreText, setPxuScoreText] = useState<string>('24.5');
  const [pxuTuitionText, setPxuTuitionText] = useState<string>('18');

  // Strict PXU Data Isolation
  const pxuUni = universitiesList.find((u) => u.code === 'PXU');
  const pxuApps = applications.filter((a) => a.uniCode === 'PXU');
  const pxuBookings = bookings.filter((b) => b.uniCode === 'PXU');
  const pxuLog = processingLog.filter((l) => l.uniCode === 'PXU');

  const bookingStateOf = (id: string): BookingState => bookingStates[id] || 'pending';
  const pendingBookings = pxuBookings.filter((b) => bookingStateOf(b.id) === 'pending');
  const contactedBookings = pxuBookings.filter((b) => bookingStateOf(b.id) === 'contacted');
  const doneBookings = pxuBookings.filter((b) => bookingStateOf(b.id) === 'done');

  const countByStatus = (s: ApplicationStatus) => pxuApps.filter((a) => a.status === s).length;
  const pendingApps = pxuApps.filter((a) => a.status === 'Đang xét duyệt');
  const missingApps = pxuApps.filter((a) => a.status === 'Thiếu hồ sơ');
  const pxuActionQueue = pxuApps.filter((a) => a.status === 'Đang xét duyệt' || a.status === 'Thiếu hồ sơ');
  const validCount = countByStatus('Hồ sơ hợp lệ');
  const admittedCount = countByStatus('Đã trúng tuyển');
  const cancelledCount = pxuApps.filter((a) => isCancelledStatus(a.status)).length;

  const getPxuMajorCutoff = (major: string): number => getMajorCutoffForApp(pxuUni, major);

  const filteredApps = pxuApps.filter((a) => {
    const matchStatus =
      appStatus === 'Tất cả'
        ? true
        : appStatus === CANCELLED_STATUS_FILTER_LABEL || appStatus === 'Đã bị hủy'
        ? isCancelledStatus(a.status)
        : a.status === appStatus;
    const matchMajor = appMajor === 'Tất cả' || a.major === appMajor;
    const kw = appSearch.trim().toLowerCase();
    const matchKw =
      !kw ||
      a.candidateName.toLowerCase().includes(kw) ||
      a.code.toLowerCase().includes(kw) ||
      a.major.toLowerCase().includes(kw);
    return matchStatus && matchMajor && matchKw;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (appSort === 'scoreDesc') return b.score - a.score;
    if (appSort === 'scoreAsc') return a.score - b.score;
    if (appSort === 'nameAsc') return a.candidateName.localeCompare(b.candidateName, 'vi');
    return parseViDateTimeToMs(b.submittedAt, b.submittedAtISO) - parseViDateTimeToMs(a.submittedAt, a.submittedAtISO);
  });

  const selectedApp: ApplicationRecord | null =
    pxuApps.find((a) => a.id === selectedAppId) || sortedApps[0] || pendingApps[0] || pxuApps[0] || null;

  const selectAppForReview = (app: ApplicationRecord, switchTab = false) => {
    setSelectedAppId(app.id);
    if (switchTab) setSection('apps');
    window.setTimeout(() => {
      document.getElementById('pxu-app-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 90);
  };

  const jumpToMajorApps = (major: string) => {
    setAppMajor(major);
    setAppStatus('Tất cả');
    setSection('apps');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentNavMeta = NAV_ITEMS.find((i) => i.id === section) || NAV_ITEMS[0];

  // =========================================================================
  // SECTION 1: PXU EXECUTIVE DASHBOARD
  // =========================================================================
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sleek PXU Campus Executive Banner */}
      <div
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: EMERALD_DARK,
          color: '#FFFFFF',
          padding: isDesktop ? '24px 28px' : '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <img
          src="/images/campus_pxu.jpg"
          alt="Đại học Phú Xuân"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(95deg, rgba(4,47,46,0.96) 0%, rgba(6,78,59,0.88) 60%, rgba(5,150,105,0.72) 100%)',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '680px', minWidth: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', backgroundColor: 'rgba(167,243,208,0.16)', border: '1px solid rgba(167,243,208,0.35)', fontSize: '11px', fontWeight: 800, color: '#A7F3D0', marginBottom: '10px' }}>
            <Lock size={12} /> Cổng CRM Tuyển sinh Độc quyền · Cô lập dữ liệu riêng PXU
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: isDesktop ? '24px' : '20px', fontWeight: 900, lineHeight: 1.25 }}>
            Trường Đại học Phú Xuân (PXU) — Kỳ Tuyển Sinh 2026
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#D1FAE5', lineHeight: 1.55 }}>
            Đào tạo thực chiến gắn liền doanh nghiệp (OJT ngay từ năm nhất) tại Cố đô Huế · Chuẩn các ngành:{' '}
            <strong>{pxuUni ? getCutoffRangeText(pxuUni) : '21–24.5đ'}</strong> (TK 2024: {pxuUni ? formatCleanDecimal(pxuUni.score2024, 2) : '24.5'}đ) · Học phí:{' '}
            <strong>{pxuUni ? formatTuitionRange(pxuUni.tuitionMin, pxuUni.tuitionMax, true) : '18–22 triệu/năm'}</strong>.
          </p>
        </div>

        <div style={{ position: 'relative', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSection('programs')}
            style={{
              padding: '10px 16px',
              borderRadius: '11px',
              border: '1px solid rgba(255,255,255,0.35)',
              backgroundColor: 'rgba(255,255,255,0.14)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            ⚙️ Cấu hình Điểm chuẩn & OJT
          </button>
          <button
            type="button"
            onClick={() => exportAppsCsv(pxuApps, 'danh-sach-thi-sinh-pxu-2026.csv')}
            style={{
              padding: '10px 16px',
              borderRadius: '11px',
              border: 'none',
              backgroundColor: '#FFFFFF',
              color: EMERALD_DARK,
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={14} /> Xuất danh sách PXU
          </button>
        </div>
      </div>

      {/* 4 Actionable KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: '14px' }}>
        {[
          {
            title: 'Tổng hồ sơ nộp PXU',
            value: pxuApps.length,
            sub: `${pxuUni?.majors.length ?? 6} ngành đào tạo OJT`,
            accent: EMERALD,
            bg: '#ECFDF5',
            icon: <FileText size={20} color={EMERALD} />,
            onClick: () => {
              setAppStatus('Tất cả');
              setSection('apps');
            },
          },
          {
            title: 'Chờ Hội đồng PXU duyệt',
            value: pendingApps.length,
            sub: `${missingApps.length} hồ sơ chờ thí sinh bổ sung`,
            accent: '#D97706',
            bg: '#FFFBEB',
            icon: <Clock size={20} color="#D97706" />,
            onClick: () => {
              setAppStatus('Đang xét duyệt');
              setSection('apps');
            },
          },
          {
            title: 'Đã trúng tuyển sớm PXU',
            value: admittedCount,
            sub: `${validCount} hồ sơ hợp lệ vòng sơ duyệt`,
            accent: '#047857',
            bg: '#D1FAE5',
            icon: <CheckCircle2 size={20} color="#047857" />,
            onClick: () => {
              setAppStatus('Đã trúng tuyển');
              setSection('apps');
            },
          },
          {
            title: 'Lịch tư vấn 1-1 PXU',
            value: pxuBookings.length,
            sub: `${pendingBookings.length} thí sinh đang chờ gọi`,
            accent: '#2563EB',
            bg: '#EFF6FF',
            icon: <Calendar size={20} color="#2563EB" />,
            onClick: () => setSection('bookings'),
          },
        ].map((kpi) => (
          <button
            key={kpi.title}
            type="button"
            onClick={kpi.onClick}
            className="up-card-interactive"
            style={{
              ...surfaceCard,
              padding: '18px',
              textAlign: 'left',
              cursor: 'pointer',
              borderTop: `3px solid ${kpi.accent}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>{kpi.title}</span>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: kpi.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {kpi.icon}
              </span>
            </div>
            <div>
              <div style={{ fontSize: isDesktop ? '28px' : '24px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>{kpi.value}</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '5px' }}>{kpi.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 2-Column Workspace: Pending Candidates Table + Major Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.45fr 1fr' : '1fr', gap: '18px', alignItems: 'start' }}>
        <div style={{ ...surfaceCard, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Thí sinh Đăng ký PXU Cần Xét Duyệt ({pxuActionQueue.length})
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748B' }}>
                Hệ thống tự động đối chiếu điểm xét tuyển với điểm chuẩn ngành PXU & đề xuất Học bổng OJT
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSection('apps')}
              style={{ padding: '7px 12px', borderRadius: '9px', border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5', color: EMERALD_DARK, fontSize: '12px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Tất cả ({pxuApps.length}) →
            </button>
          </div>

          {pxuActionQueue.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
              Toàn bộ hồ sơ chờ duyệt / chờ bổ sung của ĐH Phú Xuân đã được xử lý hoàn tất.
            </div>
          ) : (
            <div tabIndex={0} role="region" aria-label="Bảng hàng đợi xử lý hồ sơ PXU" style={{ overflowX: 'auto', maxHeight: 'min(500px, 70vh)' }}>
              <table className="up-table">
                <thead>
                  <tr>
                    <th>Thí sinh</th>
                    <th>Ngành đăng ký tại PXU</th>
                    <th>Đối chiếu Chuẩn ngành</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'right' }}>Xét duyệt</th>
                  </tr>
                </thead>
                <tbody>
                  {pxuActionQueue.slice(0, 6).map((app) => {
                    const cutoff = getPxuMajorCutoff(app.major);
                    const delta = +(app.score - cutoff).toFixed(2);
                    return (
                      <tr key={app.id} className="up-row-hover">
                        <td>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{app.candidateName}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>{app.code}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{app.major}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>Nộp {app.submittedAt}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>
                            {formatCleanDecimal(app.score, 2)}đ <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#94A3B8' }}>/ Chuẩn ngành {formatCleanDecimal(cutoff, 2)}đ</span>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: delta >= 4 ? '#047857' : delta >= 0 ? EMERALD : '#D97706' }}>
                            {delta >= 4 ? `🌟 +${formatCleanDecimal(delta, 2)}đ (Đề xuất HB OJT)` : delta >= 0 ? `✓ +${formatCleanDecimal(delta, 2)}đ Đạt chuẩn` : `${formatCleanDecimal(delta, 2)}đ Dưới chuẩn`}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => selectAppForReview(app, true)}
                            style={{ padding: '6px 12px', borderRadius: '9px', border: 'none', backgroundColor: EMERALD, color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            Xử lý →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Major Distribution + Recent PXU Council Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={surfaceCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Hồ sơ theo Ngành Đào tạo PXU
              </h3>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Bấm ngành để lọc</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(pxuUni?.majors || []).map((major) => {
                const count = pxuApps.filter((a) => a.major === major).length;
                const pct = pxuApps.length > 0 ? Math.round((count / pxuApps.length) * 100) : 0;
                const cutoff = getPxuMajorCutoff(major);
                return (
                  <div
                    key={major}
                    onClick={() => jumpToMajorApps(major)}
                    style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: '10px', backgroundColor: '#F8FAFC' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{major}</span>
                      <span style={{ fontSize: '11.5px', color: '#64748B', whiteSpace: 'nowrap' }}>
                        Chuẩn <strong>{cutoff}đ</strong> · <strong style={{ color: EMERALD }}>{count} HS</strong>
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: EMERALD, borderRadius: '999px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={surfaceCard}>
            <h3 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              Nhật ký Hội đồng Tuyển sinh PXU
            </h3>
            {pxuLog.length === 0 ? (
              <div style={{ fontSize: '12.5px', color: '#64748B' }}>Chưa có quyết định mới nào được ghi nhận.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pxuLog.slice(0, 4).map((log) => (
                  <div key={log.id} style={{ fontSize: '12.5px', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                      <strong style={{ color: '#0F172A' }}>{log.candidateName} ({log.appCode})</strong>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{log.time}</span>
                    </div>
                    <div style={{ color: '#475569', marginTop: '2px' }}>
                      {log.fromStatus} <ArrowRight size={11} style={{ verticalAlign: 'middle' }} />{' '}
                      <strong style={{ color: getStatusMeta(log.toStatus).color }}>{log.toStatus}</strong>
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

  // =========================================================================
  // SECTION 2: PXU APPLICATIONS & OJT DECISION ASSISTANT
  // =========================================================================
  const renderApps = () => {
    const selectedCutoff = selectedApp ? getPxuMajorCutoff(selectedApp.major) : 18.5;
    const selectedDelta = selectedApp ? +(selectedApp.score - selectedCutoff).toFixed(2) : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Clean Single-Row Toolbar */}
        <div style={{ ...surfaceCard, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '11px', padding: '0 12px', height: '40px', flex: '1 1 220px', minWidth: 0 }}>
              <Search size={16} color="#94A3B8" />
              <input
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Tìm tên thí sinh, mã hồ sơ PXU..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', backgroundColor: 'transparent', minWidth: 0 }}
              />
              {appSearch && (
                <button type="button" onClick={() => setAppSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}>
                  <X size={15} color="#94A3B8" />
                </button>
              )}
            </div>

            <select
              value={appMajor}
              onChange={(e) => setAppMajor(e.target.value)}
              aria-label="Lọc theo ngành đào tạo PXU"
              style={{ height: '40px', padding: '0 12px', borderRadius: '11px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
            >
              <option value="Tất cả">Tất cả ngành đào tạo PXU</option>
              {(pxuUni?.majors || []).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={appSort}
              onChange={(e) => setAppSort(e.target.value as AppSort)}
              aria-label="Sắp xếp"
              style={{ height: '40px', padding: '0 12px', borderRadius: '11px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
            >
              <option value="list">Mới nộp gần nhất</option>
              <option value="scoreDesc">Điểm cao → thấp</option>
              <option value="scoreAsc">Điểm thấp → cao</option>
              <option value="nameAsc">Tên A → Z</option>
            </select>

            <button
              type="button"
              onClick={() => exportAppsCsv(sortedApps, 'ho-so-xet-tuyen-pxu.csv')}
              style={{ height: '40px', padding: '0 14px', borderRadius: '11px', border: `1px solid ${EMERALD}`, backgroundColor: '#ECFDF5', color: EMERALD_DARK, fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Xuất CSV ({sortedApps.length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['Tất cả', 'Đang xét duyệt', 'Hồ sơ hợp lệ', 'Đã trúng tuyển', 'Thiếu hồ sơ', CANCELLED_STATUS_FILTER_LABEL].map((st) => {
              const active = appStatus === st;
              const cnt =
                st === 'Tất cả'
                  ? pxuApps.length
                  : st === CANCELLED_STATUS_FILTER_LABEL
                  ? cancelledCount
                  : countByStatus(st as ApplicationStatus);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setAppStatus(st)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9px',
                    border: active ? `1px solid ${EMERALD}` : '1px solid transparent',
                    backgroundColor: active ? '#ECFDF5' : '#F8FAFC',
                    color: active ? EMERALD_DARK : '#475569',
                    fontSize: '12px',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                  }}
                >
                  {st} ({cnt})
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.45fr 1fr' : '1fr', gap: '18px', alignItems: 'start' }}>
          {/* Left: PXU Candidate Table */}
          <div style={{ ...surfaceCard, padding: 0, overflow: 'hidden' }}>
            {sortedApps.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
                Không có hồ sơ PXU nào khớp bộ lọc hiện tại.
              </div>
            ) : (
              <div tabIndex={0} role="region" aria-label="Bảng hồ sơ đăng ký ĐH Phú Xuân" style={{ overflowX: 'auto', maxHeight: 'min(650px, 80vh)' }}>
                <table className="up-table">
                  <thead>
                    <tr>
                      <th>Thí sinh & Mã HS</th>
                      <th>Ngành đăng ký PXU</th>
                      <th>Điểm / Chuẩn PXU</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedApps.map((app) => {
                      const isSel = selectedApp?.id === app.id;
                      const cutoff = getPxuMajorCutoff(app.major);
                      const delta = +(app.score - cutoff).toFixed(2);
                      return (
                        <tr
                          key={app.id}
                          onClick={() => selectAppForReview(app)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSel ? '#ECFDF5' : '#FFFFFF',
                          }}
                        >
                          <td>
                            <div style={{ fontWeight: 800, color: isSel ? EMERALD_DARK : '#0F172A' }}>{app.candidateName}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748B' }}>{app.code} · {app.submittedAt}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>{app.major}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748B' }}>{app.phone}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>
                              {app.score}đ <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>/ {cutoff}đ</span>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: delta >= 0 ? EMERALD : '#D97706' }}>
                              {delta >= 4 ? `🌟 +${delta}đ (HB OJT)` : delta >= 0 ? `+${delta}đ Đạt` : `${delta}đ`}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={app.status} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: PXU Smart OJT Admission Inspector */}
          {selectedApp && (
            <div
              id="pxu-app-inspector"
              style={{
                ...surfaceCard,
                position: isDesktop ? 'sticky' : 'static',
                top: '84px',
                border: '1.5px solid #A7F3D0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: EMERALD, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Hội Đồng Tuyển Sinh PXU · Thẩm Định
                </span>
                <button
                  type="button"
                  onClick={() => openApplicationDetail(selectedApp)}
                  style={{ border: 'none', background: 'none', color: EMERALD, fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Biên nhận <ExternalLink size={12} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <UniversityAvatar code="PXU" size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>{selectedApp.candidateName}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{selectedApp.code} · {selectedApp.major}</div>
                </div>
                <StatusBadge status={selectedApp.status} />
              </div>

              {/* Automatic PXU Cutoff & OJT Scholarship Recommender */}
              <div
                style={{
                  padding: '13px 14px',
                  borderRadius: '14px',
                  backgroundColor: selectedDelta >= 0 ? '#ECFDF5' : '#FFFBEB',
                  border: selectedDelta >= 0 ? '1px solid #6EE7B7' : '1px solid #FDE68A',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                  <span>Điểm xét tuyển: <strong style={{ fontSize: '15px', color: '#0F172A' }}>{selectedApp.score}đ</strong></span>
                  <span>Chuẩn ngành PXU: <strong>{selectedCutoff}đ</strong></span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: selectedDelta >= 0 ? EMERALD_DARK : '#B45309', lineHeight: 1.45 }}>
                  {selectedDelta >= 4
                    ? `🌟 Vượt chuẩn +${selectedDelta}đ — Đủ điều kiện Trúng tuyển sớm & Đề xuất xét Học bổng Tài năng OJT (50%–100%)!`
                    : selectedDelta >= 0
                    ? `✓ Đạt ngưỡng điểm chuẩn ngành (+${selectedDelta}đ) — Đủ điều kiện duyệt Trúng tuyển sớm vào PXU.`
                    : `⚠️ Thấp hơn chuẩn điểm thi (${selectedDelta}đ) — Khuyến nghị hướng dẫn thí sinh bổ sung Học bạ THPT 5 kỳ.`}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#334155', backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {selectedApp.phone}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {selectedApp.email}</span>
                </div>
                {selectedApp.notes && (
                  <div style={{ paddingTop: '6px', borderTop: '1px dashed #E2E8F0', color: '#475569' }}>
                    <strong>Ghi chú:</strong> {selectedApp.notes}
                  </div>
                )}
              </div>

              {/* 1-Click PXU Quick Reply Chips & FSM-Guarded Decision Actions */}
              {isTerminalStatus(selectedApp.status) ? (
                <div
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '12.5px',
                    color: '#334155',
                    fontWeight: 700,
                    lineHeight: 1.5,
                  }}
                >
                  🔒 Hồ sơ đã kết thúc quy trình xét tuyển ({getStatusMeta(selectedApp.status).label}). Trạng thái đã được khóa cố định, không thể chuyển đổi lại.
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    {selectedDelta < 0 && (
                      <div
                        style={{
                          backgroundColor: '#FEF3C7',
                          border: '1px solid #F59E0B',
                          borderRadius: '10px',
                          padding: '8px 10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: '#92400E',
                          marginBottom: '8px',
                        }}
                      >
                        ⚠️ Hồ sơ thấp hơn chuẩn ngành {formatCleanDecimal(Math.abs(selectedDelta), 2)}đ — Bắt buộc nhập căn cứ xét tuyển riêng (tối thiểu 8 ký tự) nếu xác nhận Hợp lệ hoặc Trúng tuyển.
                      </div>
                    )}
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Mẫu phản hồi nhanh / căn cứ xét duyệt của Ban Tuyển sinh ĐH Phú Xuân:
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {PXU_QUICK_NOTES.map((tpl) => (
                        <button
                          key={tpl}
                          type="button"
                          onClick={() => setReviewerNote(tpl)}
                          style={{
                            padding: '5px 9px',
                            borderRadius: '8px',
                            border: reviewerNote === tpl ? `1px solid ${EMERALD}` : '1px solid #E2E8F0',
                            backgroundColor: reviewerNote === tpl ? '#ECFDF5' : '#F8FAFC',
                            color: reviewerNote === tpl ? EMERALD_DARK : '#475569',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            whiteSpace: 'normal',
                            lineHeight: 1.35,
                          }}
                        >
                          + {tpl}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={reviewerNote}
                      onChange={(e) => setReviewerNote(e.target.value)}
                      placeholder={
                        selectedDelta < 0
                          ? 'Bắt buộc nhập căn cứ xét học bạ / xét tuyển riêng hoặc lý do bổ sung...'
                          : 'Nhập lời nhắn gửi trực tiếp tới thí sinh đăng ký PXU...'
                      }
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: selectedDelta < 0 ? '1.5px solid #F59E0B' : '1px solid #CBD5E1',
                        fontSize: '12.5px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* FSM-Guarded Action Buttons */}
                  {(() => {
                    const allowed = ALLOWED_REVIEWER_TRANSITIONS[selectedApp.status] || [];
                    const canAdmit = allowed.includes('Đã trúng tuyển');
                    const canValid = allowed.includes('Hồ sơ hợp lệ');
                    const canMissing = allowed.includes('Thiếu hồ sơ');
                    const canReject = allowed.includes('Đã bị hủy');
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                          type="button"
                          disabled={!canAdmit}
                          title={!canAdmit ? 'Cần xác nhận Hồ sơ hợp lệ trước khi duyệt trúng tuyển' : undefined}
                          onClick={() => {
                            updateApplicationStatus(selectedApp.id, 'Đã trúng tuyển', reviewerNote || undefined);
                            setReviewerNote('');
                          }}
                          style={{
                            width: '100%',
                            padding: '11px',
                            borderRadius: '11px',
                            border: canAdmit ? 'none' : '1px solid #CBD5E1',
                            backgroundColor: canAdmit ? EMERALD : '#F1F5F9',
                            color: canAdmit ? '#FFFFFF' : '#64748B',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: canAdmit ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <CheckCircle2 size={16} />
                          {canAdmit ? 'Duyệt Trúng Tuyển ĐH Phú Xuân' : 'Duyệt Trúng Tuyển (Cần xác nhận Hợp lệ trước)'}
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                          <button
                            type="button"
                            disabled={!canValid}
                            onClick={() => {
                              updateApplicationStatus(selectedApp.id, 'Hồ sơ hợp lệ', reviewerNote || undefined);
                              setReviewerNote('');
                            }}
                            style={{ padding: '8px 6px', borderRadius: '9px', border: '1px solid #7DD3FC', backgroundColor: '#F0F9FF', color: '#0369A1', fontSize: '11.5px', fontWeight: 800, cursor: canValid ? 'pointer' : 'not-allowed', opacity: canValid ? 1 : 0.45 }}
                          >
                            ✓ Hợp lệ
                          </button>
                          <button
                            type="button"
                            disabled={!canMissing}
                            onClick={() => {
                              updateApplicationStatus(selectedApp.id, 'Thiếu hồ sơ', reviewerNote || undefined);
                              setReviewerNote('');
                            }}
                            style={{ padding: '8px 6px', borderRadius: '9px', border: '1px solid #93C5FD', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '11.5px', fontWeight: 800, cursor: canMissing ? 'pointer' : 'not-allowed', opacity: canMissing ? 1 : 0.45 }}
                          >
                            ⚠️ Bổ sung
                          </button>
                          <button
                            type="button"
                            disabled={!canReject}
                            onClick={() => {
                              updateApplicationStatus(selectedApp.id, 'Đã bị hủy', reviewerNote || undefined);
                              setReviewerNote('');
                            }}
                            style={{ padding: '8px 6px', borderRadius: '9px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '11.5px', fontWeight: 800, cursor: canReject ? 'pointer' : 'not-allowed', opacity: canReject ? 1 : 0.45 }}
                          >
                            ✕ Từ chối
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // =========================================================================
  // SECTION 3: PXU 1-1 CONSULTATIONS — 3-COLUMN KANBAN
  // =========================================================================
  const renderBookings = () => {
    const columns: { id: BookingState; title: string; dot: string; headerBg: string; border: string; items: typeof pxuBookings }[] = [
      { id: 'pending', title: 'Chờ liên hệ', dot: '#F59E0B', headerBg: '#FFFBEB', border: '#FDE68A', items: pendingBookings },
      { id: 'contacted', title: 'Đã liên hệ tư vấn', dot: '#2563EB', headerBg: '#EFF6FF', border: '#BFDBFE', items: contactedBookings },
      { id: 'done', title: 'Hoàn thành', dot: '#10B981', headerBg: '#ECFDF5', border: '#A7F3D0', items: doneBookings },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!isDesktop && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            {columns.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setMobileBkTab(col.id)}
                style={{
                  padding: '8px 6px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: mobileBkTab === col.id ? EMERALD : 'transparent',
                  color: mobileBkTab === col.id ? '#FFFFFF' : '#475569',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {col.title.split(' ')[0]} ({col.items.length})
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr', gap: '16px', alignItems: 'start' }}>
          {columns
            .filter((col) => isDesktop || col.id === mobileBkTab)
            .map((col) => (
              <div
                key={col.id}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '18px',
                  border: '1px solid #E2E8F0',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '260px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '12px', backgroundColor: col.headerBg, border: `1px solid ${col.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: col.dot }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>{col.title}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 900, backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '999px' }}>{col.items.length}</span>
                </div>

                {col.items.length === 0 ? (
                  <div style={{ padding: '26px 12px', textAlign: 'center', fontSize: '12.5px', color: '#94A3B8' }}>
                    Chưa có lịch hẹn PXU ở bước này
                  </div>
                ) : (
                  col.items.map((bk) => (
                    <div key={bk.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{bk.name}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: EMERALD }}>Ngành: {bk.major}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', backgroundColor: '#F8FAFC', padding: '9px 10px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>🕒 <strong>{bk.dateTime}</strong> {bk.channel ? `· ${bk.channel}` : ''}</div>
                        <div>📞 {bk.phone} {bk.email ? `· ${bk.email}` : ''}</div>
                        {bk.notes && <div style={{ color: '#64748B', fontStyle: 'italic' }}>"{bk.notes}"</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {col.id === 'pending' && (
                          <button type="button" onClick={() => updateBookingState(bk.id, 'contacted')} style={{ width: '100%', padding: '8px', borderRadius: '9px', border: 'none', backgroundColor: EMERALD, color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                            📞 Đánh dấu đã gọi tư vấn →
                          </button>
                        )}
                        {col.id === 'contacted' && (
                          <button type="button" onClick={() => updateBookingState(bk.id, 'done')} style={{ width: '100%', padding: '8px', borderRadius: '9px', border: 'none', backgroundColor: EMERALD_DARK, color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                            ✓ Hoàn thành phiên tư vấn
                          </button>
                        )}
                        {col.id === 'done' && (
                          <button type="button" onClick={() => updateBookingState(bk.id, 'pending')} style={{ width: '100%', padding: '7px', borderRadius: '9px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}>
                            Đặt lại chờ liên hệ
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  // =========================================================================
  // SECTION 4: PXU MAJORS, CUTOFF SYNC & OJT SCHOLARSHIPS
  // =========================================================================
  const renderPrograms = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {pxuUni && (
        <div style={{ ...surfaceCard, border: '1.5px solid #A7F3D0', backgroundColor: '#F8FEFB' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <UniversityAvatar code="PXU" size={50} />
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 900, color: '#0F172A' }}>
                  Cấu hình Điểm chuẩn & Học phí Tuyển sinh ĐH Phú Xuân
                </h2>
                <div style={{ fontSize: '13px', color: '#475569' }}>
                  Chuẩn các ngành: <strong style={{ color: EMERALD }}>{getCutoffRangeText(pxuUni)}</strong> (Tham chiếu 2024: {formatCleanDecimal(pxuUni.score2024, 2)}đ) · Học phí:{' '}
                  <strong>{formatTuitionRange(pxuUni.tuitionMin, pxuUni.tuitionMax, true)}</strong> · Việc làm sau tốt nghiệp: <strong>{pxuUni.employmentRate}%</strong>
                </div>
              </div>
            </div>

            {!isEditingPxu && (
              <button
                type="button"
                onClick={() => {
                  setPxuScoreText(formatCleanDecimal(pxuUni.score2024, 2));
                  setPxuTuitionText(formatCleanDecimal(pxuUni.tuitionMin, 1));
                  setIsEditingPxu(true);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  backgroundColor: EMERALD,
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Edit2 size={14} /> Điều chỉnh Điểm chuẩn & Học phí PXU
              </button>
            )}
          </div>

          {isEditingPxu && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #D1FAE5', display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr auto' : '1fr', gap: '12px', alignItems: 'end' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                Điểm chuẩn tham chiếu PXU (12–30đ, hỗ trợ dấu chấm hoặc dấu phẩy)
                <input
                  type="text"
                  inputMode="decimal"
                  value={pxuScoreText}
                  onChange={(e) => setPxuScoreText(e.target.value)}
                  placeholder="VD: 24.5"
                  style={{ display: 'block', width: '100%', marginTop: '5px', padding: '9px 12px', borderRadius: '10px', border: `1.5px solid ${EMERALD}`, fontSize: '14px', fontWeight: 800, backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                Học phí tối thiểu (0–200 triệu VNĐ/năm)
                <input
                  type="text"
                  inputMode="decimal"
                  value={pxuTuitionText}
                  onChange={(e) => setPxuTuitionText(e.target.value)}
                  placeholder="VD: 18"
                  style={{ display: 'block', width: '100%', marginTop: '5px', padding: '9px 12px', borderRadius: '10px', border: `1.5px solid ${EMERALD}`, fontSize: '14px', fontWeight: 800, backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                />
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const ok = updateUniversityMetrics(pxuUni.id, pxuScoreText, pxuTuitionText);
                    if (ok) {
                      setIsEditingPxu(false);
                    }
                  }}
                  style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', backgroundColor: EMERALD, color: '#FFFFFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Check size={15} /> Lưu & Đồng bộ AI
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingPxu(false)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Major Quota Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr', gap: '14px' }}>
        {pxuUni &&
          Object.entries(pxuUni.cutoffScores).map(([major, cutoff]) => {
            const appsOfMajor = pxuApps.filter((a) => a.major === major);
            const pending = appsOfMajor.filter((a) => a.status === 'Đang xét duyệt').length;
            const admitted = appsOfMajor.filter((a) => a.status === 'Đã trúng tuyển').length;
            return (
              <div key={major} className="up-card-interactive" style={{ ...surfaceCard, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '11px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <GraduationCap size={20} color={EMERALD} />
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', backgroundColor: '#ECFDF5', color: EMERALD_DARK, fontSize: '12px', fontWeight: 800 }}>
                    Chuẩn ngành: {formatCleanDecimal(cutoff, 2)}đ
                  </span>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '15.5px', fontWeight: 800, color: '#0F172A' }}>{major}</h3>
                  <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Briefcase size={12} color={EMERALD} /> Cam kết thực tập doanh nghiệp OJT
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>{appsOfMajor.length}</div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>Tổng nộp</div>
                  </div>
                  <div style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#D97706' }}>{pending}</div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>Chờ duyệt</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: EMERALD }}>{admitted}</div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>Trúng tuyển</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => jumpToMajorApps(major)}
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    padding: '9px',
                    borderRadius: '10px',
                    border: '1px solid #A7F3D0',
                    backgroundColor: '#FFFFFF',
                    color: EMERALD_DARK,
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Xem thí sinh ngành này →
                </button>
              </div>
            );
          })}
      </div>

      {/* OJT Scholarship Highlight */}
      <div style={{ borderRadius: '18px', padding: '20px', background: `linear-gradient(135deg, ${EMERALD_DARK} 0%, ${EMERALD} 100%)`, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '13px', backgroundColor: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Award size={24} color="#FFFFFF" />
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '15.5px', fontWeight: 900, marginBottom: '3px' }}>
            Chính sách Học bổng OJT & Doanh nghiệp Đồng hành tại ĐH Phú Xuân
          </div>
          <div style={{ fontSize: '13px', color: '#D1FAE5', lineHeight: 1.55 }}>
            Thí sinh nộp hồ sơ xét tuyển sớm có điểm vượt chuẩn từ +4.0đ được Hội đồng tự động gợi ý xét Học bổng Tài năng 50%–100% học phí và ưu tiên bố trí lộ trình OJT tại doanh nghiệp đối tác ngay từ năm nhất.
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // SECTION 5: PXU INSTITUTIONAL RBAC & SECURITY SCOPE
  // =========================================================================
  const renderAccount = () => (
    <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: '18px', alignItems: 'start' }}>
      <div style={surfaceCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <UniversityAvatar code="PXU" size={56} />
          <div>
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A' }}>{user.name}</div>
            <div style={{ fontSize: '13px', color: EMERALD, fontWeight: 700 }}>{user.organization}</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{user.email}</div>
          </div>
        </div>
        <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', fontSize: '13px', color: EMERALD_DARK, lineHeight: 1.6 }}>
          <strong>🔒 Chế độ Cô lập Dữ liệu Cấp Trường (`uniCode === 'PXU'`):</strong> Cổng quản trị này được phép tiếp nhận, thẩm định hồ sơ, điều phối tư vấn 1-1 và cập nhật điểm chuẩn của riêng <strong>Trường Đại học Phú Xuân</strong>. Toàn bộ dữ liệu của 29 trường đại học còn lại được ẩn và khóa bảo vệ hoàn toàn.
        </div>
      </div>

      <div style={surfaceCard}>
        <h3 style={{ margin: '0 0 12px', fontSize: '15.5px', fontWeight: 800, color: '#0F172A' }}>
          Phạm vi Quyền hạn của Ban Tuyển sinh PXU
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
          {[
            { ok: true, text: 'Xem & duyệt hồ sơ thí sinh đăng ký vào ĐH Phú Xuân (4 trạng thái + ghi chú)' },
            { ok: true, text: 'Điều phối lịch hẹn tư vấn 1-1 đặt riêng với giảng viên / ban tư vấn PXU' },
            { ok: true, text: 'Cập nhật điểm chuẩn tham chiếu & học phí sàn của PXU (đồng bộ AI Matching)' },
            { ok: false, text: 'Không xem hoặc can thiệp hồ sơ xét tuyển của 29 trường đại học khác' },
            { ok: false, text: 'Không chỉnh sửa điểm chuẩn của các trường đại học khác trên hệ thống' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', color: item.ok ? '#0F172A' : '#64748B' }}>
              <span style={{ color: item.ok ? EMERALD : '#DC2626', fontWeight: 900 }}>{item.ok ? '✓' : '✕'}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // SHELL: CONSISTENT SIDEBAR (DESKTOP) & BOTTOM NAV (MOBILE)
  // =========================================================================
  const renderMainBody = () => (
    <>
      {section === 'dashboard' && renderDashboard()}
      {section === 'apps' && renderApps()}
      {section === 'bookings' && renderBookings()}
      {section === 'programs' && renderPrograms()}
      {section === 'account' && renderAccount()}
    </>
  );

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', width: '100%' }}>
        {/* PXU Emerald Sidebar */}
        <aside
          style={{
            width: '256px',
            flexShrink: 0,
            background: 'linear-gradient(180deg, #042F2E 0%, #064E3B 100%)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 14px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px 20px', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/images/logo_pxu.png" alt="PXU" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '14.5px', fontWeight: 900, lineHeight: 1.2 }}>ĐH Phú Xuân (PXU)</div>
              <div style={{ fontSize: '11px', color: '#A7F3D0', fontWeight: 600 }}>Cổng Tuyển sinh & OJT</div>
            </div>
          </div>

          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.6px', padding: '0 10px 8px', opacity: 0.85 }}>
            Nghiệp vụ tuyển sinh PXU
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map((item) => {
              const active = section === item.id;
              const badge =
                item.id === 'apps' && pendingApps.length > 0
                  ? pendingApps.length
                  : item.id === 'bookings' && pendingBookings.length > 0
                  ? pendingBookings.length
                  : null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSection(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '11px',
                    border: 'none',
                    backgroundColor: active ? EMERALD : 'transparent',
                    color: active ? '#FFFFFF' : '#D1FAE5',
                    fontSize: '13.5px',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {item.icon}
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  {badge !== null && (
                    <span style={{ padding: '1px 7px', borderRadius: '999px', backgroundColor: active ? '#FFFFFF' : '#F59E0B', color: active ? EMERALD_DARK : '#451A03', fontSize: '11px', fontWeight: 900 }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.08)', fontSize: '11.5px', color: '#D1FAE5', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={12} color="#6EE7B7" /> Bảo mật Phân lập PXU
              </div>
              Chỉ hiển thị thí sinh đăng ký nguyện vọng vào <strong>Trường ĐH Phú Xuân</strong>.
            </div>
          </div>
        </aside>

        {/* Right Workspace */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <header
            style={{
              height: '64px',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              padding: '0 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              position: 'sticky',
              top: 0,
              zIndex: 60,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span style={{ fontSize: '12.5px', color: EMERALD, fontWeight: 700 }}>Cổng Tuyển sinh PXU</span>
              <ChevronRight size={14} color="#94A3B8" />
              <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentNavMeta.label}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={openNotifications}
                aria-label="Thông báo"
                style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '11px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Bell size={17} />
                {unreadNotificationCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '17px', height: '17px', padding: '0 4px', borderRadius: '999px', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>

              <AccountRoleMenu variant="light" />
            </div>
          </header>

          <main style={{ flex: 1, maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '24px 28px 48px', boxSizing: 'border-box' }}>
            {renderMainBody()}
          </main>
        </div>
      </div>
    );
  }

  // Mobile Shell
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', width: '100%', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', overflowX: 'clip' }}>
      <header
        style={{
          background: `linear-gradient(135deg, #042F2E 0%, ${EMERALD_DARK} 100%)`,
          color: '#FFFFFF',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          position: 'sticky',
          top: 0,
          zIndex: 60,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src="/images/logo_pxu.png" alt="PXU" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Tuyển sinh PXU</div>
            <div style={{ fontSize: '11px', color: '#A7F3D0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentNavMeta.shortLabel}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={openNotifications}
            aria-label="Thông báo"
            style={{ position: 'relative', width: '34px', height: '34px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Bell size={16} />
            {unreadNotificationCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '16px', height: '16px', borderRadius: '999px', backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '9.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadNotificationCount}
              </span>
            )}
          </button>
          <AccountRoleMenu variant="dark" compact />
        </div>
      </header>

      <main style={{ flex: 1, padding: '16px 14px 96px', boxSizing: 'border-box' }}>
        {renderMainBody()}
      </main>

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '520px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          boxShadow: '0 -4px 20px rgba(15,23,42,0.06)',
          display: 'flex',
          paddingTop: '6px',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom, 12px))',
          zIndex: 80,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                color: active ? EMERALD : '#64748B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                fontSize: '10px',
                fontWeight: active ? 800 : 600,
                cursor: 'pointer',
                padding: '4px 2px',
              }}
            >
              {item.icon}
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
