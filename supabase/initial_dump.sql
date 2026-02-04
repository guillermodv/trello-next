-- =========================
-- SUPABASE DEV RESET DUMP
-- =========================

create extension if not exists pgcrypto;

-- =========================
-- DROP POLICIES
-- =========================

do $$ declare r record;
begin
  for r in (
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('boards', 'lists', 'cards')
  ) loop
    execute format(
      'drop policy if exists "%s" on %I.%I',
      r.policyname, r.schemaname, r.tablename
    );
  end loop;
end $$;

-- =========================
-- DROP TABLES
-- =========================

drop table if exists cards cascade;
drop table if exists lists cascade;
drop table if exists boards cascade;

-- =========================
-- CREATE TABLES
-- =========================

create table boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner uuid,
  created_at timestamp default now()
);

create table lists (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  title text not null,
  position int not null
);

create table cards (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists(id) on delete cascade,
  title text not null,
  description text default '',
  "position" int not null,
  author text default '',
  link text default ''
);

-- =========================
-- RLS
-- =========================

alter table boards enable row level security;
alter table lists enable row level security;
alter table cards enable row level security;

-- =========================
-- DEV POLICIES (FULL CRUD)
-- =========================

create policy "dev_select_boards"
on boards
for select
using (true);

create policy "dev_insert_boards"
on boards
for insert
with check (true);

create policy "dev_update_boards"
on boards
for update
using (true)
with check (true);

create policy "dev_delete_boards"
on boards
for delete
using (true);

-- ---- LISTS ----

create policy "dev_select_lists"
on lists
for select
using (true);

create policy "dev_insert_lists"
on lists
for insert
with check (true);

create policy "dev_update_lists"
on lists
for update
using (true)
with check (true);

create policy "dev_delete_lists"
on lists
for delete
using (true);

-- ---- CARDS ----

create policy "dev_select_cards"
on cards
for select
using (true);

create policy "dev_insert_cards"
on cards
for insert
with check (true);

create policy "dev_update_cards"
on cards
for update
using (true)
with check (true);

create policy "dev_delete_cards"
on cards
for delete
using (true);

-- =========================
-- SEED DATA
-- =========================

insert into boards (id, title) values
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'My Sample Trello Board'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Proyecto personal'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Proyecto de trabajo');

insert into lists (id, board_id, title, position) values
-- My Sample Trello Board
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Por hacer', 0),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'En progreso', 1),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Hecho', 2),
-- Proyecto personal
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Ideas', 0),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Comprado', 1),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Wishlist', 2),
-- Proyecto de trabajo
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Backlog', 0),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'En desarrollo', 1),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'En testing', 2),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Deploy', 3);

insert into cards (list_id, title, position, author, link) values
-- My Sample Trello Board
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Corregir bug visual', 0, 'John Doe', 'https://example.com'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Validar registro', 1, '', ''),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Subida de archivos', 0, 'Jane Doe', ''),
-- Proyecto personal
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Comprar monitor', 0, '', ''),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Nuevo teclado', 0, '', ''),
-- Proyecto de trabajo
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Autenticación', 0, 'Admin', '');

-- =========================
-- REALTIME
-- =========================

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    alter publication supabase_realtime add table boards;
    alter publication supabase_realtime add table lists;
    alter publication supabase_realtime add table cards;
  end if;
end $$;
