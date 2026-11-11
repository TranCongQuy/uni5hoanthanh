import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  School,
  User,
  LogOut,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  Edit2,
  ChevronRight,
  ShieldCheck,
  Bell,
  Settings,
  Calendar,
  Download,
  Users,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { BookingState } from '../../context/AppContext';
import type { ApplicationRecord, ApplicationStatus } from '../../types';
import { UniversityAvatar } from '../common/UI';

// =========================================================================
// ADMIN APP v2 — Trung tâm điều hành UniPath (khung giao diện riêng cho Admin)
// Điều hướng riêng: Tổng quan / Hồ sơ / Tư vấn / Trường / Tài khoản.
// Đầy đủ chức năng hệ thống dành cho Admin: xử lý hồ sơ toàn quốc, lịch tư
// vấn, CSDL 30 trường, người dùng & ma trận phân quyền, nhật ký xử lý.
// =========================================================================

type AdminSection = 'dashboard' | 'apps' | 'bookings' | 'unis' | 'account';
type AppSort = 'list' | 'scoreDesc' | 'scoreAsc' | 'nameAsc';
type UniSort = 'name' | 'scoreDesc' | 'tuitionAsc';

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
  { id: 'apps', label: 'Hồ sơ', icon: <FileText size={20} /> },
  { id: 'bookings', label: 'Tư vấn', icon: <Calendar size={20} /> },
  { id: 'unis', label: 'Trường', icon: <School size={20} /> },
  { id: 'account', label: 'Tài khoản', icon: <User size={20} /> },
];

const ALL_STATUSES: ApplicationStatus[] = [
  'Đang xét duyệt',
  'Hồ sơ hợp lệ',
  'Thiếu hồ sơ',
  'Đã trúng tuyển',
  'Đã hủy',
  'Đã bị hủy',
];

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
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
  padding: '20px',
  boxSizing: 'border-box',
  minWidth: 0,
};

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

const Pager: React.FC<{ page: number; pageCount: number; total: number; unit: string; onChange: (p: number) => void }> = ({ page, pageCount, total, unit, onChange }) => {
  if (pageCount <= 1) return null;
  const btn: React.CSSProperties = {
    minWidth: '34px',
    height: '34px',
    padding: '0 10px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#FFFFFF',
    color: '#334155',
    fontSize: '12.5px',
    fontWeight: 700,
    cursor: 'pointer',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
      <button style={{ ...btn, opacity: page <= 1 ? 0.45 : 1 }} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Trước
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          style={p === page ? { ...btn, backgroundColor: '#2563EB', border: '1px solid #2563EB', color: '#FFFFFF', fontWeight: 800 } : btn}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button style={{ ...btn, opacity: page >= pageCount ? 0.45 : 1 }} disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
        Sau →
      </button>
      <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '6px' }}>
        Trang {page}/{pageCount} · Tổng {total} {unit}
      </span>
    </div>
  );
};

interface RegisteredUser {
  name: string;
  email: string;
}

const SYSTEM_ACCOUNTS: { name: string; email: string; role: string; color: string }[] = [
  { name: 'Trần Công Quý', email: 'quy@unipath.vn', role: 'Thí sinh', color: '#2563EB' },
  { name: 'Admin Hệ Thống UniPath', email: 'admin@unipath.vn', role: 'Admin', color: '#7C3AED' },
  { name: 'Ban Tuyển Sinh Phú Xuân', email: 'tuyensinh@pxu.edu.vn', role: 'ĐH Phú Xuân', color: '#059669' },
];

const PERMISSION_ROWS: { label: string; admin: string; pxu: string; student: string }[] = [
  { label: 'Xử lý hồ sơ của tất cả các trường', admin: '✓', pxu: '—', student: '—' },
  { label: 'Xử lý hồ sơ nộp vào PXU', admin: '✓', pxu: '✓', student: '—' },
  { label: 'Sửa CSDL điểm chuẩn & học phí', admin: '✓', pxu: '—', student: '—' },
  { label: 'Xem lịch tư vấn tuyển sinh', admin: 'Tất cả', pxu: 'Chỉ PXU', student: 'Của mình' },
  { label: 'Xem nhật ký xử lý hồ sơ', admin: 'Toàn hệ thống', pxu: 'Chỉ PXU', student: '—' },
  { label: 'Nộp hồ sơ & tự hủy hồ sơ của mình', admin: '—', pxu: '—', student: '✓' },
];

export const AdminApp: React.FC = () => {
  const {
    user,
    profile,
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
    openSettings,
    logout,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [appsPage, setAppsPage] = useState(1);
  const [unisPage, setUnisPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [bkFilter, setBkFilter] = useState<'all' | BookingState>('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // --- Apps filters ---
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState<string>('Tất cả');
  const [appUni, setAppUni] = useState<string>('Tất cả');
  const [appSort, setAppSort] = useState<AppSort>('list');

  // --- Universities filters / edit ---
  const [uniSearch, setUniSearch] = useState('');
  const [uniRegion, setUniRegion] = useState<string>('Tất cả');
  const [uniSort, setUniSort] = useState<UniSort>('name');
  const [editingUniId, setEditingUniId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number>(20);
  const [editTuition, setEditTuition] = useState<number>(15);

  // --- Registered users (chỉ đọc tên + email, không hiển thị mật khẩu) ---
  const [registeredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const raw = localStorage.getItem('unipath_registered_users');
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      return arr
        .filter((u) => u && typeof u.email === 'string' && typeof u.name === 'string')
        .map((u) => ({ name: u.name as string, email: u.email as string }));
    } catch {
      return [];
    }
  });

  // --- Derived data ---
  const totalApps = applications.length;
  const countByStatus = (s: ApplicationStatus) => applications.filter((a) => a.status === s).length;
  const pendingApps = applications.filter((a) => a.status === 'Đang xét duyệt');
  const missingApps = applications.filter((a) => a.status === 'Thiếu hồ sơ');
  const uniCodesInApps = Array.from(new Set(applications.map((a) => a.uniCode)));
  const uniCounts = uniCodesInApps
    .map((code) => ({
      code,
      name: applications.find((a) => a.uniCode === code)?.uniName || code,
      count: applications.filter((a) => a.uniCode === code).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxUniCount = Math.max(1, ...uniCounts.map((u) => u.count));
  const avgScore = totalApps > 0 ? (applications.reduce((sum, a) => sum + a.score, 0) / totalApps).toFixed(1) : '0';

  const filteredApps = applications.filter((a) => {
    const matchStatus = appStatus === 'Tất cả' || a.status === appStatus;
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
    return 0;
  });

  const APPS_PER_PAGE = 5;
  const appsPageCount = Math.max(1, Math.ceil(sortedApps.length / APPS_PER_PAGE));
  const curAppsPage = Math.min(appsPage, appsPageCount);
  const pagedApps = sortedApps.slice((curAppsPage - 1) * APPS_PER_PAGE, curAppsPage * APPS_PER_PAGE);

  const selectedApp: ApplicationRecord | null =
    applications.find((a) => a.id === selectedAppId) || pendingApps[0] || applications[0] || null;

  const filteredUnis = universitiesList
    .filter((u) => {
      const matchRegion = uniRegion === 'Tất cả' || u.region === uniRegion;
      const kw = uniSearch.trim().toLowerCase();
      const matchKw = !kw || u.name.toLowerCase().includes(kw) || u.code.toLowerCase().includes(kw);
      return matchRegion && matchKw;
    })
    .sort((a, b) => {
      if (uniSort === 'scoreDesc') return b.score2024 - a.score2024;
      if (uniSort === 'tuitionAsc') return a.tuitionMin - b.tuitionMin;
      return a.name.localeCompare(b.name, 'vi');
    });

  const UNIS_PER_PAGE = 12;
  const unisPageCount = Math.max(1, Math.ceil(filteredUnis.length / UNIS_PER_PAGE));
  const curUnisPage = Math.min(unisPage, unisPageCount);
  const pagedUnis = filteredUnis.slice((curUnisPage - 1) * UNIS_PER_PAGE, curUnisPage * UNIS_PER_PAGE);

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const applyBatch = (status: ApplicationStatus) => {
    checkedIds.forEach((id) => updateApplicationStatus(id, status));
    setCheckedIds([]);
  };

  const bookingStateOf = (id: string): BookingState => bookingStates[id] || 'pending';
  const bookingCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => bookingStateOf(b.id) === 'pending').length,
    contacted: bookings.filter((b) => bookingStateOf(b.id) === 'contacted').length,
    done: bookings.filter((b) => bookingStateOf(b.id) === 'done').length,
  };
  const filteredBookings = bkFilter === 'all' ? bookings : bookings.filter((b) => bookingStateOf(b.id) === bkFilter);

  const selectApp = (app: ApplicationRecord, goToApps: boolean) => {
    setSelectedAppId(app.id);
    if (goToApps) setSection('apps');
    if (!isDesktop) {
      window.setTimeout(() => {
        document.getElementById("app-inspector")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, goToApps ? 180 : 80);
    }
  };

  const handleSaveUni = (id: number) => {
    updateUniversityMetrics(id, editScore, editTuition);
    setEditingUniId(null);
  };

  const selectStyle: React.CSSProperties = {
    padding: '9px 12px',
    borderRadius: '11px',
    border: '1px solid #E2E8F0',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', ...(isDesktop ? { height: '100%' } : {}) }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Tổng quan điều hành</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          Hệ thống tuyển sinh UniPath 2.0 · {new Date().toLocaleDateString('vi-VN')} · {universitiesList.length} trường · Điểm TB hồ sơ {avgScore}
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Tổng hồ sơ', value: totalApps, icon: <FileText size={19} color="#2563EB" />, bg: '#EFF6FF' },
          { label: 'Đang xét duyệt', value: countByStatus('Đang xét duyệt'), icon: <Clock size={19} color="#D97706" />, bg: '#FFFBEB' },
          { label: 'Thiếu hồ sơ', value: countByStatus('Thiếu hồ sơ'), icon: <AlertCircle size={19} color="#2563EB" />, bg: '#EFF6FF' },
          { label: 'Đã trúng tuyển', value: countByStatus('Đã trúng tuyển'), icon: <CheckCircle2 size={19} color="#059669" />, bg: '#ECFDF5' },
          { label: 'Lịch tư vấn', value: bookings.length, icon: <Calendar size={19} color="#7C3AED" />, bg: '#F5F3FF' },
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

      {/* Việc cần xử lý */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {[
          { text: `${pendingApps.length} hồ sơ chờ duyệt`, target: 'apps' as AdminSection, color: '#D97706', bg: '#FFFBEB' },
          { text: `${missingApps.length} hồ sơ thiếu giấy tờ`, target: 'apps' as AdminSection, color: '#2563EB', bg: '#EFF6FF' },
          { text: `${bookings.length} lịch tư vấn đã đặt`, target: 'bookings' as AdminSection, color: '#7C3AED', bg: '#F5F3FF' },
        ].map((item) => (
          <button
            key={item.text}
            onClick={() => setSection(item.target)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '13px 15px',
              borderRadius: '15px',
              border: 'none',
              backgroundColor: item.bg,
              color: item.color,
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              textAlign: 'left',
              minWidth: 0,
            }}
          >
            <span style={{ minWidth: 0 }}>{item.text}</span>
            <ChevronRight size={16} style={{ flexShrink: 0 }} />
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.35fr 1fr' : '1fr', gap: '16px', alignItems: isDesktop ? 'stretch' : 'start', ...(isDesktop ? { flex: 1, minHeight: 0 } : {}) }}>
        {/* Hàng đợi */}
        <div style={{ ...cardStyle, ...(isDesktop ? { height: '100%', overflowY: 'auto' as const } : {}) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Hàng đợi cần xử lý</h2>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', backgroundColor: '#FFFBEB', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
              {pendingApps.length} chờ duyệt
            </span>
          </div>
          {pendingApps.length === 0 ? (
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>Không có hồ sơ nào đang chờ duyệt. 🎉</p>
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
                    borderBottom: '1px solid #F1F5F9',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    minWidth: 0,
                  }}
                >
                  <UniversityAvatar code={app.uniCode} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.candidateName} · {app.code}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.major} — {app.uniName}
                    </div>
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#2563EB', whiteSpace: 'nowrap' }}>{app.score}đ</span>
                  <ChevronRight size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setSection('apps')}
            style={{ marginTop: '14px', padding: '10px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
          >
            Xem tất cả hồ sơ
          </button>
        </div>

        {/* Phân bổ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0, ...(isDesktop ? { height: '100%', overflowY: 'auto' as const } : {}) }}>
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Phân bổ theo trạng thái</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ALL_STATUSES.map((s) => {
                const c = countByStatus(s);
                const pct = totalApps > 0 ? Math.round((c / totalApps) * 100) : 0;
                return (
                  <div key={s} style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#334155', fontWeight: 600 }}>{s}</span>
                      <span style={{ color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {c} · {pct}%
                      </span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: statusColor(s), borderRadius: '999px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '12px' }}>
              Hồ sơ hợp lệ: <strong style={{ color: '#0F172A' }}>{countByStatus('Hồ sơ hợp lệ')}</strong> · Đã hủy: <strong style={{ color: '#0F172A' }}>{countByStatus('Đã hủy')}</strong> · Đã bị hủy: <strong style={{ color: '#0F172A' }}>{countByStatus('Đã bị hủy')}</strong>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ theo trường</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {uniCounts.map((u) => (
                <div key={u.code} style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.code} — {u.name}
                    </span>
                    <span style={{ color: '#64748B', fontWeight: 700 }}>{u.count}</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((u.count / maxUniCount) * 100)}%`, backgroundColor: '#2563EB', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nhật ký xử lý */}
      <div style={{ ...cardStyle, ...(isDesktop ? { maxHeight: '238px', overflowY: 'auto' as const, flexShrink: 0 } : {}) }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Nhật ký xử lý hồ sơ</h2>
        <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748B' }}>Mỗi quyết định duyệt / bổ sung / từ chối đều được ghi lại: ai xử lý, hồ sơ nào, đổi trạng thái ra sao.</p>
        {processingLog.length === 0 ? (
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>Chưa có lượt xử lý nào trong phiên này. Hãy vào mục Hồ sơ và xử lý một hồ sơ đang chờ duyệt.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {processingLog.slice(0, 8).map((log) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 2px', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', minWidth: 0 }}>
                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, whiteSpace: 'nowrap' }}>{log.time}</span>
                <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 700 }}>
                  {log.actorName} <span style={{ color: '#64748B', fontWeight: 600 }}>({log.actorRole === 'admin' ? 'Admin' : log.uniCode})</span>
                </span>
                <span style={{ fontSize: '13px', color: '#334155' }}>
                  {log.appCode} · {log.candidateName}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}>
                  <span style={{ color: statusColor(log.fromStatus) }}>{log.fromStatus}</span>
                  <span style={{ color: '#94A3B8' }}>→</span>
                  <span style={{ color: statusColor(log.toStatus) }}>{log.toStatus}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderApps = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Quản lý hồ sơ xét tuyển</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
            {sortedApps.length}/{totalApps} hồ sơ · Chọn một hồ sơ để xử lý ở khung {isDesktop ? 'bên phải' : 'bên dưới'}
          </p>
        </div>
        <button
          onClick={() => exportAppsCsv(sortedApps, 'ho-so-unipath.csv')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 15px', borderRadius: '12px', border: '1.5px solid #2563EB', backgroundColor: '#FFFFFF', color: '#2563EB', fontSize: '13px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <Download size={15} /> Xuất CSV ({sortedApps.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '0 14px', height: '46px', flex: '1 1 260px', minWidth: 0, boxSizing: 'border-box' }}>
            <Search size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
            <input
              value={appSearch}
              onChange={(e) => {
                setAppSearch(e.target.value);
                setAppsPage(1);
              }}
              placeholder="Tìm tên thí sinh, mã hồ sơ, ngành, trường..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13.5px', color: '#0F172A', backgroundColor: 'transparent', minWidth: 0 }}
            />
            {appSearch && (
              <button onClick={() => setAppSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                <X size={16} color="#94A3B8" />
              </button>
            )}
          </div>
          <select value={appSort} onChange={(e) => {
            setAppSort(e.target.value as AppSort);
            setAppsPage(1);
          }} style={{ ...selectStyle, height: '46px' }} aria-label="Sắp xếp hồ sơ">
            <option value="list">Thứ tự danh sách</option>
            <option value="scoreDesc">Điểm cao → thấp</option>
            <option value="scoreAsc">Điểm thấp → cao</option>
            <option value="nameAsc">Tên thí sinh A–Z</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Tất cả', ...ALL_STATUSES].map((s) => {
            const count = s === 'Tất cả' ? totalApps : countByStatus(s as ApplicationStatus);
            return (
              <button
                key={s}
                onClick={() => {
                  setAppStatus(s);
                  setAppsPage(1);
                }}
                style={{
                  padding: '7px 13px',
                  borderRadius: '999px',
                  border: appStatus === s ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: appStatus === s ? '#EFF6FF' : '#FFFFFF',
                  color: appStatus === s ? '#1D4ED8' : '#475569',
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Trường:</span>
          {['Tất cả', ...uniCodesInApps].map((code) => (
            <button
              key={code}
              onClick={() => {
                setAppUni(code);
                setAppsPage(1);
              }}
              style={{
                padding: '5px 11px',
                borderRadius: '999px',
                border: appUni === code ? '1.5px solid #0F172A' : '1px solid #E2E8F0',
                backgroundColor: appUni === code ? '#0F172A' : '#FFFFFF',
                color: appUni === code ? '#FFFFFF' : '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

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
            padding: '10px 14px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800, marginRight: '2px' }}>Đã chọn {checkedIds.length} hồ sơ</span>
          <button onClick={() => applyBatch('Đã trúng tuyển')} style={{ padding: '8px 13px', borderRadius: '10px', border: 'none', backgroundColor: '#059669', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}>
            Duyệt trúng tuyển
          </button>
          <button onClick={() => applyBatch('Thiếu hồ sơ')} style={{ padding: '8px 13px', borderRadius: '10px', border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}>
            Yêu cầu bổ sung
          </button>
          <button onClick={() => applyBatch('Đã bị hủy')} style={{ padding: '8px 13px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}>
            Từ chối
          </button>
          <button onClick={() => setCheckedIds([])} style={{ padding: '8px 13px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.4)', backgroundColor: 'transparent', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}>
            Bỏ chọn
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.55fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          {sortedApps.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>Không có hồ sơ nào khớp bộ lọc hiện tại.</div>
          )}
          {pagedApps.map((app) => {
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
                  border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: isSelected ? '#F8FBFF' : '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span
                    role="checkbox"
                    aria-checked={checkedIds.includes(app.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChecked(app.id);
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      border: checkedIds.includes(app.id) ? '2px solid #2563EB' : '2px solid #CBD5E1',
                      backgroundColor: checkedIds.includes(app.id) ? '#2563EB' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  >
                    {checkedIds.includes(app.id) && <Check size={13} color="#FFFFFF" strokeWidth={3.5} />}
                  </span>
                  <UniversityAvatar code={app.uniCode} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.candidateName}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                      {app.code} · {app.submittedAt}
                    </div>
                  </div>
                  <StatusChip status={app.status} />
                </div>
                <div style={{ fontSize: '12.5px', color: '#334155' }}>
                  {app.major} — {app.uniName}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Điểm: <strong style={{ color: '#2563EB' }}>{app.score}</strong> · {app.phone} · {app.email}
                </div>
              </button>
            );
          })}
        </div>

        {selectedApp && (
          <div id="app-inspector" style={{ ...cardStyle, position: isDesktop ? 'sticky' : 'static', top: '24px', scrollMarginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.6px', color: '#2563EB', textTransform: 'uppercase', marginBottom: '8px' }}>Xử lý hồ sơ</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <UniversityAvatar code={selectedApp.uniCode} size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedApp.candidateName}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{selectedApp.code}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#334155', marginBottom: '12px' }}>
              <div>Trường: <strong>{selectedApp.uniName} ({selectedApp.uniCode})</strong></div>
              <div>Ngành: <strong>{selectedApp.major}</strong></div>
              <div>Điểm xét tuyển: <strong style={{ color: '#2563EB' }}>{selectedApp.score}</strong></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <Phone size={13} color="#64748B" /> {selectedApp.phone} · {selectedApp.email}
              </div>
              <div>Nộp lúc: {selectedApp.submittedAt}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                Trạng thái: <StatusChip status={selectedApp.status} />
              </div>
              {selectedApp.notes && (
                <div style={{ fontSize: '12.5px', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '10px', lineHeight: 1.5 }}>{selectedApp.notes}</div>
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
                  backgroundColor: selectedApp.status === 'Đã trúng tuyển' ? '#A7F3D0' : '#059669',
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
                <CheckCircle2 size={17} /> Duyệt trúng tuyển
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
      <Pager page={curAppsPage} pageCount={appsPageCount} total={sortedApps.length} unit="hồ sơ" onChange={setAppsPage} />
    </div>
  );

  const renderBookings = () => {
    const stateMeta: Record<BookingState, { label: string; color: string; bg: string }> = {
      pending: { label: 'Chờ liên hệ', color: '#B45309', bg: '#FEF3C7' },
      contacted: { label: 'Đã liên hệ', color: '#1D4ED8', bg: '#DBEAFE' },
      done: { label: 'Hoàn thành', color: '#047857', bg: '#D1FAE5' },
    };
    const chipBtn = (active: boolean): React.CSSProperties => ({
      padding: '7px 13px',
      borderRadius: '999px',
      border: active ? '1px solid #0F172A' : '1px solid #E2E8F0',
      backgroundColor: active ? '#0F172A' : '#FFFFFF',
      color: active ? '#FFFFFF' : '#475569',
      fontSize: '12.5px',
      fontWeight: 700,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    });
    const actBtn = (bg: string): React.CSSProperties => ({
      padding: '8px 12px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: bg,
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 800,
      cursor: 'pointer',
    });
    const ghostBtn: React.CSSProperties = {
      padding: '8px 12px',
      borderRadius: '10px',
      border: '1px solid #E2E8F0',
      backgroundColor: '#FFFFFF',
      color: '#64748B',
      fontSize: '12px',
      fontWeight: 700,
      cursor: 'pointer',
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Lịch tư vấn tuyển sinh</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
            {bookings.length} lịch hẹn trên toàn hệ thống · {bookingCounts.pending} đang chờ liên hệ — bấm xử lý ngay trên từng lịch
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button style={chipBtn(bkFilter === 'all')} onClick={() => setBkFilter('all')}>
            Tất cả · {bookingCounts.all}
          </button>
          <button style={chipBtn(bkFilter === 'pending')} onClick={() => setBkFilter('pending')}>
            Chờ liên hệ · {bookingCounts.pending}
          </button>
          <button style={chipBtn(bkFilter === 'contacted')} onClick={() => setBkFilter('contacted')}>
            Đã liên hệ · {bookingCounts.contacted}
          </button>
          <button style={chipBtn(bkFilter === 'done')} onClick={() => setBkFilter('done')}>
            Hoàn thành · {bookingCounts.done}
          </button>
        </div>
        {filteredBookings.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>Không có lịch tư vấn nào ở trạng thái này.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {filteredBookings.map((bk) => {
              const st = bookingStateOf(bk.id);
              const meta = stateMeta[st];
              return (
                <div key={bk.id} style={{ ...cardStyle, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UniversityAvatar code={bk.uniCode} size={38} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bk.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        Tư vấn với {bk.uniCode} · {bk.major}
                      </div>
                    </div>
                    <span style={{ padding: '4px 9px', borderRadius: '999px', backgroundColor: meta.bg, color: meta.color, fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>{meta.label}</span>
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
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '2px' }}>
                    {st === 'pending' && (
                      <button style={actBtn('#2563EB')} onClick={() => updateBookingState(bk.id, 'contacted')}>
                        Đánh dấu đã liên hệ
                      </button>
                    )}
                    {st === 'contacted' && (
                      <>
                        <button style={actBtn('#059669')} onClick={() => updateBookingState(bk.id, 'done')}>
                          Hoàn thành tư vấn
                        </button>
                        <button style={ghostBtn} onClick={() => updateBookingState(bk.id, 'pending')}>
                          Đặt lại
                        </button>
                      </>
                    )}
                    {st === 'done' && (
                      <button style={ghostBtn} onClick={() => updateBookingState(bk.id, 'pending')}>
                        Mở lại lịch
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderUnis = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Cơ sở dữ liệu trường đại học</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          Đủ {universitiesList.length} trường · Đang hiện {filteredUnis.length} · Chỉ Admin được sửa điểm chuẩn & học phí sàn
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '0 14px', height: '44px', flex: '1 1 240px', minWidth: 0, boxSizing: 'border-box' }}>
          <Search size={17} color="#94A3B8" style={{ flexShrink: 0 }} />
          <input
            value={uniSearch}
            onChange={(e) => {
              setUniSearch(e.target.value);
              setUnisPage(1);
            }}
            placeholder="Tìm tên trường hoặc mã trường..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13.5px', backgroundColor: 'transparent', minWidth: 0 }}
          />
        </div>
        <select value={uniSort} onChange={(e) => {
          setUniSort(e.target.value as UniSort);
          setUnisPage(1);
        }} style={{ ...selectStyle, height: '44px' }} aria-label="Sắp xếp trường">
          <option value="name">Tên trường A–Z</option>
          <option value="scoreDesc">Điểm chuẩn cao → thấp</option>
          <option value="tuitionAsc">Học phí thấp → cao</option>
        </select>
        {['Tất cả', 'Bắc', 'Trung', 'Nam'].map((r) => (
          <button
            key={r}
            onClick={() => {
              setUniRegion(r);
              setUnisPage(1);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              border: uniRegion === r ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
              backgroundColor: uniRegion === r ? '#EFF6FF' : '#FFFFFF',
              color: uniRegion === r ? '#1D4ED8' : '#475569',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {r === 'Tất cả' ? 'Tất cả' : `Miền ${r}`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(258px, 1fr))', gap: '12px' }}>
        {pagedUnis.map((uni) => {
          const isEditing = editingUniId === uni.id;
          return (
            <div key={uni.id} style={{ ...cardStyle, padding: '16px', border: isEditing ? '2px solid #2563EB' : '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <UniversityAvatar code={uni.code} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{uni.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {uni.code} · Miền {uni.region} · {uni.loc}
                  </div>
                </div>
              </div>
              {!isEditing ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12.5px', color: '#334155', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 10px', minWidth: 0 }}>
                      Điểm chuẩn 2024<br />
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{uni.score2024}</strong>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 10px', minWidth: 0 }}>
                      Học phí từ<br />
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{uni.tuitionMin}tr</strong>
                      <span style={{ color: '#64748B' }}> /năm</span>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 10px', minWidth: 0 }}>
                      Việc làm<br />
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{uni.employmentRate}%</strong>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 10px', minWidth: 0 }}>
                      Ngành đào tạo<br />
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{uni.majors.length}</strong>
                      <span style={{ color: '#64748B' }}> · ★ {uni.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingUniId(uni.id);
                      setEditScore(uni.score2024);
                      setEditTuition(uni.tuitionMin);
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 13px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#2563EB', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    <Edit2 size={13} /> Sửa số liệu
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Điểm chuẩn 2024
                    <input
                      type="number"
                      step="0.25"
                      value={editScore}
                      onChange={(e) => setEditScore(Number(e.target.value))}
                      style={{ display: 'block', width: '100%', marginTop: '4px', padding: '9px 11px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                    />
                  </label>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Học phí từ (triệu/năm)
                    <input
                      type="number"
                      step="1"
                      value={editTuition}
                      onChange={(e) => setEditTuition(Number(e.target.value))}
                      style={{ display: 'block', width: '100%', marginTop: '4px', padding: '9px 11px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13.5px', boxSizing: 'border-box' }}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleSaveUni(uni.id)}
                      style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#059669', color: '#FFFFFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Check size={15} /> Lưu
                    </button>
                    <button
                      onClick={() => setEditingUniId(null)}
                      style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filteredUnis.length === 0 && <div style={{ ...cardStyle, textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>Không tìm thấy trường nào khớp bộ lọc.</div>}
      <Pager page={curUnisPage} pageCount={unisPageCount} total={filteredUnis.length} unit="trường" onChange={setUnisPage} />
    </div>
  );

  const renderAccount = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: isDesktop ? '1160px' : '680px' }}>
      <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Tài khoản quản trị</h1>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={28} color="#FFFFFF" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A' }}>{user.name}</div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>{user.title}</div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>
              {user.email} · {user.organization}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
          Vai trò hiện tại: <strong style={{ color: '#2563EB' }}>Admin Hệ Thống (admin)</strong> — toàn quyền xử lý hồ sơ của {universitiesList.length} trường và quản trị CSDL. Hồ sơ cá nhân liên kết: {profile.name} · {profile.school}.
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <button
            onClick={openNotifications}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 14px', borderRadius: '11px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#334155', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
          >
            <Bell size={14} /> Thông báo
          </button>
          <button
            onClick={openSettings}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 14px', borderRadius: '11px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#334155', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
          >
            <Settings size={14} /> Cài đặt
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.25fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
      {/* Ma trận phân quyền */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldCheck size={17} color="#2563EB" />
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Ma trận phân quyền giữa các user</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 0.8fr 0.9fr 0.9fr', gap: '8px', padding: '8px 4px', borderBottom: '2px solid #E2E8F0', fontSize: '11.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            <span>Chức năng</span>
            <span style={{ textAlign: 'center' }}>Admin</span>
            <span style={{ textAlign: 'center' }}>PXU</span>
            <span style={{ textAlign: 'center' }}>Thí sinh</span>
          </div>
          {PERMISSION_ROWS.map((row) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.9fr 0.8fr 0.9fr 0.9fr', gap: '8px', padding: '9px 4px', borderBottom: '1px solid #F1F5F9', fontSize: '12.5px', alignItems: 'center' }}>
              <span style={{ color: '#334155', fontWeight: 600, minWidth: 0 }}>{row.label}</span>
              <span style={{ textAlign: 'center', fontWeight: 800, color: row.admin === '—' ? '#CBD5E1' : '#2563EB' }}>{row.admin}</span>
              <span style={{ textAlign: 'center', fontWeight: 800, color: row.pxu === '—' ? '#CBD5E1' : '#059669' }}>{row.pxu}</span>
              <span style={{ textAlign: 'center', fontWeight: 800, color: row.student === '—' ? '#CBD5E1' : '#D97706' }}>{row.student}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#64748B', lineHeight: 1.6 }}>
          Ma trận này được thực thi ngay trong tầng xử lý của hệ thống (không chỉ ẩn nút): vai trò nào gọi thao tác trái quyền sẽ bị chặn và nhận thông báo. Vai trò được xác định bằng tài khoản đăng nhập — muốn dùng vai trò khác, hãy đăng xuất rồi đăng nhập đúng tài khoản.
        </p>
      </div>

      {/* Người dùng hệ thống */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Users size={17} color="#2563EB" />
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Người dùng hệ thống ({SYSTEM_ACCOUNTS.length + registeredUsers.length})</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SYSTEM_ACCOUNTS.map((acc) => (
            <div key={acc.email} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 2px', borderBottom: '1px solid #F1F5F9', minWidth: 0 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '11px', backgroundColor: `${acc.color}1A`, color: acc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900, flexShrink: 0 }}>
                {acc.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.name}</div>
                <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.email}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: acc.color, backgroundColor: `${acc.color}1A`, padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>{acc.role}</span>
            </div>
          ))}
          {registeredUsers.map((acc) => (
            <div key={acc.email} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 2px', borderBottom: '1px solid #F1F5F9', minWidth: 0 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '11px', backgroundColor: '#FFF7ED', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900, flexShrink: 0 }}>
                {acc.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.name}</div>
                <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.email}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', backgroundColor: '#FFF7ED', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>Thí sinh (đăng ký)</span>
            </div>
          ))}
        </div>
        <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#64748B' }}>Gồm 3 tài khoản hệ thống theo vai trò và các tài khoản thí sinh tự đăng ký trên thiết bị này.</p>
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
            <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#334155', fontWeight: 600 }}>Bạn chắc chắn muốn đăng xuất khỏi Trung tâm điều hành?</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={logout} style={{ padding: '10px 18px', borderRadius: '11px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                Đăng xuất
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ padding: '10px 18px', borderRadius: '11px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ---------------------------------------------------------------------
  // Shell
  // ---------------------------------------------------------------------

  const navButton = (item: (typeof NAV_ITEMS)[number], vertical: boolean) => {
    const active = section === item.id;
    const badge = item.id === 'apps' && pendingApps.length > 0 ? pendingApps.length : null;
    return (
      <button
        key={item.id}
        onClick={() => setSection(item.id)}
        style={{
          display: 'flex',
          flexDirection: vertical ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: vertical ? 'flex-start' : 'center',
          gap: vertical ? '11px' : '3px',
          padding: vertical ? '12px 14px' : '6px 1px',
          borderRadius: vertical ? '13px' : '0',
          border: 'none',
          backgroundColor: vertical ? (active ? '#2563EB' : 'transparent') : 'transparent',
          color: vertical ? (active ? '#FFFFFF' : '#C7D3E8') : active ? '#2563EB' : '#64748B',
          fontSize: vertical ? '14px' : '10px',
          fontWeight: active ? 800 : 600,
          cursor: 'pointer',
          flex: vertical ? undefined : 1,
          width: vertical ? '100%' : undefined,
          minWidth: 0,
          position: 'relative',
        }}
      >
        <span style={{ position: 'relative', display: 'flex' }}>
          {item.icon}
          {badge !== null && !vertical && (
            <span style={{ position: 'absolute', top: '-6px', right: '-9px', minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '999px', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '9.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              {badge}
            </span>
          )}
        </span>
        <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
        {vertical && badge !== null && (
          <span style={{ marginLeft: 'auto', minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '999px', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            {badge}
          </span>
        )}
        {!vertical && active && <span style={{ width: '18px', height: '3px', borderRadius: '999px', backgroundColor: '#2563EB' }} />}
      </button>
    );
  };

  const utilityButtons = (dark: boolean) => (
    <>
      <button
        onClick={openNotifications}
        aria-label="Thông báo"
        style={{ width: '38px', height: '38px', borderRadius: '11px', border: dark ? '1px solid rgba(255,255,255,0.22)' : '1px solid #E2E8F0', backgroundColor: dark ? 'rgba(255,255,255,0.08)' : '#FFFFFF', color: dark ? '#FFFFFF' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <Bell size={17} />
      </button>
      <button
        onClick={openSettings}
        aria-label="Cài đặt"
        style={{ width: '38px', height: '38px', borderRadius: '11px', border: dark ? '1px solid rgba(255,255,255,0.22)' : '1px solid #E2E8F0', backgroundColor: dark ? 'rgba(255,255,255,0.08)' : '#FFFFFF', color: dark ? '#FFFFFF' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      >
        <Settings size={17} />
      </button>
    </>
  );

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
        ...(isDesktop ? { height: '100%', overflowY: 'auto' as const } : {}),
      }}
    >
      {section === 'dashboard' && renderDashboard()}
      {section === 'apps' && renderApps()}
      {section === 'bookings' && renderBookings()}
      {section === 'unis' && renderUnis()}
      {section === 'account' && renderAccount()}
    </main>
  );

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#EDF1F7', width: '100%' }}>
        <aside
          style={{
            width: '262px',
            flexShrink: 0,
            background: 'linear-gradient(180deg, #0B1B36 0%, #12295A 100%)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            padding: '22px 16px',
            height: '100%',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '0 6px 20px', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: '18px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '13px', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={23} color="#FFFFFF" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15.5px', fontWeight: 900, lineHeight: 1.2 }}>UniPath Admin</div>
              <div style={{ fontSize: '11.5px', color: '#9DB4DC' }}>Trung tâm điều hành</div>
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{NAV_ITEMS.map((item) => navButton(item, true))}</nav>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>{utilityButtons(true)}</div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '14px', padding: '13px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '11.5px', color: '#9DB4DC', marginBottom: '9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
              <button
                onClick={() => setSection('account')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                <LogOut size={13} /> Tài khoản & đăng xuất
              </button>
            </div>
          </div>
        </aside>
        {content}
      </div>
    );
  }

  // Mobile shell
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EDF1F7', width: '100%', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', overflowX: 'clip' }}>
      <header style={{ background: 'linear-gradient(135deg, #0B1B36 0%, #1D4ED8 100%)', color: '#FFFFFF', padding: '15px 16px 13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={21} color="#FFFFFF" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15.5px', fontWeight: 900, lineHeight: 1.2 }}>UniPath Admin</div>
          <div style={{ fontSize: '11.5px', color: '#B9CCF2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Trung tâm điều hành · {user.name}
          </div>
        </div>
        <span style={{ fontSize: '10.5px', fontWeight: 800, backgroundColor: '#F59E0B', color: '#451A03', padding: '4px 9px', borderRadius: '999px', whiteSpace: 'nowrap', flexShrink: 0 }}>{pendingApps.length} chờ duyệt</span>
        {utilityButtons(true)}
      </header>

      {content}

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
          boxShadow: '0 -4px 24px rgba(0,0,0,0.07)',
          display: 'flex',
          paddingTop: '6px',
          paddingBottom: 'max(10px, env(safe-area-inset-bottom, 12px))',
          boxSizing: 'border-box',
          zIndex: 80,
        }}
      >
        {NAV_ITEMS.map((item) => navButton(item, false))}
      </nav>
    </div>
  );
};
