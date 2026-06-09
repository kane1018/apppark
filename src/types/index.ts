/**
 * AppParkのドメイン型定義。
 * データソース（ローカル配列）と各コンポーネントが共有する型をここに集約します。
 * 後から Supabase / Firebase / Notion 等に移行する場合も、この型を基準にできます。
 */
// import type のためビルド時に消去され、ランタイム依存は生じません。
import type { IconName } from "@/components/icons";
import type { MiniTool } from "@/lib/minitool/types";

/** 掲載タイプ */
export type ListingType =
  | "external" // 外部サービス（URL掲載）
  | "internal_mini_tool" // AppPark内ミニツール
  | "iframe_embed" // iframe埋め込み（管理者承認制）
  | "development"; // 開発中サービス紹介

/** 掲載の審査状態 */
export type ModerationState =
  | "draft"
  | "reviewing"
  | "published"
  | "hidden"
  | "rejected";

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

/** カテゴリ（大カテゴリ） */
export interface Category {
  slug: string;
  name: string;
  description: string;
  /** カードや見出しに表示するアイコン（Lucide。キーは IconName を参照） */
  icon: IconName;
  /** 詳細カテゴリ（表示名の配列）。カテゴリ一覧・フィルター・投稿フォームで使用 */
  subCategories?: string[];
  /** 関連する目的タグ（Purpose.slug の配列）。カテゴリページの回遊導線に使用 */
  relatedPurposes?: string[];
  /** トップページの「主要カテゴリ」に含めるか（true のみトップに表示） */
  isMajor?: boolean;
  /** SEO上書き（未指定なら name / description から自動生成） */
  seoTitle?: string;
  seoDescription?: string;
}

/** 目的タグ */
export interface Purpose {
  slug: string;
  name: string;
  /** カード等で使う短い説明 */
  description: string;
  /** カードや見出しに表示するアイコン（Lucide。キーは IconName を参照） */
  icon: IconName;
  /** トップページに表示する主要な目的タグか */
  featured?: boolean;
}

/** 汎用タグの種類 */
export type TagGroup = "audience" | "toolType" | "pricing" | "status";

/**
 * 汎用タグ定義（利用者別タグ・ツール形式タグ・料金タグ・運営状態タグ）。
 * slug はタグ単独ページ（/tags/[slug]）と検索フィルターに使われます。
 * slug は全グループ横断で一意にしてください。
 */
export interface TagDef {
  slug: string;
  name: string;
  group: TagGroup;
  /** 一覧やタグページで使う短い説明（任意） */
  description?: string;
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
  /** 大カテゴリの slug */
  category: string;
  /** 詳細カテゴリ（表示名の配列。所属する大カテゴリの subCategories から選ぶ） */
  subCategories: string[];
  /** 目的タグの slug 配列（purposeTags） */
  purposes: string[];
  /** 利用者別タグの slug 配列（TagDef: audience） */
  audienceTags: string[];
  /** ツール形式タグの slug 配列（TagDef: toolType） */
  toolTypeTags: string[];
  /** 料金タグの slug 配列（TagDef: pricing）。未指定なら pricing から自動導出 */
  pricingTags: string[];
  /** 運営状態タグの slug 配列（TagDef: status）。未指定なら status 等から自動導出 */
  statusTags: string[];
  /** AI対応サービスか（AI機能を備える／AIで動く）。未指定ならカテゴリ等から自動導出 */
  isAiEnabled: boolean;
  /** AppPark内で完結して使えるミニツールか。未指定なら listingType から自動導出 */
  isInternalMiniTool: boolean;
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
  /** 投稿者のユーザーID（運営作成は "apppark-official"）。編集・削除申請の権限判定に使用 */
  authorId: string;
  /** 公開表示名（公開ページに表示される投稿者名） */
  publicAuthorName: string;
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
   * 公式（運営作成）として特別扱いするか。通常投稿は false。
   * 初期掲載サービスも、実際の投稿者（公開表示名）に紐づく通常投稿として扱うため false です。
   */
  isFirstParty: boolean;
  /** 作成区分。"user"＝通常のユーザー投稿、"official"＝運営公式（特別表示）。 */
  createdBy: "user" | "official";

  /** 掲載タイプ（外部URL / 内ミニツール / iframe / 開発中） */
  listingType: ListingType;
  /** AppPark内ミニツール設定（listingType === "internal_mini_tool" のとき有効） */
  miniTool: MiniTool;
  /** iframe埋め込み（管理者承認制） */
  iframeEmbed: { requested: boolean; url: string | null; approved: boolean };
  /** 開発中サービス情報 */
  developmentInfo: { enabled: boolean; status: string | null; plannedRelease: string | null };
  /** 審査状態（MVPはデータのみ。本格管理画面は将来） */
  moderationState: ModerationState;
  /** 任意のCTAボタン（ミニツール等の補足導線） */
  ctaLabel: string | null;
  ctaUrl: string | null;
  /** このサービスの元になったアイデア投稿の id（アイデア掲示板から作られた場合） */
  relatedIdeaId: string | null;
  /** 利用者の声（実際に寄せられたもののみ。無ければ空配列） */
  voices: UsageVoice[];
}

/* ============================================================
 * アイデア掲示板（「こんなのあったらいいな掲示板」）
 * ============================================================ */

/** アイデアのステータス */
export type IdeaStatus =
  | "open" // 募集中
  | "planned" // 作成予定
  | "in_progress" // 作成中
  | "created" // 作成済み
  | "closed"; // 終了

/** AppPark内ミニツールで作れそうか */
export type MiniToolPotential = "yes" | "maybe" | "no" | "unknown";

/** 作ってほしい度（1〜5） */
export type WantLevel = 1 | 2 | 3 | 4 | 5;

/**
 * アイデア投稿（利用者が「こんなWebツールが欲しい」を書き込む）。
 * このデータ構造のまま Supabase / Firebase 等のテーブルに対応づけられます。
 */
export interface Idea {
  id: string;
  title: string;
  /** 困っていること・解決したいこと */
  problem: string;
  /** こんなツールが欲しい */
  desiredTool: string;
  /** カテゴリ slug（既存カテゴリと共通） */
  category: string;
  /** 目的タグ slug 配列（既存 purposes と共通） */
  purposeTags: string[];
  /** 利用者別タグ slug 配列（既存 tags と共通） */
  audienceTags: string[];
  /** 使いたい場面（任意） */
  useCase: string | null;
  similarServiceUrl: string | null;
  referenceImageUrl: string | null;
  miniToolPotential: MiniToolPotential;
  wantLevel: WantLevel;
  status: IdeaStatus;
  /** このアイデアから作られたサービスの id（あれば） */
  relatedServiceId: string | null;
  /** 投稿者ユーザーID */
  authorId: string;
  /** 公開表示名 */
  publicAuthorName: string;
  /** 匿名表示にするか（true のとき公開ページでは「匿名」と表示） */
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  moderationStatus: ModerationStatus;
  riskLevel: RiskLevel;
}

/** アイデアへのコメント */
export interface IdeaComment {
  id: string;
  ideaId: string;
  userId: string | null;
  authorName: string;
  body: string;
  riskLevel: RiskLevel;
  moderationStatus: ModerationStatus;
  reportedCount: number;
  createdAt: string;
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
  /** 投稿ユーザーID（ログイン必須）。null は旧データ等。 */
  userId: string | null;
  /** 公開表示名（コメント欄に表示される名前） */
  authorName: string;
  /** 非公開。表示には使わない。 */
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
