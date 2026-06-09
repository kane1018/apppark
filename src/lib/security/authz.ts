/**
 * AppPark 共有 認可（authorization）述語と公開フィールド許可リスト。
 *
 * 【重要】ここの関数は「UIの出し分け」と「サーバー/APIでの検証」の**両方**で同じ規則を
 * 使うためのものです。クライアントでこれを満たしても、**最終的な権限判定は必ず
 * サーバー側（Route Handler / Edge Function）か Supabase RLS で行ってください**
 * （docs/security/SUPABASE_RLS_DESIGN.md を参照）。クライアントの判定は信用しません。
 */
import type { AppUser } from "@/lib/auth/types";
import type { Idea, Service } from "@/types";

type MaybeUser = AppUser | null | undefined;

/* ---------------- 基本述語 ---------------- */

export function isLoggedIn(user: MaybeUser): user is AppUser {
  return !!user && !!user.id;
}

export function isAdmin(user: MaybeUser): boolean {
  return isLoggedIn(user) && user.role === "admin";
}

export function isOwner(user: MaybeUser, authorId: string): boolean {
  return isLoggedIn(user) && user.id === authorId;
}

/** 投稿者本人 or 管理者 */
function ownerOrAdmin(user: MaybeUser, authorId: string): boolean {
  return isOwner(user, authorId) || isAdmin(user);
}

/* ---------------- サービス ---------------- */

export function canEditService(user: MaybeUser, service: Pick<Service, "authorId">): boolean {
  return ownerOrAdmin(user, service.authorId);
}
export const canHideService = canEditService; // 非公開申請
export const canDeleteService = canEditService; // 削除申請

/** 公開状態（published/hidden/rejected）の変更は管理者のみ */
export function canChangeServiceModeration(user: MaybeUser): boolean {
  return isAdmin(user);
}

/* ---------------- アイデア ---------------- */

export function canEditIdea(user: MaybeUser, idea: Pick<Idea, "authorId">): boolean {
  return ownerOrAdmin(user, idea.authorId);
}
export const canDeleteIdea = canEditIdea;

/** アイデアの status / 関連サービス紐付けは管理者のみ */
export function canChangeIdeaStatus(user: MaybeUser): boolean {
  return isAdmin(user);
}

/* ---------------- ログイン必須操作 ---------------- */

export function canComment(user: MaybeUser): boolean {
  return isLoggedIn(user);
}
export function canPostIdea(user: MaybeUser): boolean {
  return isLoggedIn(user);
}
export function canLike(user: MaybeUser): boolean {
  return isLoggedIn(user);
}

/* ---------------- 公開フィールドの許可リスト ---------------- */

/** 公開プロフィールで返してよいフィールド */
export const PUBLIC_PROFILE_FIELDS = [
  "slug",
  "nickname",
  "displayName",
  "avatarUrl",
  "bio",
] as const;

/** 公開APIで**絶対に返してはいけない**フィールド名（横断チェック用） */
export const NEVER_PUBLIC_FIELDS = [
  "email",
  "contactEmail",
  "contact_email",
  "contactName",
  "contact_name",
  "role",
  "authProviderId",
  "internalUserId",
  "moderationReason",
  "moderation_reason",
  "moderationInternalNote",
  "moderation_internal_note",
  "adminNote",
  "admin_note",
  "riskScore",
  "risk_score",
  "riskLevel",
  "risk_level",
  "reportedCount",
  "reported_count",
] as const;

export interface PublicProfile {
  slug: string;
  nickname: string;
  displayName: string;
  avatarUrl: string | null;
  bio?: string | null;
}

/**
 * 任意のユーザーレコードから、公開してよいフィールドのみを抜き出す。
 * email・role・連絡先などは含めない（公開API/プロフィールで使用）。
 */
export function toPublicProfile(p: {
  slug?: string;
  nickname?: string;
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}): PublicProfile {
  return {
    slug: p.slug ?? "",
    nickname: p.nickname ?? "",
    displayName: p.displayName ?? p.nickname ?? "",
    avatarUrl: p.avatarUrl ?? null,
    bio: p.bio ?? null,
  };
}
