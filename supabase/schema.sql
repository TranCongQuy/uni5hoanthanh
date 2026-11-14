-- ============================================================================
-- UNIPATH 2.0 — SUPABASE POSTGRESQL SCHEMA & ROW-LEVEL SECURITY (RLS)
-- Nhóm UP5 — Trường Đại học Phú Xuân (PXU)
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. PROFILES & ROLE-BASED ACCESS CONTROL
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'admin', 'university_pxu')),
  phone text,
  school text,
  province text,
  expected_score numeric(4,2) default 24.5 check (expected_score >= 10 and expected_score <= 30),
  holland_primary text check (holland_primary in ('R','I','A','S','E','C')),
  is_premium boolean default false,
  created_at timestamptz default now()
);

-- 2. UNIVERSITIES & CUTOFF SCORES
create table if not exists public.universities (
  id integer primary key,
  code text unique not null,
  name text not null,
  loc text not null,
  region text not null check (region in ('Bắc', 'Trung', 'Nam')),
  tuition_min numeric(6,2) not null check (tuition_min >= 0 and tuition_min <= 200),
  tuition_max numeric(6,2) not null check (tuition_max >= tuition_min),
  score_2024 numeric(4,2) not null check (score_2024 >= 12 and score_2024 <= 30),
  cutoff_scores jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- 3. ADMISSION APPLICATIONS (WITH SERVER-SIDE FSM & OWNER ISOLATION)
create table if not exists public.applications (
  id text primary key,
  code text unique not null,
  uni_id integer not null references public.universities(id),
  uni_code text not null,
  uni_name text not null,
  major text not null,
  candidate_name text not null,
  phone text not null,
  email text not null,
  score numeric(4,2) not null check (score >= 10 and score <= 30),
  status text not null default 'Đang xét duyệt' check (
    status in ('Đang xét duyệt', 'Hồ sơ hợp lệ', 'Thiếu hồ sơ', 'Đã trúng tuyển', 'Đã hủy', 'Đã bị hủy')
  ),
  notes text,
  cancel_reason text,
  submitted_at_iso timestamptz not null default now(),
  updated_at timestamptz default now()
);

-- Unique partial index preventing duplicate active applications (email + uni_id + major)
create unique index if not exists idx_unique_active_application
  on public.applications (lower(email), uni_id, lower(major))
  where status not in ('Đã trúng tuyển', 'Đã hủy', 'Đã bị hủy');

-- 4. CONSULTATION BOOKINGS
create table if not exists public.bookings (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  uni_code text not null,
  uni_name text,
  major text not null,
  scheduled_date date not null check (scheduled_date >= current_date),
  time_slot text not null,
  channel text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'done')),
  notes text,
  created_at timestamptz default now()
);

-- 5. INSTITUTIONAL PROCESSING AUDIT LOGS
create table if not exists public.processing_logs (
  id text primary key,
  actor text not null,
  role text not null,
  action text not null,
  target_code text not null,
  uni_code text not null,
  detail text not null,
  created_at timestamptz default now()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.universities enable row level security;
alter table public.applications enable row level security;
alter table public.bookings enable row level security;
alter table public.processing_logs enable row level security;

-- Helper role check
create or replace function public.current_user_role()
returns text language sql security definer stable as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'student');
$$;

-- Universities: everyone can read; only admin (or PXU for PXU) can update
create policy "universities_select_all" on public.universities
  for select using (true);

create policy "universities_update_institutional" on public.universities
  for update using (
    public.current_user_role() = 'admin'
    or (public.current_user_role() = 'university_pxu' and code = 'PXU')
  );

-- Applications: students read/insert/withdraw ONLY their own; PXU reads/updates ONLY PXU; Admin full access
create policy "applications_select_scoped" on public.applications
  for select using (
    public.current_user_role() = 'admin'
    or (public.current_user_role() = 'university_pxu' and uni_code = 'PXU')
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "applications_insert_own" on public.applications
  for insert with check (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "applications_update_scoped" on public.applications
  for update using (
    public.current_user_role() = 'admin'
    or (public.current_user_role() = 'university_pxu' and uni_code = 'PXU')
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
