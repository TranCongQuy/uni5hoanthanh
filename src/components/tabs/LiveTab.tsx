import React, { useState, useEffect } from 'react';
import {
  Radio,
  Users,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/MockData';
import { Button, UniversityAvatar, ImageSafe, AppFooter } from '../common/UI';

interface LiveChatMessage {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  isAdvisor?: boolean;
}

export const LiveTab: React.FC = () => {
  const { openUniDetail, showToast } = useApp();

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live chat state (Max 8 comments sliding window, showing 4 in view, scroll to see other 4)
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = React.useRef<HTMLDivElement>(null);
  const poolIndexRef = React.useRef(0);

  const [messages, setMessages] = useState<LiveChatMessage[]>([
    {
      id: 'm1',
      author: 'TS. Lê Thành Trung',
      avatar: '/images/advisor_avatar.png',
      time: '14:28',
      text: 'Chào các bạn học sinh 2k8! Thầy và ban tư vấn tuyển sinh sẵn sàng giải đáp thắc mắc về phương thức xét tuyển sớm.',
      isAdvisor: true,
    },
    {
      id: 'm2',
      author: 'Ngọc Lan (Huế)',
      avatar: '/images/speaker_2.png',
      time: '14:30',
      text: 'Thầy cho em hỏi điểm chuẩn ngành CNTT và cơ hội nhận học bổng OJT tại trường Phú Xuân năm nay thế nào ạ?',
    },
    {
      id: 'm3',
      author: 'Ban Tư vấn Tuyển sinh',
      avatar: '/images/advisor_avatar.png',
      time: '14:31',
      text: 'Chào Lan! Điểm chuẩn CNTT dự kiến từ 24.5. Trường đang có gói học bổng 50-100% cho thí sinh nộp hồ sơ đợt 1 nhé!',
      isAdvisor: true,
    },
    {
      id: 'm4',
      author: 'Quốc Huy (Đà Nẵng)',
      avatar: '/images/avatar_user.png',
      time: '14:32',
      text: 'Cho em hỏi điểm xét học bạ ngành Trí tuệ nhân tạo có lấy chứng chỉ tiếng Anh để quy đổi điểm không ạ?',
    },
  ]);

  // Infinite real-time live comments generator (keep max 8 comments, FIFO sliding window)
  useEffect(() => {
    const commentsPool: Omit<LiveChatMessage, 'id' | 'time'>[] = [
      {
        author: 'Trần Minh Quân (Đà Nẵng)',
        avatar: '/images/avatar_user.png',
        text: 'Em được 24.5 điểm khối A00 có cơ hội đỗ CNTT Bách Khoa không ạ?',
      },
      {
        author: 'Ban Tư vấn Tuyển sinh',
        avatar: '/images/advisor_avatar.png',
        text: 'Chào Quân! 24.5đ em hoàn toàn yên tâm nộp NV1 CNTT ĐH Phú Xuân hoặc Điện tử Bách Khoa nhé!',
        isAdvisor: true,
      },
      {
        author: 'Lê Hoàng Yến (Huế)',
        avatar: '/images/speaker_2.png',
        text: 'Trường Đại học Phú Xuân có chính sách học bổng cho học sinh giỏi tỉnh không ạ?',
      },
      {
        author: 'TS. Lê Thành Trung',
        avatar: '/images/advisor_avatar.png',
        text: 'Chào Yến! PXU cấp học bổng OJT 100% học phí toàn khóa cho học sinh giỏi cấp tỉnh trở lên nhé!',
        isAdvisor: true,
      },
      {
        author: 'Nguyễn Đăng Khoa (TP.HCM)',
        avatar: '/images/speaker_3.png',
        text: 'Thầy cho em hỏi kỳ thi ĐGNL ĐHQG-HCM năm nay cổng đăng ký đợt 1 mở khi nào ạ?',
      },
      {
        author: 'Phạm Thu Trang (Hà Nội)',
        avatar: '/images/speaker_1.png',
        text: 'Học phí ĐH Ngoại Thương năm nay có tăng nhiều so với khóa trước không thầy?',
      },
      {
        author: 'Ban Tư vấn Unipath',
        avatar: '/images/advisor_avatar.png',
        text: 'Mức học phí các trường công lập từ 18-35 triệu/năm, các bạn tham khảo chi tiết trong bảng so sánh nhé!',
        isAdvisor: true,
      },
      {
        author: 'Vũ Đức Nam (Quảng Nam)',
        avatar: '/images/avatar_user.png',
        text: 'Ngành Vi mạch bán dẫn tại Bách Khoa cần học tốt những môn gì nhất ạ?',
      },
      {
        author: 'Đặng Mai Phương (Hải Phòng)',
        avatar: '/images/speaker_2.png',
        text: 'Có bạn nào định nộp hồ sơ xét tuyển sớm bằng IELTS vào NEU không?',
      },
      {
        author: 'Hoàng Anh Tuấn (Nghệ An)',
        avatar: '/images/speaker_3.png',
        text: 'Trường có ký túc xá cho tân sinh viên ngoại tỉnh không ạ? Đăng ký thế nào ạ?',
      },
      {
        author: 'TS. Lê Thành Trung',
        avatar: '/images/advisor_avatar.png',
        text: '100% thí sinh nộp đợt 1 đều được ưu tiên xếp phòng KTX tiện nghi đầy đủ nhé các em!',
        isAdvisor: true,
      },
      {
        author: 'Bùi Thanh Hằng (Cần Thơ)',
        avatar: '/images/speaker_1.png',
        text: 'Em muốn theo ngành Logistics thì nên chọn ĐH Kinh tế TP.HCM hay ĐH Quốc tế ạ?',
      },
    ];

    const interval = setInterval(() => {
      const template = commentsPool[poolIndexRef.current % commentsPool.length];
      poolIndexRef.current += 1;

      const newMsg: LiveChatMessage = {
        id: `m-live-${Date.now()}-${poolIndexRef.current}`,
        author: template.author,
        avatar: template.avatar,
        time: 'Vừa xong',
        text: template.text,
        isAdvisor: template.isAdvisor,
      };

      setMessages((prev) => {
        // Keep maximum 8 comments in the sliding buffer
        const nextList = prev.length >= 8 ? prev.slice(1) : prev;
        return [...nextList, newMsg];
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Smooth scroll to bottom when new comment arrives
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `m-${Date.now()}`,
      author: 'Bạn (Học sinh)',
      avatar: '/images/avatar_user.png',
      time: 'Vừa xong',
      text: chatInput.trim(),
    };

    setMessages((prev) => {
      const nextList = prev.length >= 8 ? prev.slice(1) : prev;
      return [...nextList, newMsg];
    });
    setChatInput('');

    // Simulated reply from advisor
    setTimeout(() => {
      setMessages((prev) => {
        const nextList = prev.length >= 8 ? prev.slice(1) : prev;
        return [
          ...nextList,
          {
            id: `m-bot-${Date.now()}`,
            author: 'Ban Tư vấn Tuyển sinh',
            avatar: '/images/advisor_avatar.png',
            time: 'Vừa xong',
            text: 'Cảm ơn bạn! Ban tuyển sinh đã ghi nhận và sẽ giải đáp chi tiết cho bạn ngay bây giờ nhé.',
            isAdvisor: true,
          },
        ];
      });
    }, 2000);
  };

  // Virtual booths (6 featured universities)
  const virtualBooths = [
    { uni: UNIVERSITIES[10], isLive: true, viewers: 342 }, // PXU
    { uni: UNIVERSITIES[0], isLive: true, viewers: 512 },  // BKA
    { uni: UNIVERSITIES[20], isLive: true, viewers: 428 }, // HCMUT
    { uni: UNIVERSITIES[1], isLive: false, viewers: 0 },   // FTU
    { uni: UNIVERSITIES[2], isLive: false, viewers: 0 },   // NEU
    { uni: UNIVERSITIES[22], isLive: false, viewers: 0 },  // UEH
  ];

  // Workshop sessions
  const sessions = [
    {
      id: 's1',
      title: 'Bí kíp săn học bổng toàn phần ngành Công nghệ 2026',
      speaker: 'GS. Đặng Minh Nhật - Viện trưởng Viện CNTT',
      img: '/images/speaker_1.png',
      viewers: 720,
    },
    {
      id: 's2',
      title: 'Chiến thuật chọn tổ hợp môn thi tốt nghiệp THPT chuẩn',
      speaker: 'ThS. Trần Thị Mai - Chuyên gia Hướng nghiệp',
      img: '/images/speaker_2.png',
      viewers: 580,
    },
    {
      id: 's3',
      title: 'Xu hướng việc làm khối ngành Kinh tế & Logistics',
      speaker: 'Doanh nhân Nguyễn Hoàng Long',
      img: '/images/speaker_3.png',
      viewers: 490,
    },
  ];

  return (
    <div style={{ padding: '20px 20px 104px', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
            Ngày hội Tuyển sinh số 2026
          </h2>
          <span style={{ fontSize: '13px', color: '#64748B' }}>
            Kết nối trực tiếp cùng hơn 30 trường Đại học
          </span>
        </div>
        <span
          style={{
            backgroundColor: '#FEF2F2',
            color: '#EF4444',
            border: '1px solid #FEE2E2',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          Còn 3 ngày
        </span>
      </div>

      {/* 2. Banner Virtual EduFair 220dp with Countdown */}
      <div
        style={{
          position: 'relative',
          height: '220px',
          borderRadius: '28px',
          overflow: 'hidden',
          marginBottom: '28px',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.2)',
        }}
      >
        <ImageSafe
          src="/images/banner_edufair.png"
          fallbackSrc="/images/campus_default.png"
          altText="EduFair 2026"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.85) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '18px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                }}
              />
              LIVE NOW
            </span>
            <span style={{ color: '#E2E8F0', fontSize: '13px' }}>
              Virtual EduFair 2026
            </span>
          </div>

          <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
            Ngày hội Tư vấn & Khám phá Giảng đường
          </h3>

          {/* 4 Countdown Boxes */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { val: timeLeft.days, label: 'Ngày' },
              { val: timeLeft.hours, label: 'Giờ' },
              { val: timeLeft.minutes, label: 'Phút' },
              { val: timeLeft.seconds, label: 'Giây' },
            ].map((unit, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '12px',
                  padding: '6px 4px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                  {String(unit.val).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '10px', color: '#E2E8F0' }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Virtual Booths (Gian hàng ảo các trường) */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
          Gian hàng ảo các trường
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {virtualBooths.map(({ uni, isLive, viewers }) => (
            <div
              key={uni.id}
              onClick={() => openUniDetail(uni.id)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '14px',
                border: '1px solid #E2E8F0',
                boxShadow: isLive ? '0 4px 14px rgba(239,68,68,0.1)' : '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <UniversityAvatar code={uni.code} size={56} className="mb-2" />

              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: 1.25,
                  height: '32px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                {uni.name}
              </div>

              {/* Status pill */}
              <div style={{ marginTop: 'auto', width: '100%' }}>
                {isLive ? (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      color: '#EF4444',
                      border: '1px solid #FEE2E2',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#EF4444',
                      }}
                    />
                    LIVE ({viewers})
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#F1F5F9',
                      color: '#64748B',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    Sắp diễn ra
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Unipath LIVE - Tư vấn cùng chuyên gia Video & Chat Stream */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
          Unipath LIVE – Tư vấn cùng chuyên gia
        </h3>

        {/* Video Mockup Card */}
        <div
          style={{
            position: 'relative',
            height: '190px',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: '#0F172A',
            marginBottom: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          <ImageSafe
            src="/images/advisor_live.png"
            fallbackSrc="/images/campus_default.png"
            altText="Chuyên gia tư vấn"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Top badges */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              right: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Radio size={14} /> LIVE
            </span>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Users size={14} /> 1.250 đang xem
            </span>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              color: '#FFFFFF',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Phiên trực tiếp: Giải đáp nguyện vọng tuyển sinh 2026
            </div>
          </div>
        </div>

        {/* Live Chat Stream Container */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          {/* Header of Chat with Counter Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              paddingBottom: '8px',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px #10B981',
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                Khung bình luận trực tiếp
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                color: '#64748B',
                backgroundColor: '#F8FAFC',
                padding: '2px 8px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              8 bình luận gần nhất • Lướt để xem
            </span>
          </div>

          {/* Viewport for 4 comments visible at a time, scroll to view all 8 */}
          <div
            ref={chatScrollRef}
            style={{
              height: '210px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '12px',
              paddingRight: '6px',
              scrollBehavior: 'smooth',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  padding: '6px 8px',
                  borderRadius: '12px',
                  backgroundColor: msg.isAdvisor ? '#EFF6FF' : '#F8FAFC',
                  border: msg.isAdvisor ? '1px solid #DBEAFE' : '1px solid #F1F5F9',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              >
                <img
                  src={msg.avatar}
                  alt={msg.author}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: msg.isAdvisor ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                  }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: msg.isAdvisor ? '#2563EB' : '#0F172A',
                      }}
                    >
                      {msg.author}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>{msg.time}</span>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#334155', lineHeight: 1.35 }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Đặt câu hỏi cho diễn giả..."
              style={{
                flex: 1,
                height: '40px',
                borderRadius: '20px',
                border: '1px solid #CBD5E1',
                padding: '0 14px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: chatInput.trim() ? '#2563EB' : '#E2E8F0',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* 5. Sessions & Workshops (Phiên tư vấn & Hội thảo) */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
          Phiên tư vấn & Hội thảo
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sessions.map((s) => (
            <div
              key={s.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '14px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <img
                src={s.img}
                alt={s.speaker}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0F172A',
                    lineHeight: 1.3,
                    marginBottom: '4px',
                  }}
                >
                  {s.title}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {s.speaker}
                </div>
              </div>
              <Button
                variant="tonal"
                size="S"
                onClick={() => showToast(`Đang kết nối vào phòng: "${s.title}"`)}
              >
                Vào xem
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Pinned CTA Button */}
      <Button
        variant="danger"
        size="L"
        fullWidth
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast('Bạn đang xem phiên trực tiếp EduFair 2026!');
        }}
      >
        Lên đầu trang xem phiên Live trực tiếp ↑
      </Button>

      <AppFooter text="Sự kiện trực tuyến chính thức Unipath EduFair 2026." />
    </div>
  );
};
