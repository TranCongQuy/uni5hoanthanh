import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/MockData';
import { Button } from '../common/UI';

export const BookConsultationModal: React.FC = () => {
  const {
    isBookConsultationOpen,
    closeBookConsultation,
    consultationTargetUni,
    profile,
    addBooking,
    showToast,
  } = useApp();

  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [date, setDate] = useState('15/11/2026');
  const [time, setTime] = useState('14:30');
  const [selectedUniCode, setSelectedUniCode] = useState(
    consultationTargetUni ? consultationTargetUni.code : 'PXU'
  );
  const [major, setMajor] = useState(
    consultationTargetUni ? consultationTargetUni.majors[0] : profile.targetMajor
  );
  const [notes, setNotes] = useState('');

  if (!isBookConsultationOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Vui lòng nhập đầy đủ họ tên và số điện thoại!');
      return;
    }

    addBooking({
      name: name.trim(),
      phone: phone.trim(),
      dateTime: `${time} ngày ${date}`,
      uniCode: selectedUniCode,
      major: major || 'Tư vấn tổng quát',
      notes: notes.trim() || 'Học sinh quan tâm tuyển sinh năm 2026',
    });

    closeBookConsultation();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={closeBookConsultation}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#2563EB" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Đặt lịch tư vấn 1-1 chuyên gia
            </h3>
          </div>
          <button
            onClick={closeBookConsultation}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '16px',
              padding: '12px 14px',
              marginBottom: '16px',
              border: '1px solid #DBEAFE',
              fontSize: '13px',
              color: '#1E40AF',
            }}
          >
            Chuyên gia tuyển sinh trường ĐH sẽ liên hệ trực tiếp qua điện thoại hoặc Zalo để hướng dẫn làm hồ sơ xét tuyển sớm và xin học bổng.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Họ và tên thí sinh / phụ huynh *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  padding: '0 14px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số điện thoại liên hệ *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  padding: '0 14px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* University & Major */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Trường đại học muốn tư vấn
              </label>
              <select
                value={selectedUniCode}
                onChange={(e) => setSelectedUniCode(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.code} - {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Ngành quan tâm
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  padding: '0 14px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Date & Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Ngày hẹn
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '14px',
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Khung giờ
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '14px',
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="09:00">09:00 Sáng</option>
                  <option value="10:30">10:30 Sáng</option>
                  <option value="14:30">14:30 Chiều</option>
                  <option value="16:00">16:00 Chiều</option>
                  <option value="19:30">19:30 Tối</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Nội dung hoặc câu hỏi cần giải đáp
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Cần tư vấn học bổng, phương thức xét tuyển học bạ..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '14px',
                  border: '1px solid #CBD5E1',
                  padding: '10px 14px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  resize: 'none',
                }}
              />
            </div>
          </div>

          {/* Fixed Button */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '14px 20px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <Button
              type="submit"
              variant="danger"
              size="L"
              fullWidth
            >
              Xác nhận Đặt lịch tư vấn ngay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
