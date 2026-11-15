-- Esquema SQL para Supabase (PostgreSQL Free Tier)
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase para despliegue en Vercel (400+ usuarios simultaneos)

create table if not exists public.students (
  cif text primary key,
  full_name text not null,
  career text not null,
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  sheet_row integer,
  sync_status text not null default 'synced'
);

create index if not exists idx_students_checked_in on public.students(checked_in);
create index if not exists idx_students_sync_status on public.students(sync_status);

create table if not exists public.companies (
  id bigint generated always as identity primary key,
  name text unique not null,
  sort_order integer not null default 0
);

create table if not exists public.registrations (
  id text primary key,
  category text not null check (category in ('sponsor', 'teacher', 'guest')),
  company text,
  first_name text not null,
  last_name text not null,
  career text,
  created_at timestamptz not null default now(),
  sync_status text not null default 'pending'
);

create index if not exists idx_registrations_category on public.registrations(category);
create index if not exists idx_registrations_created_at on public.registrations(created_at desc);
create index if not exists idx_registrations_sync_status on public.registrations(sync_status);

create table if not exists public.app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

