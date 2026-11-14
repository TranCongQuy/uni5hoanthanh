import type { ApplicationRecord, ConsultationBooking } from '../types';

/**
 * Lightweight Supabase REST synchronization adapter (Zero-dependency PostgREST client).
 * When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in Vercel/.env,
 * changes are mirrored asynchronously to Supabase PostgreSQL while keeping LocalStorage
 * responsive and offline-safe.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '') || '';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

async function postgrestUpsert(table: string, payload: Record<string, unknown>): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Offline or sandbox fallback: LocalStorage remains authoritative in client mode
  }
}

export function syncApplicationToCloud(app: ApplicationRecord): void {
  if (!isSupabaseConfigured) return;
  void postgrestUpsert('applications', {
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
  });
}

export function syncBookingToCloud(booking: ConsultationBooking, status = 'pending'): void {
  if (!isSupabaseConfigured) return;
  void postgrestUpsert('bookings', {
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
  });
}
