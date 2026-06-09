import type { MiniToolType } from "@/lib/minitool/types";
import type { Service } from "@/types";
import { siteConfig } from "@/config/site";

/**
 * Service データを組み立てる共通ファクトリ。
 *
 * services.ts（AppPark内で動く実動ツール）と initialServices.ts（各カテゴリの初期掲載
 * ミニツール）の双方から使うため、循環参照を避けて独立モジュールに切り出しています。
 *
 * 初期掲載サービスは「運営作成」ではなく、サイトオーナー本人の通常投稿
 * （公開表示名：siteConfig.owner.displayName）として扱います（createdBy: "user"）。
 * 未指定のタグ・フラグは他のフィールドから自動導出します（指定があれば尊重）。
 * 投稿者のコードは実行しません。
 */

/** ミニツールの種類 → ツール形式タグ slug */
const MINI_TOOL_TYPE_TAG: Record<MiniToolType, string | null> = {
  diagnosis: "diagnosis",
  calculator: "calculator",
  template_generator: "template",
  checklist: "checklist",
  text_transform: "text-transform",
  random: "random",
  none: null,
};

/** 料金（enum）→ 料金タグ slug */
function derivePricingTags(s: Service): string[] {
  switch (s.pricing) {
    case "free":
      return ["free"];
    case "paid":
      return ["paid"];
    case "freemium":
      return ["freemium"];
    default:
      return [];
  }
}

/** 運営状況・属性 → 運営状態タグ slug */
function deriveStatusTags(s: Service): string[] {
  const tags = new Set<string>();
  if (s.listingType === "development") tags.add("developing");
  else if (s.status === "active") tags.add("published");
  else if (s.status === "beta") tags.add("beta");
  else if (s.status === "development") tags.add("developing");
  else if (s.status === "paused") tags.add("discontinued");
  tags.add(s.isFirstParty ? "official" : "indie");
  if (s.isSponsored) tags.add("sponsor");
  return Array.from(tags);
}

/** 掲載タイプ・ミニツール種別 → ツール形式タグ slug */
function deriveToolTypeTags(s: Service): string[] {
  const tags = new Set<string>();
  switch (s.listingType) {
    case "external":
      tags.add("external");
      break;
    case "internal_mini_tool": {
      tags.add("internal-mini-tool");
      const mt = MINI_TOOL_TYPE_TAG[s.miniTool.type];
      if (mt) tags.add(mt);
      break;
    }
    case "iframe_embed":
      tags.add("iframe");
      break;
    case "development":
      tags.add("dev-service");
      break;
  }
  return Array.from(tags);
}

/** AI対応かどうかの自動判定 */
function deriveIsAiEnabled(s: Service): boolean {
  return (
    s.category === "ai-tools" ||
    s.purposes.includes("try-ai") ||
    s.aiToolsUsed.length > 0 ||
    s.toolTypeTags.includes("ai-chat")
  );
}

export function tool(
  partial: Omit<
    Service,
    | "pricing"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "thumbnailUrl"
    | "galleryImageUrls"
    | "imageAlt"
    | "views"
    | "clicks"
    | "helpfulCount"
    | "authorId"
    | "publicAuthorName"
    | "authorName"
    | "authorLinks"
    | "aiToolsUsed"
    | "recruitmentNote"
    | "isSponsored"
    | "isFirstParty"
    | "createdBy"
    | "listingType"
    | "miniTool"
    | "iframeEmbed"
    | "developmentInfo"
    | "moderationState"
    | "ctaLabel"
    | "ctaUrl"
    | "relatedIdeaId"
    | "voices"
    | "subCategories"
    | "audienceTags"
    | "toolTypeTags"
    | "pricingTags"
    | "statusTags"
    | "isAiEnabled"
    | "isInternalMiniTool"
  > &
    Partial<Service>
): Service {
  const merged: Service = {
    pricing: "free",
    status: "active",
    createdAt: "2026-06-09",
    updatedAt: "2026-06-09",
    thumbnailUrl: null,
    galleryImageUrls: [],
    imageAlt: null,
    views: 0,
    clicks: 0,
    helpfulCount: 0,
    authorId: siteConfig.owner.authorId,
    publicAuthorName: siteConfig.owner.displayName,
    authorName: siteConfig.owner.displayName,
    authorLinks: [],
    aiToolsUsed: [],
    recruitmentNote: null,
    isSponsored: false,
    isFirstParty: false,
    createdBy: "user",
    listingType: "internal_mini_tool",
    miniTool: { enabled: false, type: "none", config: null },
    iframeEmbed: { requested: false, url: null, approved: false },
    developmentInfo: { enabled: false, status: null, plannedRelease: null },
    moderationState: "published",
    ctaLabel: null,
    ctaUrl: null,
    relatedIdeaId: null,
    voices: [],
    subCategories: [],
    audienceTags: [],
    toolTypeTags: [],
    pricingTags: [],
    statusTags: [],
    isAiEnabled: false,
    isInternalMiniTool: false,
    ...partial,
  } as Service;

  if (merged.toolTypeTags.length === 0)
    merged.toolTypeTags = deriveToolTypeTags(merged);
  if (merged.pricingTags.length === 0)
    merged.pricingTags = derivePricingTags(merged);
  if (merged.statusTags.length === 0)
    merged.statusTags = deriveStatusTags(merged);
  if (partial.isInternalMiniTool === undefined)
    merged.isInternalMiniTool = merged.listingType === "internal_mini_tool";
  if (partial.isAiEnabled === undefined)
    merged.isAiEnabled = deriveIsAiEnabled(merged);

  return merged;
}
