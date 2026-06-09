-- AppPark: サイトオーナー（kane / kansuinaoi@gmail.com）への紐付けと管理者付与。
--
-- 実行タイミング：オーナーが一度 Google ログインして auth.users / profiles に
-- 行ができた後に実行してください（冪等。オーナー未ログイン時は何もしません）。
--
-- やること：
--   1) オーナーの profiles を nickname/display_name='kane'、role='admin' に統一
--   2) 既存の初期掲載（author 表示が "Kansui"/"kane"、または created_by='user' の
--      初期データ）を、オーナーの実 auth.users.id に紐付け
--   3) services 由来のコメント/アイデア/ミニツールの author_id も合わせて更新

do $$
declare
  owner_id uuid;
begin
  select id into owner_id from auth.users where lower(email) = 'kansuinaoi@gmail.com' limit 1;
  if owner_id is null then
    raise notice 'オーナー未ログインのため backfill をスキップしました（先に Google ログインしてください）';
    return;
  end if;

  -- 1) プロフィール統一（kane / admin）
  update public.profiles
     set nickname = 'kane', display_name = 'kane', role = 'admin', updated_at = now()
   where id = owner_id;

  -- 2) 既存初期掲載サービスを紐付け
  --    （移行前データの author を判定するための一時カラム legacy_author_name がある場合に使用。
  --     無い場合は、全初期データをオーナーに寄せるなら where 条件を調整してください）
  update public.services
     set author_id = owner_id
   where author_id is null
      or author_id not in (select id from public.profiles);

  -- 3) ミニツール / コメント / アイデア / いいね の author/user も追従
  update public.mini_tools set author_id = owner_id
   where author_id not in (select id from public.profiles);

  -- comments / ideas / likes は user_id/author_id が auth ユーザーを参照するため、
  -- 初期データを投入する場合は author_id = owner_id を指定して insert してください。
end $$;

-- 任意：別アカウントを後から管理者にする場合
-- update public.profiles set role = 'admin'
--  where id = (select id from auth.users where lower(email) = '<admin_email>');
