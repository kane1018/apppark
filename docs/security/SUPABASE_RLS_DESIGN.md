# AppPark サーバー側権限管理 / Supabase RLS 設計

本書は、AppPark を Supabase（または実 API）に接続する際の **サーバー側権限検証**と
**Row Level Security（RLS）**の設計です。現状のフロント側チェック（`src/lib/security/authz.ts`）
は UX のためのものであり、**最終的な権限判定は必ず本書の RLS / サーバー側で行います**。

> 原則：
> 1. **デフォルト拒否**（全テーブル `ENABLE ROW LEVEL SECURITY`、ポリシーで明示的に許可した操作のみ可）。
> 2. **公開してよい情報と非公開情報を分離**（email・内部メモ・role 等は公開ビュー/公開 select で返さない）。
> 3. **所有者 or 管理者のみ**が編集・非公開・削除でき、**ログイン必須**操作は `auth.uid()` を必須にする。
> 4. **状態遷移（公開/非公開、moderation、集計値）は管理者または DB トリガーのみ**が変更できる。

---

## 0. 共通：ロールと補助関数

| ロール | 説明 |
|---|---|
| `anon` | 未ログイン（閲覧のみ） |
| `authenticated` | ログイン済み（`auth.uid()` が取れる） |
| アプリ内 `role` | `profiles.role ∈ {user, maker, admin}`。**admin のみ管理操作可** |

補助関数（`SECURITY DEFINER`）:

- `auth.uid()` … Supabase 標準。現在のユーザー UUID。
- `app.is_admin()` … `(select role from profiles where id = auth.uid()) = 'admin'`
- `app.owns(author uuid)` … `author = auth.uid()`

---

## 1. テーブル別：カラム分類と CRUD 権限

各表で **公開可（anon が select 可）** / **本人のみ** / **管理者のみ** / **非公開（公開 select で返さない）** を明記します。

### 1-1. `profiles`（ユーザープロフィール）

| カラム | 公開可？ | 備考 |
|---|---|---|
| `id` (uuid, = auth.users.id) | △ | 内部ID。公開ビューでは返さず `slug` を識別子にする |
| `slug` (text unique) | ✅公開 | 公開プロフィールURL `/users/[slug]` |
| `nickname` (text) | ✅公開 | カード・詳細・プロフィールに表示 |
| `display_name` (text) | ✅公開 | |
| `avatar_url` (text null) | ✅公開 | |
| `bio` (text null) | ✅公開 | 公開プロフィール文（任意） |
| `role` (text) | ❌非公開 | admin 判定用。公開しない |
| `contact_name` (text null) | ❌非公開 | 運営確認用 |
| `created_at` / `updated_at` | △ | 公開ビューでは任意 |
| **`email`** | ❌**絶対非公開** | `auth.users` 側で管理。`profiles` には**保持しない**（管理は auth.users のみ） |

**公開 select は `public_profiles` ビュー（`slug, nickname, display_name, avatar_url, bio`）経由のみ。**

| 操作 | 許可ルール |
|---|---|
| SELECT | 本人：自分の全カラム / 管理者：全件 / anon・他人：**`public_profiles` ビューのみ** |
| INSERT | `authenticated` かつ `id = auth.uid()`（サインアップ時。通常はトリガーで auth.users から自動作成） |
| UPDATE | 本人（`id = auth.uid()`）。ただし `role` の変更は**管理者のみ**（トリガーで保護） |
| DELETE | 本人 or 管理者 |

### 1-2. `services`（掲載サービス / 内ミニツール掲載）

| カラム | 公開可？ | 備考 |
|---|---|---|
| `id, slug, name, short_description, description` | ✅公開（published時） | |
| `category, sub_categories[], purposes[], audience_tags[], tool_type_tags[], pricing_tags[], status_tags[], tags[]` | ✅公開 | |
| `pricing, status, listing_type, is_ai_enabled, is_internal_mini_tool` | ✅公開 | |
| `thumbnail_url, gallery_image_urls[], image_alt, url, cta_label, cta_url` | ✅公開 | URL は http/https のみ（`safeUrl`） |
| `mini_tool (jsonb), iframe_embed (jsonb), development_info (jsonb), faq (jsonb)` | ✅公開 | iframe は `approved=true` のみ表示 |
| `recruitment_status[], recruitment_note` | ✅公開 | |
| `author_id` (uuid → profiles.id) | △ | 公開時は **author の nickname/avatar に解決**して返す。生の id 露出は最小限 |
| `views, clicks, helpful_count` | ✅公開（任意） | **更新は集計処理/管理者のみ**（トリガー保護） |
| `is_first_party, created_by` | ✅公開（表示用） | **変更は管理者のみ** |
| `moderation_state` (`draft/reviewing/published/hidden/rejected`) | △ | 値は返すが、**published 以外は本人/管理者しか行を見られない** |
| `moderation_internal_note` (text null) | ❌非公開 | 運営メモ。公開 select で返さない |
| `created_at, updated_at` | ✅公開 | |

| 操作 | 許可ルール |
|---|---|
| SELECT | `moderation_state = 'published'` は全員 / 本人（`author_id = auth.uid()`）は自分の全状態 / 管理者は全件。**下書き・審査中・非公開は本人/管理者のみ** |
| INSERT | `authenticated` かつ `author_id = auth.uid()` かつ `moderation_state IN ('draft','reviewing')`（いきなり published 不可） |
| UPDATE | 本人 or 管理者。ただし **`moderation_state` を `published/hidden/rejected` に変えられるのは管理者のみ**、`is_first_party/views/clicks/helpful_count/author_id` は管理者のみ（トリガー保護） |
| DELETE | 本人（自分の投稿）or 管理者 |

> 「編集申請 / 非公開申請 / 削除申請」は、**直接 UPDATE/DELETE させず `submissions` に申請行を作る**運用も可（§1-7）。
> 本人の直接編集を許す場合でも、公開状態の遷移は管理者に限定する。

### 1-3. `mini_tools`（内ミニツール設定。services から分離する場合）

services に `mini_tool jsonb` を内包する現行設計でも可。分離する場合：

| カラム | 公開可？ | 備考 |
|---|---|---|
| `id, service_id (FK), type, config (jsonb), enabled` | ✅公開（親が published時） | **config はテンプレート型のみ**。HTML/JS/eval/外部script は保存・実行しない |
| `author_id` | △ | 親 service と同一所有者 |
| `created_at, updated_at` | ✅公開 | |

| 操作 | 許可ルール |
|---|---|
| SELECT | 親 service が公開なら全員 / 本人 / 管理者 |
| INSERT/UPDATE/DELETE | `author_id = auth.uid()` or 管理者。**config は許可された type/スキーマのみ**（サーバー側でバリデーション、§2） |

### 1-4. `comments`（サービス・アイデア共通コメント。polymorphic）

| カラム | 公開可？ | 備考 |
|---|---|---|
| `id, target_type ('service'|'idea'), target_id` | ✅公開 | |
| `user_id` (FK profiles) | △ | 公開時は nickname/avatar に解決して返す |
| `author_nickname` (denormalized) | ✅公開 | 表示用ニックネーム |
| `body, comment_type, is_author_reply, created_at` | ✅公開（published時） | |
| `moderation_status (published/pending/hidden/deleted)` | △ | published 以外は本人/管理者のみ |
| `risk_score, risk_level` | ❌非公開 | 判定値。公開しない |
| `moderation_reason` (text null) | ❌非公開 | 判定理由。公開しない |
| `reported_count` | ❌非公開（or 管理者のみ） | |
| **`author_email`** | ❌**保持しない** | 旧 Comment 型の authorEmail は**廃止**（email を comments に置かない） |

| 操作 | 許可ルール |
|---|---|
| SELECT | `moderation_status = 'published'` は全員 / 本人（`user_id = auth.uid()`）/ 管理者は全件 |
| INSERT | **`authenticated` のみ** かつ `user_id = auth.uid()`。`risk_*` / `moderation_status` はサーバー（トリガー/関数）が設定 |
| UPDATE | 本人（自分の body 編集、短時間）or 管理者（モデレーション）。`moderation_status` 変更は管理者のみ |
| DELETE | 本人 or 管理者（論理削除 `moderation_status='deleted'` 推奨） |

### 1-5. `ideas`（アイデア掲示板）

| カラム | 公開可？ | 備考 |
|---|---|---|
| `id, title, problem, desired_tool, category, purpose_tags[], audience_tags[], use_case, want_level, status, related_service_id` | ✅公開（published時） | |
| `similar_service_url, reference_image_url` | ✅公開 | **http/https のみ**（`safeUrl`） |
| `mini_tool_potential` | ✅公開 | |
| `author_id` (FK profiles) | △ | `is_anonymous=true` なら**ニックネームも返さず「匿名」** |
| `public_author_name` | △ | 匿名時は公開しない |
| `is_anonymous` | ✅公開 | |
| `like_count, comment_count` | ✅公開 | **更新は集計/トリガーのみ**（直接更新不可） |
| `moderation_status (published/pending/hidden/deleted)` | △ | 高リスクは `pending`。published 以外は本人/管理者のみ |
| `risk_level` | ❌非公開 | |
| `created_at, updated_at` | ✅公開 | |

| 操作 | 許可ルール |
|---|---|
| SELECT | `moderation_status = 'published'` は全員 / 本人 / 管理者は全件 |
| INSERT | **`authenticated` のみ** かつ `author_id = auth.uid()`。`like_count/comment_count` は 0、`risk_level/moderation_status` はサーバーが設定 |
| UPDATE | 本人（内容編集）or 管理者。`status (planned/in_progress/created/closed)` と `related_service_id` の設定は管理者（または承認フロー）のみ。集計値は直接更新不可 |
| DELETE | 本人 or 管理者（論理削除推奨） |

### 1-6. `likes`（共感「これ欲しい」。1ユーザー1回）

| カラム | 公開可？ | 備考 |
|---|---|---|
| `id, target_type ('idea'), target_id` | △ | 集計のみ公開 |
| `user_id` (FK profiles) | ❌非公開 | **誰がいいねしたかは公開しない**（本人のみ自分の行を見れる） |
| `created_at` | ❌ | |

**一意制約**：`UNIQUE (user_id, target_type, target_id)` → **同一ユーザーは同じ対象に1回のみ**（DB レベルで保証）。
件数は集計ビュー/関数 `app.like_count(target_type, target_id)` で公開。

| 操作 | 許可ルール |
|---|---|
| SELECT | 本人（`user_id = auth.uid()`）は自分の like のみ / 管理者は全件 / 件数は集計関数経由で全員 |
| INSERT | **`authenticated` のみ** かつ `user_id = auth.uid()`。UNIQUE が重複を拒否 |
| UPDATE | なし（不要） |
| DELETE | 本人のみ（いいね解除） |

### 1-7. `submissions`（掲載申請 / 編集・非公開・削除申請 / iframe申請）

| カラム | 公開可？ | 備考 |
|---|---|---|
| `id, type ('listing'|'edit'|'hide'|'delete'|'iframe'|'development')` | ❌非公開 | |
| `submitter_id` (FK profiles) | ❌非公開 | |
| `target_service_id` (null) | ❌非公開 | |
| `payload (jsonb)` | ❌非公開 | 申請内容（公開前の下書き相当） |
| **`contact_email`** | ❌**非公開** | 運営確認用。公開 select で**絶対返さない**（本人/管理者のみ） |
| `status ('pending'|'approved'|'rejected')` | ❌非公開（本人/管理者のみ） | |
| `admin_note` (text null) | ❌**管理者のみ** | 運営メモ。本人にも返さない |
| `created_at, updated_at` | ❌非公開 | |

> **submissions は公開対象外**（＝下書き・審査中投稿）。**本人と管理者以外には一切見せない。**

| 操作 | 許可ルール |
|---|---|
| SELECT | 本人（`submitter_id = auth.uid()`、ただし `admin_note` を除く）/ 管理者は全件。**anon は不可** |
| INSERT | `authenticated` かつ `submitter_id = auth.uid()` かつ `status='pending'` |
| UPDATE | 本人：`status='pending'` の自分の申請内容のみ（撤回・修正）/ `status` 変更（approve/reject）と `admin_note` は**管理者のみ** |
| DELETE | 本人（撤回）or 管理者 |

---

## 2. アプリ側（サーバー/API）で追加検証すべきこと

RLS だけでは表現しづらいものは、**API（Route Handler / Edge Function）でも検証**します。

1. **ミニツール config の検証**：許可された `type` と JSON スキーマのみ。HTML/JS 文字列・`eval`・外部 script URL・APIキー/パスワード/決済欄を**サーバーで拒否**（フロント `safeExpression`/テンプレートと同等の検証をサーバーでも実施）。
2. **URL の検証**：`url, cta_url, similar_service_url, reference_image_url, iframe_embed.url` は **http/https のみ**（`safeUrl`）。`javascript:` `data:` 等を保存時に拒否。
3. **入力長・必須・禁止文字**：title/説明/コメント等の最大長、必須、危険スキーム、外部リンク数、個人情報らしき文字列（電話・メール）を検証（既存 `moderation.ts` をサーバーでも実行）。
4. **モデレーション**：`risk_*` と `moderation_status` は**サーバーが算出**してセット（クライアント値を信用しない）。高リスクは `pending`。
5. **公開レスポンスの整形**：API は**公開フィールドのみ**返す（`toPublicProfile` / 公開ビュー / select 列の明示）。`email, contact_email, role, *_internal_note, admin_note, risk_*, reported_count` は公開 API で**返さない**。
6. **集計値の保護**：`views/clicks/helpful_count/like_count/comment_count` はクライアントから直接更新させず、RPC（`SECURITY DEFINER` 関数）やトリガー経由でのみ増減。

---

## 3. 公開 / 非公開フィールドのまとめ

**公開 API で返してよい**：`slug, nickname, display_name, avatar_url, bio`（profiles）、サービスの公開項目、公開済みコメント本文＋author nickname、公開済みアイデア、like の**件数**。

**公開 API で返してはいけない**：
`email, contact_email, contact_name, role, auth provider id, 内部 user id（最小限に）, moderation_internal_note, admin_note, moderation_reason, risk_score, risk_level, reported_count, submissions.payload/status, 下書き・審査中・非公開の行`。

---

## 4. 適用手順（Supabase）

1. `supabase/migrations/0001_schema.sql` … テーブル・型・制約・インデックス。
2. `supabase/migrations/0002_rls_policies.sql` … RLS 有効化・補助関数・ポリシー・列保護トリガー・公開ビュー・集計関数。
3. Supabase ダッシュボード or `supabase db push` で適用。
4. API/Edge Function で §2 の追加検証を実装。
5. クライアントは `src/lib/security/authz.ts` の述語で UI を出し分け（**表示のためだけ**。最終判定は RLS/サーバー）。

> 本設計は準備（設計＋ポリシー雛形）です。本番適用前に、実テーブルのカラムと型、Supabase Auth 設定、
> 各 RPC のスキーマ検証を実装・テストしてください。
