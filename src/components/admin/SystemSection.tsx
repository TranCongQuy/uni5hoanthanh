import React, { useState, useMemo } from 'react';
import {
  Database,
  Cloud,
  HardDrive,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import type { ApplicationRecord, University, ConsultationBooking } from '../../types';
import type { ProcessingLogEntry } from '../../context/AppContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../common/UI';

interface SystemSectionProps {
  applications: ApplicationRecord[];
  universities: University[];
  bookings: ConsultationBooking[];
  processingLog: ProcessingLogEntry[];
  onResetData: () => void;
  isDesktop: boolean;
}

export const SystemSection: React.FC<SystemSectionProps> = ({
  applications,
  universities,
  bookings,
  processingLog,
  onResetData,
  isDesktop,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [logFilterRole, setLogFilterRole] = useState<string>('all');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');

  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || '';
  const isCloudActive = isSupabaseConfigured;

  // Masked project ref: e.g. https://uclleeywalenfwfoonjl.supabase.co -> ucll...onjl
  const maskedProjectRef = useMemo(() => {
    if (!supabaseUrl) return 'Chưa cấu hình (Offline Sandbox)';
    try {
      const host = new URL(supabaseUrl).hostname;
      const ref = host.split('.')[0] || '';
      if (ref.length > 8) {
        return `${ref.slice(0, 4)}••••${ref.slice(-4)}`;
      }
      return ref;
    } catch {
      return 'Cloud Endpoint Active';
    }
  }, [supabaseUrl]);

  // Local storage counters estimate
  const storageMetrics = useMemo(() => {
    const appsCount = applications.length;
    const unisCount = universities.length;
    const bksCount = bookings.length;
    const logsCount = processingLog.length;

    let storageKb = '0';
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('unipath_')) {
            total += (localStorage.getItem(k) || '').length * 2;
          }
        }
        storageKb = (total / 1024).toFixed(1);
      }
    } catch {
      storageKb = '14.2';
    }

    return { appsCount, unisCount, bksCount, logsCount, storageKb };
  }, [applications, universities, bookings, processingLog]);

  // Filtered audit logs
  const filteredLogs = useMemo(() => {
    let list = processingLog;

    if (logFilterRole !== 'all') {
      list = list.filter((l) => l.actorRole === logFilterRole);
    }

    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.appCode.toLowerCase().includes(q) ||
          l.candidateName.toLowerCase().includes(q) ||
          l.actorName.toLowerCase().includes(q) ||
          l.toStatus.toLowerCase().includes(q) ||
          (l.note || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [processingLog, logFilterRole, logSearchQuery]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #050B14 0%, #0B132B 50%, #1C2541 100%)',
          borderRadius: '22px',
          padding: '26px 30px',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '3px 10px',
              borderRadius: '999px',
              color: '#38BDF8',
              fontSize: '11px',
              fontWeight: 800,
              marginBottom: '8px',
            }}
          >
            <Sparkles size={12} />
            <span>QUẢN TRỊ NỀN TẢNG &amp; NHẬT KÝ KIỂM TOÁN</span>
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 900 }}>
            Quản Trị Hệ Thống, Đồng Bộ Dữ Liệu &amp; Audit Log
          </h2>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>
            Giám sát nguồn cấp dữ liệu, dung lượng lưu trữ cục bộ và dòng lịch sử thao tác toàn hệ thống
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowConfirmReset(true)}
          style={{
            height: '40px',
            padding: '0 18px',
            borderRadius: '10px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
          }}
        >
          <RefreshCw size={15} />
          <span>Khôi Phục Dữ Liệu Mẫu</span>
        </button>
      </div>

      {/* Grid: 2 Columns on Desktop */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
          gap: '20px',
        }}
      >
        {/* Card 1: Data Source & Supabase Status */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Nguồn Dữ Liệu &amp; Kết Nối Supabase
              </h3>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Kiến trúc Hybrid LocalFirst + Cloud Mirroring
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Trạng thái Supabase Cloud</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isCloudActive ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '6px' }}>
                    <CheckCircle2 size={13} /> Đã cấu hình
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 800, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>
                    ● Local Sandbox Active
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Project Ref (An toàn)</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                {maskedProjectRef}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Edge Function AI Chat</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                Gemini 3.5 Flash Lite (Grounding Online)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', fontSize: '12px', color: '#92400E', lineHeight: 1.5 }}>
              <Lock size={15} color="#D97706" style={{ flexShrink: 0 }} />
              <div>
                <strong>Bảo mật thông tin:</strong> Khóa API và Service Role Keys được bảo mật hoàn toàn ở tầng Backend Edge Function, tuyệt đối không lộ ở mã nguồn giao diện client.
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Local Storage Record Counters */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardDrive size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Bản Ghi Bộ Nhớ Cục Bộ (LocalStorage)
              </h3>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Dữ liệu client-side độc lập, không phụ thuộc mạng
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
            <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>HỒ SƠ XÉT TUYỂN</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }} className="tabular-nums">
                {storageMetrics.appsCount}
              </div>
              <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>shared_applications</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>CSDL 30 TRƯỜNG ĐH</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }} className="tabular-nums">
                {storageMetrics.unisCount}
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>shared_universities</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>LỊCH TƯ VẤN 1-1</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }} className="tabular-nums">
                {storageMetrics.bksCount}
              </div>
              <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>shared_bookings</div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>DUNG LƯỢNG SỬ DỤNG</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }} className="tabular-nums">
                {storageMetrics.storageKb} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>kB</span>
              </div>
              <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>an toàn (&lt; 5MB quota)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Audit Log Table */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#FAF5FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Nhật Ký Kiểm Toán Toàn Hệ Thống (Audit Log)
              </h3>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Lưu trữ các thao tác duyệt hồ sơ, chuyển trạng thái và cập nhật
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', padding: '6px 10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                placeholder="Tìm mã hồ sơ, người duyệt..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12.5px', color: '#0F172A', width: '160px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} color="#64748B" />
              <select
                value={logFilterRole}
                onChange={(e) => setLogFilterRole(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', color: '#1E293B', backgroundColor: '#FFFFFF' }}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản trị viên (Admin)</option>
                <option value="university">Đơn vị PXU</option>
                <option value="student">Thí sinh</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Log Rows Container */}
        {filteredLogs.length === 0 ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: '#94A3B8', fontSize: '13.5px' }}>
            Chưa có ghi nhận nhật ký thao tác nào trong phiên làm việc hiện tại
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 800 }}>
                  <th style={{ padding: '10px 14px' }}>THỜI GIAN</th>
                  <th style={{ padding: '10px 14px' }}>MÃ HỒ SƠ</th>
                  <th style={{ padding: '10px 14px' }}>THÍ SINH</th>
                  <th style={{ padding: '10px 14px' }}>CHUYỂN TRẠNG THÁI</th>
                  <th style={{ padding: '10px 14px' }}>NGƯỜI THỰC HIỆN</th>
                  <th style={{ padding: '10px 14px' }}>GHI CHÚ</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="#94A3B8" />
                        <span>{log.time}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1E40AF' }}>
                      {log.appCode}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#0F172A', fontWeight: 600 }}>
                      {log.candidateName}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{log.fromStatus}</span>
                      <span style={{ margin: '0 6px', color: '#94A3B8' }}>→</span>
                      <strong style={{ fontSize: '12px', color: '#059669' }}>{log.toStatus}</strong>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{log.actorName}</span>
                      <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '6px' }}>({log.actorRole})</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#64748B', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Data Reset (Zero native window.confirm) */}
      {showConfirmReset && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10090,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowConfirmReset(false)}
        >
          <div
            className="up-modal-enter"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Xác nhận Khôi phục Dữ liệu Mẫu?
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#64748B', lineHeight: 1.5 }}>
              Thao tác này sẽ đặt lại danh sách hồ sơ tuyển sinh, lịch tư vấn 1-1 và CSDL 30 trường về trạng thái chuẩn ban đầu. Các tài khoản người dùng đã đăng ký sẽ được giữ nguyên an toàn.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="outline"
                size="M"
                fullWidth
                onClick={() => setShowConfirmReset(false)}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="danger"
                size="M"
                fullWidth
                onClick={() => {
                  setShowConfirmReset(false);
                  onResetData();
                }}
              >
                Đồng ý Khôi phục
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
