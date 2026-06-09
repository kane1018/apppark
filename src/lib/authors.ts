import { siteConfig } from "@/config/site";

/**
 * 公開してよい投稿者情報。
 * public profile では nickname / avatarUrl のみを扱い、email・内部ID・管理情報は返しません。
 */
export interface PublicAuthor {
  /** 公開ニックネーム（カード・詳細・プロフィールに表示） */
  nickname: string;
  avatarUrl: string | null;
  /** プロフィールページの slug（/users/[slug]） */
  slug: string;
}

/**
 * authorId / publicAuthorName から、公開してよい投稿者情報を解決します。
 * メールアドレスや内部IDは一切含めません（公開ページ用）。
 */
export function resolvePublicAuthor(
  authorId: string,
  publicAuthorName: string
): PublicAuthor {
  if (authorId === siteConfig.owner.authorId) {
    return {
      nickname: siteConfig.owner.nickname,
      avatarUrl: siteConfig.owner.avatarUrl,
      slug: siteConfig.owner.nickname,
    };
  }
  return {
    nickname: publicAuthorName || "ユーザー",
    avatarUrl: null,
    slug: encodeURIComponent(publicAuthorName || "user"),
  };
}
