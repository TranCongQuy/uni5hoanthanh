import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Phone,
  User,
  Video,
  CheckCircle2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, UniversityAvatar } from '../common/UI';
import {
  getLocalOffsetDateISO,
  getLocalTodayISO,
  isPastDateISO,
  validateVietnamPhone,
} from '../../utils/validation';

const TIME_SLOTS = [
  '09:00 - 09:30 (Sáng)',
  '14:30 - 15:00 (Chiều)',
  '16:00 - 16:30 (Chiều)',
  '19:30 - 20:00 (Tối)',
];

const CHANNELS = [
  'Google Meet 1-1',
  'Gọi điện / Zalo',
  'Tư vấn trực tiếp tại cơ sở',
];

export const BookConsultationModal: React.FC = () => {
  const {
    isBookConsultationOpen,
    closeBookConsultation,
    consultationTargetUni,
    universitiesList,
    profile,
    user,
    addBooking,
    showToast,
    setActiveTab,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';

  const [selectedUniId, setSelectedUniId] = useState<number>(11);
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [candidateName, setCandidateName] = useState<string>(profile.name);
  const [phone, setPhone] = useState<string>(profile.phone);
  const [dateInput, setDateInput] = useState<string>(() => getLocalOffsetDateISO(1));
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [channel, setChannel] = useState<string>(CHANNELS[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const selectedUni =
    universitiesList.find((u) => u.id === selectedUniId) ||
    consultationTargetUni ||
    universitiesList[0];

  useEffect(() => {
    if (isBookConsultationOpen) {
      const target =
        consultationTargetUni ||
        universitiesList.find((u) => u.code === 'PXU') ||
        universitiesList[0];
      if (target) {
        setSelectedUniId(target.id);
        setSelectedMajor(target.majors[0] || 'Cần định hướng chọn ngành phù hợp');
      }
      setCandidateName(profile.name || user.name || '');
      setPhone(profile.phone || '');
      setDateInput(getLocalOffsetDateISO(1));
      setNotes('');
      setIsSubmitted(false);
    }
  }, [isBookConsultationOpen, consultationTargetUni, universitiesList, profile.name, profile.phone, user.name]);

  if (!isBookConsultationOpen || !selectedUni) return null;

  const todayISO = getLocalTodayISO();

  const handleUniChange = (newId: number) => {
    setSelectedUniId(newId);
    const found = universitiesList.find((u) => u.id === newId);
    if (found) {
      setSelectedMajor(found.majors[0] || 'Cần định hướng chọn ngành phù hợp');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateName.trim().length < 2) {
      showToast('Vui lòng nhập họ và tên thí sinh (tối thiểu 2 ký tự)!');
      return;
    }
    const phoneCheck = validateVietnamPhone(phone);
    if (!phoneCheck.ok) {
      showToast(phoneCheck.error || 'Vui lòng nhập số điện thoại Việt Nam hợp lệ!');
      return;
    }
    if (!dateInput || isPastDateISO(dateInput)) {
      showToast('Ngày hẹn tư vấn không được nằm trong quá khứ! Vui lòng chọn từ hôm nay trở đi.');
      return;
    }

    const parts = dateInput.split('-');
    const formattedDate =
      parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateInput;
    const shortSlot = timeSlot.replace(/\s*\(.*\)/, '');

    const ok = addBooking({
      name: candidateName.trim(),
      email: user.email,
      phone: phone.trim(),
      dateTime: `${shortSlot} - ${formattedDate}`,
      scheduledDateISO: dateInput,
      timeSlot: shortSlot,
      channel,
      uniId: selectedUni.id,
      uniName: selectedUni.name,
      uniCode: selectedUni.code,
      major: selectedMajor || selectedUni.majors[0] || 'Tư vấn định hướng ngành',
      notes:
        notes.trim() ||
        `Đăng ký tư vấn 1-1 (${channel}) về điều kiện xét tuyển sớm và chính sách học bổng năm 2026.`,
    });

    if (ok) {
      setIsSubmitted(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1250,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? '24px' : '0',
        boxSizing: 'border-box',
      }}
      onClick={closeBookConsultation}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isDesktop ? '640px' : '520px',
          maxHeight: isDesktop ? 'min(88vh, 780px)' : 'calc(100dvh - 48px)',
          backgroundColor: '#FFFFFF',
          borderRadius: isDesktop ? '24px' : '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDesktop
            ? '0 25px 60px rgba(0,0,0,0.35)'
            : '0 -10px 30px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Calendar size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Đặt lịch tư vấn tuyển sinh 1-1
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Kết nối trực tiếp cùng Cán bộ Tuyển sinh nhà trường
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeBookConsultation}
            aria-label="Đóng đặt lịch tư vấn"
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
              color: '#475569',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        {isSubmitted ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', overflowY: 'auto' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: '#D1FAE5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>
              Đã gửi lịch hẹn tư vấn 1-1!
            </h4>
            <p style={{ margin: '0 0 18px', fontSize: '13.5px', color: '#475569', lineHeight: 1.55 }}>
              Ban Tuyển sinh <strong>{selectedUni.name} ({selectedUni.code})</strong> đã nhận được yêu cầu tư vấn ngành{' '}
              <strong style={{ color: '#2563EB' }}>{selectedMajor}</strong> của bạn và sẽ liên hệ xác nhận đúng khung giờ đã chọn.
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
                textAlign: 'left',
                fontSize: '13px',
                color: '#334155',
                marginBottom: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div>
                <strong>Hình thức:</strong> {channel}
              </div>
              <div>
                <strong>Khung giờ:</strong> {timeSlot} · Ngày {dateInput.split('-').reverse().join('/')}
              </div>
              <div>
                <strong>Số điện thoại nhận liên hệ:</strong> {phone}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="M"
                style={{ flex: 1, minWidth: '140px' }}
                onClick={closeBookConsultation}
              >
                Đóng cửa sổ
              </Button>
              <Button
                variant="primary"
                size="M"
                style={{ flex: 1, minWidth: '160px' }}
                onClick={() => {
                  closeBookConsultation();
                  setActiveTab(4);
                }}
              >
                Xem lịch hẹn của tôi
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Selected University Banner */}
            <div
              style={{
                backgroundColor: selectedUni.code === 'PXU' ? '#ECFDF5' : '#EFF6FF',
                border: `1.5px solid ${selectedUni.code === 'PXU' ? '#6EE7B7' : '#BFDBFE'}`,
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <UniversityAvatar code={selectedUni.code} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {selectedUni.name}
                  </span>
                  {selectedUni.code === 'PXU' && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        padding: '2px 7px',
                        borderRadius: '999px',
                      }}
                    >
                      Đối tác Chiến lược OJT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  {selectedUni.loc} · Học phí {selectedUni.tuitionMin}–{selectedUni.tuitionMax} tr/năm
                </div>
              </div>
            </div>

            {/* Choose University & Major */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
                gap: '12px',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Trường đại học đăng ký tư vấn
                </label>
                <select
                  value={selectedUniId}
                  onChange={(e) => handleUniChange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                >
                  {universitiesList.map((u) => (
                    <option key={u.id} value={u.id}>
                      [{u.code}] {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Ngành học quan tâm
                </label>
                <select
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                >
                  {selectedUni.majors.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="Cần định hướng chọn ngành phù hợp">
                    Cần định hướng chọn ngành phù hợp
                  </option>
                </select>
              </div>
            </div>

            {/* Candidate Name & Phone */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
                gap: '12px',
              }}
            >
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <User size={14} color="#2563EB" /> Họ và tên thí sinh *
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Nhập họ và tên..."
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '13.5px',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <Phone size={14} color="#2563EB" /> Số điện thoại / Zalo *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0912 345 678"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '13.5px',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
                gap: '12px',
              }}
            >
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <Calendar size={14} color="#059669" /> Ngày hẹn tư vấn
                </label>
                <input
                  type="date"
                  min={todayISO}
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '13.5px',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  <Clock size={14} color="#059669" /> Khung giờ mong muốn
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Channel Chips */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                <Video size={14} color="#2563EB" /> Hình thức kết nối
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CHANNELS.map((ch) => {
                  const active = channel === ch;
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setChannel(ch)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '11px',
                        border: active ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                        backgroundColor: active ? '#EFF6FF' : '#F8FAFC',
                        color: active ? '#1D4ED8' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: active ? 800 : 600,
                        cursor: 'pointer',
                      }}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                <MessageSquare size={14} color="#64748B" /> Câu hỏi dành cho Cán bộ Tuyển sinh
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Em muốn hỏi về điều kiện xét học bổng doanh nghiệp OJT, học phí kỳ đầu và cơ hội thực tập..."
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: '#0F172A',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F8FAFC',
                padding: '10px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#64748B',
              }}
            >
              <Sparkles size={15} color="#F59E0B" style={{ flexShrink: 0 }} />
              <span>
                Hoàn toàn miễn phí · Yêu cầu được đồng bộ trực tiếp tới Cổng Tuyển sinh nhà trường.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <Button variant="tonal" size="L" style={{ flex: 1 }} type="button" onClick={closeBookConsultation}>
                Hủy
              </Button>
              <Button variant="primary" size="L" style={{ flex: 2 }} type="submit">
                Xác nhận đặt lịch 1-1
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
