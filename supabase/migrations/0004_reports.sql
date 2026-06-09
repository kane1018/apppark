-- AppPark: 通報（reports）テーブル ＋ RLS。
-- 通報はログイン必須（いたずら通報防止・重複管理・運営確認のため）。
--
-- ※ likes について：本スキーマの public.likes（target_type で 'idea'/'service' を区別）が
--    要件の idea_likes / service_likes を兼ねます（1ユーザー1回は UNIQUE 制約で保証済み）。
--    サービスの「役に立った」も likes（target_type='service'）で表現できます。
--    別テーブルに分ける場合も、下記 reports と同じ RLS 方針（insert はログイン必須・
--    delete は本人のみ・集計は関数経由）を適用してください。

-- service への「役に立った」も likes で扱えるよう target_type を拡張
do $$ begin
  alter table public.likes drop constraint if exists likes_target_type_check;
exception when undefined_object then null; end $$;
alter table public.likes
  add constraint likes_target_type_check check (target_type in ('idea','service'));

-- ============ reports ============
create table if not exists public.reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references public.profiles (id) on delete cascade,
  target_type  text not null check (target_type in ('service','comment','idea','idea_comment')),
  target_id    uuid not null,
  reason       text not null,
  detail       text,
  status       text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  admin_note   text,                       -- 非公開（管理者のみ）
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- 同一ユーザーの同一対象への重複通報を防ぐ
  unique (reporter_id, target_type, target_id)
);
create index if not exists idx_reports_target on public.reports (target_type, target_id);
create index if not exists idx_reports_status on public.reports (status);

alter table public.reports enable row level security;

-- 通報はログイン必須・本人名義のみ
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert
  with check (auth.uid() is not null and reporter_id = auth.uid());

-- 閲覧は本人（自分の通報）と管理者のみ。anon・他人には見せない
drop policy if exists reports_select on public.reports;
create policy reports_select on public.reports for select
  using (reporter_id = auth.uid() or app.is_admin());

-- ステータス変更・運営メモは管理者のみ
drop policy if exists reports_update on public.reports;
create policy reports_update on public.reports for update
  using (app.is_admin())
  with check (app.is_admin());

drop policy if exists reports_delete on public.reports;
create policy reports_delete on public.reports for delete
  using (app.is_admin());

-- 本人は status / admin_note を変更不可（reports_update が admin 限定なので二重防御）
create or replace function public.protect_reports_columns()
returns trigger language plpgsql as $$
begin
  if not app.is_admin() then
    raise exception '通報の更新は管理者のみ可能です';
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists trg_protect_reports on public.reports;
create trigger trg_protect_reports before update on public.reports
  for each row execute function public.protect_reports_columns();
