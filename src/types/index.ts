/**
 * AppParkのドメイン型定義。
 * データソース（ローカル配列）と各コンポーネントが共有する型をここに集約します。
 * 後から Supabase / Firebase / Notion 等に移行する場合も、この型を基準にできます。
 */
// import type のためビルド時に消去され、ランタイム依存は生じません。
import type { IconName } from "@/components/icons";

/** 料金形態（セクション12） */
export type Pricing = "free" | "paid" | "freemium" | "unknown";

/** 運営状況（セクション12） */
export type ServiceStatus = "active" | "beta" | "development" | "paused";

/**
 * 募集・相談ステータス。MVPでは「表示のみ」。
 * 売買・決済・エスクロー等の取引機能は実装しません（相談の意思表示にとどめます）。
 */
export type RecruitmentStatus =
  | "seeking_users" // ユーザー募集中
  | "seeking_feedback" // フィードバック募集中
  | "seeking_cofounder" // 共同開発者募集中
  | "seeking_sponsor" // スポンサー募集中
  | "transfer_consultation" // 譲渡相談可
  | "purchase_consultation"; // 購入相談可

/** 役に立った度（利用者の声） */
export type HelpfulRating =
  | "very-helpful"
  | "helpful"
  | "slightly-helpful"
  | "not-helpful";

/** カテゴリ */
export interface Category {
  slug: string;
  name: string;
  description: string;
  /** カードや見出しに表示するアイコン（Lucide。キーは IconName を参照） */
  icon: IconName;
}

/** 目的タグ */
export interface Purpose {
  slug: string;
  name: string;
  /** カード等で使う短い説明 */
  description: string;
  /** カードや見出しに表示するアイコン（Lucide。キーは IconName を参照） */
  icon: IconName;
}

/** 作者SNS等のリンク */
export interface AuthorLink {
  label: string;
  url: string;
}

/** 利用者の声（セクション13-8）。MVPはデモデータ。 */
export interface UsageVoice {
  id: string;
  /** 使用目的 */
  purpose: string;
  /** 感想 */
  comment: string;
  /** 役に立った度 */
  rating: HelpfulRating;
}

/** 掲載サービス（セクション23の全項目） */
export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  /** カテゴリの slug */
  category: string;
  /** 目的タグの slug 配列 */
  purposes: string[];
  /** 自由タグ */
  tags: string[];
  pricing: Pricing;
  status: ServiceStatus;
  /**
   * メイン画像URL（一覧カード・詳細ページ上部に表示）。
   * null の場合はカテゴリアイコン＋グラデーションのプレースホルダを表示します。
   * 投稿フォームの thumbnailUrl に対応。
   */
  thumbnailUrl: string | null;
  /**
   * サブ画像（スクリーンショット等）のURL配列。詳細ページでギャラリー表示。
   * 投稿フォームの galleryImageUrls に対応。最大3〜5枚程度を想定。
   */
  galleryImageUrls: string[];
  /** 画像の代替テキスト（alt）。未指定ならサービス名から自動生成します。 */
  imageAlt: string | null;
  /** 外部サービスのURL */
  url: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  clicks: number;
  helpfulCount: number;
  /** こんな人におすすめ */
  recommendedFor: string[];
  /** 使い方（3〜5ステップ） */
  howToUse: string[];
  /** 使用目的の例 */
  useCases: string[];
  /** 注意点 */
  cautions: string[];
  authorName: string;
  authorComment: string;
  authorLinks: AuthorLink[];
  techStack: string[];
  aiToolsUsed: string[];
  reasonCreated: string;
  recruitmentStatus: RecruitmentStatus[];
  /** 募集・相談についての投稿者の補足（任意）。未記入なら null。 */
  recruitmentNote: string | null;
  isSponsored: boolean;
  /** 「スポンサー」「PR」「広告」のいずれか */
  sponsorLabel?: "スポンサー" | "PR" | "広告";
  /**
   * AppPark運営が作成・提供するツールか（true なら「運営作成」表示、url は内部 /tools/...）。
   * 外部の投稿サービスは false。
   */
  isFirstParty: boolean;
  /** 利用者の声（実際に寄せられたもののみ。無ければ空配列） */
  voices: UsageVoice[];
}

/* ============================================================
 * コメント機能（追加仕様）
 * ============================================================ */

/** コメントの種類 */
export type CommentType =
  | "impression" // 使ってみた感想
  | "good-point" // 便利だった点
  | "improvement" // 改善してほしい点
  | "bug" // バグ報告
  | "question" // 使い方の質問
  | "author-reply" // 作者からの返信
  | "other"; // その他

/** 危険度レベル */
export type RiskLevel = "low" | "medium" | "high";

/** モデレーション状態 */
export type ModerationStatus = "published" | "pending" | "hidden" | "deleted";

/**
 * コメント。
 * このデータ構造のまま Supabase / Firebase 等のテーブルに対応づけられます。
 * 返信は parentId を持つ「1階層まで」。
 */
export interface Comment {
  id: string;
  serviceId: string;
  /** 親コメントID（返信の場合のみ）。トップレベルは null。 */
  parentId: string | null;
  authorName: string;
  /** 非公開。表示には使わない。将来のログイン連携用。 */
  authorEmail?: string;
  commentType: CommentType;
  body: string;
  /** 0〜100 */
  riskScore: number;
  riskLevel: RiskLevel;
  moderationStatus: ModerationStatus;
  /** 判定理由（人間可読） */
  moderationReason: string;
  reportedCount: number;
  /** 投稿者本人（作者）の返信なら true → 「作者」ラベルを表示 */
  isAuthorReply: boolean;
  createdAt: string;
  updatedAt: string;
}
