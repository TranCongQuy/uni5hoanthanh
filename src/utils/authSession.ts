import type { CurrentUser } from '../types';

export const AUTH_SESSION_KEY = 'unipath_v2_auth_session';

export const EMPTY_USER: CurrentUser = {
  email: '',
  name: '',
  role: 'student',
  avatar: '/images/avatar_user.png',
};

export interface StoredSession {
  isLoggedIn: boolean;
  isGuest: boolean;
  user: CurrentUser;
}

/**
 * Khôi phục phiên đăng nhập từ localStorage.
 * Bắt buộc bảo vệ: Bỏ hoàn toàn tài khoản Khách.
 * Mọi phiên cũ có isGuest: true hoặc email guest@unipath.vn lập tức bị xóa bỏ
 * và trả về trạng thái chưa đăng nhập (isLoggedIn: false).
 */
export function recoverInitialSession(customStorage?: Storage | null): StoredSession {
  const storage = customStorage !== undefined ? customStorage : (typeof window !== 'undefined' ? window.localStorage : null);
  if (!storage) {
    return {
      isLoggedIn: false,
      isGuest: false,
      user: EMPTY_USER,
    };
  }

  try {
    const raw = storage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return {
        isLoggedIn: false,
        isGuest: false,
        user: EMPTY_USER,
      };
    }

    const saved = JSON.parse(raw) as Partial<StoredSession> | null;
    if (saved && saved.isLoggedIn && saved.user) {
      const email = (saved.user.email || '').trim().toLowerCase();
      const isGuestSession = saved.isGuest === true || email === 'guest@unipath.vn';

      if (!isGuestSession && email.length > 0) {
        return {
          isLoggedIn: true,
          isGuest: false,
          user: saved.user as CurrentUser,
        };
      }

      // Xóa phiên khách cũ khỏi storage
      try {
        storage.removeItem(AUTH_SESSION_KEY);
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore parse error
  }

  return {
    isLoggedIn: false,
    isGuest: false,
    user: EMPTY_USER,
  };
}
