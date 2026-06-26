-- ============================================================
--  NEEDMONEY4MUSIC — esquema de base de datos (Supabase)
--  Ejecuta esto en el SQL Editor de tu proyecto Supabase.
-- ============================================================

create extension if not exists "pgcrypto";

-- Tabla de fans / leads del embudo
create table if not exists public.fans (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text,                      -- nombre de la "puerta de nombre"
  email        text,                      -- al registrarse con OAuth
  provider     text,                      -- google | spotify | apple | name_gate
  spotify_id   text,                      -- si entra con Spotify
  avatar_url   text,
  user_id      uuid references auth.users(id) on delete set null,
  source       text default 'name_gate',  -- de dónde vino el lead
  unique (email)
);

create index if not exists fans_user_id_idx on public.fans (user_id);
create index if not exists fans_created_at_idx on public.fans (created_at desc);

-- ------------------------------------------------------------
-- RLS: el embudo escribe con la SERVICE ROLE KEY desde el server
-- (rutas /api), que ignora RLS. Aun así dejamos RLS activado y
-- sin políticas públicas para que el cliente anónimo NO pueda leer
-- ni escribir la tabla directamente.
-- ------------------------------------------------------------
alter table public.fans enable row level security;

-- (Opcional) permitir que cada usuario autenticado lea SU propia fila:
drop policy if exists "fans_select_own" on public.fans;
create policy "fans_select_own"
  on public.fans for select
  using (auth.uid() = user_id);

-- Vista pública agregada para el contador (sin exponer datos personales)
create or replace view public.fan_count as
  select count(*)::int as total from public.fans;

-- Cuando un usuario se autentica, enlazamos/creamos su fila de fan.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.fans (user_id, email, name, provider, avatar_url, source)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_app_meta_data->>'provider', 'oauth'),
    new.raw_user_meta_data->>'avatar_url',
    'oauth'
  )
  on conflict (email) do update
    set user_id = excluded.user_id,
        provider = excluded.provider,
        avatar_url = coalesce(excluded.avatar_url, public.fans.avatar_url);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

