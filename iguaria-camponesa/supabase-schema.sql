-- ═══════════════════════════════════════
-- Iguaria Camponesa — Supabase Schema
-- ═══════════════════════════════════════

-- Reservas
create table if not exists reservas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  telefone    text,
  data        date not null,
  hora        text not null,
  pessoas     text,
  notas       text,
  estado      text not null default 'Pendente' check (estado in ('Pendente','Confirmada','Cancelada')),
  criado_em   timestamptz default now()
);

-- Pratos (menu completo)
create table if not exists pratos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  descricao   text,
  preco       numeric(6,2),
  categoria   text not null check (categoria in ('Entradas','Carnes','Peixes','Sobremesas','Bebidas')),
  ativo       boolean default true,
  ordem       int default 0
);

-- Pratos do Dia
create table if not exists pratos_do_dia (
  id          uuid primary key default gen_random_uuid(),
  prato_id    uuid references pratos(id) on delete cascade,
  data        date not null,
  ativo       boolean default true,
  unique(prato_id, data)
);

-- Galeria
create table if not exists galeria (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  storage_path text,
  descricao   text,
  destaque    boolean default false,
  ordem       int default 0,
  criado_em   timestamptz default now()
);

-- Calendário de disponibilidade
create table if not exists calendario (
  id          uuid primary key default gen_random_uuid(),
  data        date not null unique,
  estado      text not null default 'Disponível' check (estado in ('Disponível','Lotado','Fechado'))
);

-- ── RLS (Row Level Security) ─────────────────────────────────────

-- Reservas: público pode inserir (formulário do site), admin lê tudo
alter table reservas enable row level security;
create policy "público insere reservas" on reservas for insert with check (true);
create policy "admin lê reservas"       on reservas for select using (auth.role() = 'authenticated');
create policy "admin atualiza reservas" on reservas for update using (auth.role() = 'authenticated');

-- Restantes tabelas: apenas autenticados
alter table pratos         enable row level security;
alter table pratos_do_dia  enable row level security;
alter table galeria        enable row level security;
alter table calendario     enable row level security;

create policy "admin full pratos"        on pratos        for all using (auth.role() = 'authenticated');
create policy "admin full pratos_do_dia" on pratos_do_dia for all using (auth.role() = 'authenticated');
create policy "público lê galeria"       on galeria       for select using (true);
create policy "admin gere galeria"       on galeria       for all   using (auth.role() = 'authenticated');
create policy "público lê calendario"    on calendario    for select using (true);
create policy "admin gere calendario"    on calendario    for all   using (auth.role() = 'authenticated');

-- ── Storage ─────────────────────────────────────────────────────
-- Criar bucket 'galeria' em Supabase Dashboard > Storage > New bucket
-- Marcar como Public para URLs públicas
