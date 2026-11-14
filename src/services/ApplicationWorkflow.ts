import type { ApplicationRecord, ApplicationStatus, HollandCode, University } from '../types';
import { roundScore2 } from '../utils/validation';

export const MAX_ACTIVE_APPLICATIONS = 5;

export const TERMINAL_APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  'Đã trúng tuyển',
  'Đã hủy',
  'Đã bị hủy',
];

export function isTerminalStatus(status: ApplicationStatus): boolean {
  return TERMINAL_APPLICATION_STATUSES.includes(status);
}

export function isActiveApplication(status: ApplicationStatus): boolean {
  return !isTerminalStatus(status);
}

/**
 * Strict Finite State Machine (FSM) for institutional reviewers (Admin / PXU):
 * - 'Đang xét duyệt' MUST pass through 'Hồ sơ hợp lệ' before 'Đã trúng tuyển'.
 * - Terminal states ('Đã trúng tuyển', 'Đã hủy', 'Đã bị hủy') CANNOT be revived.
 */
export const ALLOWED_REVIEWER_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  'Đang xét duyệt': ['Hồ sơ hợp lệ', 'Thiếu hồ sơ', 'Đã bị hủy'],
  'Thiếu hồ sơ': ['Hồ sơ hợp lệ', 'Đã bị hủy'],
  'Hồ sơ hợp lệ': ['Đã trúng tuyển', 'Thiếu hồ sơ', 'Đã bị hủy'],
  'Đã trúng tuyển': [],
  'Đã hủy': [],
  'Đã bị hủy': [],
};

export function getMajorCutoffForApp(uni: University | undefined, major: string): number {
  if (!uni) return 24.0;
  const specific = uni.cutoffScores[major];
  if (typeof specific === 'number' && Number.isFinite(specific)) {
    return roundScore2(specific);
  }
  return roundScore2(uni.score2024 || 24.0);
}

export function validateNewApplicationSubmission(
  existingApps: ApplicationRecord[],
  candidateEmail: string,
  uniId: number,
  major: string
):
  | { ok: true; activeCount: number; error?: undefined }
  | { ok: false; code: 'DUPLICATE' | 'QUOTA_EXCEEDED'; error: string } {
  const normEmail = (candidateEmail || '').trim().toLowerCase();
  const normMajor = (major || '').trim().toLowerCase();

  const userActiveApps = existingApps.filter(
    (a) => a.email.trim().toLowerCase() === normEmail && isActiveApplication(a.status)
  );

  const duplicate = userActiveApps.find(
    (a) => a.uniId === uniId && a.major.trim().toLowerCase() === normMajor
  );
  if (duplicate) {
    return {
      ok: false,
      code: 'DUPLICATE',
      error: `Bạn đã có hồ sơ đang hoạt động (${duplicate.code}) cho ngành "${major}" tại trường này!`,
    };
  }

  if (userActiveApps.length >= MAX_ACTIVE_APPLICATIONS) {
    return {
      ok: false,
      code: 'QUOTA_EXCEEDED',
      error: `Mỗi thí sinh chỉ được giữ tối đa ${MAX_ACTIVE_APPLICATIONS} nguyện vọng đang xét tuyển cùng lúc. Vui lòng rút bớt nguyện vọng cũ nếu muốn đăng ký mới!`,
    };
  }

  return { ok: true, activeCount: userActiveApps.length };
}

export function canStudentCancelApplication(
  app: ApplicationRecord,
  userEmail: string,
  isGuestOrLoggedOut: boolean = !userEmail || userEmail.trim().toLowerCase() === 'guest@unipath.vn'
): { allowed: boolean; ok: boolean; error?: string } {
  if (isGuestOrLoggedOut) {
    return { allowed: false, ok: false, error: 'Vui lòng đăng nhập tài khoản thí sinh để quản lý hồ sơ!' };
  }
  if (app.email.trim().toLowerCase() !== (userEmail || '').trim().toLowerCase()) {
    return { allowed: false, ok: false, error: 'Bạn không có quyền rút hồ sơ của thí sinh khác!' };
  }
  if (app.status !== 'Đang xét duyệt' && app.status !== 'Thiếu hồ sơ') {
    return {
      allowed: false,
      ok: false,
      error: `Chỉ có thể rút hồ sơ đang ở trạng thái "Đang xét duyệt" hoặc "Thiếu hồ sơ" (hiện tại: ${app.status}).`,
    };
  }
  return { allowed: true, ok: true };
}

export function validateReviewerStatusChange(
  app: ApplicationRecord,
  nextStatus: ApplicationStatus,
  majorCutoff: number,
  notes?: string
):
  | { ok: true; normalizedNote?: string; isBelowCutoffOverride: boolean; error?: undefined }
  | { ok: false; error: string } {
  if (app.status === nextStatus) {
    return { ok: false, error: `Hồ sơ ${app.code} hiện đã ở trạng thái "${nextStatus}".` };
  }

  if (isTerminalStatus(app.status)) {
    return {
      ok: false,
      error: `Hồ sơ ${app.code} đã kết thúc (${app.status}), không thể khôi phục hoặc đổi trạng thái!`,
    };
  }

  const allowedNext = ALLOWED_REVIEWER_TRANSITIONS[app.status] || [];
  if (!allowedNext.includes(nextStatus)) {
    if (app.status === 'Đang xét duyệt' && nextStatus === 'Đã trúng tuyển') {
      return {
        ok: false,
        error: `Quy trình xét duyệt chuẩn: Hồ sơ ${app.code} cần được xác nhận "Hồ sơ hợp lệ" trước khi phê duyệt "Đã trúng tuyển"!`,
      };
    }
    return {
      ok: false,
      error: `Không thể chuyển trực tiếp từ "${app.status}" sang "${nextStatus}".`,
    };
  }

  const cleanNote = (notes || '').trim();
  const isBelowCutoff = roundScore2(app.score - majorCutoff) < 0;

  if ((nextStatus === 'Hồ sơ hợp lệ' || nextStatus === 'Đã trúng tuyển') && isBelowCutoff) {
    if (cleanNote.length < 8) {
      return {
        ok: false,
        error: `Điểm hồ sơ (${app.score}đ) thấp hơn chuẩn ngành (${majorCutoff}đ). Bắt buộc nhập căn cứ giải trình (≥ 8 ký tự, VD: Xét tuyển sớm học bạ / Chứng chỉ quốc tế)!`,
      };
    }
    return { ok: true, normalizedNote: cleanNote, isBelowCutoffOverride: true };
  }

  if (nextStatus === 'Thiếu hồ sơ' || nextStatus === 'Đã bị hủy') {
    if (cleanNote.length < 6) {
      return {
        ok: false,
        error: `Vui lòng nhập rõ lý do "${nextStatus}" (tối thiểu 6 ký tự) trước khi xác nhận!`,
      };
    }
  }

  return {
    ok: true,
    normalizedNote: cleanNote || undefined,
    isBelowCutoffOverride: false,
  };
}

export interface ComputedHollandAssessment {
  primaryCode: HollandCode;
  scores: Record<HollandCode, number>;
  topCodes: HollandCode[];
  tiedTopCodes: HollandCode[];
  completedAt: string;
}

export function computeHollandAssessment(
  scores: Record<HollandCode, number>,
  completedAt = 'Hôm nay'
): ComputedHollandAssessment {
  const allCodes: HollandCode[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  const sorted = [...allCodes].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const positive = sorted.filter((code) => (scores[code] || 0) > 0);

  if (positive.length === 0) {
    return {
      primaryCode: 'R',
      scores,
      topCodes: ['R'],
      tiedTopCodes: [],
      completedAt,
    };
  }

  const maxScore = scores[positive[0]] || 0;
  const tiedAtTop = positive.filter((code) => (scores[code] || 0) === maxScore);
  const topCodes = positive.slice(0, 3);

  return {
    primaryCode: positive[0],
    scores,
    topCodes,
    tiedTopCodes: tiedAtTop.length >= 2 ? tiedAtTop : [],
    completedAt,
  };
}
