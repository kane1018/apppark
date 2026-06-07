/**
 * サイト全体の設定を一元管理するファイル。
 *
 * サービス名を変更する場合は、まずこのファイルの `name` を変えてください。
 * サイト名・メタ情報・OGP・構造化データ・フッター表記はすべてここを参照します。
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  // β版のVercel既定URL。独自ドメイン設定時は環境変数 NEXT_PUBLIC_SITE_URL で上書き。
  "https://apppark.vercel.app";

export const siteConfig = {
  /** サービス名。変更する場合はここだけ直せば全体に反映されます。 */
  name: "AppPark",
  /** 英語表記・ロゴ等で使う短い名前 */
  shortName: "AppPark",
  /** ロゴマークに使うアイコン（Lucide の IconName）。ヘッダー・フッターで参照 */
  logoIcon: "layout-grid" as const,
  /** 公開URL（本番では環境変数 NEXT_PUBLIC_SITE_URL で上書き） */
  url: siteUrl,
  /** ロケール */
  locale: "ja_JP",
  lang: "ja",

  /**
   * β版・デモ版として公開中かどうか。
   * true の間はヘッダー上部に「β版（デモ）」のバーを表示します。
   * 正式公開時に false にしてください。
   */
  isBeta: true,
  /** β表記のラベル */
  betaLabel: "β版",

  /**
   * 検索エンジンにインデックスさせないフラグ（β版/デモ公開用）。
   * true の間は、全ページに noindex メタタグを出力し、robots.txt で
   * クロールを禁止します（Google検索に出にくい状態）。
   *
   * 【正式公開時】サービス名・デザイン・法務・掲載基準が固まったら
   * false に変更し、独自ドメイン設定／Search Console登録／sitemap送信を行ってください。
   */
  noIndex: true,

  /** キャッチコピー（メインコピー / OGPタイトルにも使用） */
  tagline: "こんなの欲しかった、が見つかる。",

  /** トップページのメインコピー（= キャッチコピー）／サブコピー */
  heroTitle: "こんなの欲しかった、が見つかる。",
  heroSubtitle: "面白いWebサービス・便利ツールを探せるサイト。",

  /** title 用のフレーズ（句点なし）。ホームの title は「サービス名｜この文」になります */
  titleTagline: "面白いWebサービス・便利ツールを探せるサイト",

  /** サイトの説明（メタ description の既定値） */
  description:
    "AppParkは、AIツール、業務効率化、学習、生活便利、画像・動画、サイト制作など、面白いWebサービス・便利ツールを目的別・カテゴリ別に探せるサイトです。",

  /** OGP 用の説明（meta description とは別に最適化） */
  ogDescription:
    "面白いWebサービス・便利ツールを探せるサイト。AIツール、業務効率化、学習、生活便利など、目的別・カテゴリ別にWebツールを見つけられます。",

  /** SEOキーワード候補（セクション22） */
  keywords: [
    "Webサービス 探す",
    "便利なWebサービス",
    "面白いWebサービス",
    "Webアプリ 探す",
    "AIツール 探す",
    "個人開発 サービス",
    "Webサービス 投稿",
    "Webサービス 見本市",
    "小さなWebサービス",
    "便利ツール",
    "無料Webサービス",
    "業務効率化 Webサービス",
  ],

  /** OGP / Twitter Card 設定（1200×630 PNG。SNSで確実に表示されます） */
  ogImage: "/og.png",
  twitterCard: "summary_large_image" as const,
  /** X(Twitter)の公式アカウント。未取得のため空（空のときは twitter:site を出力しない）。 */
  twitterSite: "",

  /**
   * Google Search Console の「HTMLタグ」確認用トークン。
   * 環境変数 NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION に
   * content="..." の値だけを設定すると、<meta name="google-site-verification">
   * が自動で出力され、GSCの所有権確認がそのまま通ります。
   */
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",

  /** 運営者表記（構造化データ・フッター・各法務ページで使用） */
  organization: {
    name: "AppPark 運営チーム",
    /** 運営者（Organization）のURL */
    url: siteUrl,
    /** 運営者ロゴ（Organization 構造化データ用） */
    logo: "/icon.svg",
    /** 問い合わせ・通報の受付メール（仮）。実運用時に差し替えてください。 */
    contactEmail: "contact@web-ichiba.example.com",
  },

  /** フッターのコピーライト表記に使う開始年 */
  copyrightStartYear: 2026,
} as const;

/** 主要ナビゲーション（ヘッダー） */
export const mainNav = [
  { label: "サービスを探す", href: "/services" },
  { label: "カテゴリ", href: "/categories" },
  { label: "目的から探す", href: "/purposes" },
  { label: `${siteConfig.name}について`, href: "/about" },
] as const;

/** ヘッダー内の補助導線（投稿者・スポンサー向け。目立たせすぎない） */
export const subNav = [
  { label: "掲載申請", href: "/submit" },
  { label: "スポンサー掲載", href: "/sponsor" },
] as const;

/**
 * 掲載者向けの導線（モバイルメニューに表示）。
 * 閲覧者向けの「探す」導線を主役に保ちつつ、作った人がすぐ見つけられるように。
 * 「Webサービスを作った方へ」はトップページの掲載者向けセクション(#for-creators)へ。
 */
export const creatorNav = [
  { label: "掲載申請する", href: "/submit" },
  { label: "Webサービスを作った方へ", href: "/#for-creators" },
  { label: "スポンサー掲載", href: "/sponsor" },
] as const;

/** フッターのリンク群（一元管理） */
export const footerNav = {
  explore: {
    title: "探す",
    links: [
      { label: "サービス一覧", href: "/services" },
      { label: "カテゴリ一覧", href: "/categories" },
      { label: "目的から探す", href: "/purposes" },
    ],
  },
  creator: {
    title: "投稿者の方へ",
    links: [
      { label: "掲載申請する", href: "/submit" },
      { label: "掲載基準", href: "/guidelines" },
    ],
  },
  sponsor: {
    title: "スポンサーの方へ",
    links: [{ label: "スポンサー掲載について", href: "/sponsor" }],
  },
  about: {
    title: "運営・規約",
    links: [
      { label: `${siteConfig.name}について`, href: "/about" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "通報・削除依頼", href: "/report" },
      { label: "利用規約", href: "/terms" },
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "免責事項", href: "/disclaimer" },
    ],
  },
} as const;

/** サイト全体で使い回す共通の免責文（セクション13-13） */
export const SERVICE_DISCLAIMER =
  `この掲載サービスは投稿者または外部運営者が提供するサービスです。${siteConfig.name}は、掲載サービスの内容、安全性、合法性、品質、継続提供、収益性を保証するものではありません。利用前に各サービスの利用規約・プライバシーポリシーをご確認ください。`;
