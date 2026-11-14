import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';
import {
  formatCleanDecimal,
  validateStudentScore,
  validateVietnamPhone,
} from '../../utils/validation';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileOpen, closeEditProfile, profile, updateProfile, showToast, viewMode } = useApp();
  const isDesktop = viewMode === 'desktop';

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [dob, setDob] = useState(profile.dob);
  const [gender, setGender] = useState(profile.gender);
  const [grade, setGrade] = useState(profile.grade);
  const [school, setSchool] = useState(profile.school);
  const [province, setProvince] = useState(profile.province);
  const [targetMajor, setTargetMajor] = useState(profile.targetMajor);
  const [dreamUni, setDreamUni] = useState(profile.dreamUni);
  const [scoreText, setScoreText] = useState(formatCleanDecimal(profile.expectedScore, 2));
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isEditProfileOpen) {
      setName(profile.name);
      setPhone(profile.phone);
      setDob(profile.dob);
      setGender(profile.gender);
      setGrade(profile.grade);
      setSchool(profile.school);
      setProvince(profile.province);
      setTargetMajor(profile.targetMajor);
      setDreamUni(profile.dreamUni);
      setScoreText(formatCleanDecimal(profile.expectedScore, 2));
      setErrorMsg('');
    }
  }, [isEditProfileOpen, profile]);

  if (!isEditProfileOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (name.trim().length < 2) {
      const msg = 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự)!';
      setErrorMsg(msg);
      showToast(msg);
      return;
    }

    if (phone.trim().length > 0) {
      const phoneCheck = validateVietnamPhone(phone);
      if (!phoneCheck.ok) {
        const msg = phoneCheck.error || 'Số điện thoại không hợp lệ!';
        setErrorMsg(msg);
        showToast(msg);
        return;
      }
    }

    const scoreCheck = validateStudentScore(scoreText);
    if (!scoreCheck.ok || scoreCheck.value === undefined) {
      const msg = scoreCheck.error || 'Điểm dự kiến phải nằm trong khoảng 0.5 – 30.0!';
      setErrorMsg(msg);
      showToast(msg);
      return;
    }

    const saved = updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      dob: dob.trim(),
      gender,
      grade,
      school: school.trim(),
      province: province.trim(),
      targetMajor: targetMajor.trim(),
      dreamUni: dreamUni.trim(),
      expectedScore: scoreCheck.value,
    });

    if (saved) {
      closeEditProfile();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? '24px' : '0',
      }}
      onClick={closeEditProfile}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isDesktop ? '640px' : '520px',
          height: isDesktop ? 'min(86vh, 760px)' : 'min(88dvh, calc(100dvh - 56px))',
          maxHeight: isDesktop ? '86vh' : 'calc(100dvh - 56px)',
          backgroundColor: '#FFFFFF',
          borderRadius: isDesktop ? '24px' : '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDesktop ? '0 25px 60px rgba(0,0,0,0.35)' : '0 -10px 30px rgba(0,0,0,0.2)',
          animation: isDesktop ? 'fadeIn 0.25s ease-out' : 'slideUp 0.3s ease-out',
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
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Thông tin cá nhân
          </h3>
          <button
            type="button"
            onClick={closeEditProfile}
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                borderRadius: '14px',
                padding: '10px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Avatar centered */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #2563EB',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                  backgroundColor: '#EFF6FF',
                }}
              >
                <img
                  src={profile.avatarPath || '/images/avatar_user.png'}
                  alt={profile.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
              Ảnh đại diện tài khoản
            </span>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Họ và tên *
              </label>
              <input
                type="text"
                value={name}
                autoComplete="name"
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg('');
                }}
                required
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '16px',
                  border: '1px solid #CBD5E1',
                  padding: '0 16px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Địa chỉ Email (Chỉ đọc)
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                autoComplete="email"
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '0 16px',
                  fontSize: '14px',
                  backgroundColor: '#F8FAFC',
                  color: '#94A3B8',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phone}
                  autoComplete="tel"
                  inputMode="tel"
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="0912345678"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '16px',
                    border: '1px solid #CBD5E1',
                    padding: '0 16px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Ngày sinh
                </label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '16px',
                    border: '1px solid #CBD5E1',
                    padding: '0 16px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Giới tính
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Nam', 'Nữ', 'Khác'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '14px',
                      border: gender === g ? '2px solid #2563EB' : '1px solid #CBD5E1',
                      backgroundColor: gender === g ? '#EFF6FF' : '#FFFFFF',
                      color: gender === g ? '#2563EB' : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Khối lớp
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '16px',
                    border: '1px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Lớp 10">Lớp 10</option>
                  <option value="Lớp 11">Lớp 11</option>
                  <option value="Lớp 12">Lớp 12</option>
                  <option value="Tự do">Tự do</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Trường THPT
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '16px',
                    border: '1px solid #CBD5E1',
                    padding: '0 16px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Tỉnh / Thành phố
              </label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '16px',
                  border: '1px solid #CBD5E1',
                  padding: '0 16px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Ngành học quan tâm nhất
              </label>
              <input
                type="text"
                value={targetMajor}
                onChange={(e) => setTargetMajor(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '16px',
                  border: '1px solid #CBD5E1',
                  padding: '0 16px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Trường đại học mơ ước
                </label>
                <input
                  type="text"
                  value={dreamUni}
                  onChange={(e) => setDreamUni(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '16px',
                    border: '1px solid #CBD5E1',
                    padding: '0 16px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Điểm dự kiến (0.5–30) *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={scoreText}
                  onChange={(e) => {
                    setScoreText(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="24.5"
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '16px',
                    border: '1px solid #CBD5E1',
                    padding: '0 16px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#1D4ED8',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Fixed Save Button */}
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
              variant="primary"
              size="L"
              fullWidth
              icon={<Save size={18} />}
            >
              Lưu thay đổi hồ sơ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
