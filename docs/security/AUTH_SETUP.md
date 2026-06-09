# AppPark 本番ログイン（Supabase Auth / Google）セットアップ手順

AppPark は **ハイブリッド認証**です。

- `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されている →
  **Supabase Auth（Googleログイン等）が本番モードで有効**。
- 未設定 → ローカル簡易ログイン（この端末のみ・MVP用。認証/権限の根拠には使わない）。

コードはすでにこの切り替えに対応済み（`src/lib/auth/supabase.ts` / `AuthProvider`）。
以下の**外部設定**を行うと、Googleログインが本番で有効になります。

---

## 1. Supabase プロジェクト作成

1. https://supabase.com でプロジェクト作成。
2. SQL Editor で、本リポジトリの SQL を順に実行：
   1. `supabase/migrations/0001_schema.sql`（テーブル・型・自動プロフィール作成トリガー）
   2. `supabase/migrations/0002_rls_policies.sql`（RLS有効化・ポリシー・列保護・公開ビュー）
   3. （初回ログイン後）`supabase/migrations/0003_owner_backfill.sql`（kane への紐付け・admin付与）

> `0002` 適用後は**全テーブルで RLS が有効（デフォルト拒否）**になります。RLS は無効化しないでください。

## 2. Google プロバイダを有効化

1. Supabase ダッシュボード → **Authentication → Providers → Google** を有効化。
2. Google Cloud Console で OAuth クライアント（Web）を作成し、**Client ID / Secret** を Supabase に設定。
3. **Authorized redirect URI** に Supabase が表示する
   `https://<project>.supabase.co/auth/v1/callback` を登録。
4. Supabase → **Authentication → URL Configuration** の
   **Redirect URLs** に本番とローカルを追加：
   - `https://apppark.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
   - `https://apppark.vercel.app/**`（ワイルドカード許可する場合）

> アプリ側は `redirectTo = <origin>/auth/callback?next=...` を渡します（`AuthProvider.signInWithGoogle`）。

## 3. Vercel 環境変数（クライアント公開可な anon key のみ）

Vercel → Project → Settings → Environment Variables：

| 変数 | 値 | 公開 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` | 公開可 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key | 公開可（RLSで保護） |
| `NEXT_PUBLIC_SITE_URL` | `https://apppark.vercel.app` | 公開可 |

> ❌ **`service_role` key は絶対にクライアント／`NEXT_PUBLIC_` に入れない**。
> サーバー専用処理が必要になったら、Vercel のサーバー側 env（`SUPABASE_SERVICE_ROLE_KEY`、`NEXT_PUBLIC_` を付けない）として Edge/Route Handler 内でのみ使用。

再デプロイすると、ログイン画面が **Googleログイン優先**に切り替わります。

## 4. オーナー（kane）の確定と既存投稿の移行

1. `kansuinaoi@gmail.com` で一度 Google ログイン
   → トリガーが `profiles` を自動作成（**nickname/display_name=`kane`、role=`admin`** に特別扱い）。
2. SQL Editor で `0003_owner_backfill.sql` を実行
   → 既存初期掲載の `author_id` をオーナーの実 `auth.users.id` に紐付け、admin を確定。

> 現フロントは静的データ（`src/data/services.ts`、`authorId='kansui'` というセンチネル）を表示しています。
> Supabase からサービスを読むよう切り替えるまでは、`AuthProvider` が
> **オーナーのメール一致時に id を `kansui` にマップ**してマイページ表示の整合を保ちます。
> Supabase をデータソースにした段階で、このマッピングは不要になります（`0003` の backfill が実 id を設定）。

## 5. 公開される情報 / されない情報

| 公開（カード・詳細・公開プロフィール・公開API） | 非公開（本人マイページ・管理者のみ） |
|---|---|
| `nickname` / `display_name` / `avatar_url` / `slug` | `email` / `role` / `contact_name` |
| 公開済みサービス・コメント・アイデア、いいね件数 | 下書き・審査中・非公開、`risk_*`、`admin_note`、`moderation_*` 内部メモ |

- 公開 select は `public_profiles` ビュー（email/role を含まない）経由。
- `auth.users` は直接公開しない（RLSで保護）。

## 6. 権限（RLS/サーバーで強制）

`supabase/migrations/0002_rls_policies.sql` と `docs/security/SUPABASE_RLS_DESIGN.md` を参照。要点：

- 未ログインは投稿・コメント・アイデア・いいね **不可**（`insert` は `auth.uid() is not null`）。
- 編集/非公開/削除は `author_id = auth.uid()` または `admin` のみ。
- 公開状態・集計値・role・モデレーション項目は **管理者または DB トリガーのみ**変更可。
- 下書き・審査中・非公開は **本人/管理者のみ** select 可。
- いいねは **1ユーザー1回**（`UNIQUE` 制約）。
- 管理者判定は `profiles.role='admin'`（**フロントだけで判定しない**）。

## 7. セキュリティ・チェックリスト

- [ ] `service_role` key がクライアント/`NEXT_PUBLIC_` に無い
- [ ] 全テーブルで RLS 有効（`0002` 適用）
- [ ] 公開 select で `email` / `role` を返さない（`public_profiles` 経由）
- [ ] Google redirect URL を本番・ローカルとも登録
- [ ] オーナーが admin、既存投稿が kane に紐付き
- [ ] localStorage は UI 補助のみ（認証/権限の根拠にしない）

---

### 現状（このリポジトリの実装状態）

- コードは Supabase 有効時に **Googleログイン優先**で動作（`LoginPanel`）。未設定時はローカル簡易ログイン。
- `AuthProvider`：Supabase セッション/ローカルの両対応。オーナーのメール一致時に
  `id=kansui` / `nickname=display_name=kane` / `role=admin` にマップ（静的データとの整合のため）。
- 公開ページ・カード・詳細・プロフィールは **nickname/avatar のみ**表示（email/role 非公開）。
- RLS・スキーマ・列保護・公開ビューは `supabase/migrations/` に用意済み（**適用は手動**）。

### 残課題（手動 or 次フェーズ）

- Supabase プロジェクト作成・Google プロバイダ設定・env 設定・SQL 適用（本書 1〜4）。
- サービス/コメント/アイデアの**データソースを静的データから Supabase に切替**（現状は表示は静的、認証のみ Supabase 可）。切替後に author_id ベースの所有権が完全に DB 駆動になる。
- Edge/Route Handler での追加サーバー検証（ミニツール config・URL・モデレーション算出）。
