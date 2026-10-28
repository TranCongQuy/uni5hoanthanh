import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Bot, Send, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ChatMessage } from '../../types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-welcome',
    sender: 'bot',
    text: '👋 Xin chào bạn! Mình là Trợ lý AI Hướng nghiệp & Tuyển sinh Unipath.\n\nBạn đang quan tâm hay muốn tìm kiếm thông tin về trường đại học, ngành học, điểm chuẩn hay học phí nào hôm nay? Hãy nhập câu hỏi hoặc bấm chọn các gợi ý bên dưới để mình hỗ trợ ngay nhé!',
    timestamp: 'Vừa xong',
  },
];

const SUGGESTIONS = [
  'Học phí đại học 2026',
  'Điểm chuẩn ngành CNTT',
  'Đại học Phú Xuân (PXU)',
  'Tỷ lệ đỗ với 24.5 điểm',
  'Top 5 ngành hot nhất',
  'Trường Đại học Bách Khoa',
];

export const ChatBotModal: React.FC = () => {
  const { isChatBotOpen, closeChatBot, profile, user } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (user?.email === 'quy@unipath.vn') {
      return INITIAL_MESSAGES;
    }
    const saved = localStorage.getItem('unipath_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If old sample messages are present, clean them up
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed.some((m: ChatMessage) => m.id === 'm-sample-user')) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_MESSAGES;
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Sync to local storage only for non-demo users
  useEffect(() => {
    if (user?.email !== 'quy@unipath.vn') {
      localStorage.setItem('unipath_chat_history', JSON.stringify(messages));
    }
  }, [messages, user?.email]);

  // Reset chat messages to fresh initial when demo user logs in
  useEffect(() => {
    if (user?.email === 'quy@unipath.vn') {
      setMessages(INITIAL_MESSAGES);
    }
  }, [user?.email]);

  // Scroll to bottom cleanly within messages container ONLY (prevents scrolling window / outer modal)
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (isChatBotOpen) {
      scrollToBottom();
    }
  }, [messages, isChatBotOpen, isTyping]);

  // Bot response algorithm matching ChatBotActivity.java
  const generateBotAnswer = useCallback((query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('bách khoa') || q.includes('dut') || q.includes('bka')) {
      return 'Đại học Bách Khoa là cơ sở đào tạo kỹ thuật hàng đầu với các ngành mũi nhọn như Khoa học máy tính, Kỹ thuật Điều khiển & Tự động hóa, Vi mạch bán dẫn. Điểm chuẩn thường dao động từ 24.0 đến 28.5 điểm.';
    } else if (q.includes('ngoại thương') || q.includes('ftu')) {
      return 'Đại học Ngoại Thương nổi tiếng với môi trường năng động và các ngành Kinh tế đối ngoại, Tài chính quốc tế, Logistics. Điểm chuẩn các tổ hợp A00, D01 thường từ 27.0 điểm trở lên.';
    } else if (q.includes('kinh tế quốc dân') || q.includes('neu')) {
      return 'ĐH Kinh Tế Quốc Dân (NEU) là trung tâm đào tạo kinh tế & quản trị top đầu miền Bắc với các ngành hot: Thương mại điện tử, Phân tích dữ liệu, Marketing. Điểm sàn từ 26.5 điểm.';
    } else if (q.includes('y hà nội') || q.includes('hmu') || q.includes('y dược')) {
      return 'Khối ngành Sức khỏe & Y Dược yêu cầu chuẩn đầu vào khắt khe: Y khoa (từ 27.5-28.8 điểm), Răng - Hàm - Mặt và Dược học. Thời gian đào tạo bác sĩ từ 6 năm.';
    } else if (q.includes('phú xuân') || q.includes('pxu')) {
      return 'Trường Đại học Phú Xuân (PXU) tại TP. Huế chú trọng mô hình đào tạo thực chiến OJT, cam kết việc làm cho sinh viên với 92% có việc làm ngay sau tốt nghiệp. Học phí chỉ từ 18-22 triệu/năm.';
    } else if (q.includes('học phí') || q.includes('tiền học') || q.includes('chi phí')) {
      return 'Học phí đại học năm 2026 chia theo các nhóm:\n• Trường công lập chuẩn: 15–28 triệu VNĐ/năm\n• Trường tư thục & tự chủ (PXU, FPT, Thăng Long...): 18–45 triệu VNĐ/năm\n• Chương trình liên kết quốc tế: 60–120 triệu VNĐ/năm\nBạn muốn tìm hiểu học phí của trường cụ thể nào?';
    } else if (q.includes('tỷ lệ đỗ') || q.includes('khả năng đỗ') || q.includes('đỗ không')) {
      return `Dựa trên điểm thi dự kiến THPT ${profile.expectedScore || 24.5} điểm của bạn:\n• Nhóm An toàn (>90%): ĐH Phú Xuân, ĐH Sư Phạm Huế, ĐH Duy Tân\n• Nhóm Vừa sức (60-80%): ĐH Kinh Tế Huế, ĐH Khoa Học Huế\n• Nhóm Thách thức (<50%): ĐH Bách Khoa, ĐH Ngoại Thương\nBạn có thể vào tab AI Matching để xem phân tích chi tiết!`;
    } else if (q.includes('điểm chuẩn') || q.includes('xét tuyển')) {
      return 'Điểm chuẩn 2026 dự kiến giữ ổn định so với năm trước. Phương thức xét tuyển sớm (học bạ THPT, đánh giá năng lực ĐHQG/ĐHBK) đang chiếm 50-60% chỉ tiêu. Bạn nên đăng ký sớm để giữ suất học bổng!';
    } else if (q.includes('ngành hot') || q.includes('chọn ngành') || q.includes('ngành') || q.includes('cntt') || q.includes('ai')) {
      return 'Top 5 nhóm ngành dẫn đầu thị trường lao động 2026:\n1. Trí tuệ Nhân tạo & Khoa học Dữ liệu\n2. Công nghệ Thông tin & An toàn thông tin\n3. Logistics & Quản lý Chuỗi cung ứng\n4. Digital Marketing & Thương mại Điện tử\n5. Công nghệ Bán dẫn & Vi mạch\nBạn có thể làm bài Trắc nghiệm Holland để xem ngành nào hợp tính cách nhất nhé!';
    } else if (q.includes('chào') || q.includes('hi') || q.includes('hello')) {
      return 'Chào bạn! Trợ lý Unipath luôn sẵn sàng giải đáp mọi thắc mắc về tuyển sinh, ngành học và điểm chuẩn 2026. Bạn cần tư vấn trường nào?';
    } else {
      return 'Cảm ơn câu hỏi của bạn! Trợ lý Unipath đã ghi nhận và đối soát với cơ sở dữ liệu 30 trường đại học. Bạn muốn tìm hiểu sâu hơn về ngành học hay phương thức xét tuyển của trường nào?';
    }
  }, [profile.expectedScore]);

  const handleSendMessage = useCallback((textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: content.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = generateBotAnswer(content);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  }, [inputText, generateBotAnswer]);

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    setShowClearConfirm(false);
  };

  if (!isChatBotOpen) return null;

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
      onClick={closeChatBot}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: 'min(88dvh, calc(100dvh - 56px))',
          maxHeight: 'calc(100dvh - 56px)',
          backgroundColor: '#F8FAFC',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px', paddingBottom: '4px', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              width: '40px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#CBD5E1',
            }}
          />
        </div>

        {/* App Bar (Sticky Top with Safe Area, 100% visible on all phones) */}
        <div
          style={{
            padding: '8px 18px 12px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 60,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Robot Avatar with blinking dot */}
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                border: '2px solid #2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                position: 'relative',
              }}
            >
              <Bot size={22} />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  border: '2px solid #FFFFFF',
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Trợ lý AI Unipath
              </div>
              <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                ● Đang hoạt động • Hỗ trợ tuyển sinh 24/7
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowClearConfirm(true)}
              title="Xóa cuộc trò chuyện"
              aria-label="Xóa cuộc trò chuyện"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <Trash2 size={16} />
            </button>

            <button
              onClick={closeChatBot}
              aria-label="Đóng trợ lý AI"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1E293B',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div
          ref={messagesContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '8px',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={16} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '75%',
                    backgroundColor: isUser ? '#2563EB' : '#FFFFFF',
                    color: isUser ? '#FFFFFF' : '#1E293B',
                    padding: '12px 16px',
                    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    border: isUser ? 'none' : '1px solid #E2E8F0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    fontSize: '14px',
                    lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                }}
              >
                <Bot size={16} />
              </div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '10px 16px',
                  borderRadius: '20px 20px 20px 4px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div
          style={{
            padding: '8px 18px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {SUGGESTIONS.map((sugg, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sugg)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #DBEAFE',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {sugg}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Nhập câu hỏi về tuyển sinh..."
            style={{
              flex: 1,
              height: '46px',
              borderRadius: '23px',
              border: '1.5px solid #CBD5E1',
              padding: '0 18px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: inputText.trim() ? '#2563EB' : '#E2E8F0',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            <Send size={18} />
          </button>
        </div>

        {/* Clear History Confirmation Modal */}
        {showClearConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 1100,
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                width: '100%',
                maxWidth: '340px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 800 }}>
                Xóa lịch sử trò chuyện?
              </h4>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748B' }}>
                Toàn bộ tin nhắn trước đây sẽ được làm mới về hội thoại chào mừng mặc định.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '16px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleClearHistory}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Xóa lịch sử
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
