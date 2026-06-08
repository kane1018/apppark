import type { Service } from "@/types";

/**
 * 掲載サービスデータ。
 *
 * 公開初期は、AppPark運営が作成した「実際に動くWebツール」を掲載しています
 * （isFirstParty: true、url は AppPark内の /tools/<slug>）。
 * 外部の投稿サービスは、掲載申請を運営が確認のうえ追加します（isFirstParty: false）。
 *
 * 後から Supabase / Firebase / Notion / スプレッドシート等に移行する場合も、
 * この Service 型に合わせてデータを返すようにすれば、UIは変更不要です。
 */
function tool(
  partial: Omit<
    Service,
    | "pricing"
    | "status"
    | "thumbnailUrl"
    | "galleryImageUrls"
    | "imageAlt"
    | "views"
    | "clicks"
    | "helpfulCount"
    | "authorName"
    | "authorLinks"
    | "aiToolsUsed"
    | "recruitmentNote"
    | "isSponsored"
    | "isFirstParty"
    | "voices"
  > &
    Partial<Service>
): Service {
  return {
    pricing: "free",
    status: "active",
    thumbnailUrl: null,
    galleryImageUrls: [],
    imageAlt: null,
    views: 0,
    clicks: 0,
    helpfulCount: 0,
    authorName: "AppPark運営",
    authorLinks: [],
    aiToolsUsed: [],
    recruitmentNote: null,
    isSponsored: false,
    isFirstParty: true,
    voices: [],
    ...partial,
  } as Service;
}

export const services: Service[] = [
  tool({
    id: "tool-char-count",
    slug: "char-count",
    name: "文字数カウント",
    shortDescription: "文章の文字数・文字種・行数・単語数をその場で数えます。",
    description:
      "入力した文章の文字数（スペース込み／除く）、行数、単語数、原稿用紙の枚数の目安を、ブラウザ上でリアルタイムに数えるツールです。SNSの文字数制限の確認や、原稿のボリューム把握に使えます。入力内容はサーバーに送信されません（ブラウザ内で処理）。",
    category: "writing",
    purposes: ["write", "work-efficiency"],
    tags: ["文字数", "カウント", "文章", "無料"],
    url: "/tools/char-count",
    createdAt: "2026-06-08",
    updatedAt: "2026-06-08",
    recommendedFor: [
      "SNSやフォームの文字数制限を確認したい人",
      "原稿のボリュームを把握したい人",
      "ブログ・メールの文字数を整えたい人",
    ],
    howToUse: [
      "テキスト欄に文章を貼り付ける",
      "文字数・行数・単語数が自動で表示される",
      "必要に応じてコピー・クリアする",
    ],
    useCases: ["投稿前の文字数チェック", "原稿量の見積もり"],
    cautions: ["入力内容はブラウザ内でのみ処理され、保存されません"],
    authorComment: "「あと何文字？」をすぐ確認できるよう、シンプルさを重視しました。",
    techStack: ["Next.js", "TypeScript"],
    reasonCreated: "投稿前の文字数確認を、広告だらけのサイトに頼らず素早く行いたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-image-compress",
    slug: "image-compress",
    name: "画像圧縮・リサイズ",
    shortDescription: "画像をブラウザ内で圧縮・リサイズ。アップロード不要。",
    description:
      "JPEG・PNG・WebP画像を、ブラウザ内（あなたの端末上）でリサイズ・再圧縮してファイルサイズを小さくするツールです。最大幅と画質を選ぶだけ。画像はサーバーへアップロードされないため、安心して使えます。ブログやサイトの表示高速化、メール添付の軽量化に。",
    category: "image-video",
    purposes: ["edit-image", "work-efficiency"],
    tags: ["画像圧縮", "リサイズ", "ブラウザ完結", "無料"],
    url: "/tools/image-compress",
    createdAt: "2026-06-08",
    updatedAt: "2026-06-08",
    recommendedFor: [
      "ブログ・サイトの画像を軽くしたい人",
      "アップロードせず手元で圧縮したい人",
      "メール添付の画像サイズを下げたい人",
    ],
    howToUse: [
      "画像ファイルを選ぶ（またはドラッグ＆ドロップ）",
      "最大幅と画質を調整する",
      "圧縮後の画像をダウンロードする",
    ],
    useCases: ["サイト表示の高速化", "SNS・メール用に画像を軽量化"],
    cautions: [
      "画像はブラウザ内で処理され、サーバーへ送信されません",
      "圧縮後は画質を確認してからご利用ください",
    ],
    authorComment: "プライバシーのため、画像を一切アップロードしない設計にしました。",
    techStack: ["Next.js", "Canvas API"],
    reasonCreated: "画像をアップロードせずに手元で圧縮したいニーズに応えたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-password-generator",
    slug: "password-generator",
    name: "パスワード生成",
    shortDescription: "強度を選べる安全なランダムパスワードを生成します。",
    description:
      "長さや文字種（英大文字・小文字・数字・記号）を選んで、推測されにくいランダムなパスワードを生成するツールです。生成はすべてブラウザ内で行われ、外部に送信されません。区別しにくい文字（0/O, 1/l）を除外するオプションもあります。",
    category: "developer",
    purposes: ["work-efficiency", "business-tools"],
    tags: ["パスワード", "セキュリティ", "生成", "無料"],
    url: "/tools/password-generator",
    createdAt: "2026-06-07",
    updatedAt: "2026-06-07",
    recommendedFor: [
      "強いパスワードを手早く作りたい人",
      "アカウントごとに異なるパスワードを使いたい人",
    ],
    howToUse: [
      "長さと文字種を選ぶ",
      "生成ボタンを押す",
      "パスワードをコピーして使う",
    ],
    useCases: ["新規アカウント作成時", "定期的なパスワード更新"],
    cautions: [
      "生成はブラウザ内のみで行われ、保存・送信されません",
      "生成したパスワードはパスワード管理ツール等で安全に保管してください",
    ],
    authorComment: "暗号学的に安全な乱数（Web Crypto）で生成しています。",
    techStack: ["Next.js", "Web Crypto API"],
    reasonCreated: "安全なパスワードを、信頼できる手元の処理で作れるようにしたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-price-calc",
    slug: "price-calc",
    name: "税込・割引計算",
    shortDescription: "税込／税抜・割引後の価格をすぐに計算します。",
    description:
      "金額と税率（10%・8%・任意）を入力して、税込・税抜の価格を相互に計算できるツールです。割引率を入れれば割引後の価格も同時にわかります。買い物・見積もり・価格設定の確認に。",
    category: "calc-diagnosis",
    purposes: ["calculate", "business-tools"],
    tags: ["計算", "税込", "割引", "無料"],
    url: "/tools/price-calc",
    createdAt: "2026-06-06",
    updatedAt: "2026-06-06",
    recommendedFor: [
      "税込・税抜をすぐ計算したい人",
      "割引後の価格を確認したい人",
      "見積もり・価格設定をする個人事業の方",
    ],
    howToUse: [
      "金額を入力する",
      "税率（10%/8%/任意）と割引率を選ぶ",
      "税込・税抜・割引後の金額を確認する",
    ],
    useCases: ["買い物時の価格確認", "見積もり・請求の確認"],
    cautions: ["端数処理（切り捨て等）は用途に応じてご確認ください"],
    authorComment: "毎回電卓を叩く手間を減らすために作りました。",
    techStack: ["Next.js", "TypeScript"],
    reasonCreated: "税込・割引の計算をその場でまとめて行いたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-color-converter",
    slug: "color-converter",
    name: "カラーコード変換",
    shortDescription: "HEX↔RGBを相互変換。色のプレビュー付き。",
    description:
      "カラーコードを HEX（#RRGGBB）と RGB の間で相互変換できるツールです。スライダーで色を調整しながら、プレビューとコードを同時に確認できます。デザインやコーディングでの色指定に。",
    category: "creator",
    purposes: ["edit-image", "build-site"],
    tags: ["カラー", "HEX", "RGB", "デザイン"],
    url: "/tools/color-converter",
    createdAt: "2026-06-05",
    updatedAt: "2026-06-05",
    recommendedFor: [
      "デザイン・コーディングで色を扱う人",
      "HEXとRGBを行き来したい人",
    ],
    howToUse: [
      "HEXを入力する、またはRGBスライダーを動かす",
      "プレビューと変換結果を確認する",
      "コードをコピーして使う",
    ],
    useCases: ["CSSの色指定", "デザインの色調整"],
    cautions: ["対応形式は HEX（#RRGGBB）と RGB です"],
    authorComment: "色をいじりながら確認できるようにしました。",
    techStack: ["Next.js", "TypeScript"],
    reasonCreated: "色コードの変換を、プレビューを見ながら行いたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-pomodoro-timer",
    slug: "pomodoro-timer",
    name: "ポモドーロタイマー",
    shortDescription: "25分集中＋5分休憩。作業に集中するためのタイマー。",
    description:
      "「25分集中 → 5分休憩」を繰り返すポモドーロ・テクニック用のタイマーです。集中と休憩を切り替えながら作業を進められます。時間はブラウザ内でカウントし、終了時に通知（音）でお知らせします。",
    category: "productivity",
    purposes: ["work-efficiency", "study"],
    tags: ["タイマー", "集中", "ポモドーロ", "無料"],
    url: "/tools/pomodoro-timer",
    createdAt: "2026-06-04",
    updatedAt: "2026-06-04",
    recommendedFor: [
      "集中して作業・勉強したい人",
      "だらだら作業を防ぎたい人",
    ],
    howToUse: [
      "スタートを押して25分集中する",
      "終了したら5分休憩する",
      "これを繰り返す",
    ],
    useCases: ["仕事・勉強の集中時間づくり", "在宅ワークのリズムづくり"],
    cautions: ["タブを閉じるとカウントはリセットされます"],
    authorComment: "余計な機能を省き、集中に集中できるようにしました。",
    techStack: ["Next.js", "TypeScript"],
    reasonCreated: "シンプルなポモドーロタイマーを、広告なしで使いたかったため。",
    recruitmentStatus: ["seeking_users", "seeking_feedback"],
  }),
];

/* ------------------------------------------------------------------
 * データ取得ヘルパー（後で DB 接続に置き換えやすいよう関数化）
 * ------------------------------------------------------------------ */

export function getAllServices(): Service[] {
  return services;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(categorySlug: string): Service[] {
  return services.filter((s) => s.category === categorySlug);
}

export function getServicesByPurpose(purposeSlug: string): Service[] {
  return services.filter((s) => s.purposes.includes(purposeSlug));
}

/** すべてのタグ（重複なし） */
export function getAllTags(): string[] {
  const set = new Set<string>();
  services.forEach((s) => s.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

/** 内部の運営作成ツールか（url が /tools/ で始まる） */
export function isInternalToolUrl(url: string): boolean {
  return url.startsWith("/tools/");
}
