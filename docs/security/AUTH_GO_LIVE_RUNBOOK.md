# AppPark Googleログイン 有効化ランブック（最短手順）

> このリポジトリ側の準備（コード・SQL・設定スキャフォールド）は完了しています。
> 残りは**あなたのアカウントが必要な操作だけ**です（私が代行できないのはこの部分のみ）。
> 所要時間 ~15分。コピペ用の値はすべて下に用意しました。

---

## 用意した値（そのままコピペ）

| 用途 | 値 |
|---|---|
| 本番 Redirect URL | `https://apppark.vercel.app/auth/callback` |
| ローカル Redirect URL | `http://localhost:3000/auth/callback` |
| Vercel 環境変数1 | `NEXT_PUBLIC_SUPABASE_URL` = （Supabaseの Project URL） |
| Vercel 環境変数2 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` = （Supabaseの anon public key） |
| Vercel 環境変数3 | `NEXT_PUBLIC_SITE_URL` = `https://apppark.vercel.app` |
| 初期 SQL | `supabase/RUN_IN_SQL_EDITOR.sql` を**丸ごと貼って Run** |
| ログイン後 SQL | `supabase/migrations/0003_owner_backfill.sql` を貼って Run |

---

## STEP 1. Supabase プロジェクト作成 ＋ SQL 実行（~5分）

1. https://supabase.com → New project（無料枠でOK。Region は Tokyo 推奨）。
2. 左メニュー **SQL Editor → New query**。
3. リポジトリの **`supabase/RUN_IN_SQL_EDITOR.sql` の中身を全部コピーして貼り付け → Run**。
   - これでテーブル・**RLS有効化**・ポリシー・公開ビュー・自動プロフィール作成トリガーが入ります。
4. **Project Settings → API** で次の2つを控える：
   - **Project URL**（= `NEXT_PUBLIC_SUPABASE_URL`）
   - **anon public** key（= `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
   - ⚠️ **service_role** key は使いません／クライアントに置きません。

> CLI派の場合：`npx supabase login` → `npx supabase link --project-ref <ref>` → `npx supabase db push`
> （`supabase/config.toml` はスキャフォールド済み。migrations の 0001→0002→0003 が順に適用されます）

## STEP 2. Google ログインを有効化（~5分）

1. **Google Cloud Console** → APIとサービス → 認証情報 → **OAuth クライアント ID を作成**（種類：ウェブアプリ）。
   - 「承認済みのリダイレクト URI」に、Supabase が表示する
     `https://<project-ref>.supabase.co/auth/v1/callback` を貼る
     （値は Supabase の **Authentication → Providers → Google** 画面に表示されます）。
   - 必要なら OAuth 同意画面を「外部・テスト」で作成し、自分のメールをテストユーザーに追加。
2. 発行された **Client ID / Client secret** を、Supabase の **Authentication → Providers → Google** に貼って **Enable**。
3. Supabase **Authentication → URL Configuration → Redirect URLs** に追加：
   - `https://apppark.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`

## STEP 3. Vercel 環境変数（~2分）

Vercel → プロジェクト → **Settings → Environment Variables** に3つ追加（Production と Preview 両方）：

```
NEXT_PUBLIC_SUPABASE_URL       = <STEP1 の Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY  = <STEP1 の anon public key>
NEXT_PUBLIC_SITE_URL           = https://apppark.vercel.app
```

→ **Redeploy**（Deployments → 最新 → Redeploy）。
これで本番のログイン画面が **Googleログイン優先**に切り替わります。

## STEP 4. オーナー確定＆既存投稿の紐付け（~2分）

1. 本番サイトで **`kansuinaoi@gmail.com`** で Google ログイン（1回）。
   → トリガーが `profiles` を自動作成し、**nickname/display_name=`kane`、role=`admin`** になります。
2. Supabase **SQL Editor** で、**`supabase/migrations/0003_owner_backfill.sql` を貼って Run**。
   → 既存掲載を実 `auth.users.id` に紐付け、admin を確定。

---

## 完了チェック

- [ ] STEP1 の SQL 実行後、Table Editor に profiles/services/... が並び、各テーブルに「RLS enabled」表示
- [ ] Google でログイン → ログアウトできる
- [ ] `kansuinaoi@gmail.com` ログイン時、表示名が **kane**
- [ ] 公開ページ（カード/詳細/プロフィール）に**メールアドレスが出ない**
- [ ] 未ログインで投稿・コメント・アイデア・いいねが**できない**
- [ ] Vercel の env に **service_role を入れていない**

困ったら、つまずいた画面のスクショ or エラーメッセージを貼ってください。その箇所を一緒に直します。
