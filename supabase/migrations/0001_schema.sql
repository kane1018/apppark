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
