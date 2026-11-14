import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  School,
  Users,
  Search,
  Clock,
  CheckCircle2,
  Check,
  X,
  Edit2,
  ChevronRight,
  ShieldCheck,
  Bell,
  Calendar,
  Download,
  Phone,
  Mail,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ExternalLink,
  GraduationCap,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { BookingState } from '../../context/AppContext';
import {
  CANCELLED_STATUS_FILTER_LABEL,
  getStatusMeta,
  isCancelledStatus,
  isTerminalStatus,
} from '../../types';
import type { ApplicationRecord, ApplicationStatus, University } from '../../types';
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

type AdminSection = 'dashboard' | 'apps' | 'bookings' | 'unis' | 'account';
type AppSort = 'list' | 'scoreDesc' | 'scoreAsc' | 'nameAsc';
type UniSort = 'name' | 'scoreDesc' | 'tuitionAsc';

const NAV_ITEMS: { id: AdminSection; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Tổng quan điều hành', shortLabel: 'Tổng quan', icon: <LayoutDashboard size={19} /> },
  { id: 'apps', label: 'Hồ sơ xét tuyển', shortLabel: 'Hồ sơ', icon: <FileText size={19} /> },
  { id: 'bookings', label: 'Lịch tư vấn 1-1', shortLabel: 'Tư vấn', icon: <Calendar size={19} /> },
  { id: 'unis', label: 'CSDL 30 Trường ĐH', shortLabel: '30 Trường', icon: <School size={19} /> },
  { id: 'account', label: 'Phân quyền & User', shortLabel: 'Phân quyền', icon: <Users size={19} /> },
];

const QUICK_REVIEW_NOTES = [
  'Đủ điều kiện trúng tuyển sớm đợt 1 năm 2026.',
  'Hồ sơ hợp lệ, đã chuyển Hội đồng tuyển sinh trường.',
  'Vui lòng bổ sung ảnh chụp Học bạ HK1 lớp 12 rõ nét.',
  'Chưa đạt ngưỡng điểm sàn nhận hồ sơ theo quy chế.',
];

const SYSTEM_ACCOUNTS = [
  { name: 'Trần Công Quý', email: 'quy@unipath.vn', role: 'Thí sinh THPT', color: '#2563EB', bg: '#EFF6FF' },
  { name: 'Ban Tuyển sinh ĐH Phú Xuân', email: 'tuyensinh@pxu.edu.vn', role: 'ĐH Phú Xuân (PXU)', color: '#059669', bg: '#ECFDF5' },
  { name: 'Admin Hệ thống UniPath', email: 'admin@unipath.vn', role: 'Quản trị toàn quốc', color: '#4F46E5', bg: '#EEF2FF' },
];

const PERMISSION_ROWS = [
  { label: 'Thẩm định & duyệt hồ sơ cả 30 trường đại học', admin: 'Toàn quyền', pxu: '—', student: '—' },
  { label: 'Thẩm định hồ sơ nộp vào Trường ĐH Phú Xuân (PXU)', admin: 'Toàn quyền', pxu: 'Chỉ PXU', student: '—' },
  { label: 'Điều chỉnh điểm chuẩn & học phí sàn (đồng bộ AI)', admin: '30 trường', pxu: 'Chỉ PXU', student: '—' },
  { label: 'Điều phối lịch hẹn tư vấn tuyển sinh 1-1', admin: 'Toàn quốc', pxu: 'Chỉ PXU', student: 'Của riêng mình' },
  { label: 'Truy cập nhật ký kiểm toán xử lý hồ sơ', admin: 'Toàn sàn', pxu: 'Chỉ PXU', student: '—' },
  { label: 'Nộp hồ sơ, bổ sung minh chứng & tự rút nguyện vọng', admin: '—', pxu: '—', student: 'Chính chủ' },
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

const getMajorCutoff = (app: ApplicationRecord, unis: University[]): number => {
  const u = unis.find((x) => x.code === app.uniCode || x.id === app.uniId);
  return getMajorCutoffForApp(u, app.major);
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

export const AdminApp: React.FC = () => {
  const {
    registeredUsers,
    applications,
    bookings,
    universitiesList,
    updateUniversityMetrics,
    updateApplicationStatus,
    batchUpdateApplicationStatus,
    processingLog,
    bookingStates,
    updateBookingState,
    openApplicationDetail,
    openNotifications,
    unreadNotificationCount,
    resetAllData,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [appsPage, setAppsPage] = useState(1);
  const [unisPage, setUnisPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [reviewerNote, setReviewerNote] = useState('');
  const [mobileBkTab, setMobileBkTab] = useState<BookingState>('pending');

  // Filters
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState<string>('Tất cả');
  const [appUni, setAppUni] = useState<string>('Tất cả');
  const [appSort, setAppSort] = useState<AppSort>('list');

  const [uniSearch, setUniSearch] = useState('');
  const [uniRegion, setUniRegion] = useState<string>('Tất cả');
  const [uniSort, setUniSort] = useState<UniSort>('name');
  const [editingUniId, setEditingUniId] = useState<number | null>(null);
  const [editScoreText, setEditScoreText] = useState<string>('20');
  const [editTuitionText, setEditTuitionText] = useState<string>('15');

  // Derived metrics
  const totalApps = applications.length;
  const countByStatus = (s: ApplicationStatus) => applications.filter((a) => a.status === s).length;
  const pendingApps = applications.filter((a) => a.status === 'Đang xét duyệt');
  const missingApps = applications.filter((a) => a.status === 'Thiếu hồ sơ');
  const validAppsCount = countByStatus('Hồ sơ hợp lệ');
  const admittedAppsCount = countByStatus('Đã trúng tuyển');
  const cancelledAppsCount = applications.filter((a) => isCancelledStatus(a.status)).length;
  const actionQueue = applications.filter((a) => a.status === 'Đang xét duyệt' || a.status === 'Thiếu hồ sơ');

  const avgScore =
    totalApps > 0 ? (applications.reduce((sum, a) => sum + a.score, 0) / totalApps).toFixed(1) : '0.0';
  const admittedRate = totalApps > 0 ? Math.round((admittedAppsCount / totalApps) * 100) : 0;

  const bookingStateOf = (id: string): BookingState => bookingStates[id] || 'pending';
  const pendingBookings = bookings.filter((b) => bookingStateOf(b.id) === 'pending');
  const contactedBookings = bookings.filter((b) => bookingStateOf(b.id) === 'contacted');
  const doneBookings = bookings.filter((b) => bookingStateOf(b.id) === 'done');

  const uniCodesInApps = Array.from(new Set(applications.map((a) => a.uniCode)));
  const topUnisByApps = uniCodesInApps
    .map((code) => ({
      code,
      name: applications.find((a) => a.uniCode === code)?.uniName || code,
      count: applications.filter((a) => a.uniCode === code).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const maxUniAppCount = Math.max(1, ...topUnisByApps.map((u) => u.count));

  // Filtered Applications
  const filteredApps = applications.filter((a) => {
    const matchStatus =
      appStatus === 'Tất cả'
        ? true
        : appStatus === CANCELLED_STATUS_FILTER_LABEL || appStatus === 'Đã hủy / Từ chối'
        ? isCancelledStatus(a.status)
        : a.status === appStatus;
    const matchUni = appUni === 'Tất cả' || a.uniCode === appUni;
    const kw = appSearch.trim().toLowerCase();
    const matchKw =
      !kw ||
      a.candidateName.toLowerCase().includes(kw) ||
      a.code.toLowerCase().includes(kw) ||
      a.major.toLowerCase().includes(kw) ||
      a.uniName.toLowerCase().includes(kw);
    return matchStatus && matchUni && matchKw;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (appSort === 'scoreDesc') return b.score - a.score;
    if (appSort === 'scoreAsc') return a.score - b.score;
    if (appSort === 'nameAsc') return a.candidateName.localeCompare(b.candidateName, 'vi');
    return parseViDateTimeToMs(b.submittedAt, b.submittedAtISO) - parseViDateTimeToMs(a.submittedAt, a.submittedAtISO);
  });

  const APPS_PER_PAGE = 6;
  const appsPageCount = Math.max(1, Math.ceil(sortedApps.length / APPS_PER_PAGE));
  const curAppsPage = Math.max(1, Math.min(appsPage, appsPageCount));
  const pageStartIdx = (curAppsPage - 1) * APPS_PER_PAGE;
  const pagedApps = sortedApps.slice(pageStartIdx, pageStartIdx + APPS_PER_PAGE);

  const selectedApp: ApplicationRecord | null =
    applications.find((a) => a.id === selectedAppId) || sortedApps[0] || pendingApps[0] || applications[0] || null;

  // Filtered Universities
  const filteredUnis = universitiesList
    .filter((u) => {
      const matchRegion = uniRegion === 'Tất cả' || u.region === uniRegion;
      const kw = uniSearch.trim().toLowerCase();
      const matchKw = !kw || u.name.toLowerCase().includes(kw) || u.code.toLowerCase().includes(kw) || u.loc.toLowerCase().includes(kw);
      return matchRegion && matchKw;
    })
    .sort((a, b) => {
      if (uniSort === 'scoreDesc') return b.score2024 - a.score2024;
      if (uniSort === 'tuitionAsc') return a.tuitionMin - b.tuitionMin;
      return a.name.localeCompare(b.name, 'vi');
    });

  const UNIS_PER_PAGE = 10;
  const unisPageCount = Math.max(1, Math.ceil(filteredUnis.length / UNIS_PER_PAGE));
  const curUnisPage = Math.min(unisPage, unisPageCount);
  const pagedUnis = filteredUnis.slice((curUnisPage - 1) * UNIS_PER_PAGE, curUnisPage * UNIS_PER_PAGE);

  const jumpToFilteredApps = (statusFilter: string) => {
    setAppStatus(statusFilter);
    setAppsPage(1);
    setSection('apps');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectAppForReview = (app: ApplicationRecord, switchTab = false) => {
    setSelectedAppId(app.id);
    if (switchTab) setSection('apps');
    window.setTimeout(() => {
      document.getElementById('admin-app-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 90);
  };

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const applyBatch = (status: ApplicationStatus) => {
    batchUpdateApplicationStatus(checkedIds, status, reviewerNote || undefined);
    setCheckedIds([]);
    setReviewerNote('');
  };

  const handleSaveUni = (id: number) => {
    const ok = updateUniversityMetrics(id, editScoreText, editTuitionText);
    if (ok) {
      setEditingUniId(null);
    }
  };

  const currentNavMeta = NAV_ITEMS.find((i) => i.id === section) || NAV_ITEMS[0];

  // =========================================================================
  // SECTION 1: DASHBOARD
  // =========================================================================
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 4 Actionable KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: '14px' }}>
        {[
          {
            title: 'Tổng hồ sơ toàn quốc',
            value: totalApps,
            sub: `Điểm trung bình: ${avgScore}đ`,
            accent: '#2563EB',
            iconBg: '#EFF6FF',
            icon: <FileText size={20} color="#2563EB" />,
            onClick: () => jumpToFilteredApps('Tất cả'),
            cta: 'Xem tất cả →',
          },
          {
            title: 'Chờ thẩm định mới',
            value: pendingApps.length,
            sub: `+ ${missingApps.length} chờ bổ sung (Hàng đợi: ${actionQueue.length})`,
            accent: '#D97706',
            iconBg: '#FFFBEB',
            icon: <Clock size={20} color="#D97706" />,
            onClick: () => jumpToFilteredApps('Đang xét duyệt'),
            cta: 'Xử lý ngay →',
          },
          {
            title: 'Đã trúng tuyển sớm',
            value: admittedAppsCount,
            sub: `Chiếm ${admittedRate}% tổng nguyện vọng`,
            accent: '#059669',
            iconBg: '#ECFDF5',
            icon: <CheckCircle2 size={20} color="#059669" />,
            onClick: () => jumpToFilteredApps('Đã trúng tuyển'),
            cta: 'Danh sách đỗ →',
          },
          {
            title: 'Lịch hẹn tư vấn 1-1',
            value: bookings.length,
            sub: `${pendingBookings.length} thí sinh đang chờ gọi`,
            accent: '#4F46E5',
            iconBg: '#EEF2FF',
            icon: <Calendar size={20} color="#4F46E5" />,
            onClick: () => setSection('bookings'),
            cta: 'Mở bảng Kanban →',
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              borderTop: `3px solid ${kpi.accent}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B' }}>{kpi.title}</span>
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: kpi.iconBg,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {kpi.icon}
              </span>
            </div>
            <div>
              <div style={{ fontSize: isDesktop ? '28px' : '24px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                {kpi.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', gap: '6px' }}>
                <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>{kpi.sub}</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: kpi.accent, whiteSpace: 'nowrap' }}>{kpi.cta}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Visual 5-Stage 100% Reconciled Pipeline Banner */}
      <div style={{ ...surfaceCard, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800, color: '#0F172A' }}>
              Quy trình Phễu Xét Tuyển Toàn Quốc (Đối soát 100%: {pendingApps.length + validAppsCount + admittedAppsCount + missingApps.length + cancelledAppsCount}/{totalApps} hồ sơ)
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748B' }}>
              Bấm vào bất kỳ giai đoạn nào để lọc ngay danh sách hồ sơ ở bước đó
            </p>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', backgroundColor: '#F8FAFC', padding: '5px 12px', borderRadius: '999px', border: '1px solid #E2E8F0' }}>
            Đang hoạt động: {universitiesList.length} trường ĐH Bắc – Trung – Nam
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(5, 1fr)' : 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { step: 'Bước 1', label: 'Đang chờ xét duyệt', count: pendingApps.length, color: '#B45309', bg: '#FFFBEB', border: '#FDE68A', filter: 'Đang xét duyệt' },
            { step: 'Bước 2', label: 'Hồ sơ hợp lệ', count: validAppsCount, color: '#0369A1', bg: '#F0F9FF', border: '#BAE6FD', filter: 'Hồ sơ hợp lệ' },
            { step: 'Bước 3', label: 'Đã trúng tuyển sớm', count: admittedAppsCount, color: '#047857', bg: '#ECFDF5', border: '#A7F3D0', filter: 'Đã trúng tuyển' },
            { step: 'Cần lưu ý', label: 'Chờ thí sinh bổ sung', count: missingApps.length, color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE', filter: 'Thiếu hồ sơ' },
            { step: 'Kết thúc', label: CANCELLED_STATUS_FILTER_LABEL, count: cancelledAppsCount, color: '#64748B', bg: '#F8FAFC', border: '#CBD5E1', filter: CANCELLED_STATUS_FILTER_LABEL },
          ].map((st) => (
            <button
              key={st.label}
              type="button"
              onClick={() => jumpToFilteredApps(st.filter)}
              style={{
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: st.bg,
                border: `1px solid ${st.border}`,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: st.color }}>
                  {st.step}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{st.label}</div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: st.color, flexShrink: 0 }}>{st.count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Workspace: Priority Action Queue + Analytics & Audit Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.45fr 1fr' : '1fr', gap: '18px', alignItems: 'start' }}>
        {/* Left: Priority Action Queue */}
        <div style={{ ...surfaceCard, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Hàng đợi Ưu tiên Cần Xử Lý ({actionQueue.length})
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748B' }}>
                Tự động đối chiếu điểm thí sinh với điểm chuẩn ngành của trường đăng ký
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSection('apps')}
              style={{
                padding: '7px 13px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#2563EB',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Mở bảng đầy đủ →
            </button>
          </div>

          {actionQueue.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
              🎉 Tuyệt vời! Toàn bộ hồ sơ chờ duyệt và chờ bổ sung đều đã được giải quyết xong.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="up-table">
                <thead>
                  <tr>
                    <th>Thí sinh</th>
                    <th>Trường & Ngành</th>
                    <th>Điểm / Chuẩn</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'right' }}>Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {actionQueue.slice(0, 6).map((app) => {
                    const cutoff = getMajorCutoff(app, universitiesList);
                    const delta = +(app.score - cutoff).toFixed(2);
                    return (
                      <tr key={app.id} className="up-row-hover">
                        <td>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{app.candidateName}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>{app.code}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UniversityAvatar code={app.uniCode} size={28} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, color: '#0F172A', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {app.major}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#64748B' }}>{app.uniCode} · {app.uniName}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>
                            {app.score}đ <span style={{ fontWeight: 500, color: '#94A3B8', fontSize: '11.5px' }}>/ {cutoff}đ</span>
                          </div>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: delta >= 0 ? '#059669' : '#D97706',
                            }}
                          >
                            {delta >= 0 ? `+${delta}đ Đạt chuẩn` : `${delta}đ Dưới chuẩn`}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => selectAppForReview(app, true)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '9px',
                              border: 'none',
                              backgroundColor: '#2563EB',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Thẩm định →
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

        {/* Right: Top Schools & Audit Log Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: 0 }}>
          {/* Top Schools */}
          <div style={surfaceCard}>
            <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              Phân bổ Hồ sơ theo Trường Đại học
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {topUnisByApps.map((u) => (
                <div
                  key={u.code}
                  onClick={() => {
                    setAppUni(u.code);
                    setAppStatus('Tất cả');
                    setAppsPage(1);
                    setSection('apps');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <strong>{u.code}</strong> — {u.name}
                    </span>
                    <span style={{ fontWeight: 800, color: '#2563EB', whiteSpace: 'nowrap' }}>{u.count} hồ sơ</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.round((u.count / maxUniAppCount) * 100)}%`,
                        backgroundColor: u.code === 'PXU' ? '#059669' : '#2563EB',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Timeline */}
          <div style={surfaceCard}>
            <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              Nhật ký Kiểm toán Gần đây
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#64748B' }}>
              Ghi vết tự động mọi quyết định của Admin, ĐH Phú Xuân và Thí sinh
            </p>
            {processingLog.length === 0 ? (
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', fontSize: '12.5px', color: '#64748B' }}>
                Chưa phát sinh quyết định thẩm định mới. Hãy duyệt thử 1 hồ sơ để xem nhật ký ghi vết trực tiếp.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {processingLog.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      paddingBottom: '10px',
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getStatusMeta(log.toStatus).dot,
                        marginTop: '6px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0, fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                        <strong style={{ color: '#0F172A' }}>{log.candidateName} ({log.appCode})</strong>
                        <span style={{ fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{log.time}</span>
                      </div>
                      <div style={{ color: '#475569', marginTop: '2px' }}>
                        <span>{log.fromStatus}</span> <ArrowRight size={11} style={{ verticalAlign: 'middle' }} />{' '}
                        <strong style={{ color: getStatusMeta(log.toStatus).color }}>{log.toStatus}</strong>
                        <span style={{ color: 'var(--up-color-text-tertiary, #64748B)', marginLeft: '6px' }}>(bởi {log.actorName})</span>
                      </div>
                      {log.note && (
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px', fontStyle: 'italic' }}>
                          "{log.note}"
                        </div>
                      )}
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
  // SECTION 2: APPLICATIONS MANAGEMENT (CLEAN DATA TABLE + SMART INSPECTOR)
  // =========================================================================
  const renderApps = () => {
    const selectedCutoff = selectedApp ? getMajorCutoff(selectedApp, universitiesList) : 20;
    const selectedDelta = selectedApp ? +(selectedApp.score - selectedCutoff).toFixed(2) : 0;
    const stepIndex = !selectedApp
      ? 1
      : selectedApp.status === 'Đã trúng tuyển'
      ? 3
      : selectedApp.status === 'Hồ sơ hợp lệ'
      ? 2
      : 1;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Clean Single-Row Filter Bar */}
        <div style={{ ...surfaceCard, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '11px',
                padding: '0 12px',
                height: '40px',
                flex: '1 1 240px',
                minWidth: 0,
              }}
            >
              <Search size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
              <input
                value={appSearch}
                onChange={(e) => {
                  setAppSearch(e.target.value);
                  setAppsPage(1);
                }}
                placeholder="Tìm tên thí sinh, mã hồ sơ, ngành..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', backgroundColor: 'transparent', color: '#0F172A', minWidth: 0 }}
              />
              {appSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setAppSearch('');
                    setAppsPage(1);
                  }}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={15} color="#94A3B8" />
                </button>
              )}
            </div>

            <select
              value={appUni}
              onChange={(e) => {
                setAppUni(e.target.value);
                setAppsPage(1);
              }}
              aria-label="Lọc theo trường đại học"
              style={{
                height: '40px',
                padding: '0 12px',
                borderRadius: '11px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="Tất cả">Tất cả trường có hồ sơ ({uniCodesInApps.length})</option>
              {uniCodesInApps.map((code) => (
                <option key={code} value={code}>
                  {code} — {applications.find((a) => a.uniCode === code)?.uniName || code}
                </option>
              ))}
            </select>

            <select
              value={appSort}
              onChange={(e) => {
                setAppSort(e.target.value as AppSort);
                setAppsPage(1);
              }}
              aria-label="Sắp xếp hồ sơ"
              style={{
                height: '40px',
                padding: '0 12px',
                borderRadius: '11px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="list">Mới nộp gần nhất</option>
              <option value="scoreDesc">Điểm cao → thấp</option>
              <option value="scoreAsc">Điểm thấp → cao</option>
              <option value="nameAsc">Tên A → Z</option>
            </select>

            <button
              type="button"
              onClick={() => exportAppsCsv(sortedApps, 'unipath-ho-so-toan-quoc.csv')}
              style={{
                height: '40px',
                padding: '0 14px',
                borderRadius: '11px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <Download size={14} /> Xuất CSV ({sortedApps.length})
            </button>
          </div>

          {/* Segmented Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { key: 'Tất cả', count: totalApps },
              { key: 'Đang xét duyệt', count: pendingApps.length },
              { key: 'Hồ sơ hợp lệ', count: validAppsCount },
              { key: 'Đã trúng tuyển', count: admittedAppsCount },
              { key: 'Thiếu hồ sơ', count: missingApps.length },
              { key: CANCELLED_STATUS_FILTER_LABEL, count: cancelledAppsCount },
            ].map((tab) => {
              const active = appStatus === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setAppStatus(tab.key);
                    setAppsPage(1);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9px',
                    border: active ? '1px solid #2563EB' : '1px solid transparent',
                    backgroundColor: active ? '#EFF6FF' : '#F8FAFC',
                    color: active ? '#1D4ED8' : '#475569',
                    fontSize: '12px',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{tab.key}</span>
                  <span
                    style={{
                      padding: '1px 6px',
                      borderRadius: '999px',
                      backgroundColor: active ? '#2563EB' : '#E2E8F0',
                      color: active ? '#FFFFFF' : '#475569',
                      fontSize: '10.5px',
                      fontWeight: 800,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Batch Action Bar */}
        {checkedIds.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px 16px',
              boxShadow: '0 8px 24px rgba(15,23,42,0.18)',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 800, marginRight: '4px' }}>
              Đang chọn {checkedIds.length} hồ sơ:
            </span>
            <input
              type="text"
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Căn cứ / Ghi chú xử lý hàng loạt..."
              style={{
                flex: '1 1 200px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.25)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                padding: '0 10px',
                fontSize: '12px',
              }}
            />
            <button type="button" onClick={() => applyBatch('Hồ sơ hợp lệ')} style={{ padding: '7px 12px', borderRadius: '9px', border: 'none', backgroundColor: 'var(--up-color-primary, #0284C7)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <CheckCircle2 size={13} /> Xác nhận hợp lệ
            </button>
            <button type="button" onClick={() => applyBatch('Đã trúng tuyển')} style={{ padding: '7px 12px', borderRadius: '9px', border: 'none', backgroundColor: 'var(--up-color-success, #059669)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <GraduationCap size={13} /> Duyệt trúng tuyển
            </button>
            <button type="button" onClick={() => applyBatch('Thiếu hồ sơ')} style={{ padding: '7px 12px', borderRadius: '9px', border: 'none', backgroundColor: 'var(--up-color-warning, #D97706)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <AlertTriangle size={13} /> Yêu cầu bổ sung
            </button>
            <button type="button" onClick={() => applyBatch('Đã bị hủy')} style={{ padding: '7px 12px', borderRadius: '9px', border: 'none', backgroundColor: 'var(--up-color-danger, #DC2626)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <XCircle size={13} /> Từ chối
            </button>
            <button type="button" onClick={() => setCheckedIds([])} style={{ padding: '7px 12px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Bỏ chọn
            </button>
          </div>
        )}

        {/* Master Table + Smart Inspector Split */}
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.5fr 1fr' : '1fr', gap: '18px', alignItems: 'start' }}>
          {/* Left: Data Table (Desktop) / Compact Rows (Mobile) */}
          <div style={{ ...surfaceCard, padding: 0, overflow: 'hidden' }}>
            {sortedApps.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
                Không có hồ sơ nào khớp điều kiện lọc hiện tại.
              </div>
            ) : isDesktop ? (
              <div tabIndex={0} role="region" aria-label="Bảng hồ sơ xét tuyển toàn quốc" style={{ overflowX: 'auto', maxHeight: 'min(650px, 80vh)' }}>
                <table className="up-table">
                  <thead>
                    <tr>
                      <th style={{ width: '36px' }}>Chọn</th>
                      <th>Thí sinh & Mã HS</th>
                      <th>Trường & Ngành đăng ký</th>
                      <th>Điểm / Chuẩn</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedApps.map((app) => {
                      const isSel = selectedApp?.id === app.id;
                      const cutoff = getMajorCutoff(app, universitiesList);
                      const delta = +(app.score - cutoff).toFixed(2);
                      const checked = checkedIds.includes(app.id);
                      const terminal = isTerminalStatus(app.status);
                      return (
                        <tr
                          key={app.id}
                          onClick={() => selectAppForReview(app)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isSel ? '#EFF6FF' : '#FFFFFF',
                            transition: 'background-color 0.14s ease',
                          }}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              role="checkbox"
                              disabled={terminal}
                              title={terminal ? 'Hồ sơ đã kết thúc — không thể xử lý hàng loạt' : 'Chọn hồ sơ'}
                              aria-checked={checked}
                              onClick={() => !terminal && toggleChecked(app.id)}
                              style={{
                                width: '19px',
                                height: '19px',
                                borderRadius: '5px',
                                border: checked ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                                backgroundColor: terminal ? '#F1F5F9' : checked ? '#2563EB' : '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: terminal ? 'not-allowed' : 'pointer',
                                opacity: terminal ? 0.5 : 1,
                                padding: 0,
                              }}
                            >
                              {checked && <Check size={12} color="#FFFFFF" strokeWidth={3.5} />}
                            </button>
                          </td>
                          <td>
                            <div style={{ fontWeight: 800, color: isSel ? '#1D4ED8' : '#0F172A' }}>{app.candidateName}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748B' }}>{app.code} · {app.submittedAt}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <UniversityAvatar code={app.uniCode} size={28} />
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, color: '#0F172A', maxWidth: '175px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {app.major}
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#64748B' }}>{app.uniCode} · {app.uniName}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>
                              {app.score}đ <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: '11px' }}>/ {cutoff}đ</span>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: delta >= 0 ? '#059669' : '#D97706' }}>
                              {delta >= 0 ? `+${delta}đ` : `${delta}đ`}
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
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {pagedApps.map((app) => {
                  const isSel = selectedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => selectAppForReview(app)}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: isSel ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '14px', color: '#0F172A' }}>{app.candidateName}</strong>
                        <StatusBadge status={app.status} />
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#334155', fontWeight: 600 }}>
                        {app.uniCode} — {app.major}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px' }}>
                        Điểm: <strong style={{ color: '#2563EB' }}>{app.score}đ</strong> · {app.code}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Footer — Explicit Range & Numbered Pages (Zero Lost Records) */}
            {appsPageCount > 1 && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', backgroundColor: '#F8FAFC' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>
                  Hiển thị <strong>{pageStartIdx + 1}–{Math.min(pageStartIdx + APPS_PER_PAGE, sortedApps.length)}</strong> / tổng <strong>{sortedApps.length}</strong> hồ sơ · Trang <strong>{curAppsPage}</strong>/{appsPageCount}
                </span>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <button
                    type="button"
                    disabled={curAppsPage <= 1}
                    onClick={() => setAppsPage(curAppsPage - 1)}
                    style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: curAppsPage <= 1 ? 'default' : 'pointer', opacity: curAppsPage <= 1 ? 0.45 : 1 }}
                  >
                    ← Trước
                  </button>
                  {Array.from({ length: appsPageCount }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAppsPage(p)}
                      style={{
                        minWidth: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        border: curAppsPage === p ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                        backgroundColor: curAppsPage === p ? '#2563EB' : '#FFFFFF',
                        color: curAppsPage === p ? '#FFFFFF' : '#334155',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={curAppsPage >= appsPageCount}
                    onClick={() => setAppsPage(curAppsPage + 1)}
                    style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: curAppsPage >= appsPageCount ? 'default' : 'pointer', opacity: curAppsPage >= appsPageCount ? 0.45 : 1 }}
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Smart Decision Inspector */}
          {selectedApp && (
            <div
              id="admin-app-inspector"
              style={{
                ...surfaceCard,
                position: isDesktop ? 'sticky' : 'static',
                top: '84px',
                border: '1.5px solid #BFDBFE',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Phiếu Thẩm Định Hồ Sơ
                </span>
                <button
                  type="button"
                  onClick={() => openApplicationDetail(selectedApp)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#2563EB',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Xem biên nhận <ExternalLink size={12} />
                </button>
              </div>

              {/* Candidate Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <UniversityAvatar code={selectedApp.uniCode} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedApp.candidateName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {selectedApp.code} · Nộp {selectedApp.submittedAt}
                  </div>
                </div>
                <StatusBadge status={selectedApp.status} />
              </div>

              {/* 3-Step Visual Stepper */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px' }}>
                {[
                  { idx: 1, label: '1. Tiếp nhận' },
                  { idx: 2, label: '2. Hợp lệ' },
                  { idx: 3, label: '3. Trúng tuyển' },
                ].map((s) => {
                  const done = stepIndex >= s.idx && selectedApp.status !== 'Đã bị hủy' && selectedApp.status !== 'Đã hủy';
                  return (
                    <div
                      key={s.idx}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: done ? '#EFF6FF' : '#F8FAFC',
                        color: done ? '#1D4ED8' : '#94A3B8',
                        border: done ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                      }}
                    >
                      {s.label}
                    </div>
                  );
                })}
              </div>

              {/* Score Comparison Meter */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: selectedDelta >= 0 ? '#ECFDF5' : '#FFFBEB',
                  border: selectedDelta >= 0 ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ color: '#334155', fontWeight: 700 }}>
                    Điểm thí sinh: <strong style={{ fontSize: '15px', color: '#0F172A' }}>{selectedApp.score}đ</strong>
                  </span>
                  <span style={{ color: '#475569', fontWeight: 600 }}>
                    Chuẩn ngành: <strong>{selectedCutoff}đ</strong>
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: selectedDelta >= 0 ? '#047857' : '#B45309' }}>
                  {selectedDelta >= 0
                    ? `✓ Vượt điểm chuẩn tham chiếu +${selectedDelta}đ — Đủ điều kiện xét duyệt`
                    : `⚠️ Thấp hơn chuẩn tham chiếu ${selectedDelta}đ — Cân nhắc phương thức học bạ`}
                </div>
              </div>

              {/* Application Info Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#334155', marginBottom: '14px', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <div><strong>Trường:</strong> {selectedApp.uniName} ({selectedApp.uniCode})</div>
                <div><strong>Ngành:</strong> {selectedApp.major}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', color: '#475569' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {selectedApp.phone}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {selectedApp.email}</span>
                </div>
                {selectedApp.notes && (
                  <div style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed #E2E8F0', color: '#475569', lineHeight: 1.45 }}>
                    <strong>Ghi chú hồ sơ:</strong> {selectedApp.notes}
                  </div>
                )}
              </div>

              {/* Quick Reply Note Chips & FSM-Guarded Decision Actions */}
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
                  🔒 Hồ sơ đã kết thúc quy trình xét tuyển ({getStatusMeta(selectedApp.status).label}). Hệ thống đã khóa chuyển đổi trạng thái nhằm bảo toàn tính toàn vẹn dữ liệu.
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
                      Ghi chú phản hồi / căn cứ thẩm định gửi thí sinh:
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {QUICK_REVIEW_NOTES.map((tpl) => (
                        <button
                          key={tpl}
                          type="button"
                          onClick={() => setReviewerNote(tpl)}
                          style={{
                            padding: '5px 9px',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: reviewerNote === tpl ? '#EFF6FF' : '#F8FAFC',
                            color: reviewerNote === tpl ? '#1D4ED8' : '#475569',
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
                          ? 'Bắt buộc nhập căn cứ xét tuyển riêng / lý do yêu cầu bổ sung / từ chối...'
                          : 'Nhập nội dung phản hồi (bắt buộc khi Yêu cầu bổ sung hoặc Từ chối)...'
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
                          title={!canAdmit ? 'Cần xác nhận Hồ sơ hợp lệ (Bước 2) trước khi duyệt trúng tuyển' : undefined}
                          onClick={() => {
                            updateApplicationStatus(selectedApp.id, 'Đã trúng tuyển', reviewerNote || undefined);
                            setReviewerNote('');
                          }}
                          style={{
                            width: '100%',
                            padding: '11px',
                            borderRadius: '11px',
                            border: canAdmit ? 'none' : '1px solid #CBD5E1',
                            backgroundColor: canAdmit ? '#059669' : '#F1F5F9',
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
                          {canAdmit ? 'Duyệt Trúng Tuyển Sớm' : 'Duyệt Trúng Tuyển (Cần xác nhận Hợp lệ trước)'}
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                          <button
                            type="button"
                            disabled={!canValid}
                            onClick={() => {
                              updateApplicationStatus(selectedApp.id, 'Hồ sơ hợp lệ', reviewerNote || undefined);
                              setReviewerNote('');
                            }}
                            style={{
                              padding: '8px 6px',
                              borderRadius: '9px',
                              border: '1px solid #7DD3FC',
                              backgroundColor: '#F0F9FF',
                              color: '#0369A1',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              cursor: canValid ? 'pointer' : 'not-allowed',
                              opacity: canValid ? 1 : 0.45,
                            }}
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
                            style={{
                              padding: '8px 6px',
                              borderRadius: '9px',
                              border: '1px solid #93C5FD',
                              backgroundColor: '#EFF6FF',
                              color: '#1D4ED8',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              cursor: canMissing ? 'pointer' : 'not-allowed',
                              opacity: canMissing ? 1 : 0.45,
                            }}
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
                            style={{
                              padding: '8px 6px',
                              borderRadius: '9px',
                              border: '1px solid #FECACA',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              cursor: canReject ? 'pointer' : 'not-allowed',
                              opacity: canReject ? 1 : 0.45,
                            }}
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
  // SECTION 3: 1-1 CONSULTATION BOOKINGS — 3-COLUMN KANBAN PIPELINE
  // =========================================================================
  const renderBookings = () => {
    const columns: { id: BookingState; title: string; dot: string; headerBg: string; border: string; items: typeof bookings }[] = [
      { id: 'pending', title: 'Chờ liên hệ', dot: '#F59E0B', headerBg: '#FFFBEB', border: '#FDE68A', items: pendingBookings },
      { id: 'contacted', title: 'Đã liên hệ tư vấn', dot: '#2563EB', headerBg: '#EFF6FF', border: '#BFDBFE', items: contactedBookings },
      { id: 'done', title: 'Hoàn thành', dot: '#10B981', headerBg: '#ECFDF5', border: '#A7F3D0', items: doneBookings },
    ];

    const renderBookingCard = (bk: (typeof bookings)[number], st: BookingState) => (
      <div
        key={bk.id}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UniversityAvatar code={bk.uniCode} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {bk.name}
            </div>
            <div style={{ fontSize: '11.5px', color: '#2563EB', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {bk.uniCode} · {bk.major}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#475569', backgroundColor: '#F8FAFC', padding: '9px 10px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
            <span>🕒 <strong>{bk.dateTime}</strong></span>
            {bk.channel && (
              <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 7px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                {bk.channel}
              </span>
            )}
          </div>
          <div>📞 {bk.phone} {bk.email ? `· ${bk.email}` : ''}</div>
          {bk.notes && <div style={{ color: '#64748B', fontStyle: 'italic' }}>"{bk.notes}"</div>}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {st === 'pending' && (
            <button
              type="button"
              onClick={() => updateBookingState(bk.id, 'contacted')}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '9px', border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
            >
              📞 Đánh dấu đã liên hệ →
            </button>
          )}
          {st === 'contacted' && (
            <>
              <button
                type="button"
                onClick={() => updateBookingState(bk.id, 'done')}
                style={{ flex: 1, padding: '8px 10px', borderRadius: '9px', border: 'none', backgroundColor: '#059669', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                ✓ Hoàn thành
              </button>
              <button
                type="button"
                onClick={() => updateBookingState(bk.id, 'pending')}
                style={{ padding: '8px 10px', borderRadius: '9px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#64748B', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Quay lại
              </button>
            </>
          )}
          {st === 'done' && (
            <button
              type="button"
              onClick={() => updateBookingState(bk.id, 'pending')}
              style={{ width: '100%', padding: '7px 10px', borderRadius: '9px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              Mở lại lịch hẹn
            </button>
          )}
        </div>
      </div>
    );

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
                  backgroundColor: mobileBkTab === col.id ? '#0F172A' : 'transparent',
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
                  minHeight: '280px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    backgroundColor: col.headerBg,
                    border: `1px solid ${col.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: col.dot }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>{col.title}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#0F172A', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '999px' }}>
                    {col.items.length}
                  </span>
                </div>

                {col.items.length === 0 ? (
                  <div style={{ padding: '28px 12px', textAlign: 'center', fontSize: '12.5px', color: '#94A3B8' }}>
                    Không có lịch hẹn nào ở cột này
                  </div>
                ) : (
                  col.items.map((bk) => renderBookingCard(bk, col.id))
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  // =========================================================================
  // SECTION 4: 30 UNIVERSITIES DATABASE — CLEAN DATA TABLE + INLINE EDIT
  // =========================================================================
  const renderUnis = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Toolbar */}
      <div style={{ ...surfaceCard, padding: '14px 16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '11px', padding: '0 12px', height: '40px', flex: '1 1 220px', minWidth: 0 }}>
          <Search size={16} color="#94A3B8" />
          <input
            value={uniSearch}
            onChange={(e) => {
              setUniSearch(e.target.value);
              setUnisPage(1);
            }}
            placeholder="Tìm tên trường, mã trường, tỉnh/thành..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', backgroundColor: 'transparent', minWidth: 0 }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Tất cả', 'Bắc', 'Trung', 'Nam'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setUniRegion(r);
                setUnisPage(1);
              }}
              style={{
                height: '40px',
                padding: '0 14px',
                borderRadius: '10px',
                border: uniRegion === r ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                backgroundColor: uniRegion === r ? '#EFF6FF' : '#FFFFFF',
                color: uniRegion === r ? '#1D4ED8' : '#475569',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {r === 'Tất cả' ? 'Toàn quốc (30)' : `Miền ${r}`}
            </button>
          ))}
        </div>

        <select
          value={uniSort}
          onChange={(e) => {
            setUniSort(e.target.value as UniSort);
            setUnisPage(1);
          }}
          aria-label="Sắp xếp trường"
          style={{ height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
        >
          <option value="name">Tên trường A → Z</option>
          <option value="scoreDesc">Điểm chuẩn cao → thấp</option>
          <option value="tuitionAsc">Học phí thấp → cao</option>
        </select>
      </div>

      {/* Table / Responsive List */}
      <div style={{ ...surfaceCard, padding: 0, overflow: 'hidden' }}>
        {isDesktop ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="up-table">
              <thead>
                <tr>
                  <th>Trường Đại học</th>
                  <th>Khu vực</th>
                  <th>Điểm chuẩn 2024</th>
                  <th>Học phí (triệu/năm)</th>
                  <th>Việc làm</th>
                  <th>Số ngành</th>
                  <th style={{ textAlign: 'right' }}>Chỉnh sửa (Đồng bộ AI)</th>
                </tr>
              </thead>
              <tbody>
                {pagedUnis.map((uni) => {
                  const isEditing = editingUniId === uni.id;
                  return (
                    <tr key={uni.id} className="up-row-hover" style={{ backgroundColor: isEditing ? '#F8FAFF' : undefined }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <UniversityAvatar code={uni.code} size={34} />
                          <div>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>{uni.name}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748B' }}>Mã: <strong>{uni.code}</strong> · {uni.loc}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ padding: '3px 9px', borderRadius: '999px', backgroundColor: '#F1F5F9', color: '#334155', fontSize: '11.5px', fontWeight: 700 }}>
                          Miền {uni.region}
                        </span>
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editScoreText}
                            onChange={(e) => setEditScoreText(e.target.value)}
                            placeholder="12 - 30"
                            style={{ width: '88px', padding: '6px 8px', borderRadius: '8px', border: '1.5px solid #2563EB', fontSize: '13px', fontWeight: 800 }}
                          />
                        ) : (
                          <div>
                            <strong style={{ fontSize: '14px', color: '#2563EB' }}>{formatCleanDecimal(uni.score2024, 2)}đ</strong>
                            <div style={{ fontSize: '10.5px', color: '#64748B' }}>Ngành: {getCutoffRangeText(uni)}</div>
                          </div>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editTuitionText}
                            onChange={(e) => setEditTuitionText(e.target.value)}
                            placeholder="0 - 200"
                            style={{ width: '88px', padding: '6px 8px', borderRadius: '8px', border: '1.5px solid #2563EB', fontSize: '13px', fontWeight: 800 }}
                          />
                        ) : (
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>
                            {formatTuitionRange(uni.tuitionMin, uni.tuitionMax, false)}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ color: '#059669', fontWeight: 800 }}>{uni.employmentRate}%</span>
                      </td>
                      <td>{uni.majors.length} ngành</td>
                      <td style={{ textAlign: 'right' }}>
                        {isEditing ? (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleSaveUni(uni.id)}
                              style={{ padding: '6px 11px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                            >
                              ✓ Lưu
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingUniId(null)}
                              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUniId(uni.id);
                              setEditScoreText(formatCleanDecimal(uni.score2024, 2));
                              setEditTuitionText(formatCleanDecimal(uni.tuitionMin, 1));
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              color: '#2563EB',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <Edit2 size={12} /> Sửa chỉ số
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pagedUnis.map((uni) => {
              const isEditing = editingUniId === uni.id;
              return (
                <div key={uni.id} style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <UniversityAvatar code={uni.code} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {uni.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>{uni.code} · Miền {uni.region}</div>
                    </div>
                  </div>
                  {!isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                      <span>Chuẩn TK: <strong style={{ color: '#2563EB' }}>{formatCleanDecimal(uni.score2024, 2)}đ</strong> · Học phí: <strong>{formatTuitionRange(uni.tuitionMin, uni.tuitionMax, false)}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUniId(uni.id);
                          setEditScoreText(formatCleanDecimal(uni.score2024, 2));
                          setEditTuitionText(formatCleanDecimal(uni.tuitionMin, 1));
                        }}
                        style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#2563EB', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Sửa
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '6px', alignItems: 'center' }}>
                      <input type="text" inputMode="decimal" value={editScoreText} onChange={(e) => setEditScoreText(e.target.value)} placeholder="12-30" style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #2563EB', fontWeight: 700 }} />
                      <input type="text" inputMode="decimal" value={editTuitionText} onChange={(e) => setEditTuitionText(e.target.value)} placeholder="0-200" style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #2563EB', fontWeight: 700 }} />
                      <button type="button" onClick={() => handleSaveUni(uni.id)} style={{ padding: '7px 11px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}>
                        Lưu
                      </button>
                      <button type="button" onClick={() => setEditingUniId(null)} style={{ padding: '7px 9px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {unisPageCount > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC' }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Trang <strong>{curUnisPage}</strong> / {unisPageCount} ({filteredUnis.length} trường)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" disabled={curUnisPage <= 1} onClick={() => setUnisPage(curUnisPage - 1)} style={{ padding: '6px 11px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', opacity: curUnisPage <= 1 ? 0.45 : 1 }}>
                ← Trước
              </button>
              <button type="button" disabled={curUnisPage >= unisPageCount} onClick={() => setUnisPage(curUnisPage + 1)} style={{ padding: '6px 11px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer', opacity: curUnisPage >= unisPageCount ? 0.45 : 1 }}>
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // =========================================================================
  // SECTION 5: RBAC MATRIX & SYSTEM USERS
  // =========================================================================
  const renderAccount = () => (
    <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.35fr 1fr' : '1fr', gap: '18px', alignItems: 'start' }}>
      <div style={{ ...surfaceCard, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
            Ma trận Phân quyền Bảo mật RBAC (Thực thi tại tầng lõi)
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748B' }}>
            Mọi hành động trái quyền đều bị chặn trực tiếp tại `AppContext` kèm cảnh báo minh bạch
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="up-table">
            <thead>
              <tr>
                <th>Nghiệp vụ hệ thống</th>
                <th style={{ textAlign: 'center' }}>Admin</th>
                <th style={{ textAlign: 'center' }}>ĐH Phú Xuân</th>
                <th style={{ textAlign: 'center' }}>Thí sinh</th>
              </tr>
            </thead>
            <tbody>
              {PERMISSION_ROWS.map((row) => (
                <tr key={row.label}>
                  <td style={{ fontWeight: 600 }}>{row.label}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: row.admin === '—' ? '#CBD5E1' : '#4F46E5' }}>{row.admin}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: row.pxu === '—' ? '#CBD5E1' : '#059669' }}>{row.pxu}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: row.student === '—' ? '#CBD5E1' : '#2563EB' }}>{row.student}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={surfaceCard}>
        <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
          Danh sách Tài khoản Hệ thống ({SYSTEM_ACCOUNTS.length + registeredUsers.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SYSTEM_ACCOUNTS.map((acc) => (
            <div key={acc.email} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: acc.bg, color: acc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px', flexShrink: 0 }}>
                {acc.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.name}</div>
                <div style={{ fontSize: '11.5px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.email}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 9px', borderRadius: '999px', backgroundColor: acc.bg, color: acc.color, whiteSpace: 'nowrap' }}>
                {acc.role}
              </span>
            </div>
          ))}

          {registeredUsers.map((acc) => (
            <div key={acc.email} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px', flexShrink: 0 }}>
                {acc.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{acc.name}</div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>{acc.email}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 9px', borderRadius: '999px', backgroundColor: '#FEF3C7', color: '#B45309' }}>
                Mới đăng ký
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // DESKTOP & MOBILE SHELLS (CLEAN SAAS CONTROL CENTER)
  // =========================================================================
  const renderMainBody = () => (
    <>
      {section === 'dashboard' && renderDashboard()}
      {section === 'apps' && renderApps()}
      {section === 'bookings' && renderBookings()}
      {section === 'unis' && renderUnis()}
      {section === 'account' && renderAccount()}
    </>
  );

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', width: '100%' }}>
        {/* Sticky Left Sidebar */}
        <aside
          style={{
            width: '252px',
            flexShrink: 0,
            backgroundColor: '#0F172A',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={21} color="#FFFFFF" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.2px' }}>UniPath Admin</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Control Center 2026</div>
            </div>
          </div>

          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px', padding: '0 10px 8px' }}>
            Phân hệ quản trị
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
                    backgroundColor: active ? '#2563EB' : 'transparent',
                    color: active ? '#FFFFFF' : '#CBD5E1',
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
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: '999px',
                        backgroundColor: active ? '#FFFFFF' : '#F59E0B',
                        color: active ? '#1D4ED8' : '#451A03',
                        fontSize: '11px',
                        fontWeight: 900,
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '10px 12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.5 }}>
              <div style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} color="#60A5FA" /> Đồng bộ trực tiếp
              </div>
              Mọi thay đổi điểm chuẩn và trạng thái hồ sơ được phản ánh tức thì sang Cổng Thí sinh.
            </div>
            <button
              type="button"
              onClick={resetAllData}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.14)',
                backgroundColor: 'transparent',
                color: '#CBD5E1',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} /> Khôi phục dữ liệu mẫu
            </button>
          </div>
        </aside>

        {/* Right Content Area with Sticky Topbar */}
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
              <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Trung tâm Điều hành</span>
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
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: '11px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
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

          <main style={{ flex: 1, maxWidth: '1260px', width: '100%', margin: '0 auto', padding: '24px 28px 48px', boxSizing: 'border-box' }}>
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
          backgroundColor: '#0F172A',
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
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={18} color="#FFFFFF" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>UniPath Admin</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentNavMeta.shortLabel}</div>
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
                color: active ? '#2563EB' : '#64748B',
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
