# AppPark

**こんなの欲しかった、が見つかる。** 面白いWebサービス・便利ツールを、**目的別／カテゴリ別に探せる発見サイト**です。
このサイトの主役は「投稿する人」ではなく、まず **「見る人・使う人」** です。

> ⚠️ 掲載データはすべて **架空のデモデータ** です。閲覧数・クリック数・役に立った数・各種フォーム送信・コメントは、MVPでは**実データ保存なしの仮実装**です。

---

## サービス概要

- 目的別・カテゴリ別にWebサービスを探せる
- 詳細ページは「使う前の案内ページ」として機能（何ができる／料金／使い方／注意点）
- 外部リンクから実際にサービスを開ける（外部サービスである旨を明示）
- 利用者の声・**モデレーション付きコメント／返信**・改善要望／通報の導線
- 審査制（キュレーション型）の掲載申請
- スポンサー型マネタイズ導線（必ず「スポンサー」「PR」「広告」と明示）
- 掲載基準・利用規約・プライバシーポリシー・免責事項を整備

## 技術スタック

- **Next.js 14（App Router）**
- **TypeScript**
- **Tailwind CSS**
- データは **ローカルのTypeScript配列**（`src/data/`）。後から Supabase / Firebase / Notion / Googleスプレッドシート等へ移行しやすい構成。
- Vercel / Netlify でそのまま公開可能

## セットアップ方法

> Node.js 18.18 以上（推奨：20 / 22 / 24 LTS）が必要です。

```bash
npm install
```

## 開発サーバー起動方法

```bash
npm run dev
# http://localhost:3000 を開く
```

## ビルド方法

```bash
npm run build   # 本番ビルド
npm run start   # ビルド結果をローカルで起動
```

## Vercel / Netlify への公開方法

### Vercel（推奨）
1. このリポジトリを GitHub 等に push
2. [Vercel](https://vercel.com) で「New Project」→ リポジトリを選択
3. フレームワークは自動で **Next.js** が検出されます。そのままデプロイ
4. 環境変数 `NEXT_PUBLIC_SITE_URL` に公開URL（例：`https://your-domain.com`）を設定
   - sitemap / OGP / 構造化データの絶対URLに使われます

### Netlify
1. リポジトリを連携
2. Build command: `npm run build` / Publish directory: `.next`
3. 公式の **Next.js Runtime** プラグインを有効化（`netlify.toml` 同梱済み）
4. 環境変数 `NEXT_PUBLIC_SITE_URL` を設定

---

## β版（デモ）として仮公開する

> 現在このリポジトリは **β版モード**（`siteConfig.isBeta = true` / `siteConfig.noIndex = true`）です。
> ヘッダー上部に「β版（デモ）」バーが表示され、全ページに `noindex` が付与され、`robots.txt` はクロールを禁止します（Google検索に出にくい状態）。独自ドメインは未設定で、無料URLでの公開を想定しています。

### Vercelでβ版公開する手順（推奨）
1. GitHubにこのプロジェクトをpushする
2. [Vercel](https://vercel.com) にログインする
3. **New Project** を選択する
4. GitHubリポジトリを選択する
5. **Framework Preset** が **Next.js** になっていることを確認する
6. **Build Command** が `npm run build` になっていることを確認する
7. **Deploy** を押す
8. 発行されたURL（例：`https://apppark-beta.vercel.app`）を確認する

### Netlifyでβ版公開する手順
1. GitHubにこのプロジェクトをpushする
2. [Netlify](https://app.netlify.com) にログインする
3. **Add new site** を選択する
4. **Import an existing project** を選択する
5. GitHubリポジトリを選択する
6. **Build Command** を `npm run build` にする
7. **Publish directory** は `.next`（Next.js Runtimeプラグインが管理。`netlify.toml` 同梱済み）
8. **Deploy** を押す
9. 発行されたURL（例：`https://apppark-demo.netlify.app`）を確認する

### β版公開時の注意（noindex の切り替え）
- 正式公開前は **`src/config/site.ts` の `siteConfig.noIndex = true`**（既定）にしてください。
  - 全ページ `noindex`／`robots.txt` でクロール禁止になります。
- 正式公開する場合は **`siteConfig.noIndex = false`** に変更してください。
  - あわせて `siteConfig.isBeta = false`（β版バーを消す）、`NEXT_PUBLIC_SITE_URL` を独自ドメインに設定し、
    Google Search Console 登録・`sitemap.xml` 送信・`robots.txt` 確認を行ってください。

---

## 編集ガイド（よく使う変更）

### サービス名を変更する
`src/config/site.ts` の `siteConfig.name` を変更してください。
サイト名・メタ情報・OGP・構造化データ・フッター表記はすべてここを参照しているため、**1か所の変更で全体に反映**されます。

### 掲載サービスデータを追加する
`src/data/services.ts` の `services` 配列に1件追加します。型は `src/types/index.ts` の `Service` を参照。
- `slug` がURL（`/services/[slug]`）になります
- 画像フィールド：
  - `thumbnailUrl`（メイン画像URL。一覧カードと詳細上部に表示。`null` ならカテゴリアイコン＋グラデーションのプレースホルダ）
  - `galleryImageUrls`（サブ画像URLの配列。詳細ページでギャラリー表示。空配列なら非表示）
  - `imageAlt`（画像の alt。`null` ならサービス名から自動生成）
- 画像が読み込めない場合は自動でプレースホルダにフォールバックします（レイアウトは崩れません）
- 募集・相談ステータス：
  - `recruitmentStatus`（`seeking_users` / `seeking_feedback` / `seeking_cofounder` / `seeking_sponsor` / `transfer_consultation` / `purchase_consultation` の配列。空配列可）
  - `recruitmentNote`（募集・相談についての投稿者の補足。`null` 可）
  - ラベル・説明・アイコン・色は `src/lib/recruitment.ts` で一元管理。表示は `RecruitmentStatusBadges`、フィルターは `RecruitmentStatusFilter`、投稿欄は `RecruitmentStatusField`、注意文は `RecruitmentNotice`
  - ※ 表示は「相談・募集の意思表示」のみ。売買・決済・エスクロー等は実装しません
- デモの画像は `public/demo/` に「デモ画像」と明記したサンプルSVGを置いています（実サービスの画面ではありません）

### 画像アップロードへの拡張（将来）
現状は **画像URL入力方式**（MVP）です。`thumbnailUrl` / `galleryImageUrls` のデータ構造はそのままに、
将来 Supabase Storage / Firebase Storage / Cloudinary / S3 等のアップロードに差し替えられます。
表示は `src/components/Thumbnail.tsx`（メイン画像＋フォールバック）と
`src/components/ServiceGallery.tsx`（ギャラリー）に分離済みのため、保存先を足すだけで対応できます。

### カテゴリを追加する
`src/data/categories.ts` の `categories` 配列に1件追加します（`slug` がURLになります）。
`icon` には `src/components/icons.tsx` の `IconName`（`bot` / `zap` / `globe` など）から選んで指定します。

### 目的タグを追加する
`src/data/purposes.ts` の `purposes` 配列に1件追加します（`slug` がURLになります）。
`icon` は上記同様、`IconName` から指定します。

### アイコンを変更・追加する
カテゴリ・目的のアイコンは **Lucide Icons（ISC・商用利用可）** に統一しています（絵文字は不使用）。
- 既存アイコンの変更：データの `icon` を別の `IconName` に変えるだけ
- 新しいアイコンを使いたい：`src/components/icons.tsx` で対象アイコンを `import` し、`iconRegistry` と `IconName` に追加
- 背景色・サイズは `IconBadge`（`tone`: navy / orange / grey、`size`: sm / md / lg）で統一管理

### スポンサー枠・料金を編集する
- 料金・枠：`src/data/sponsor.ts`（`sponsorPlans` / `sponsorSlots` / `expectedSponsors`）
- 表示位置：`src/components/SponsorBanner.tsx`（トップ／一覧／カテゴリ／詳細下部に設置済み）
- スポンサー枠には必ず「スポンサー」「PR」「広告」のいずれかを表示しています

### 投稿フォーム等の送信先を設定する
MVPでは各フォームは**仮送信**（画面にメッセージを出すのみ）です。実送信に切り替えるには、各コンポーネントの `handleSubmit` 内の `// TODO:` 箇所を、送信先（Formspree / Googleフォーム / API Route / Supabase 等）への `fetch` に置き換えてください。
- 投稿申請：`src/components/SubmitForm.tsx`
- 通報・削除依頼：`src/components/ReportForm.tsx`
- 改善要望・バグ報告：`src/components/FeedbackForm.tsx`
- お問い合わせ：`src/components/ContactForm.tsx`

### 法務ページを編集する
- 掲載基準：`src/components/GuidelineSection.tsx` ＋ `src/app/guidelines/page.tsx`
- 利用規約：`src/app/terms/page.tsx`
- プライバシーポリシー：`src/app/privacy/page.tsx`
- 免責事項：`src/app/disclaimer/page.tsx`
- 共通の免責文：`src/config/site.ts` の `SERVICE_DISCLAIMER`

---

## コメント機能とモデレーション（安全性重視）

- 各サービス詳細ページにコメント欄を設置（**返信は1階層まで**）
- 投稿者本人の返信には「作者」ラベル
- 投稿時に**危険度判定**を実行（`src/lib/moderation.ts`）
  - ルールベース：NGワード／URL数／個人情報らしき文字列／攻撃的表現／同一内容の連続投稿 など
  - `riskScore`(0〜100) / `riskLevel`(low・medium・high) / `moderationStatus`(published・pending・hidden・deleted) / `moderationReason` / `reportedCount` を保持
  - **low=公開 / medium=確認中（保留）/ high=自動で非公開（確認待ち）**、通報が一定数で確認待ち
- 各コメントに「通報」ボタン
- **AI判定への差し替え**：`src/lib/moderation.ts` の `moderateComment()` の中身を、OpenAI Moderation 等のAPI呼び出しに置き換えるだけでUIは変更不要です
- MVPは永続化なし（リロードで初期化）。`src/data/comments.ts` のデータ構造のまま Supabase 等のテーブルに対応づけられます

---

## ディレクトリ構成

```
src/
  app/            … 各ルート（page.tsx）+ layout / sitemap.ts / robots.ts / icon.svg / not-found
  components/     … UIコンポーネント（Header, ServiceCard, SearchBar, comments/ ほか）
  config/         … site.ts（サイト名・SEO・フッター等の一元管理）
  data/           … services / categories / purposes / comments / sponsor（差し替え可能）
  lib/            … filters（検索・絞り込み）/ moderation（危険度判定）/ seo / labels
  types/          … ドメイン型定義
public/           … og.svg（OGP画像）
```

## SEO / Google Search Console

各ページに以下を設定済みです（`src/lib/seo.ts` の `buildMetadata` と各ページの JSON-LD）。

- **title / description**（`%s | AppPark` テンプレート）
- **canonical**（絶対URL。重複URLの正規化に有効）
- **OGP / Twitter Card**（OG画像は `public/og.svg`）
- **構造化データ（JSON-LD）**
  - 全ページ共通：`WebSite`（サイト内検索付き）＋ `Organization`（運営者・発行元）
  - 一覧系：`CollectionPage` + `ItemList`
  - サービス詳細：`SoftwareApplication`
  - 規約・申請・通報など：`WebPage`
  - すべてのページ：`BreadcrumbList`（パンくず）
- パンくずリスト・内部リンク・画像alt・モバイルファースト・**h1は各ページ1つ**
- `sitemap.xml`（`src/app/sitemap.ts`／全URLを列挙）/ `robots.txt`（`src/app/robots.ts`）
- `manifest.webmanifest`（`src/app/manifest.ts`）

### 公開前に必ず設定する環境変数

`.env.example` を `.env.local` にコピーし、以下を設定してください。

| 変数 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical・OGP・sitemap・構造化データの絶対URL（例：`https://your-domain.com`） |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console「HTMLタグ」確認用トークン（任意） |

> ⚠️ `NEXT_PUBLIC_*` はビルド時に埋め込まれます。値を変えたら **再ビルド** してください。

### Google Search Console への登録手順（公開後）

1. 本番URLで公開し、`NEXT_PUBLIC_SITE_URL` を本番ドメインに設定して再デプロイ
2. [Search Console](https://search.google.com/search-console) で「URLプレフィックス」にサイトURLを入力
3. 確認方法は次のいずれか：
   - **HTMLタグ**：表示された `content="..."` の値を `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` に設定して再デプロイ → 「確認」
   - または **ドメイン（DNS）** 確認（Vercel/Netlifyのドメイン設定でTXTレコード追加）
4. 確認後、「サイトマップ」に `sitemap.xml` を送信
5. 数日後、「ページ」レポートでインデックス状況を確認

---

## 今後追加できる機能（MVPでは未実装）

会員登録 / ログイン / 星評価レビュー / 自動ランキング / 決済・売買・エスクロー / 広告収益分配 / 本格的な管理画面（コメントの非表示・削除・復元のUI） / 投稿者へのダッシュボード。
※ いずれもデータ構造・導線は将来拡張しやすいように設計しています。

## MVPで実装しないもの（方針）

会員登録・ログイン・DM・決済・サービス売買・広告収益分配・エスクロー・自動ランキング・複雑な管理画面。
売買は「相談ステータスの表示のみ」で、取引・決済機能は持ちません。AppParkは取引成立・権利移転・収益性・安全性を保証しません。
