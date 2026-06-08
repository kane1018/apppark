import type { Comment } from "@/types";

/**
 * コメントの初期データ。
 *
 * 本番では、実際に投稿されたコメントのみを表示します（架空コメントは置きません）。
 * MVPの現状はクライアント側のみで保持し、永続化していません。
 * 後から Supabase / Firebase 等に接続する場合は、この Comment 型の構造のまま
 * テーブルへ保存し、serviceId で取得するようにしてください。
 *
 * 返信は parentId を持ち、1階層までです。
 */
export const seedComments: Comment[] = [];

/** 指定サービスの、現在表示してよいコメントの初期データを返す */
export function getSeedCommentsForService(serviceId: string): Comment[] {
  return seedComments.filter((c) => c.serviceId === serviceId);
}
