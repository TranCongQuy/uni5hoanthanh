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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ApplicationRecord, ApplicationStatus } from '../../types';
import { UniversityAvatar } from '../common/UI';

// =========================================================================
// ADMIN APP — Trung tâm điều hành UniPath (khung giao diện riêng cho Admin)
// Điều hướng riêng: Tổng quan / Hồ sơ / Trường / Tài khoản.
// Không dùng chung khung 5 tab của thí sinh.
// =========================================================================

type AdminSection = 'dashboard' | 'apps' | 'unis' | 'account';

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
  { id: 'apps', label: 'Hồ sơ', icon: <FileText size={20} /> },
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
    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor(status) }} />
    {status}
  </span>
);

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
  padding: '20px',
};

export const AdminApp: React.FC = () => {
  const {
    user,
    profile,
    applications,
    universitiesList,
    updateUniversityMetrics,
    updateApplicationStatus,
    processingLog,
    openApplicationDetail,
    logout,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // --- Apps filters ---
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState<string>('Tất cả');
  const [appUni, setAppUni] = useState<string>('Tất cả');

  // --- Universities filters / edit ---
  const [uniSearch, setUniSearch] = useState('');
  const [uniRegion, setUniRegion] = useState<string>('Tất cả');
  const [editingUniId, setEditingUniId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number>(20);
  const [editTuition, setEditTuition] = useState<number>(15);

  // --- Derived data (toàn bộ tính từ dữ liệu thật trong AppContext) ---
  const totalApps = applications.length;
  const countByStatus = (s: ApplicationStatus) => applications.filter((a) => a.status === s).length;
  const pendingApps = applications.filter((a) => a.status === 'Đang xét duyệt');
  const uniCodesInApps = Array.from(new Set(applications.map((a) => a.uniCode)));
  const uniCounts = uniCodesInApps
    .map((code) => ({
      code,
      name: applications.find((a) => a.uniCode === code)?.uniName || code,
      count: applications.filter((a) => a.uniCode === code).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxUniCount = Math.max(1, ...uniCounts.map((u) => u.count));

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

  const selectedApp: ApplicationRecord | null =
    applications.find((a) => a.id === selectedAppId) || pendingApps[0] || applications[0] || null;

  const filteredUnis = universitiesList.filter((u) => {
    const matchRegion = uniRegion === 'Tất cả' || u.region === uniRegion;
    const kw = uniSearch.trim().toLowerCase();
    const matchKw = !kw || u.name.toLowerCase().includes(kw) || u.code.toLowerCase().includes(kw);
    return matchRegion && matchKw;
  });

  const goHandleApp = (app: ApplicationRecord) => {
    setSelectedAppId(app.id);
    setSection('apps');
  };

  const handleSaveUni = (id: number) => {
    updateUniversityMetrics(id, editScore, editTuition);
    setEditingUniId(null);
  };

  // ---------------------------------------------------------------------
  // Sub-views
  // ---------------------------------------------------------------------

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>
          Tổng quan điều hành
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          Hệ thống tuyển sinh UniPath 2.0 · {new Date().toLocaleDateString('vi-VN')} · Dữ liệu toàn quốc {universitiesList.length} trường
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Tổng hồ sơ', value: totalApps, icon: <FileText size={20} color="#2563EB" />, bg: '#EFF6FF' },
          { label: 'Đang xét duyệt', value: countByStatus('Đang xét duyệt'), icon: <Clock size={20} color="#D97706" />, bg: '#FFFBEB' },
          { label: 'Thiếu hồ sơ', value: countByStatus('Thiếu hồ sơ'), icon: <AlertCircle size={20} color="#2563EB" />, bg: '#EFF6FF' },
          { label: 'Đã trúng tuyển', value: countByStatus('Đã trúng tuyển'), icon: <CheckCircle2 size={20} color="#059669" />, bg: '#ECFDF5' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ ...cardStyle, padding: '16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: kpi.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}
            >
              {kpi.icon}
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>{kpi.value}</div>
            <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '12.5px', color: '#64748B' }}>
        Hồ sơ hợp lệ: <strong style={{ color: '#0F172A' }}>{countByStatus('Hồ sơ hợp lệ')}</strong>
        {'  ·  '}Đã hủy (thí sinh tự hủy): <strong style={{ color: '#0F172A' }}>{countByStatus('Đã hủy')}</strong>
        {'  ·  '}Đã bị hủy (từ chối): <strong style={{ color: '#0F172A' }}>{countByStatus('Đã bị hủy')}</strong>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1.35fr 1fr' : '1fr',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {/* Hàng đợi cần xử lý */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Hàng đợi cần xử lý</h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#D97706',
                backgroundColor: '#FFFBEB',
                padding: '3px 10px',
                borderRadius: '999px',
              }}
            >
              {pendingApps.length} hồ sơ chờ duyệt
            </span>
          </div>
          {pendingApps.length === 0 ? (
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>Không có hồ sơ nào đang chờ duyệt. 🎉</p>
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
                    borderBottom: '1px solid #F1F5F9',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
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
                  <ChevronRight size={16} color="#94A3B8" />
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setSection('apps')}
            style={{
              marginTop: '14px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Xem tất cả hồ sơ
          </button>
        </div>

        {/* Phân bổ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Phân bổ theo trạng thái</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ALL_STATUSES.map((s) => {
                const c = countByStatus(s);
                const pct = totalApps > 0 ? Math.round((c / totalApps) * 100) : 0;
                return (
                  <div key={s}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#334155', fontWeight: 600 }}>{s}</span>
                      <span style={{ color: '#64748B', fontWeight: 700 }}>
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
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Hồ sơ theo trường</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {uniCounts.map((u) => (
                <div key={u.code}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: 600 }}>
                      {u.code} — {u.name}
                    </span>
                    <span style={{ color: '#64748B', fontWeight: 700 }}>{u.count}</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.round((u.count / maxUniCount) * 100)}%`,
                        backgroundColor: '#2563EB',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nhật ký xử lý hồ sơ (luồng xử lý của Admin & các trường) */}
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Nhật ký xử lý hồ sơ</h2>
        <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748B' }}>
          Mỗi quyết định duyệt / bổ sung / từ chối đều được ghi lại: ai xử lý, hồ sơ nào, đổi trạng thái ra sao.
        </p>
        {processingLog.length === 0 ? (
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>Chưa có lượt xử lý nào trong phiên này. Hãy vào mục Hồ sơ và xử lý một hồ sơ đang chờ duyệt.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {processingLog.slice(0, 8).map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 2px',
                  borderBottom: '1px solid #F1F5F9',
                  flexWrap: 'wrap',
                }}
              >
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
      <div>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Quản lý hồ sơ xét tuyển</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          {filteredApps.length}/{totalApps} hồ sơ · Chọn một hồ sơ ở danh sách để xử lý ở khung bên {isDesktop ? 'phải' : 'dưới'}
        </p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '0 14px',
            height: '46px',
          }}
        >
          <Search size={18} color="#94A3B8" />
          <input
            value={appSearch}
            onChange={(e) => setAppSearch(e.target.value)}
            placeholder="Tìm theo tên thí sinh, mã hồ sơ, ngành, trường..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13.5px', color: '#0F172A', backgroundColor: 'transparent', minWidth: 0 }}
          />
          {appSearch && (
            <button onClick={() => setAppSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <X size={16} color="#94A3B8" />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Tất cả', ...ALL_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setAppStatus(s)}
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
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Trường:</span>
          {['Tất cả', ...uniCodesInApps].map((code) => (
            <button
              key={code}
              onClick={() => setAppUni(code)}
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

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.55fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredApps.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
              Không có hồ sơ nào khớp bộ lọc hiện tại.
            </div>
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
                  border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: isSelected ? '#F8FBFF' : '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <UniversityAvatar code={app.uniCode} size={34} />
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
                <div style={{ fontSize: '12.5px', color: '#334155' }}>
                  {app.major} — {app.uniName}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Điểm xét tuyển: <strong style={{ color: '#2563EB' }}>{app.score}</strong> · {app.phone} · {app.email}
                </div>
              </button>
            );
          })}
        </div>

        {/* Inspector / xử lý */}
        {selectedApp && (
          <div style={{ ...cardStyle, position: isDesktop ? 'sticky' : 'static', top: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.6px', color: '#2563EB', textTransform: 'uppercase', marginBottom: '8px' }}>
              Xử lý hồ sơ
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <UniversityAvatar code={selectedApp.uniCode} size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>{selectedApp.candidateName}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{selectedApp.code}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#334155', marginBottom: '12px' }}>
              <div>Trường: <strong>{selectedApp.uniName} ({selectedApp.uniCode})</strong></div>
              <div>Ngành: <strong>{selectedApp.major}</strong></div>
              <div>Điểm xét tuyển: <strong style={{ color: '#2563EB' }}>{selectedApp.score}</strong></div>
              <div>Liên hệ: {selectedApp.phone} · {selectedApp.email}</div>
              <div>Nộp lúc: {selectedApp.submittedAt}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Trạng thái: <StatusChip status={selectedApp.status} />
              </div>
              {selectedApp.notes && (
                <div style={{ fontSize: '12.5px', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '10px', lineHeight: 1.5 }}>
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
                style={{
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Xem biên nhận chi tiết
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderUnis = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>
          Cơ sở dữ liệu trường đại học
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
          Đủ {universitiesList.length} trường · Đang hiện {filteredUnis.length} · Sửa điểm chuẩn & học phí sàn của từng trường
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '0 14px',
            height: '44px',
            flex: isDesktop ? '0 1 340px' : '1 1 100%',
          }}
        >
          <Search size={17} color="#94A3B8" />
          <input
            value={uniSearch}
            onChange={(e) => setUniSearch(e.target.value)}
            placeholder="Tìm tên trường hoặc mã trường..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13.5px', backgroundColor: 'transparent', minWidth: 0 }}
          />
        </div>
        {['Tất cả', 'Bắc', 'Trung', 'Nam'].map((r) => (
          <button
            key={r}
            onClick={() => setUniRegion(r)}
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              border: uniRegion === r ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
              backgroundColor: uniRegion === r ? '#EFF6FF' : '#FFFFFF',
              color: uniRegion === r ? '#1D4ED8' : '#475569',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {r === 'Tất cả' ? 'Tất cả' : `Miền ${r}`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
        {filteredUnis.map((uni) => {
          const isEditing = editingUniId === uni.id;
          return (
            <div key={uni.id} style={{ ...cardStyle, padding: '16px', border: isEditing ? '2px solid #2563EB' : '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <UniversityAvatar code={uni.code} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {uni.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {uni.code} · Miền {uni.region} · {uni.loc}
                  </div>
                </div>
              </div>
              {!isEditing ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12.5px', color: '#334155', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 10px' }}>
                      Điểm chuẩn 2024<br />
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{uni.score2024}</strong>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 10px' }}>
                      Học phí từ<br />
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{uni.tuitionMin}tr</strong>
                      <span style={{ color: '#64748B' }}> /năm</span>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 10px' }}>
                      Việc làm<br />
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{uni.employmentRate}%</strong>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 10px' }}>
                      Đánh giá<br />
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{uni.rating} ★</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingUniId(uni.id);
                      setEditScore(uni.score2024);
                      setEditTuition(uni.tuitionMin);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 13px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#2563EB',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
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
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Check size={15} /> Lưu
                    </button>
                    <button
                      onClick={() => setEditingUniId(null)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#475569',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
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
      {filteredUnis.length === 0 && (
        <div style={{ ...cardStyle, textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>Không tìm thấy trường nào khớp bộ lọc.</div>
      )}
    </div>
  );

  const renderAccount = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
      <h1 style={{ margin: 0, fontSize: isDesktop ? '26px' : '22px', fontWeight: 900, color: '#0F172A' }}>Tài khoản quản trị</h1>
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
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
          Vai trò hiện tại: <strong style={{ color: '#2563EB' }}>Admin Hệ Thống (admin)</strong> — toàn quyền duyệt hồ sơ của {universitiesList.length} trường và quản trị CSDL điểm chuẩn, học phí. Hồ sơ cá nhân: {profile.name} · {profile.school}.
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShieldCheck size={17} color="#2563EB" />
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Quyền của phiên đăng nhập này</h2>
        </div>
        <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
          Vai trò được xác định bằng <strong>tài khoản đăng nhập</strong>, không tự đổi giữa chừng:
          <ul style={{ margin: '8px 0', paddingLeft: '18px' }}>
            <li><strong>Admin:</strong> xử lý hồ sơ của cả {universitiesList.length} trường, sửa CSDL điểm chuẩn/học phí, xem nhật ký xử lý</li>
            <li><strong>ĐH Phú Xuân:</strong> chỉ xử lý hồ sơ nộp vào PXU — hệ thống tự chặn nếu xử lý hồ sơ trường khác</li>
            <li><strong>Thí sinh:</strong> chỉ nộp và tự hủy hồ sơ của chính mình, không xử lý được hồ sơ</li>
          </ul>
          Muốn dùng vai trò khác: đăng xuất ở dưới rồi đăng nhập bằng tài khoản của vai trò đó
          (Thí sinh: quy@unipath.vn · Admin: admin@unipath.vn · PXU: tuyensinh@pxu.edu.vn — mật khẩu xem trong README dự án).
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
            <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#334155', fontWeight: 600 }}>Bạn chắc chắn muốn đăng xuất khỏi Trung tâm điều hành?</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={logout}
                style={{ padding: '10px 18px', borderRadius: '11px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
              >
                Đăng xuất
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{ padding: '10px 18px', borderRadius: '11px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
              >
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
          padding: vertical ? '12px 14px' : '6px 2px',
          borderRadius: vertical ? '13px' : '0',
          border: 'none',
          backgroundColor: vertical ? (active ? '#2563EB' : 'transparent') : 'transparent',
          color: vertical ? (active ? '#FFFFFF' : '#C7D3E8') : active ? '#2563EB' : '#64748B',
          fontSize: vertical ? '14px' : '10.5px',
          fontWeight: active ? 800 : 600,
          cursor: 'pointer',
          flex: vertical ? undefined : 1,
          width: vertical ? '100%' : undefined,
        }}
      >
        {item.icon}
        {item.label}
        {!vertical && active && <span style={{ width: '18px', height: '3px', borderRadius: '999px', backgroundColor: '#2563EB' }} />}
      </button>
    );
  };

  const content = (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        width: '100%',
        maxWidth: isDesktop ? '1180px' : undefined,
        margin: '0 auto',
        padding: isDesktop ? '28px' : '18px 16px 96px',
        boxSizing: 'border-box',
      }}
    >
      {section === 'dashboard' && renderDashboard()}
      {section === 'apps' && renderApps()}
      {section === 'unis' && renderUnis()}
      {section === 'account' && renderAccount()}
    </main>
  );

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#EDF1F7', width: '100%' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '262px',
            flexShrink: 0,
            background: 'linear-gradient(180deg, #0B1B36 0%, #12295A 100%)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            padding: '22px 16px',
            position: 'sticky',
            top: 0,
            height: '100vh',
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
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {NAV_ITEMS.map((item) => navButton(item, true))}
          </nav>
          <div style={{ marginTop: 'auto', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '14px', padding: '13px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: '11.5px', color: '#9DB4DC', marginBottom: '9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            <button
              onClick={() => setSection('account')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              <LogOut size={13} /> Tài khoản & đăng xuất
            </button>
          </div>
        </aside>
        {content}
      </div>
    );
  }

  // Mobile shell
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EDF1F7', width: '100%', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #0B1B36 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          padding: '16px 18px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
        }}
      >
        <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={21} color="#FFFFFF" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15.5px', fontWeight: 900, lineHeight: 1.2 }}>UniPath Admin</div>
          <div style={{ fontSize: '11.5px', color: '#B9CCF2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Trung tâm điều hành · {user.name}
          </div>
        </div>
        <span style={{ fontSize: '10.5px', fontWeight: 800, backgroundColor: '#F59E0B', color: '#451A03', padding: '4px 9px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
          {pendingApps.length} chờ duyệt
        </span>
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
