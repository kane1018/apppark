import type { TagDef, TagGroup } from "@/types";

/**
 * 汎用タグの定義（利用者別・ツール形式・料金・運営状態）。
 *
 * slug は全グループ横断で一意です（/tags/[slug] の単独ページに使うため）。
 * 検索フィルター・投稿フォーム・サービスカードのタグ表示にも使われます。
 * タグを追加する場合は、対応する配列に1件追加してください。
 */

/** 利用者別タグ（職種・立場から探す） */
export const audienceTags: TagDef[] = [
  { slug: "individual", name: "個人向け", group: "audience" },
  { slug: "student", name: "学生向け", group: "audience" },
  { slug: "worker", name: "社会人向け", group: "audience" },
  { slug: "freelance", name: "フリーランス向け", group: "audience" },
  { slug: "sole-proprietor", name: "個人事業主向け", group: "audience" },
  { slug: "small-business", name: "小規模事業者向け", group: "audience" },
  { slug: "employee", name: "会社員向け", group: "audience" },
  { slug: "executive", name: "経営者向け", group: "audience" },
  { slug: "professional", name: "士業向け", group: "audience" },
  { slug: "creator-audience", name: "クリエイター向け", group: "audience" },
  { slug: "engineer", name: "エンジニア向け", group: "audience" },
  { slug: "marketer", name: "マーケター向け", group: "audience" },
  { slug: "recruiter", name: "採用担当向け", group: "audience" },
  { slug: "hr-staff", name: "人事向け", group: "audience" },
  { slug: "educator", name: "教育関係者向け", group: "audience" },
  { slug: "foreigner-support", name: "外国人対応向け", group: "audience" },
  { slug: "beginner", name: "初心者向け", group: "audience" },
  { slug: "code-beginner", name: "コード初心者向け", group: "audience" },
  { slug: "ai-beginner", name: "AI初心者向け", group: "audience" },
];

/** ツール形式タグ（ツールの形式から探す） */
export const toolTypeTags: TagDef[] = [
  { slug: "external", name: "外部サービス", group: "toolType" },
  { slug: "internal-mini-tool", name: "AppPark内ミニツール", group: "toolType" },
  { slug: "diagnosis", name: "診断", group: "toolType" },
  { slug: "calculator", name: "計算", group: "toolType" },
  { slug: "checklist", name: "チェックリスト", group: "toolType" },
  { slug: "template", name: "テンプレート生成", group: "toolType" },
  { slug: "text-transform", name: "文章変換", group: "toolType" },
  { slug: "comparison", name: "比較表", group: "toolType" },
  { slug: "random", name: "ランダム生成", group: "toolType" },
  { slug: "step-guide", name: "ステップ案内", group: "toolType" },
  { slug: "qa-nav", name: "Q&Aナビ", group: "toolType" },
  { slug: "form", name: "受付フォーム", group: "toolType" },
  { slug: "browser-game", name: "ブラウザゲーム", group: "toolType" },
  { slug: "ai-chat", name: "AIチャット", group: "toolType" },
  { slug: "image-gen", name: "画像生成", group: "toolType" },
  { slug: "video-gen", name: "動画生成", group: "toolType" },
  { slug: "audio-gen", name: "音声生成", group: "toolType" },
  { slug: "nocode", name: "ノーコード", group: "toolType" },
  { slug: "api", name: "API連携", group: "toolType" },
  { slug: "iframe", name: "iframe埋め込み", group: "toolType" },
  { slug: "dev-service", name: "開発中サービス", group: "toolType" },
];

/** 料金タグ（料金形態から探す） */
export const pricingTags: TagDef[] = [
  { slug: "free", name: "無料", group: "pricing" },
  { slug: "paid", name: "有料", group: "pricing" },
  { slug: "freemium", name: "フリーミアム", group: "pricing" },
  { slug: "free-trial", name: "無料トライアルあり", group: "pricing" },
  { slug: "one-time", name: "買い切り", group: "pricing" },
  { slug: "subscription", name: "月額制", group: "pricing" },
  { slug: "usage-based", name: "従量課金", group: "pricing" },
  { slug: "open-source", name: "オープンソース", group: "pricing" },
  { slug: "no-signup", name: "登録不要", group: "pricing" },
  { slug: "login-required", name: "ログイン必要", group: "pricing" },
];

/** 運営状態タグ（サービスの状態から探す） */
export const statusTags: TagDef[] = [
  { slug: "published", name: "公開中", group: "status" },
  { slug: "beta", name: "β版", group: "status" },
  { slug: "developing", name: "開発中", group: "status" },
  { slug: "pre-registration", name: "事前登録受付中", group: "status" },
  { slug: "indie", name: "個人開発", group: "status" },
  { slug: "official", name: "運営作成", group: "status" },
  { slug: "updating", name: "更新中", group: "status" },
  { slug: "discontinued", name: "更新停止中", group: "status" },
  { slug: "new", name: "新着", group: "status" },
  { slug: "featured", name: "注目", group: "status" },
  { slug: "sponsor", name: "スポンサー", group: "status" },
  { slug: "pr", name: "PR", group: "status" },
];

/** すべての汎用タグ */
export const allTagDefs: TagDef[] = [
  ...audienceTags,
  ...toolTypeTags,
  ...pricingTags,
  ...statusTags,
];

const tagMap = new Map(allTagDefs.map((t) => [t.slug, t]));

export function getTagDef(slug: string): TagDef | undefined {
  return tagMap.get(slug);
}

export function getTagName(slug: string): string {
  return tagMap.get(slug)?.name ?? slug;
}

export function getTagsByGroup(group: TagGroup): TagDef[] {
  return allTagDefs.filter((t) => t.group === group);
}

export const tagGroupLabels: Record<TagGroup, string> = {
  audience: "利用者・立場",
  toolType: "ツール形式",
  pricing: "料金形態",
  status: "運営状態",
};
