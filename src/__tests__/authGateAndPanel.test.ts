import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import {
  AUTH_SESSION_KEY,
  EMPTY_USER,
  recoverInitialSession,
} from '../utils/authSession';
import { ChatBotModal } from '../components/modals/ChatBotModal';

// Mock MockData & Supabase to prevent network calls in unit tests
vi.mock('../lib/supabase', () => ({
  syncApplicationToCloud: vi.fn(),
  syncBookingToCloud: vi.fn(),
  syncQuizResultToCloud: vi.fn(),
  fetchUniversitiesFromCloud: vi.fn().mockResolvedValue([]),
  mergeUniversitiesWithCloud: vi.fn((list) => list),
}));

// Mock useApp context hook for testing ChatBotModal in desktop mode
const mockUseApp = vi.fn();
vi.mock('../context/AppContext', () => ({
  useApp: () => mockUseApp(),
}));

// Mock localStorage implementation
class MockStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

describe('Bảo vệ Cổng Đăng Nhập & Hủy Phiên Khách (Việc 1)', () => {
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
  });

  it('hủy phiên khách cũ có isGuest: true và trả về trạng thái chưa đăng nhập', () => {
    mockStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({
        isLoggedIn: true,
        isGuest: true,
        user: { email: 'guest@unipath.vn', name: 'Khách trải nghiệm', role: 'student' },
      })
    );

    const session = recoverInitialSession(mockStorage);

    expect(session.isLoggedIn).toBe(false);
    expect(session.isGuest).toBe(false);
    expect(session.user).toEqual(EMPTY_USER);
    expect(mockStorage.getItem(AUTH_SESSION_KEY)).toBeNull(); // Đã xóa khỏi storage
  });

  it('hủy phiên khách cũ có email guest@unipath.vn kể cả khi isGuest=false', () => {
    mockStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({
        isLoggedIn: true,
        isGuest: false,
        user: { email: 'guest@unipath.vn', name: 'Khách', role: 'student' },
      })
    );

    const session = recoverInitialSession(mockStorage);

    expect(session.isLoggedIn).toBe(false);
    expect(session.isGuest).toBe(false);
    expect(session.user).toEqual(EMPTY_USER);
    expect(mockStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('giữ nguyên phiên đăng nhập hợp lệ của thí sinh thật', () => {
    const validUser = {
      email: 'quy@unipath.vn',
      name: 'Trần Công Quý',
      role: 'student' as const,
      avatar: '/images/avatar_user.png',
    };
    mockStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({
        isLoggedIn: true,
        isGuest: false,
        user: validUser,
      })
    );

    const session = recoverInitialSession(mockStorage);

    expect(session.isLoggedIn).toBe(true);
    expect(session.isGuest).toBe(false);
    expect(session.user.email).toBe('quy@unipath.vn');
    expect(mockStorage.getItem(AUTH_SESSION_KEY)).not.toBeNull(); // Phiên hợp lệ không bị xóa
  });

  it('trả về chưa đăng nhập khi storage trống hoặc không có session', () => {
    const session = recoverInitialSession(mockStorage);

    expect(session.isLoggedIn).toBe(false);
    expect(session.isGuest).toBe(false);
    expect(session.user).toEqual(EMPTY_USER);
  });
});

describe('Panel AI Mặc Định Thu Nhỏ Ở Desktop (Việc 2)', () => {
  it('trên desktop: mặc định panel ở trạng thái thu nhỏ (chỉ render nút tròn nổi, không bung hộp thoại)', () => {
    mockUseApp.mockReturnValue({
      viewMode: 'desktop',
      isLoggedIn: true,
      user: { email: 'quy@unipath.vn', name: 'Trần Công Quý', role: 'student' },
      profile: { name: 'Trần Công Quý' },
      isChatBotOpen: false,
      closeChatBot: vi.fn(),
      openChatBot: vi.fn(),
      incrementAiQueryCount: vi.fn(),
      universitiesList: [],
    });

    const html = renderToString(React.createElement(ChatBotModal));

    // Nút tròn nổi thu nhỏ phải có mặt
    expect(html).toContain('aria-label="Mở Trợ lý AI UniPath"');
    expect(html).toContain('title="Mở Trợ lý AI UniPath"');

    // Panel nội dung trò chuyện KHÔNG được hiển thị mặc định
    expect(html).not.toContain('Thu nhỏ trợ lý AI');
    expect(html).not.toContain('Hỏi bất kỳ điều gì về tuyển sinh, điểm chuẩn');
  });
});
