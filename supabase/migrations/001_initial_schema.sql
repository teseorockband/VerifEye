-- VerifEye — Migración inicial
-- Ejecutar en Supabase SQL Editor o via supabase db push

-- Extensiones
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- para búsqueda fuzzy

-- ──────────────────────────────────────────
-- ENUMS
-- ──────────────────────────────────────────

create type link_level as enum (
  'none',
  'indirect',
  'direct',
  'produced_in_israel',
  'produced_in_settlements'
);

create type product_category as enum (
  'food',
  'cosmetics',
  'technology',
  'fashion',
  'household',
  'other'
);

create type report_status as enum (
  'pending',
  'approved',
  'rejected'
);

-- ──────────────────────────────────────────
-- FUENTES
-- ──────────────────────────────────────────

create table sources (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  url         text not null,
  description text,
  last_checked timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

comment on table sources is 'Fuentes verificables de información (UN OHCHR, Who Profits, BDS, etc.)';

-- ──────────────────────────────────────────
-- EMPRESAS
-- ──────────────────────────────────────────

create table companies (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  country           text not null,           -- ISO 3166-1 alpha-2
  parent_company_id uuid references companies(id) on delete set null,
  website           text,
  description       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table companies is 'Empresas fabricantes y sus matrices corporativas';
create index on companies using gin (name gin_trgm_ops);
create index on companies (parent_company_id);

-- ──────────────────────────────────────────
-- PRODUCTOS
-- ──────────────────────────────────────────

create table products (
  id                uuid primary key default uuid_generate_v4(),
  ean               text not null unique,    -- código EAN/UPC
  name              text not null,
  brand             text not null,
  category          product_category not null default 'other',
  country_of_origin text not null,           -- ISO 3166-1 alpha-2
  company_id        uuid references companies(id) on delete set null,
  image_url         text,
  link_level        link_level not null default 'none',
  link_summary      text,                    -- resumen en texto plano de los vínculos
  last_verified     timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table products is 'Productos identificados por código EAN';
create index on products using gin (name gin_trgm_ops);
create index on products using gin (brand gin_trgm_ops);
create index on products (category);
create index on products (link_level);
create index on products (company_id);

-- ──────────────────────────────────────────
-- RELACIONES (many-to-many con tipo de vínculo y fuente)
-- ──────────────────────────────────────────

create table relationships (
  id           uuid primary key default uuid_generate_v4(),
  subject_type text not null check (subject_type in ('product', 'company')),
  subject_id   uuid not null,
  object_type  text not null check (object_type in ('company', 'country')),
  object_id    text not null,               -- uuid de empresa o código ISO de país
  link_type    link_level not null,
  description  text not null,              -- descripción humana del vínculo
  source_id    uuid not null references sources(id),
  verified_at  timestamptz not null default now(),
  created_at   timestamptz not null default now(),

  -- Garantía: sin fuente no hay relación publicada
  constraint must_have_source check (source_id is not null)
);

comment on table relationships is 'Vínculos entre productos/empresas y países/entidades. Siempre requieren fuente.';
create index on relationships (subject_type, subject_id);
create index on relationships (link_type);
create index on relationships (source_id);

-- ──────────────────────────────────────────
-- ALTERNATIVAS
-- ──────────────────────────────────────────

create table alternatives (
  id                     uuid primary key default uuid_generate_v4(),
  product_id             uuid not null references products(id) on delete cascade,
  alternative_product_id uuid not null references products(id) on delete cascade,
  reason                 text,
  created_at             timestamptz not null default now(),

  constraint no_self_reference check (product_id != alternative_product_id),
  unique (product_id, alternative_product_id)
);

comment on table alternatives is 'Productos alternativos sugeridos sin los vínculos detectados';
create index on alternatives (product_id);

-- ──────────────────────────────────────────
-- REPORTES COMUNITARIOS
-- ──────────────────────────────────────────

create table user_reports (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) on delete set null,
  product_ean      text not null,
  description      text not null,
  source_url       text not null,            -- obligatorio: sin fuente no se acepta
  status           report_status not null default 'pending',
  moderator_notes  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table user_reports is 'Reportes comunitarios pendientes de moderación';
create index on user_reports (status);
create index on user_reports (product_ean);

-- ──────────────────────────────────────────
-- DISPUTAS (empresas que solicitan revisión)
-- ──────────────────────────────────────────

create table disputes (
  id                  uuid primary key default uuid_generate_v4(),
  product_id          uuid references products(id) on delete set null,
  company_name        text not null,
  contact_email       text not null,
  description         text not null,
  documentation_url   text,
  status              report_status not null default 'pending',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table disputes is 'Solicitudes de revisión enviadas por empresas afectadas';

-- ──────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────

alter table sources       enable row level security;
alter table companies     enable row level security;
alter table products      enable row level security;
alter table relationships enable row level security;
alter table alternatives  enable row level security;
alter table user_reports  enable row level security;
alter table disputes      enable row level security;

-- Lectura pública para datos de referencia
create policy "public read sources"       on sources       for select using (true);
create policy "public read companies"     on companies     for select using (true);
create policy "public read products"      on products      for select using (true);
create policy "public read relationships" on relationships for select using (true);
create policy "public read alternatives"  on alternatives  for select using (true);

-- Reportes: inserción pública, lectura solo del propio usuario
create policy "insert report"       on user_reports for insert with check (true);
create policy "read own reports"    on user_reports for select using (auth.uid() = user_id);

-- Disputas: inserción pública
create policy "insert dispute"      on disputes     for insert with check (true);

-- ──────────────────────────────────────────
-- FUNCIÓN: actualizar updated_at automáticamente
-- ──────────────────────────────────────────

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_companies_updated_at     before update on companies     for each row execute function update_updated_at();
create trigger trg_products_updated_at      before update on products      for each row execute function update_updated_at();
create trigger trg_user_reports_updated_at  before update on user_reports  for each row execute function update_updated_at();
create trigger trg_disputes_updated_at      before update on disputes      for each row execute function update_updated_at();
