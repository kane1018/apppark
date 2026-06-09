-- ============================================================
-- AppPark: Supabase 初期セットアップ（SQL Editor に丸ごと貼って Run）
-- 内容 = migrations/0001_schema.sql + 0002_rls_policies.sql
-- ※ オーナー紐付け（0003）は「初回ログイン後」に別途実行します。
-- ============================================================

-- ========== 0001_schema.sql ==========
-- AppPark: スキーマ定義（Supabase / Postgres）
-- 本ファイルはテーブル・型・制約・インデックスのみ。RLSは 0002 で設定します。
-- 既存のアプリ型（src/types）に対応。snake_case で定義します。

-- ============ enum ============
do $$ begin
  create type app_role as enum ('user', 'maker', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_type as enum ('external', 'internal_mini_tool', 'iframe_embed', 'development');
exception when duplicate_object then null; end $$;

do $$ begin
  create type moderation_state as enum ('draft', 'reviewing', 'published', 'hidden', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type comment_moderation as enum ('published', 'pending', 'hidden', 'deleted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type risk_level as enum ('low', 'medium', 'high');
exception when duplicate_object then null; end $$;

do $$ begin
  create type idea_status as enum ('open', 'planned', 'in_progress', 'created', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_type as enum ('listing', 'edit', 'hide', 'delete', 'iframe', 'development');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

-- ============ profiles ============
-- email / role は非公開（本人マイページ・管理者のみ）。公開は public_profiles ビュー経由。
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,                 -- 非公開（本人/管理者のみ。公開ビューには含めない）
  slug          text unique not null,
  nickname      text not null,
  display_name  text not null,
  avatar_url    text,
  bio           text,
  role          app_role not null default 'user',  -- 非公開（admin判定）
  contact_name  text,                 -- 非公開（運営確認用）
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============ services ============
create table if not exists public.services (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  author_id         uuid not null references public.profiles (id) on delete cascade,
  name              text not null,
  short_description text not null,
  description       text not null default '',
  category          text not null,
  sub_categories    text[] not null default '{}',
  purposes          text[] not null default '{}',
  audience_tags     text[] not null default '{}',
  tool_type_tags    text[] not null default '{}',
  pricing_tags      text[] not null default '{}',
  status_tags       text[] not null default '{}',
  tags              text[] not null default '{}',
  pricing           text not null default 'free',
  status            text not null default 'active',
  listing_type      listing_type not null default 'internal_mini_tool',
  is_ai_enabled     boolean not null default false,
  is_internal_mini_tool boolean not null default false,
  is_first_party    boolean not null default false,
  created_by        text not null default 'user',
  thumbnail_url     text,
  gallery_image_urls text[] not null default '{}',
  image_alt         text,
  url               text not null default '',
  cta_label         text,
  cta_url           text,
  related_idea_id   uuid,
  faq               jsonb not null default '[]',
  recruitment_status text[] not null default '{}',
  recruitment_note  text,
  mini_tool         jsonb not null default '{"enabled":false,"type":"none","config":null}',
  iframe_embed      jsonb not null default '{"requested":false,"url":null,"approved":false}',
  development_info  jsonb not null default '{"enabled":false,"status":null,"plannedRelease":null}',
  moderation_state  moderation_state not null default 'draft',
  moderation_internal_note text,        -- 非公開（運営メモ）
  views             integer not null default 0,
  clicks            integer not null default 0,
  helpful_count     integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_services_author on public.services (author_id);
create index if not exists idx_services_state  on public.services (moderation_state);
create index if not exists idx_services_category on public.services (category);

-- ============ mini_tools（services から分離する場合・任意） ============
create table if not exists public.mini_tools (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null references public.services (id) on delete cascade,
  author_id   uuid not null references public.profiles (id) on delete cascade,
  type        text not null,           -- diagnosis/calculator/template_generator/checklist/text_transform/random
  config      jsonb not null,          -- テンプレート型のみ（HTML/JS不可）
  enabled     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_minitools_service on public.mini_tools (service_id);

-- ============ comments（service / idea 共通） ============
create table if not exists public.comments (
  id              uuid primary key default gen_random_uuid(),
  target_type     text not null check (target_type in ('service','idea')),
  target_id       uuid not null,
  parent_id       uuid references public.comments (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  author_nickname text not null,
  body            text not null check (char_length(body) <= 2000),
  comment_type    text not null default 'other',
  is_author_reply boolean not null default false,
  moderation_status comment_moderation not null default 'pending',
  moderation_reason text,               -- 非公開
  risk_score      integer not null default 0,  -- 非公開
  risk_level      risk_level not null default 'low', -- 非公開
  reported_count  integer not null default 0,  -- 非公開
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_comments_target on public.comments (target_type, target_id);
create index if not exists idx_comments_user   on public.comments (user_id);

-- ============ ideas ============
create table if not exists public.ideas (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(title) <= 200),
  problem            text not null check (char_length(problem) <= 2000),
  desired_tool       text not null check (char_length(desired_tool) <= 2000),
  category           text not null,
  purpose_tags       text[] not null default '{}',
  audience_tags      text[] not null default '{}',
  use_case           text,
  similar_service_url text,
  reference_image_url text,
  mini_tool_potential text not null default 'unknown',
  want_level         integer not null default 3 check (want_level between 1 and 5),
  status             idea_status not null default 'open',
  related_service_id uuid references public.services (id) on delete set null,
  author_id          uuid not null references public.profiles (id) on delete cascade,
  public_author_name text not null,
  is_anonymous       boolean not null default false,
  like_count         integer not null default 0,    -- 集計のみ更新
  comment_count      integer not null default 0,    -- 集計のみ更新
  moderation_status  comment_moderation not null default 'pending',
  risk_level         risk_level not null default 'low', -- 非公開
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists idx_ideas_author on public.ideas (author_id);
create index if not exists idx_ideas_status on public.ideas (moderation_status);

-- ============ likes（共感。1ユーザー1回） ============
create table if not exists public.likes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('idea')),
  target_id   uuid not null,
  created_at  timestamptz not null default now(),
  unique (user_id, target_type, target_id)   -- 重複いいね不可（DBで保証）
);
create index if not exists idx_likes_target on public.likes (target_type, target_id);

-- ============ submissions（掲載・編集・非公開・削除・iframe申請） ============
create table if not exists public.submissions (
  id                uuid primary key default gen_random_uuid(),
  type              submission_type not null,
  submitter_id      uuid not null references public.profiles (id) on delete cascade,
  target_service_id uuid references public.services (id) on delete set null,
  payload           jsonb not null default '{}',  -- 非公開（下書き相当）
  contact_email     text,                          -- 非公開（運営確認用）
  status            submission_status not null default 'pending',
  admin_note        text,                          -- 管理者のみ
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_submissions_submitter on public.submissions (submitter_id);
create index if not exists idx_submissions_status on public.submissions (status);

-- ============ サインアップ時に profiles を自動作成 ============
-- Googleログイン後、profiles に行が無ければ自動作成する。
--   nickname     = Google名 or メールの@より前
--   display_name = nickname
--   avatar_url   = Googleプロフィール画像（あれば）
--   email        = Googleアカウントのメール（非公開）
--   role         = 'user'（ただしサイトオーナーのメールは 'admin'）
-- オーナー（kansuinaoi@gmail.com）は nickname / display_name を 'kane' に固定。
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  owner_email text := 'kansuinaoi@gmail.com';
  is_owner    boolean := lower(new.email) = owner_email;
  meta        jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  base_name   text;
  base_slug   text;
  the_role    app_role;
begin
  if is_owner then
    base_name := 'kane';
  else
    base_name := coalesce(
      meta->>'full_name',
      meta->>'name',
      meta->>'nickname',
      split_part(new.email, '@', 1),
      'user'
    );
  end if;
  base_slug := regexp_replace(lower(base_name), '[^a-z0-9]+', '-', 'g');
  if base_slug = '' or base_slug is null then base_slug := 'user'; end if;
  the_role := case when is_owner then 'admin'::app_role else 'user'::app_role end;

  insert into public.profiles (id, email, slug, nickname, display_name, avatar_url, role)
  values (
    new.id,
    new.email,
    base_slug || '-' || substr(new.id::text, 1, 6),  -- 衝突回避
    base_name,
    base_name,
    nullif(meta->>'avatar_url', ''),
    the_role
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========== 0002_rls_policies.sql ==========
-- AppPark: Row Level Security ポリシー
-- 方針：全テーブルでRLSを有効化（デフォルト拒否）。明示的に許可した操作のみ可。
-- 公開フィールドの分離・列保護（状態/集計値）・公開ビュー・集計関数を含む。

-- ============ 補助関数 ============
create schema if not exists app;

create or replace function app.is_admin()
returns boolean language sql stable security definer set search_path = public, app as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

create or replace function app.owns(author uuid)
returns boolean language sql stable as $$
  select author = auth.uid();
$$;

-- いいね件数（誰がしたかは隠し、件数のみ公開）
create or replace function app.like_count(p_target_type text, p_target_id uuid)
returns integer language sql stable security definer set search_path = public, app as $$
  select count(*)::int from public.likes l
   where l.target_type = p_target_type and l.target_id = p_target_id;
$$;

-- ============ profiles ============
alter table public.profiles enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or app.is_admin());
-- ※ 公開閲覧は public_profiles ビュー経由（下記）。本テーブルの直接 select は本人/管理者のみ。

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid() or app.is_admin())
  with check (id = auth.uid() or app.is_admin());
-- role の昇格防止はトリガーで保護（下記 protect_profiles_columns）。

drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles for delete
  using (id = auth.uid() or app.is_admin());

-- 公開プロフィール（email/role/contact_name/内部idを含まない）
create or replace view public.public_profiles
with (security_invoker = true) as
  select slug, nickname, display_name, avatar_url, bio
  from public.profiles;
grant select on public.public_profiles to anon, authenticated;

-- role 等の保護（本人でも role を変えられない。管理者のみ）
create or replace function public.protect_profiles_columns()
returns trigger language plpgsql as $$
begin
  if not app.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'role は変更できません';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists trg_protect_profiles on public.profiles;
create trigger trg_protect_profiles before update on public.profiles
  for each row execute function public.protect_profiles_columns();

-- ============ services ============
alter table public.services enable row level security;

drop policy if exists services_select on public.services;
create policy services_select on public.services for select
  using (
    moderation_state = 'published'         -- 公開済みは全員
    or author_id = auth.uid()              -- 本人は自分の全状態（下書き・審査中含む）
    or app.is_admin()                      -- 管理者は全件
  );

drop policy if exists services_insert on public.services;
create policy services_insert on public.services for insert
  with check (
    author_id = auth.uid()
    and moderation_state in ('draft','reviewing')   -- いきなり published 不可
  );

drop policy if exists services_update on public.services;
create policy services_update on public.services for update
  using (author_id = auth.uid() or app.is_admin())
  with check (author_id = auth.uid() or app.is_admin());

drop policy if exists services_delete on public.services;
create policy services_delete on public.services for delete
  using (author_id = auth.uid() or app.is_admin());

-- 状態遷移・集計値・所有者の保護（管理者以外は変更不可）
create or replace function public.protect_services_columns()
returns trigger language plpgsql as $$
begin
  if not app.is_admin() then
    if new.moderation_state is distinct from old.moderation_state
       and new.moderation_state in ('published','hidden','rejected') then
      raise exception '公開状態の変更は管理者のみ可能です';
    end if;
    if new.is_first_party is distinct from old.is_first_party
       or new.author_id   is distinct from old.author_id
       or new.views        is distinct from old.views
       or new.clicks       is distinct from old.clicks
       or new.helpful_count is distinct from old.helpful_count then
      raise exception 'この項目は管理者または集計処理のみ変更できます';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists trg_protect_services on public.services;
create trigger trg_protect_services before update on public.services
  for each row execute function public.protect_services_columns();

-- ============ mini_tools ============
alter table public.mini_tools enable row level security;

drop policy if exists minitools_select on public.mini_tools;
create policy minitools_select on public.mini_tools for select
  using (
    exists (select 1 from public.services s
            where s.id = mini_tools.service_id
              and (s.moderation_state = 'published' or s.author_id = auth.uid() or app.is_admin()))
  );

drop policy if exists minitools_cud on public.mini_tools;
create policy minitools_insert on public.mini_tools for insert
  with check (author_id = auth.uid() or app.is_admin());
create policy minitools_update on public.mini_tools for update
  using (author_id = auth.uid() or app.is_admin())
  with check (author_id = auth.uid() or app.is_admin());
create policy minitools_delete on public.mini_tools for delete
  using (author_id = auth.uid() or app.is_admin());
-- ※ config が「テンプレート型のみ」であることは API/関数でスキーマ検証（RLSでは表現しない）。

-- ============ comments ============
alter table public.comments enable row level security;

drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments for select
  using (
    moderation_status = 'published'
    or user_id = auth.uid()
    or app.is_admin()
  );

drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert
  with check (
    auth.uid() is not null            -- ログイン必須
    and user_id = auth.uid()
  );

drop policy if exists comments_update on public.comments;
create policy comments_update on public.comments for update
  using (user_id = auth.uid() or app.is_admin())
  with check (user_id = auth.uid() or app.is_admin());

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete
  using (user_id = auth.uid() or app.is_admin());

-- 本人は moderation_status / risk_* / reported_count を変更不可（管理者のみ）
create or replace function public.protect_comments_columns()
returns trigger language plpgsql as $$
begin
  if not app.is_admin() then
    if new.moderation_status is distinct from old.moderation_status
       or new.risk_score   is distinct from old.risk_score
       or new.risk_level   is distinct from old.risk_level
       or new.reported_count is distinct from old.reported_count then
      raise exception 'モデレーション項目は管理者のみ変更できます';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists trg_protect_comments on public.comments;
create trigger trg_protect_comments before update on public.comments
  for each row execute function public.protect_comments_columns();

-- ============ ideas ============
alter table public.ideas enable row level security;

drop policy if exists ideas_select on public.ideas;
create policy ideas_select on public.ideas for select
  using (
    moderation_status = 'published'
    or author_id = auth.uid()
    or app.is_admin()
  );

drop policy if exists ideas_insert on public.ideas;
create policy ideas_insert on public.ideas for insert
  with check (
    auth.uid() is not null            -- ログイン必須
    and author_id = auth.uid()
    and like_count = 0 and comment_count = 0
  );

drop policy if exists ideas_update on public.ideas;
create policy ideas_update on public.ideas for update
  using (author_id = auth.uid() or app.is_admin())
  with check (author_id = auth.uid() or app.is_admin());

drop policy if exists ideas_delete on public.ideas;
create policy ideas_delete on public.ideas for delete
  using (author_id = auth.uid() or app.is_admin());

-- 集計値・状態・関連サービスの保護（管理者/集計のみ）
create or replace function public.protect_ideas_columns()
returns trigger language plpgsql as $$
begin
  if not app.is_admin() then
    if new.like_count    is distinct from old.like_count
       or new.comment_count is distinct from old.comment_count
       or new.status      is distinct from old.status
       or new.related_service_id is distinct from old.related_service_id
       or new.risk_level  is distinct from old.risk_level
       or new.moderation_status is distinct from old.moderation_status then
      raise exception 'この項目は管理者または集計処理のみ変更できます';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists trg_protect_ideas on public.ideas;
create trigger trg_protect_ideas before update on public.ideas
  for each row execute function public.protect_ideas_columns();

-- ============ likes ============
alter table public.likes enable row level security;

drop policy if exists likes_select on public.likes;
create policy likes_select on public.likes for select
  using (user_id = auth.uid() or app.is_admin());   -- 誰がしたかは非公開。件数は app.like_count()

drop policy if exists likes_insert on public.likes;
create policy likes_insert on public.likes for insert
  with check (auth.uid() is not null and user_id = auth.uid());  -- UNIQUE で1回のみ

drop policy if exists likes_delete on public.likes;
create policy likes_delete on public.likes for delete
  using (user_id = auth.uid());                     -- いいね解除は本人のみ
-- UPDATE は許可しない（ポリシー無し＝拒否）。

-- ============ submissions（下書き・審査中。本人/管理者のみ） ============
alter table public.submissions enable row level security;

drop policy if exists submissions_select on public.submissions;
create policy submissions_select on public.submissions for select
  using (submitter_id = auth.uid() or app.is_admin());  -- anon 不可

drop policy if exists submissions_insert on public.submissions;
create policy submissions_insert on public.submissions for insert
  with check (
    auth.uid() is not null
    and submitter_id = auth.uid()
    and status = 'pending'
  );

drop policy if exists submissions_update on public.submissions;
create policy submissions_update on public.submissions for update
  using (
    (submitter_id = auth.uid() and status = 'pending')  -- 本人は審査前のみ修正/撤回
    or app.is_admin()
  )
  with check (submitter_id = auth.uid() or app.is_admin());

drop policy if exists submissions_delete on public.submissions;
create policy submissions_delete on public.submissions for delete
  using (submitter_id = auth.uid() or app.is_admin());

-- 本人は status / admin_note を変更不可（承認・運営メモは管理者のみ）
create or replace function public.protect_submissions_columns()
returns trigger language plpgsql as $$
begin
  if not app.is_admin() then
    if new.status is distinct from old.status
       or new.admin_note is distinct from old.admin_note then
      raise exception '承認状態・運営メモは管理者のみ変更できます';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists trg_protect_submissions on public.submissions;
create trigger trg_protect_submissions before update on public.submissions
  for each row execute function public.protect_submissions_columns();

-- ============ 注意 ============
-- ・公開 select で email を返さないため、profiles.email は保持せず auth.users 側で管理する。
-- ・admin_note / moderation_internal_note / risk_* / reported_count / payload は
--   公開APIの select 列に含めない（本テーブルへの直接 select は本人/管理者に限定済み）。
-- ・集計値（views/clicks/helpful_count/like_count/comment_count）は
--   SECURITY DEFINER の RPC かトリガーでのみ増減させる（クライアント直接更新は上記トリガーで拒否）。
