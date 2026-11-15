import type { ApplicationRecord, ConsultationBooking } from '../types';

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
