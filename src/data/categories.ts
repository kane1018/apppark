import type { Category } from "@/types";

/**
 * カテゴリ一覧（セクション10-3）。
 * カテゴリを追加する場合はこの配列に1件追加してください。
 * slug は URL（/categories/[slug]）に使われます。
 */
export const categories: Category[] = [
  {
    slug: "ai-tools",
    name: "AIツール",
    description: "文章生成・画像生成・要約など、AIを活用したWebサービス。",
    icon: "bot",
  },
  {
    slug: "productivity",
    name: "業務効率化",
    description: "日々の作業を軽くする、タスク管理・自動化系ツール。",
    icon: "zap",
  },
  {
    slug: "education",
    name: "学習・教育",
    description: "勉強の記録・暗記・スキルアップに役立つサービス。",
    icon: "graduation-cap",
  },
  {
    slug: "lifestyle",
    name: "生活便利",
    description: "家計簿・習慣化など、暮らしを少し便利にするツール。",
    icon: "house",
  },
  {
    slug: "creator",
    name: "クリエイター支援",
    description: "制作・発信を助ける、クリエイター向けのツール。",
    icon: "palette",
  },
  {
    slug: "minigame",
    name: "ミニゲーム",
    description: "ちょっとした息抜きに遊べる、軽量なWebゲーム。",
    icon: "gamepad-2",
  },
  {
    slug: "business",
    name: "事業者向け",
    description: "個人事業・小規模事業の実務に使えるサービス。",
    icon: "building-2",
  },
  {
    slug: "developer",
    name: "開発者向け",
    description: "開発・運用を助ける、エンジニア向けのツール。",
    icon: "code-2",
  },
  {
    slug: "writing",
    name: "文章作成",
    description: "ライティング・台本・コピーづくりを支えるツール。",
    icon: "pen-line",
  },
  {
    slug: "image-video",
    name: "画像・動画",
    description: "画像加工・動画編集・字幕づくりなどのツール。",
    icon: "clapperboard",
  },
  {
    slug: "calc-diagnosis",
    name: "計算・診断",
    description: "計算・シミュレーション・チェック・診断系のツール。",
    icon: "calculator",
  },
  {
    slug: "website",
    name: "サイト制作",
    description: "サイトづくり・改善・診断に役立つツール。",
    icon: "layout-template",
  },
];

const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return categoryMap.get(slug);
}

export function getCategoryName(slug: string): string {
  return categoryMap.get(slug)?.name ?? slug;
}
