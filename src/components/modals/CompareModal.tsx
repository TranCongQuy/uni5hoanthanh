import React, { useState } from 'react';
import { X, Scale, Plus, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES, getUniversityById } from '../../data/MockData';
import type { University } from '../../types';
import { Button, UniversityAvatar } from '../common/UI';

export const CompareModal: React.FC = () => {
  const {
    isCompareModalOpen,
    closeCompareModal,
    compareIds,
    removeCompare,
    toggleCompare,
    clearCompare,
    openUniDetail,
  } = useApp();

  const [showAddPicker, setShowAddPicker] = useState(false);
  const [compareSearchKeyword, setCompareSearchKeyword] = useState('');
  const [compareFilterRegion, setCompareFilterRegion] = useState('Tất cả');

  if (!isCompareModalOpen) return null;

  const compareUnis: University[] = compareIds
    .map((id) => getUniversityById(id))
    .filter((u): u is University => u !== undefined);

  // Available universities to add (not yet in compare)
  const availableToAdd = UNIVERSITIES.filter((u) => !compareIds.includes(u.id));

  const filteredAvailableToAdd = availableToAdd.filter((u) => {
    const kw = compareSearchKeyword.toLowerCase().trim();
    const matchKw =
      !kw ||
      u.name.toLowerCase().includes(kw) ||
      u.code.toLowerCase().includes(kw) ||
      u.loc.toLowerCase().includes(kw) ||
      u.majors.some((m) => m.toLowerCase().includes(kw));

    const matchRegion =
      compareFilterRegion === 'Tất cả' || u.region.toLowerCase().includes(compareFilterRegion.toLowerCase());

    return matchKw && matchRegion;
  });

  // Determine best values among selected
  const lowestTuition = Math.min(...compareUnis.map((u) => u.tuitionMin));
  const highestEmployment = Math.max(...compareUnis.map((u) => u.employmentRate));

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
      onClick={closeCompareModal}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          height: 'min(88dvh, calc(100dvh - 56px))',
          maxHeight: 'calc(100dvh - 56px)',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={22} color="#2563EB" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              So sánh trường ({compareUnis.length}/3)
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {compareUnis.length > 0 && (
              <button
                onClick={clearCompare}
                style={{
                  border: 'none',
                  backgroundColor: '#FEF2F2',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
              >
                Xóa hết
              </button>
            )}
            <button
              onClick={closeCompareModal}
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
        </div>

        {/* Comparison Table / Grid Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
          {compareUnis.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Scale size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700 }}>
                Chưa có trường nào được chọn
              </h4>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748B' }}>
                Chọn tối đa 3 trường từ trang chủ hoặc danh sách trường để đối chiếu học phí, điểm chuẩn và chỉ số việc làm.
              </p>
              <Button
                variant="primary"
                size="M"
                onClick={() => setShowAddPicker(true)}
              >
                + Chọn trường so sánh ngay
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Columns for selected universities */}
              {compareUnis.map((uni, idx) => {
                const isBestTuition = uni.tuitionMin === lowestTuition;
                const isBestEmployment = uni.employmentRate === highestEmployment;

                return (
                  <div
                    key={uni.id}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1.5px solid #E2E8F0',
                      padding: '12px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      position: 'relative',
                    }}
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => removeCompare(uni.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#F1F5F9',
                        border: 'none',
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={14} />
                    </button>

                    {/* Logo & Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '12px' }}>
                      <UniversityAvatar code={uni.code} size={48} className="mb-2" />
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 800,
                          color: '#0F172A',
                          height: '36px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.25,
                        }}
                      >
                        {uni.name}
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                        {uni.code} • {uni.region}
                      </span>
                    </div>

                    {/* Criteria Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      {/* Row 1: Học phí */}
                      <div
                        style={{
                          padding: '8px',
                          borderRadius: '12px',
                          backgroundColor: isBestTuition ? '#ECFDF5' : '#F8FAFC',
                          border: isBestTuition ? '1px solid #10B981' : '1px solid #E2E8F0',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '10px', color: '#64748B' }}>Học phí</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: isBestTuition ? '#059669' : '#1E293B' }}>
                          {uni.tuitionMin}-{uni.tuitionMax} tr
                        </div>
                        {isBestTuition && (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: '#059669' }}>
                            Tốt nhất
                          </span>
                        )}
                      </div>

                      {/* Row 2: Điểm chuẩn 2024 */}
                      <div
                        style={{
                          padding: '8px',
                          borderRadius: '12px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '10px', color: '#64748B' }}>Chuẩn 2024</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#2563EB' }}>
                          {uni.score2024} đ
                        </div>
                        <div style={{ fontSize: '9px', color: '#94A3B8' }}>
                          2023: {uni.score2023}đ
                        </div>
                      </div>

                      {/* Row 3: Việc làm */}
                      <div
                        style={{
                          padding: '8px',
                          borderRadius: '12px',
                          backgroundColor: isBestEmployment ? '#ECFDF5' : '#F8FAFC',
                          border: isBestEmployment ? '1px solid #10B981' : '1px solid #E2E8F0',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '10px', color: '#64748B' }}>Việc làm</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: isBestEmployment ? '#059669' : '#1E293B' }}>
                          {uni.employmentRate}%
                        </div>
                        {isBestEmployment && (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: '#059669' }}>
                            Cao nhất
                          </span>
                        )}
                      </div>

                      {/* Row 4: Đánh giá */}
                      <div
                        style={{
                          padding: '8px',
                          borderRadius: '12px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '10px', color: '#64748B' }}>Đánh giá</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B' }}>
                          ★ {uni.rating}
                        </div>
                      </div>

                      {/* Row 5: Ngành chính */}
                      <div
                        style={{
                          padding: '8px',
                          borderRadius: '12px',
                          backgroundColor: '#F8FAFC',
                          fontSize: '11px',
                          color: '#475569',
                          textAlign: 'center',
                          height: '48px',
                          overflow: 'hidden',
                        }}
                      >
                        {uni.majors.slice(0, 2).join(', ')}
                      </div>
                    </div>

                    {/* View Detail Action */}
                    <button
                      onClick={() => {
                        closeCompareModal();
                        openUniDetail(uni.id);
                      }}
                      style={{
                        marginTop: '12px',
                        width: '100%',
                        padding: '8px 4px',
                        borderRadius: '12px',
                        backgroundColor: idx === 0 ? '#2563EB' : '#FFFFFF',
                        border: idx === 0 ? 'none' : '1.5px solid #2563EB',
                        color: idx === 0 ? '#FFFFFF' : '#2563EB',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                );
              })}

              {/* Empty Slot (+ Thêm trường) if < 3 */}
              {compareUnis.length < 3 && (
                <div
                  onClick={() => setShowAddPicker(true)}
                  style={{
                    flex: 1,
                    minWidth: '130px',
                    borderRadius: '20px',
                    border: '2px dashed #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB',
                      marginBottom: '8px',
                    }}
                  >
                    <Plus size={20} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                    + Thêm trường
                  </span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                    Tối đa 3 trường
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* University Picker Sheet Modal */}
        {showAddPicker && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#FFFFFF',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.2s',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Chọn trường thêm vào so sánh
                </h4>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Tìm thấy {filteredAvailableToAdd.length} trường phù hợp
                </span>
              </div>
              <button
                onClick={() => {
                  setShowAddPicker(false);
                  setCompareSearchKeyword('');
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#F1F5F9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Instant Search Bar inside Compare Picker (Ảnh 5) */}
            <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #F1F5F9' }}>
              <div
                style={{
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  gap: '8px',
                }}
              >
                <Search size={18} color="#2563EB" />
                <input
                  type="text"
                  value={compareSearchKeyword}
                  onChange={(e) => setCompareSearchKeyword(e.target.value)}
                  placeholder="Tìm theo tên trường, mã trường, ngành học..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '13px',
                    color: '#0F172A',
                    flex: 1,
                  }}
                  autoFocus
                />
                {compareSearchKeyword && (
                  <button
                    onClick={() => setCompareSearchKeyword('')}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      padding: '2px',
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Quick Region Filter Chips */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {['Tất cả', 'Bắc', 'Trung', 'Nam'].map((reg) => {
                  const active = compareFilterRegion === reg;
                  return (
                    <button
                      key={reg}
                      onClick={() => setCompareFilterRegion(reg)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '10px',
                        border: active ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                        color: active ? '#2563EB' : '#64748B',
                        fontSize: '11px',
                        fontWeight: active ? 800 : 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {reg === 'Tất cả' ? 'Toàn quốc' : `Miền ${reg}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              {filteredAvailableToAdd.length === 0 ? (
                <div style={{ padding: '30px 16px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                  Không tìm thấy trường nào phù hợp với từ khóa "{compareSearchKeyword}".
                </div>
              ) : (
                filteredAvailableToAdd.map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => {
                      toggleCompare(uni.id);
                      setShowAddPicker(false);
                      setCompareSearchKeyword('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.15s',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <UniversityAvatar code={uni.code} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {uni.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        <strong style={{ color: '#2563EB' }}>{uni.code}</strong> • Miền {uni.region} • Học phí: {uni.tuitionMin}-{uni.tuitionMax} tr
                      </div>
                    </div>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563EB',
                      }}
                    >
                      <Plus size={18} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
