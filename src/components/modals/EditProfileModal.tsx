import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileOpen, closeEditProfile, profile, updateProfile, showToast } = useApp();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [dob, setDob] = useState(profile.dob);
  const [gender, setGender] = useState(profile.gender);
  const [grade, setGrade] = useState(profile.grade);
  const [school, setSchool] = useState(profile.school);
  const [province, setProvince] = useState(profile.province);
  const [targetMajor, setTargetMajor] = useState(profile.targetMajor);
  const [dreamUni, setDreamUni] = useState(profile.dreamUni);
  const [expectedScore, setExpectedScore] = useState(profile.expectedScore);

  if (!isEditProfileOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập họ và tên!');
      return;
    }

    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      dob: dob.trim(),
      gender,
      grade,
      school: school.trim(),
      province: province.trim(),
      targetMajor: targetMajor.trim(),
      dreamUni: dreamUni.trim(),
      expectedScore: Number(expectedScore) || 24.5,
    });

    closeEditProfile();
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
      onClick={closeEditProfile}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: 'min(88dvh, calc(100dvh - 56px))',
          maxHeight: 'calc(100dvh - 56px)',
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
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Thông tin cá nhân
          </h3>
          <button
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
            {/* Họ và tên */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Họ và tên *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {/* Email (read only) */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Địa chỉ Email (Chỉ đọc)
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
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

            {/* SĐT + Ngày sinh */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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

            {/* Giới tính */}
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

            {/* Lớp & Trường THPT */}
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

            {/* Tỉnh / Thành phố */}
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

            {/* Ngành mục tiêu & Trường mong muốn */}
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
                  Điểm dự kiến
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="15"
                  max="30"
                  value={expectedScore}
                  onChange={(e) => setExpectedScore(parseFloat(e.target.value))}
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
