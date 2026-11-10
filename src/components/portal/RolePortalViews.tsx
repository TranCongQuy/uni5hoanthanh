import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Edit2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UniversityAvatar } from '../common/UI';

// =========================================================================
// 1. ROLE SWITCHER BAR (Cho phép người dùng kiểm thử chuyển vai trò 1-click)
// =========================================================================
export const RoleSwitcherBar: React.FC = () => {
  const { user, switchRole } = useApp();

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1.5px solid #E2E8F0',
        padding: '16px 20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#2563EB" />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Phân Quyền Người Dùng & Chuyển Vai Trò Kiểm Thử (RBAC)
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#64748B' }}>
          Đang đăng nhập: <strong style={{ color: '#2563EB' }}>{user.name}</strong> ({user.role})
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
        }}
      >
        {/* Role 1: Student */}
        <button
          onClick={() => switchRole('student')}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            border: user.role === 'student' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
            backgroundColor: user.role === 'student' ? '#FFFBEB' : '#F8FAFC',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: user.role === 'student' ? '#F59E0B' : '#E2E8F0',
              color: user.role === 'student' ? '#FFFFFF' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: user.role === 'student' ? '#92400E' : '#1E293B' }}>
              Thí sinh (Trần Công Quý)
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Nộp hồ sơ, Holland, AI Matching
            </div>
          </div>
        </button>

        {/* Role 2: System Admin */}
        <button
          onClick={() => switchRole('admin')}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            border: user.role === 'admin' ? '2px solid #2563EB' : '1px solid #E2E8F0',
            backgroundColor: user.role === 'admin' ? '#EFF6FF' : '#F8FAFC',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: user.role === 'admin' ? '#2563EB' : '#E2E8F0',
              color: user.role === 'admin' ? '#FFFFFF' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            👑
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: user.role === 'admin' ? '#1E40AF' : '#1E293B' }}>
              Admin Hệ Thống UniPath
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Toàn quyền duyệt hồ sơ & CSDL
            </div>
          </div>
        </button>

        {/* Role 3: Đại diện ĐH Phú Xuân (PXU) */}
        <button
          onClick={() => switchRole('university_pxu')}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            border: user.role === 'university_pxu' ? '2px solid #059669' : '1px solid #E2E8F0',
            backgroundColor: user.role === 'university_pxu' ? '#ECFDF5' : '#F8FAFC',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: user.role === 'university_pxu' ? '#059669' : '#E2E8F0',
              color: user.role === 'university_pxu' ? '#FFFFFF' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            🏛️
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: user.role === 'university_pxu' ? '#065F46' : '#1E293B' }}>
              ĐH Phú Xuân (PXU)
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Chỉ duyệt hồ sơ thí sinh nộp PXU
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 2. ADMIN PORTAL VIEW (Toàn quyền quản trị hệ thống tuyển sinh toàn quốc)
// =========================================================================
export const AdminPortalView: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    openApplicationDetail,
    universitiesList,
    updateUniversityMetrics,
    logout,
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Tất cả');
  const [selectedUniFilter, setSelectedUniFilter] = useState<string>('Tất cả');
  const [editingUniId, setEditingUniId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number>(20.0);
  const [editTuition, setEditTuition] = useState<number>(15);

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchStatus = selectedStatusFilter === 'Tất cả' || app.status === selectedStatusFilter;
    const matchUni = selectedUniFilter === 'Tất cả' || app.uniCode === selectedUniFilter;
    return matchStatus && matchUni;
  });

  const countTotal = applications.length;
  const countApproved = applications.filter((a) => a.status === 'Đã trúng tuyển').length;
  const countPending = applications.filter((a) => a.status === 'Đang xét duyệt').length;
  const countMissing = applications.filter((a) => a.status === 'Thiếu hồ sơ').length;
  const countRejected = applications.filter((a) => a.status === 'Đã bị hủy' || a.status === 'Đã hủy').length;

  const handleStartEditUni = (uniId: number, currentScore: number, currentTuition: number) => {
    setEditingUniId(uniId);
    setEditScore(currentScore);
    setEditTuition(currentTuition);
  };

  const handleSaveUni = (uniId: number) => {
    updateUniversityMetrics(uniId, editScore, editTuition);
    setEditingUniId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <RoleSwitcherBar />

      {/* Admin Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #1D4ED8 100%)',
          borderRadius: '24px',
          padding: '28px 24px',
          color: '#FFFFFF',
          boxShadow: '0 8px 28px rgba(37,99,235,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11.5px',
                fontWeight: 800,
                marginBottom: '10px',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <span>👑 QUẢN TRỊ VIÊN CẤP CAO (SYSTEM ADMIN)</span>
            </div>
            <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.4px' }}>
              Bảng Điều Khiển Tuyển Sinh Toàn Quốc UniPath 2.0
            </h1>
            <p style={{ margin: 0, fontSize: '13.5px', opacity: 0.9 }}>
              Quản lý toàn bộ {countTotal} hồ sơ xét tuyển từ 30 trường đại học Bắc - Trung - Nam & cấu hình điểm chuẩn CSDL.
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Tổng hồ sơ toàn quốc</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>{countTotal}</div>
          <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '2px' }}>30 trường liên kết</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Đã trúng tuyển</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>{countApproved}</div>
          <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>Đủ điều kiện nhập học</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Đang chờ xét duyệt</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>{countPending}</div>
          <div style={{ fontSize: '11px', color: '#D97706', marginTop: '2px' }}>Cần xử lý sớm</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Thiếu hồ sơ học bạ</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#2563EB', marginTop: '4px' }}>{countMissing}</div>
          <div style={{ fontSize: '11px', color: '#1D4ED8', marginTop: '2px' }}>Cần nộp bổ sung</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Từ chối / Hủy</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#EF4444', marginTop: '4px' }}>{countRejected}</div>
          <div style={{ fontSize: '11px', color: '#DC2626', marginTop: '2px' }}>Không đạt sàn</div>
        </div>
      </div>

      {/* Applications Management Section */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '22px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>
              Danh Sách Xét Duyệt Hồ Sơ Toàn Quốc ({filteredApps.length})
            </h2>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              Quyền hạn Admin: Bạn có thể chuyển đổi trạng thái hồ sơ của bất kỳ trường nào trong 30 trường.
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={selectedUniFilter}
              onChange={(e) => setSelectedUniFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '12.5px',
                fontWeight: 600,
                backgroundColor: '#F8FAFC',
                color: '#1E293B',
              }}
            >
              <option value="Tất cả">Tất cả các trường</option>
              <option value="PXU">ĐH Phú Xuân (PXU)</option>
              <option value="BKA">ĐH Bách Khoa Hà Nội</option>
              <option value="HMU">ĐH Y Hà Nội</option>
              <option value="FTU">ĐH Ngoại Thương</option>
              <option value="HCMUT">Bách Khoa TP.HCM</option>
              <option value="DUT">Bách Khoa Đà Nẵng</option>
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '12.5px',
                fontWeight: 600,
                backgroundColor: '#F8FAFC',
                color: '#1E293B',
              }}
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Đang xét duyệt">Đang xét duyệt</option>
              <option value="Đã trúng tuyển">Đã trúng tuyển</option>
              <option value="Thiếu hồ sơ">Thiếu hồ sơ</option>
              <option value="Đã bị hủy">Đã bị hủy / Từ chối</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredApps.map((app) => (
            <div
              key={app.id}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <UniversityAvatar code={app.uniCode} size={42} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>{app.uniName}</strong>
                      <span style={{ fontSize: '11px', color: '#64748B', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        {app.code}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
                      Ngành: {app.major}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      Thí sinh: <strong>{app.candidateName}</strong> • SĐT: {app.phone} • Điểm xét: <strong style={{ color: '#D97706' }}>{app.score}đ</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor:
                        app.status === 'Đã trúng tuyển'
                          ? '#DCFCE7'
                          : app.status === 'Đang xét duyệt'
                          ? '#FEF3C7'
                          : app.status === 'Thiếu hồ sơ'
                          ? '#DBEAFE'
                          : '#FEE2E2',
                      color: app.statusColor || '#0F172A',
                    }}
                  >
                    {app.status}
                  </span>

                  <button
                    onClick={() => openApplicationDetail(app)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#1E293B',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>

              {/* Action Buttons for Admin */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: '10px',
                }}
              >
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B' }}>
                  Thao tác Admin:
                </span>

                <button
                  onClick={() => updateApplicationStatus(app.id, 'Đã trúng tuyển', 'Hội đồng xét tuyển đã phê duyệt trúng tuyển theo phương thức xét tuyển sớm 2026.')}
                  disabled={app.status === 'Đã trúng tuyển'}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: app.status === 'Đã trúng tuyển' ? '#E2E8F0' : '#10B981',
                    color: app.status === 'Đã trúng tuyển' ? '#94A3B8' : '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: app.status === 'Đã trúng tuyển' ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={13} />
                  Duyệt trúng tuyển
                </button>

                <button
                  onClick={() => updateApplicationStatus(app.id, 'Thiếu hồ sơ', 'Yêu cầu thí sinh nộp bổ sung học bạ THPT có công chứng và bản chụp CCCD 2 mặt trước ngày 30/11.')}
                  disabled={app.status === 'Thiếu hồ sơ'}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: app.status === 'Thiếu hồ sơ' ? '#E2E8F0' : '#2563EB',
                    color: app.status === 'Thiếu hồ sơ' ? '#94A3B8' : '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: app.status === 'Thiếu hồ sơ' ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertCircle size={13} />
                  Yêu cầu bổ sung
                </button>

                <button
                  onClick={() => updateApplicationStatus(app.id, 'Đã bị hủy', 'Hồ sơ bị từ chối do không đủ điểm sàn nhận hồ sơ xét tuyển sớm.')}
                  disabled={app.status === 'Đã bị hủy' || app.status === 'Đã hủy'}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: (app.status === 'Đã bị hủy' || app.status === 'Đã hủy') ? '#E2E8F0' : '#EF4444',
                    color: (app.status === 'Đã bị hủy' || app.status === 'Đã hủy') ? '#94A3B8' : '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: (app.status === 'Đã bị hủy' || app.status === 'Đã hủy') ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <XCircle size={13} />
                  Từ chối hồ sơ
                </button>

                <button
                  onClick={() => updateApplicationStatus(app.id, 'Đang xét duyệt', 'Hồ sơ đang trong quy trình đối soát hồ sơ ban đầu.')}
                  disabled={app.status === 'Đang xét duyệt'}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#64748B',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: app.status === 'Đang xét duyệt' ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Clock size={13} />
                  Đặt lại chờ duyệt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Universities Database Management Section */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '22px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>
            Quản Trị Cơ Sở Dữ Liệu 30 Trường Đại Học (CSDL Chuẩn)
          </h2>
          <div style={{ fontSize: '13px', color: '#64748B' }}>
            Quyền Admin: Cho phép tinh chỉnh Điểm chuẩn THPT dự kiến và Mức học phí sàn áp dụng cho thuật toán AI Matching 2026.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {universitiesList.slice(0, 12).map((uni) => {
            const isEditing = editingUniId === uni.id;
            return (
              <div
                key={uni.id}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  border: isEditing ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: isEditing ? '#EFF6FF' : '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UniversityAvatar code={uni.code} size={30} />
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0F172A' }}>{uni.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Mã: {uni.code} • {uni.region}</div>
                    </div>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => handleStartEditUni(uni.id, uni.score2024, uni.tuitionMin)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#2563EB',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Edit2 size={11} />
                      Sửa
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveUni(uni.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Check size={11} />
                      Lưu
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <div>
                      <label style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>Điểm chuẩn (đ):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editScore}
                        onChange={(e) => setEditScore(parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>Học phí (tr/năm):</label>
                      <input
                        type="number"
                        value={editTuition}
                        onChange={(e) => setEditTuition(parseInt(e.target.value, 10) || 0)}
                        style={{ width: '100%', padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                    <span>Điểm chuẩn: <strong style={{ color: '#D97706' }}>{uni.score2024}đ</strong></span>
                    <span>Học phí: <strong style={{ color: '#059669' }}>{uni.tuitionMin} tr/năm</strong></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. PXU ADMISSIONS PORTAL VIEW (Chỉ xem và duyệt hồ sơ Đại học Phú Xuân)
// =========================================================================
export const PXUPortalView: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    openApplicationDetail,
    logout,
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Tất cả');

  // RBAC RESTRICTION: Only filter applications submitted to PXU
  const pxuApps = applications.filter((app) => app.uniCode === 'PXU');

  const filteredApps = pxuApps.filter((app) => {
    return selectedStatusFilter === 'Tất cả' || app.status === selectedStatusFilter;
  });

  const countTotalPXU = pxuApps.length;
  const countApprovedPXU = pxuApps.filter((a) => a.status === 'Đã trúng tuyển').length;
  const countPendingPXU = pxuApps.filter((a) => a.status === 'Đang xét duyệt').length;
  const countMissingPXU = pxuApps.filter((a) => a.status === 'Thiếu hồ sơ').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <RoleSwitcherBar />

      {/* PXU Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #059669 60%, #10B981 100%)',
          borderRadius: '24px',
          padding: '28px 24px',
          color: '#FFFFFF',
          boxShadow: '0 8px 28px rgba(16,185,129,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                backgroundColor: '#FFFFFF',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }}
            >
              <img
                src="/images/logo_pxu.png"
                alt="ĐH Phú Xuân"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  marginBottom: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <span>🏛️ ĐƠN VỊ ĐÀO TẠO & CHỦ QUẢN — TRƯỜNG ĐẠI HỌC PHÚ XUÂN (PXU)</span>
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.4px' }}>
                Cổng Tuyển Sinh Trực Tuyến ĐH Phú Xuân 2026
              </h1>
              <p style={{ margin: 0, fontSize: '13.5px', opacity: 0.9 }}>
                Hệ sinh thái xét tuyển sớm OJT & Học bổng Tài năng tại thành phố Huế
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* RBAC Security Isolation Notice */}
      <div
        style={{
          backgroundColor: '#ECFDF5',
          borderRadius: '16px',
          border: '1.5px solid #A7F3D0',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#065F46',
        }}
      >
        <ShieldCheck size={24} color="#059669" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
          <strong>Phân quyền bảo mật RBAC:</strong> Bạn đang thao tác với vai trò <strong>Ban Tuyển Sinh Trường Đại học Phú Xuân (PXU)</strong>. Hệ thống tự động kích hoạt bộ lọc bảo mật: Bạn chỉ có quyền xem, xử lý và phê duyệt các hồ sơ nộp vào <strong>Đại học Phú Xuân</strong> ({countTotalPXU} hồ sơ). Dữ liệu hồ sơ của các trường đại học khác trên toàn quốc được bảo mật tuyệt đối theo chính sách bảo mật thông tin.
        </div>
      </div>

      {/* KPI Stats Cards for PXU */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Hồ sơ nộp vào PXU</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#059669', marginTop: '4px' }}>{countTotalPXU}</div>
          <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>Đợt xét tuyển sớm</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Đã duyệt trúng tuyển PXU</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>{countApprovedPXU}</div>
          <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>Đã gửi thông báo trúng tuyển</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Đang chờ xét duyệt</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>{countPendingPXU}</div>
          <div style={{ fontSize: '11px', color: '#D97706', marginTop: '2px' }}>Cần ban tuyển sinh xem</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Cần thí sinh bổ sung</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#2563EB', marginTop: '4px' }}>{countMissingPXU}</div>
          <div style={{ fontSize: '11px', color: '#1D4ED8', marginTop: '2px' }}>Thiếu học bạ / CCCD</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>Chỉ tiêu tuyển sinh 2026</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>1,200</div>
          <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>Cam kết 100% OJT</div>
        </div>
      </div>

      {/* PXU Applications Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '22px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 900, color: '#064E3B' }}>
              Danh Sách Hồ Sơ Đăng Ký Xét Tuyển Vào ĐH Phú Xuân ({filteredApps.length})
            </h2>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              Hội đồng tuyển sinh ĐH Phú Xuân duyệt điều kiện xét tuyển học bạ và cấp học bổng OJT
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['Tất cả', 'Đang xét duyệt', 'Thiếu hồ sơ', 'Đã trúng tuyển'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: selectedStatusFilter === st ? '1px solid #059669' : '1px solid #E2E8F0',
                  backgroundColor: selectedStatusFilter === st ? '#059669' : '#F8FAFC',
                  color: selectedStatusFilter === st ? '#FFFFFF' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredApps.map((app) => (
            <div
              key={app.id}
              style={{
                backgroundColor: '#F0FDF4',
                borderRadius: '16px',
                border: '1px solid #BBF7D0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <UniversityAvatar code="PXU" size={42} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '15px', color: '#064E3B' }}>{app.candidateName}</strong>
                      <span style={{ fontSize: '11px', color: '#047857', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                        {app.code}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                      Ngành đăng ký: {app.major}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                      SĐT: {app.phone} • Email: {app.email} • Điểm xét tuyển: <strong style={{ color: '#D97706' }}>{app.score}đ</strong>
                    </div>
                    {app.notes && (
                      <div style={{ fontSize: '11.5px', color: '#065F46', marginTop: '4px', fontStyle: 'italic' }}>
                        Ghi chú: {app.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor:
                        app.status === 'Đã trúng tuyển'
                          ? '#DCFCE7'
                          : app.status === 'Đang xét duyệt'
                          ? '#FEF3C7'
                          : app.status === 'Thiếu hồ sơ'
                          ? '#DBEAFE'
                          : '#FEE2E2',
                      color: app.statusColor || '#0F172A',
                    }}
                  >
                    {app.status}
                  </span>

                  <button
                    onClick={() => openApplicationDetail(app)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#1E293B',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>

              {/* Action Buttons for PXU Admissions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  borderTop: '1px solid #BBF7D0',
                  paddingTop: '10px',
                }}
              >
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#065F46' }}>
                  Hội đồng tuyển sinh PXU:
                </span>

                <button
                  onClick={() => updateApplicationStatus(app.id, 'Đã trúng tuyển', 'Chúc mừng bạn đã trúng tuyển sớm vào Đại học Phú Xuân (PXU)! Vui lòng làm thủ tục xác nhận nhập học trước 15/07/2026.')}
                  disabled={app.status === 'Đã trúng tuyển'}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: app.status === 'Đã trúng tuyển' ? '#E2E8F0' : '#059669',
                    color: app.status === 'Đã trúng tuyển' ? '#94A3B8' : '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: app.status === 'Đã trúng tuyển' ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={13} />
                  Duyệt trúng tuyển PXU
                </button>

                <button
                  onClick={() => updateApplicationStatus(app.id, 'Thiếu hồ sơ', 'Ban tuyển sinh ĐH Phú Xuân yêu cầu bổ sung học bạ THPT kỳ 1 lớp 12 và CCCD chụp rõ nét.')}
                  disabled={app.status === 'Thiếu hồ sơ'}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: app.status === 'Thiếu hồ sơ' ? '#E2E8F0' : '#2563EB',
                    color: app.status === 'Thiếu hồ sơ' ? '#94A3B8' : '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: app.status === 'Thiếu hồ sơ' ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertCircle size={13} />
                  Yêu cầu nộp bổ sung
                </button>

                <button
                  onClick={() => updateApplicationStatus(app.id, 'Đã bị hủy', 'Hồ sơ chưa đạt ngưỡng điểm sàn nhận hồ sơ của Trường Đại học Phú Xuân.')}
                  disabled={app.status === 'Đã bị hủy' || app.status === 'Đã hủy'}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: (app.status === 'Đã bị hủy' || app.status === 'Đã hủy') ? '#E2E8F0' : '#EF4444',
                    color: (app.status === 'Đã bị hủy' || app.status === 'Đã hủy') ? '#94A3B8' : '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: (app.status === 'Đã bị hủy' || app.status === 'Đã hủy') ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <XCircle size={13} />
                  Từ chối hồ sơ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PXU Programs & Academic Excellence */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '22px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 900, color: '#064E3B' }}>
          Ngành Đào Tạo Trọng Điểm 2026 — Trường Đại Học Phú Xuân
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#064E3B' }}>💻 Công nghệ Thông tin (AI & Data)</div>
            <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px' }}>Mã ngành: 7480201 • Điểm sàn: 18.0đ</div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>Thực tập OJT kỳ 6 tại các tập đoàn công nghệ lớn.</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#064E3B' }}>🎨 Thiết kế Đồ họa & Kỹ thuật số</div>
            <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px' }}>Mã ngành: 7210403 • Điểm sàn: 18.0đ</div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>Trang bị phòng Lab iMac hiện đại, đồ án thực tế.</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#064E3B' }}>📈 Quản trị Kinh doanh & Marketing Số</div>
            <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px' }}>Mã ngành: 7340101 • Điểm sàn: 18.0đ</div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>Mô hình đào tạo gắn liền dự án doanh nghiệp thực tế.</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#064E3B' }}>🌏 Ngôn ngữ Anh & Ngôn ngữ Trung Quốc</div>
            <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px' }}>Mã ngành: 7220201 • Điểm sàn: 18.0đ</div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>Cơ hội du học trao đổi và làm việc tại nước ngoài.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
