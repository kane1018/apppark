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
   * true の間はヘッダー上部に「β版」のバーを表示します。本番運用では false。
   */
  isBeta: false,
  /** β表記のラベル */
  betaLabel: "β版",

  /**
   * 通報・削除依頼にログインを必須にするか。
   * false：ログイン推奨（未ログインでも通報可）／true：ログイン必須。
   */
  requireLoginForReport: false,

  /**
   * 閲覧数・クリック数・役に立った数（利用実績の数値）を表示するか。
   * 実データの集計基盤が整うまでは false（架空の数値を出さない）。
   * 集計を始めたら true にすると、これらの数値を表示できます。
   */
  showUsageStats: false,

  /**
   * 検索エンジンにインデックスさせないフラグ。
   * 本番運用では false（インデックス許可＋robots.txtでsitemap参照）。
   * 一時的に検索から隠したい場合のみ true にしてください。
   */
  noIndex: false,

  /** キャッチコピー（メインコピー / OGPタイトルにも使用） */
  tagline: "こんなの欲しかった、が見つかる。",

  /** トップページのメインコピー（= キャッチコピー）／サブコピー／補足 */
  heroTitle: "こんなの欲しかった、が見つかる。",
  heroSubtitle:
    "AIツール、便利なWebサービス、個人開発のミニツールを、目的別・カテゴリ別に探せるサイトです。",
  heroLead:
    "外部サイトへ移動して使うサービスだけでなく、AppParkのページ内でそのまま使えるミニツールも掲載しています。",

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
    /**
     * 問い合わせ受付メール。独自ドメインのメールを用意したらここに設定してください。
     * 空のあいだは、お問い合わせフォーム（/contact）が連絡窓口になります。
     */
    contactEmail: "",
  },

  /** フッターのコピーライト表記に使う開始年 */
  copyrightStartYear: 2026,

  /**
   * サイトの初期掲載サービスの投稿者（サイトオーナー本人）。
   * 初期掲載サービスは「運営作成」ではなく、この公開表示名による通常投稿として表示します。
   * 公開するのは displayName（公開表示名）のみ。メール・連絡先・管理情報は公開しません。
   * authorId は投稿の紐付けキー（マイページの「自分の投稿」判定にも使用）。
   */
  owner: {
    authorId: "kansui",
    displayName: "Kansui",
  },
} as const;

/** 主要ナビゲーション（ヘッダー） */
export const mainNav = [
  { label: "探す", href: "/services" },
  { label: "カテゴリ", href: "/categories" },
  { label: "ミニツール", href: "/services?internal=1" },
  { label: "アイデア", href: "/ideas" },
  { label: "掲載する", href: "/submit" },
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
      { label: "アイデア掲示板", href: "/ideas" },
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
