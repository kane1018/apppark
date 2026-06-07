import type { Purpose } from "@/types";

/**
 * 目的タグ一覧（セクション10-2）。
 * 目的を追加する場合はこの配列に1件追加してください。
 * slug は URL（/purposes/[slug]）に使われます。
 */
export const purposes: Purpose[] = [
  {
    slug: "work-efficiency",
    name: "仕事を効率化したい",
    description: "手作業を減らし、日々の業務をスムーズに。",
    icon: "zap",
  },
  {
    slug: "try-ai",
    name: "AIツールを試したい",
    description: "話題のAIを、まずは気軽に試してみる。",
    icon: "bot",
  },
  {
    slug: "write",
    name: "文章を作りたい",
    description: "記事・台本・コピーなどの文章づくりに。",
    icon: "pen-line",
  },
  {
    slug: "edit-image",
    name: "画像を加工したい",
    description: "圧縮・リサイズ・加工などの画像作業に。",
    icon: "image",
  },
  {
    slug: "make-video",
    name: "動画を作りたい",
    description: "字幕・編集など、動画づくりの作業に。",
    icon: "clapperboard",
  },
  {
    slug: "study",
    name: "勉強に使いたい",
    description: "学習の記録・暗記・継続をサポート。",
    icon: "book-open",
  },
  {
    slug: "calculate",
    name: "数字を計算したい",
    description: "計算・見積もり・シミュレーションに。",
    icon: "calculator",
  },
  {
    slug: "build-site",
    name: "サイトを作りたい",
    description: "サイト制作・改善・診断に役立つツール。",
    icon: "globe",
  },
  {
    slug: "get-customers",
    name: "集客したい",
    description: "LP改善・発信など、集客まわりの作業に。",
    icon: "megaphone",
  },
  {
    slug: "daily-life",
    name: "暮らしを便利にしたい",
    description: "家計・習慣など、毎日の暮らしを軽く。",
    icon: "house",
  },
  {
    slug: "play",
    name: "ちょっと遊びたい",
    description: "息抜きに遊べる、軽いミニゲームなど。",
    icon: "gamepad-2",
  },
  {
    slug: "business-tools",
    name: "事業に使えるツールを探したい",
    description: "個人事業・小規模事業の実務ツールを探す。",
    icon: "briefcase-business",
  },
];

const purposeMap = new Map(purposes.map((p) => [p.slug, p]));

export function getPurpose(slug: string): Purpose | undefined {
  return purposeMap.get(slug);
}

export function getPurposeName(slug: string): string {
  return purposeMap.get(slug)?.name ?? slug;
}
