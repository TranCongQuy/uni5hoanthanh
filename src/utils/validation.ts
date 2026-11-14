/**
 * Centralized validation, decimal parsing, date/time normalization,
 * tuition formatting, and CSV formula-injection defense for UniPath.
 */

export function roundScore2(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Parses a decimal number written with either '.' or ',' (e.g. "25.7" or "25,7").
 * Rejects malformed strings ("25.2.1", "abc", "", NaN, Infinity).
 */
export function parseDecimalInput(raw: string | number): number | null {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? roundScore2(raw) : null;
  }
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().replace(',', '.');
  if (!normalized) return null;
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return roundScore2(parsed);
}

export function formatCleanDecimal(n: number, maxDecimals = 2): string {
  if (!Number.isFinite(n)) return '0';
  const factor = Math.pow(10, Math.max(0, maxDecimals));
  const clean = Math.round((n + Number.EPSILON) * factor) / factor;
  return String(clean);
}

export function validateStudentScore(
  raw: string | number
): { ok: true; value: number; error?: undefined } | { ok: false; error: string } {
  const val = parseDecimalInput(raw);
  if (val === null) {
    return { ok: false, error: 'Điểm xét tuyển không hợp lệ (VD hợp lệ: 24.5 hoặc 24,5).' };
  }
  if (val < 10 || val > 30) {
    return { ok: false, error: 'Điểm xét tuyển trên thang 30 phải nằm trong khoảng từ 10.0 đến 30.0 điểm.' };
  }
  return { ok: true, value: val };
}

export function validateCutoffScore(
  raw: string | number
): { ok: true; value: number; error?: undefined } | { ok: false; error: string } {
  const val = parseDecimalInput(raw);
  if (val === null) {
    return { ok: false, error: 'Điểm chuẩn không hợp lệ. Vui lòng nhập số thập phân (VD: 25.2 hoặc 25,2).' };
  }
  if (val < 12 || val > 30) {
    return { ok: false, error: 'Điểm chuẩn đại học phải nằm trong khoảng từ 12.0 đến 30.0 điểm.' };
  }
  return { ok: true, value: val };
}

export function validateTuitionMin(
  raw: string | number
): { ok: true; value: number; error?: undefined } | { ok: false; error: string } {
  const val = parseDecimalInput(raw);
  if (val === null) {
    return { ok: false, error: 'Mức học phí không hợp lệ. Vui lòng nhập số (triệu VNĐ/năm).' };
  }
  if (val < 0 || val > 200) {
    return { ok: false, error: 'Học phí phải nằm trong khoảng từ 0 đến 200 triệu VNĐ/năm.' };
  }
  return { ok: true, value: roundScore2(val) };
}

export function validateVietnamPhone(
  raw: string
): { ok: true; normalized: string; formatted: string; error?: undefined } | { ok: false; error: string } {
  const compact = (raw || '').trim().replace(/[\s.\-()]/g, '');
  let digits = compact;
  if (digits.startsWith('+84')) {
    digits = '0' + digits.slice(3);
  } else if (digits.startsWith('84') && digits.length === 11) {
    digits = '0' + digits.slice(2);
  }
  if (!/^0[35789]\d{8}$/.test(digits)) {
    return {
      ok: false,
      error: 'Số điện thoại không hợp lệ (cần 10 chữ số di động Việt Nam, bắt đầu bằng 03, 05, 07, 08 hoặc 09).',
    };
  }
  const formatted = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return { ok: true, normalized: digits, formatted };
}

export function validateEmail(raw: string): boolean {
  const s = (raw || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

/**
 * Defends against CSV Formula Injection (OWASP CSV Injection):
 * Any value starting with =, +, -, @, Tab, or CR is prefixed with a single quote (')
 * and properly RFC-4180 double-quoted.
 */
export function sanitizeCsvCell(val: unknown): string {
  const str = String(val ?? '').replace(/\r?\n/g, ' ');
  const trimmedLeft = str.replace(/^\s+/, '');
  const dangerousStart = /^[=+\-@\t\r]/.test(str) || /^[=+\-@\t\r]/.test(trimmedLeft);
  const safe = dangerousStart ? `'${str}` : str;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function getLocalTodayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLocalOffsetDateISO(daysOffset: number, now: Date = new Date()): string {
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysOffset);
  return getLocalTodayISO(target);
}

export function isPastDateISO(dateISO: string, todayISO: string = getLocalTodayISO()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return true;
  return dateISO < todayISO;
}

export function formatNowViDateTime(now: Date = new Date()): { vi: string; iso: string } {
  const pad = (n: number) => String(n).padStart(2, '0');
  const vi = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}`;
  return { vi, iso: now.toISOString() };
}

/**
 * Parses either an ISO string or Vietnamese formatted strings ("dd/MM/yyyy HH:mm"
 * or "HH:mm - dd/MM/yyyy") into epoch milliseconds for chronological sorting.
 */
export function parseViDateTimeToMs(viDateStr?: string, isoFallback?: string): number {
  if (isoFallback) {
    const isoMs = Date.parse(isoFallback);
    if (Number.isFinite(isoMs)) return isoMs;
  }
  if (!viDateStr) return 0;

  // Pattern 1: "dd/MM/yyyy HH:mm" or "dd/MM/yyyy"
  const m1 = viDateStr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?/);
  if (m1) {
    const day = Number(m1[1]);
    const month = Number(m1[2]) - 1;
    const year = Number(m1[3]);
    const hour = m1[4] ? Number(m1[4]) : 0;
    const min = m1[5] ? Number(m1[5]) : 0;
    return new Date(year, month, day, hour, min).getTime();
  }

  // Pattern 2: "HH:mm ... dd/MM/yyyy"
  const m2 = viDateStr.trim().match(/(\d{1,2}):(\d{1,2}).*?(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m2) {
    const hour = Number(m2[1]);
    const min = Number(m2[2]);
    const day = Number(m2[3]);
    const month = Number(m2[4]) - 1;
    const year = Number(m2[5]);
    return new Date(year, month, day, hour, min).getTime();
  }

  const fallback = Date.parse(viDateStr);
  return Number.isFinite(fallback) ? fallback : 0;
}

export function formatTuitionRange(tuitionMin: number, tuitionMax: number, compact = false): string {
  const min = roundScore2(tuitionMin);
  const max = roundScore2(Math.max(tuitionMin, tuitionMax));
  if (min === 0 && max === 0) return 'Miễn học phí';
  if (min === 0) {
    return compact ? `0–${max}tr` : `0–${max} tr/năm`;
  }
  if (min === max) {
    return compact ? `${min}tr` : `${min} tr/năm`;
  }
  return compact ? `${min}–${max}tr` : `${min}–${max} tr/năm`;
}
