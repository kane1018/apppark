/**
 * 各種コード値 → 日本語表示ラベルの対応表。
 * 表示文言を変えたいときはここを編集してください。
 */
import type {
  CommentType,
  HelpfulRating,
  Pricing,
  RiskLevel,
  ServiceStatus,
} from "@/types";

export const pricingLabels: Record<Pricing, string> = {
  free: "無料",
  paid: "有料",
  freemium: "フリーミアム",
  unknown: "不明",
};

export const statusLabels: Record<ServiceStatus, string> = {
  active: "運営中",
  beta: "β版",
  development: "開発中",
  paused: "休止中",
};

export const helpfulRatingLabels: Record<HelpfulRating, string> = {
  "very-helpful": "とても役に立った",
  helpful: "役に立った",
  "slightly-helpful": "少し役に立った",
  "not-helpful": "役に立たなかった",
};

export const commentTypeLabels: Record<CommentType, string> = {
  impression: "使ってみた感想",
  "good-point": "便利だった点",
  improvement: "改善してほしい点",
  bug: "バグ報告",
  question: "使い方の質問",
  "author-reply": "作者からの返信",
  other: "その他",
};

export const riskLevelLabels: Record<RiskLevel, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

/** 投稿者がフォームから選べるコメント種別（作者からの返信は通常の返信導線で付与） */
export const selectableCommentTypes: CommentType[] = [
  "impression",
  "good-point",
  "improvement",
  "bug",
  "question",
  "other",
];

/** 日付を「2026年6月7日」形式に */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 数値を 12,840 形式に */
export function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}
