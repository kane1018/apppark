/**
 * サービス一覧の検索・絞り込み・並び替えロジック（セクション11）。
 * MVPではローカルデータに対するフロント側フィルタリングです。
 */
import type { Pricing, RecruitmentStatus, Service, ServiceStatus } from "@/types";

export type SortKey = "new" | "views" | "clicks" | "helpful";

export interface FilterState {
  keyword: string;
  category: string; // "" = すべて（大カテゴリ slug）
  subCategory: string; // "" = すべて（詳細カテゴリの表示名）
  purpose: string; // "" = すべて（目的タグ slug）
  audience: string; // "" = すべて（利用者別タグ slug）
  toolType: string; // "" = すべて（ツール形式タグ slug）
  pricingTag: string; // "" = すべて（料金タグ slug）
  statusTag: string; // "" = すべて（運営状態タグ slug）
  tag: string; // "" = すべて（自由タグ）
  pricing: Pricing | ""; // "" = すべて
  status: ServiceStatus | ""; // "" = すべて
  /** 募集・相談ステータス（複数選択・OR条件）。空配列 = 絞り込みなし */
  recruitment: RecruitmentStatus[];
  freeOnly: boolean;
  aiOnly: boolean;
  /** AppPark内で使えるミニツールのみ */
  internalOnly: boolean;
  sort: SortKey;
}

export const defaultFilterState: FilterState = {
  keyword: "",
  category: "",
  subCategory: "",
  purpose: "",
  audience: "",
  toolType: "",
  pricingTag: "",
  statusTag: "",
  tag: "",
  pricing: "",
  status: "",
  recruitment: [],
  freeOnly: false,
  aiOnly: false,
  internalOnly: false,
  sort: "new",
};

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "new", label: "新着順" },
  { key: "views", label: "閲覧数順" },
  { key: "clicks", label: "クリック数順" },
  { key: "helpful", label: "役に立った数順" },
];

function matchesKeyword(s: Service, keyword: string): boolean {
  if (!keyword) return true;
  const k = keyword.trim().toLowerCase();
  if (!k) return true;
  const haystack = [
    s.name,
    s.shortDescription,
    s.description,
    ...s.tags,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(k);
}

function isAiRelated(s: Service): boolean {
  return (
    s.isAiEnabled ||
    s.category === "ai-tools" ||
    s.purposes.includes("try-ai") ||
    s.tags.some((t) => t.toLowerCase().includes("ai")) ||
    s.aiToolsUsed.length > 0
  );
}

export function filterAndSortServices(
  services: Service[],
  state: FilterState
): Service[] {
  const filtered = services.filter((s) => {
    if (!matchesKeyword(s, state.keyword)) return false;
    if (state.category && s.category !== state.category) return false;
    if (state.subCategory && !s.subCategories.includes(state.subCategory))
      return false;
    if (state.purpose && !s.purposes.includes(state.purpose)) return false;
    if (state.audience && !s.audienceTags.includes(state.audience)) return false;
    if (state.toolType && !s.toolTypeTags.includes(state.toolType)) return false;
    if (state.pricingTag && !s.pricingTags.includes(state.pricingTag))
      return false;
    if (state.statusTag && !s.statusTags.includes(state.statusTag)) return false;
    if (state.tag && !s.tags.includes(state.tag)) return false;
    if (state.pricing && s.pricing !== state.pricing) return false;
    if (state.status && s.status !== state.status) return false;
    if (
      state.recruitment.length > 0 &&
      !state.recruitment.some((r) => s.recruitmentStatus.includes(r))
    )
      return false;
    if (state.freeOnly && s.pricing !== "free") return false;
    if (state.aiOnly && !isAiRelated(s)) return false;
    if (state.internalOnly && !s.isInternalMiniTool) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (state.sort) {
    case "views":
      sorted.sort((a, b) => b.views - a.views);
      break;
    case "clicks":
      sorted.sort((a, b) => b.clicks - a.clicks);
      break;
    case "helpful":
      sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
      break;
    case "new":
    default:
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }
  return sorted;
}

/** 注目サービス（運営が選んだ想定。ここでは helpful 上位 + スポンサーを優先） */
export function getFeaturedServices(services: Service[], limit = 6): Service[] {
  return [...services]
    .sort((a, b) => {
      const sponsorDiff = Number(b.isSponsored) - Number(a.isSponsored);
      if (sponsorDiff !== 0) return sponsorDiff;
      return b.helpfulCount - a.helpfulCount;
    })
    .slice(0, limit);
}

/** 新着サービス */
export function getNewServices(services: Service[], limit = 6): Service[] {
  return [...services]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

/** よく使われているサービス（閲覧数順） */
export function getPopularServices(services: Service[], limit = 6): Service[] {
  return [...services].sort((a, b) => b.views - a.views).slice(0, limit);
}

/** 類似サービス：同じカテゴリ or 同じ目的タグ（自分は除外） */
export function getSimilarServices(
  services: Service[],
  current: Service,
  limit = 3
): Service[] {
  return services
    .filter((s) => s.id !== current.id)
    .map((s) => {
      let score = 0;
      if (s.category === current.category) score += 2;
      score += s.purposes.filter((p) => current.purposes.includes(p)).length;
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);
}
