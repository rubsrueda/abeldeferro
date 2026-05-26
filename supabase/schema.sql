-- Esquema de tablas para Abel de Ferro (Supabase)
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- Tabla de usuarios registrados
create table if not exists af_usuarios (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nombre text,
  idioma text,
  is_admin boolean default false,
  creado_en timestamp with time zone default now(),
  ultimo_login timestamp with time zone
);

-- Tabla de compras realizadas
create table if not exists af_compras (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references af_usuarios(id) on delete set null,
  email text not null,
  producto text not null,
  stripe_payment_id text,
  monto numeric,
  moneda text,
  fecha_pago timestamp with time zone default now(),
  exito boolean default true,
  metadata jsonb
);

-- Tabla de entitlements (accesos concedidos)
create table if not exists af_entitlements (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references af_usuarios(id) on delete cascade,
  producto text not null,
  concedido_en timestamp with time zone default now(),
  activo boolean default true,
  unique(usuario_id, producto)
);

-- Progreso de lectura
create table if not exists af_reading_progress (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references af_usuarios(id) on delete cascade,
  libro_id text not null,
  pagina_actual integer default 0,
  palabra_actual integer default 0,
  porcentaje numeric default 0,
  actualizado_en timestamp with time zone default now(),
  unique(usuario_id, libro_id)
);

-- Reseñas
create table if not exists af_resenas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references af_usuarios(id) on delete cascade,
  libro_id text not null,
  calificacion integer check (calificacion between 1 and 5),
  comentario text,
  creado_en timestamp with time zone default now(),
  unique(usuario_id, libro_id)
);

-- Referidos
create table if not exists af_referidos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  referidor_id uuid references af_usuarios(id) on delete set null,
  referido_id uuid references af_usuarios(id) on delete set null,
  convertido boolean default false,
  creado_en timestamp with time zone default now()
);

-- Logs de acciones
create table if not exists af_logs (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references af_usuarios(id) on delete set null,
  email text,
  accion text not null,
  detalles jsonb,
  fecha timestamp with time zone default now()
);

-- RLS Policies
alter table af_usuarios enable row level security;
alter table af_compras enable row level security;
alter table af_entitlements enable row level security;
alter table af_reading_progress enable row level security;
alter table af_resenas enable row level security;
alter table af_referidos enable row level security;
alter table af_logs enable row level security;

-- Users can read/update their own data
create policy "Users own data" on af_usuarios for all using (auth.uid() = id);
create policy "Users own purchases" on af_compras for select using (auth.uid() = usuario_id);
create policy "Users own entitlements" on af_entitlements for select using (auth.uid() = usuario_id);
create policy "Users own progress" on af_reading_progress for all using (auth.uid() = usuario_id);
create policy "Users own reviews" on af_resenas for all using (auth.uid() = usuario_id);
create policy "Public reviews readable" on af_resenas for select using (true);
create policy "Public referrals readable" on af_referidos for select using (true);

-- Function: create user profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into af_usuarios (id, email, nombre)
  values (new.id, new.email, new.raw_user_meta_data->>'nombre')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
