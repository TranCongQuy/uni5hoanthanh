import React, { useState } from 'react';
import {
  X,
  Heart,
  Scale,
  MapPin,
  Bot,
  Send,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getUniversityById } from '../../data/MockData';
import { Button, UniversityAvatar, ImageSafe } from '../common/UI';
import { BarChart } from '../charts/BarChart';
import { DonutChart } from '../charts/DonutChart';

export const UniversityDetailModal: React.FC = () => {
  const {
    selectedUniIdForDetail,
    closeUniDetail,
    favoriteIds,
    toggleFavorite,
    compareIds,
    toggleCompare,
    openChatBot,
    openApplyDemo,
    profile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'majors' | 'tuition' | 'reviews'>('overview');

  if (selectedUniIdForDetail === null) return null;
  const uni = getUniversityById(selectedUniIdForDetail);
  if (!uni) return null;

  const isFav = favoriteIds.includes(uni.id);
  const isComp = compareIds.includes(uni.id);

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
      onClick={closeUniDetail}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '92vh',
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
        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '110px' }}>
          {/* 1. Header Campus Image 200dp */}
          <div style={{ position: 'relative', height: '200px', backgroundColor: '#CBD5E1' }}>
            <ImageSafe
              src={`/images/campus_${uni.code.toLowerCase()}.jpg`}
              fallbackSrc="/images/campus_default.png"
              altText={uni.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Back & Heart Buttons */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                right: '16px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={closeUniDetail}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(4px)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  color: '#1E293B',
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => toggleFavorite(uni.id)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    color: isFav ? '#EF4444' : '#64748B',
                  }}
                >
                  <Heart size={20} fill={isFav ? '#EF4444' : 'none'} />
                </button>
              </div>
            </div>
          </div>

          {/* 2. University Brand & Info */}
          <div style={{ padding: '0 20px', marginTop: '-36px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '12px' }}>
              <UniversityAvatar
                code={uni.code}
                size={72}
                className="border-4 border-white shadow-md bg-white"
              />
              <div style={{ flex: 1, minWidth: 0, paddingBottom: '4px' }}>
                <span
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '8px',
                  }}
                >
                  MÃ: {uni.code} • Miền {uni.region}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                    {uni.rating} / 5.0
                  </span>
                </div>
              </div>
            </div>

            <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
              {uni.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
              <MapPin size={15} color="#94A3B8" />
              <span>{uni.loc}</span>
            </div>

            {/* 3. Three Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563EB' }}>
                  {uni.tuitionMin}-{uni.tuitionMax} tr
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Học phí / năm
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981' }}>
                  {uni.score2024} đ
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Điểm chuẩn 2024
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#F59E0B' }}>
                  {uni.employmentRate}%
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Có việc làm
                </div>
              </div>
            </div>

            {/* Add to compare bar */}
            <button
              onClick={() => toggleCompare(uni.id)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '14px',
                backgroundColor: isComp ? '#EFF6FF' : '#FFFFFF',
                border: isComp ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                color: isComp ? '#2563EB' : '#475569',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
            >
              <Scale size={16} />
              {isComp ? 'Đã thêm vào bảng so sánh (Bấm để gỡ)' : '+ Thêm trường này vào so sánh'}
            </button>

            {/* 4. 4 Tabs (Tổng quan | Ngành học | Học phí | Đánh giá) */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #E2E8F0',
                marginBottom: '16px',
              }}
            >
              {[
                { id: 'overview', label: 'Tổng quan' },
                { id: 'majors', label: 'Ngành học' },
                { id: 'tuition', label: 'Học phí' },
                { id: 'reviews', label: 'Đánh giá' },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: active ? '3px solid #2563EB' : '3px solid transparent',
                      color: active ? '#2563EB' : '#64748B',
                      fontSize: '14px',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 5. Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  Giới thiệu tổng quan
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                  {uni.desc}
                </p>

                {/* AI Analysis Donut + Bar Chart */}
                <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  Phân tích cơ hội trúng tuyển AI
                </h4>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '20px',
                    padding: '16px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <DonutChart percent={86} size={68} strokeWidth={6} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#10B981' }}>
                      Cơ hội trúng tuyển: Rất cao (86%)
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', lineHeight: 1.35 }}>
                      Điểm thi dự kiến {profile.expectedScore} điểm của bạn cao hơn điểm sàn năm 2024.
                    </div>
                  </div>
                </div>

                {/* 3-Year Cutoff Bar Chart */}
                <div style={{ marginBottom: '16px' }}>
                  <BarChart
                    score2022={uni.score2022}
                    score2023={uni.score2023}
                    score2024={uni.score2024}
                    userScore={profile.expectedScore}
                  />
                </div>

                {/* 3 Admission Factors */}
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Phương thức xét tuyển áp dụng:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {[
                    'Xét điểm thi tốt nghiệp THPT năm 2026',
                    'Xét học bạ THPT (5 học kỳ hoặc cả năm Lớp 12)',
                    'Xét điểm thi Đánh giá năng lực (ĐHQG / ĐHBK)',
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'majors' && (
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  Danh sách ngành đào tạo & Điểm chuẩn 2024
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(uni.cutoffScores).map(([major, cutoff], idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                          {major}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          Chỉ tiêu tuyển sinh: 120-180 sinh viên
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563EB' }}>
                          {cutoff.toFixed(2)} đ
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>Chuẩn 2024</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tuition' && (
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  Học phí & Chính sách học bổng
                </h4>
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    borderRadius: '16px',
                    padding: '14px',
                    marginBottom: '16px',
                    border: '1px solid #DBEAFE',
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1D4ED8', marginBottom: '4px' }}>
                    Mức thu trung bình: {uni.tuitionMin} – {uni.tuitionMax} triệu VNĐ / năm
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1E40AF', lineHeight: 1.4 }}>
                    Học phí được phân bổ theo từng học kỳ (2-3 kỳ/năm), cam kết không tăng quá 10% mỗi năm theo quy định của Bộ Giáo dục & Đào tạo.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                      🎓 Học bổng Thủ khoa & Tân sinh viên xuất sắc
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      Tài trợ 100% học phí toàn khóa học cho thí sinh đạt điểm cao nhất đầu vào.
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                      💼 Học bổng Doanh nghiệp & Quỹ OJT
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      Hỗ trợ từ 30% đến 50% học phí từ các tập đoàn công nghệ và đối tác chiến lược.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  Đánh giá từ sinh viên & cựu sinh viên
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      user: 'Minh Hoàng (K46 CNTT)',
                      comment: 'Chương trình học thực tế, giảng viên nhiệt tình hỗ trợ. Năm 3 đã được đi thực tập có lương tại doanh nghiệp.',
                      rate: 5,
                    },
                    {
                      user: 'Thảo My (K47 Marketing)',
                      comment: 'Khuôn viên trường đẹp, nhiều câu lạc bộ kỹ năng năng động. Rất đáng để trải nghiệm 4 năm đại học.',
                      rate: 5,
                    },
                  ].map((rev, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                          {rev.user}
                        </span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(rev.rate)].map((_, i) => (
                            <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" />
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Action Buttons */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 20px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            gap: '10px',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
          }}
        >
          <Button
            variant="tonal"
            size="L"
            style={{ flex: 1 }}
            icon={<Bot size={18} />}
            onClick={() => {
              closeUniDetail();
              openChatBot();
            }}
          >
            Hỏi AI về trường
          </Button>

          <Button
            variant="primary"
            size="L"
            style={{ flex: 1 }}
            icon={<Send size={18} />}
            onClick={() => {
              openApplyDemo(uni);
            }}
          >
            Nộp hồ sơ
          </Button>
        </div>
      </div>
    </div>
  );
};
