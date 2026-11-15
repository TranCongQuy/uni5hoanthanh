import type { ApplicationRecord, ConsultationBooking, University } from '../types';

/**
 * Lightweight Supabase REST synchronization adapter (Zero-dependency PostgREST client).
 * When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in Vercel/.env,
 * changes are mirrored asynchronously to Supabase PostgreSQL while keeping LocalStorage
 * responsive and offline-safe.
 */

function getSupabaseEnv() {
  const url = ((import.meta.env.VITE_SUPABASE_URL as string | undefined) || '').replace(/\/+$/, '');
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '';
  return { url, anonKey, configured: Boolean(url && anonKey) };
}

export const isSupabaseConfigured = Boolean(
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() &&
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()
);

async function postgrestRequest(
  table: string,
  payload: Record<string, unknown>,
  upsert = false
): Promise<boolean> {
  const { url, anonKey, configured } = getSupabaseEnv();
  if (!configured) return false;
  try {
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: upsert ? 'resolution=merge-duplicates,return=minimal' : 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    // Offline or sandbox fallback: LocalStorage remains authoritative in client mode
    return false;
  }
}

export function syncApplicationToCloud(app: ApplicationRecord): void {
  void postgrestRequest('applications', {
    id: app.id,
    code: app.code,
    uni_id: app.uniId,
    uni_code: app.uniCode,
    uni_name: app.uniName,
    major: app.major,
    candidate_name: app.candidateName,
    phone: app.phone,
    email: app.email,
    score: app.score,
    status: app.status,
    notes: app.notes ?? null,
    cancel_reason: app.cancelReason ?? null,
    submitted_at_iso: app.submittedAtISO ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, true);
}

export function syncBookingToCloud(booking: ConsultationBooking, status = 'pending'): void {
  void postgrestRequest('bookings', {
    id: booking.id,
    name: booking.name,
    email: booking.email ?? '',
    phone: booking.phone,
    uni_code: booking.uniCode,
    uni_name: booking.uniName ?? '',
    major: booking.major,
    scheduled_date: booking.scheduledDateISO ?? new Date().toISOString().slice(0, 10),
    time_slot: booking.timeSlot ?? booking.dateTime,
    channel: booking.channel ?? 'Google Meet 1-1',
    status,
    notes: booking.notes,
  }, true);
}

export interface HollandResultSyncInput {
  scores: Record<string, number>;
  primaryCode: string;
  topCodes?: string[];
  secondaryCode?: string | null;
}

export async function syncQuizResultToCloud(
  email: string,
  result: HollandResultSyncInput
): Promise<boolean> {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) return false;

  const secondaryCode =
    result.secondaryCode !== undefined
      ? result.secondaryCode
      : result.topCodes && result.topCodes.length > 1
        ? result.topCodes[1]
        : null;

  return await postgrestRequest('quiz_results', {
    profile_email: normalizedEmail,
    scores: result.scores,
    primary_code: result.primaryCode,
    secondary_code: secondaryCode,
    created_at: new Date().toISOString(),
  }, false);
}

export interface SupabaseUniversityRow {
  id: number;
  code: string;
  name: string;
  loc: string;
  region: 'Bắc' | 'Trung' | 'Nam' | string;
  tuition_min: number | string;
  tuition_max: number | string;
  score_2024: number | string;
  cutoff_scores?: Record<string, number> | null;
}

/**
 * Tải danh sách trường từ Supabase REST API với timeout 4 giây.
 * Trả về null khi thiếu env, timeout hoặc gặp lỗi mạng.
 */
export async function fetchUniversitiesFromCloud(): Promise<SupabaseUniversityRow[] | null> {
  const { url, anonKey, configured } = getSupabaseEnv();
  if (!configured) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${url}/rest/v1/universities?select=*`, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? (data as SupabaseUniversityRow[]) : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Trộn dữ liệu trường từ Supabase (thắng ở các cột DB quản lý)
 * với dữ liệu MockData (giữ nguyên majors, rating, desc, employmentRate, score2022/2023).
 * Khi không có dữ liệu cloud hoặc mảng rỗng, fallback nguyên vẹn về localUnis.
 */
export function mergeUniversitiesWithCloud(
  localUnis: University[],
  cloudRows: SupabaseUniversityRow[] | null
): { merged: University[]; source: 'db' | 'local' } {
  if (!cloudRows || !Array.isArray(cloudRows) || cloudRows.length === 0) {
    return { merged: localUnis, source: 'local' };
  }

  const cloudMap = new Map<string, SupabaseUniversityRow>();
  for (const row of cloudRows) {
    if (row && row.code) {
      cloudMap.set(row.code.trim().toUpperCase(), row);
    }
  }

  const merged = localUnis.map((localUni) => {
    const cloud = cloudMap.get(localUni.code.trim().toUpperCase());
    if (!cloud) return localUni;

    return {
      ...localUni,
      id: typeof cloud.id === 'number' ? cloud.id : localUni.id,
      code: cloud.code || localUni.code,
      name: cloud.name || localUni.name,
      loc: cloud.loc || localUni.loc,
      region: (cloud.region as 'Bắc' | 'Trung' | 'Nam') || localUni.region,
      tuitionMin: cloud.tuition_min != null ? Number(cloud.tuition_min) : localUni.tuitionMin,
      tuitionMax: cloud.tuition_max != null ? Number(cloud.tuition_max) : localUni.tuitionMax,
      score2024: cloud.score_2024 != null ? Number(cloud.score_2024) : localUni.score2024,
      cutoffScores:
        cloud.cutoff_scores && Object.keys(cloud.cutoff_scores).length > 0
          ? cloud.cutoff_scores
          : localUni.cutoffScores,
      // Bảo toàn các trường dữ liệu client mà DB chưa có:
      majors: localUni.majors,
      rating: localUni.rating,
      desc: localUni.desc,
      employmentRate: localUni.employmentRate,
      score2022: localUni.score2022,
      score2023: localUni.score2023,
      emoji: localUni.emoji,
    };
  });

  return { merged, source: 'db' };
}
