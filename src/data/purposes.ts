import type { Purpose } from "@/types";

/**
 * 目的タグ一覧（目的から探す）。
 * 「やりたいこと」からサービスを探すための導線です。
 * slug は URL（/purposes/[slug]）・検索フィルターに使われます。
 *
 * featured: true のものだけトップページに表示します（出しすぎ防止）。
 * 既存サービスが参照している slug（write / work-efficiency / try-ai /
 * edit-image / make-video / study / calculate / build-site /
 * get-customers / daily-life / business-tools）は変更しないでください。
 */
export const purposes: Purpose[] = [
  { slug: "work-efficiency", name: "仕事を効率化したい", description: "手作業を減らし、日々の業務をスムーズに。", icon: "zap", featured: true },
  { slug: "try-ai", name: "AIツールを試したい", description: "話題のAIを、まずは気軽に試してみる。", icon: "bot", featured: true },
  { slug: "write", name: "文章を作りたい", description: "記事・台本・メール・コピーなどの文章づくりに。", icon: "pen-line", featured: true },
  { slug: "polish-writing", name: "文章を整えたい", description: "校正・整形・敬語変換など、文章の手直しに。", icon: "pen-line" },
  { slug: "create-image", name: "画像を作りたい", description: "画像生成・ロゴ・バナーなどの作成に。", icon: "image", featured: true },
  { slug: "edit-image", name: "画像を加工したい", description: "圧縮・リサイズ・背景削除などの画像作業に。", icon: "image" },
  { slug: "make-video", name: "動画を作りたい", description: "字幕・編集・ショート動画づくりの作業に。", icon: "clapperboard", featured: true },
  { slug: "make-audio", name: "音声を作りたい", description: "音声合成・文字起こし・ナレーション作成に。", icon: "clapperboard" },
  { slug: "study", name: "勉強に使いたい", description: "学習の記録・暗記・継続をサポート。", icon: "book-open", featured: true },
  { slug: "calculate", name: "数字を計算したい", description: "計算・見積もり・シミュレーションに。", icon: "calculator" },
  { slug: "diagnose", name: "診断したい", description: "向き不向き・タイプ診断・チェックに。", icon: "sparkles" },
  { slug: "build-site", name: "サイトを作りたい", description: "サイト制作・改善・公開準備に役立つツール。", icon: "globe", featured: true },
  { slug: "get-customers", name: "集客したい", description: "LP改善・広告・発信など、集客まわりの作業に。", icon: "megaphone" },
  { slug: "grow-sns", name: "SNSを伸ばしたい", description: "投稿づくり・分析など、SNS運用の作業に。", icon: "share-2" },
  { slug: "daily-life", name: "生活を便利にしたい", description: "家事・家計・習慣など、毎日の暮らしを軽く。", icon: "house", featured: true },
  { slug: "manage-money", name: "お金を管理したい", description: "家計・収支・経費・税金の管理や計算に。", icon: "wallet" },
  { slug: "business-tools", name: "事業に使いたい", description: "個人事業・小規模事業の実務に使えるツール。", icon: "briefcase-business" },
  { slug: "hr-job", name: "採用・転職に使いたい", description: "履歴書・面接・採用管理など、人事・転職の作業に。", icon: "users" },
  { slug: "legal-contract", name: "法務・契約に使いたい", description: "契約書・規約・士業業務の準備や確認に。", icon: "scale" },
  { slug: "gov-procedure", name: "行政手続きを楽にしたい", description: "許認可・申請・各種手続きの準備に。", icon: "file-text" },
  { slug: "language-support", name: "外国語に対応したい", description: "翻訳・語学・多言語・外国人対応の作業に。", icon: "languages" },
  { slug: "realize-idea", name: "アイデアを形にしたい", description: "頭の中のアイデアを、使える形にしていく。", icon: "sparkles" },
  { slug: "publish-tool", name: "小さなツールを公開したい", description: "公開URLがなくても、AppPark上で小さなツールを公開。", icon: "layout-grid" },
  { slug: "no-code", name: "コードを書かずに作りたい", description: "コードを書かずに、ツールやサイトを形にする。", icon: "layout-template" },
  { slug: "try-first", name: "まず試してみたい", description: "登録なし・無料で、まず気軽に試してみる。", icon: "sparkles" },
  { slug: "kill-time", name: "暇つぶしに使いたい", description: "息抜きに遊べる、軽いミニゲームや診断など。", icon: "gamepad-2" },
  { slug: "with-friends", name: "友達と楽しみたい", description: "友達やパーティーで一緒に楽しめるツール。", icon: "gamepad-2" },
  { slug: "creative", name: "創作に使いたい", description: "ネタ出し・物語・キャラ作成など、創作の補助に。", icon: "palette" },
];

/** トップページに表示する主要な目的タグ（出しすぎ防止のため絞り込み） */
export const featuredPurposes: Purpose[] = purposes.filter((p) => p.featured);

const purposeMap = new Map(purposes.map((p) => [p.slug, p]));

export function getPurpose(slug: string): Purpose | undefined {
  return purposeMap.get(slug);
}

export function getPurposeName(slug: string): string {
  return purposeMap.get(slug)?.name ?? slug;
}
