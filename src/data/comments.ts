import type { Comment } from "@/types";

/**
 * コメントのデモデータ（追加仕様）。
 *
 * MVPでは永続化しません（リロードすると初期状態に戻ります）。
 * 後から Supabase / Firebase 等に接続する場合は、このデータ構造のまま
 * テーブルへ保存し、serviceId で取得するようにしてください。
 *
 * 返信は parentId を持ち、1階層までです。
 */
export const seedComments: Comment[] = [
  {
    id: "cmt-001",
    serviceId: "svc-001",
    parentId: null,
    authorName: "ゆき",
    commentType: "impression",
    body: "メールの下書きづくりに使っています。トーンを選べるのが地味に便利でした。",
    riskScore: 0,
    riskLevel: "low",
    moderationStatus: "published",
    moderationReason: "問題となる表現は検出されませんでした",
    reportedCount: 0,
    isAuthorReply: false,
    createdAt: "2026-06-01T09:20:00.000Z",
    updatedAt: "2026-06-01T09:20:00.000Z",
  },
  {
    id: "cmt-002",
    serviceId: "svc-001",
    parentId: "cmt-001",
    authorName: "デモ開発者A",
    commentType: "author-reply",
    body: "使っていただきありがとうございます！トーンの種類は今後増やす予定です。",
    riskScore: 0,
    riskLevel: "low",
    moderationStatus: "published",
    moderationReason: "問題となる表現は検出されませんでした",
    reportedCount: 0,
    isAuthorReply: true,
    createdAt: "2026-06-01T12:05:00.000Z",
    updatedAt: "2026-06-01T12:05:00.000Z",
  },
  {
    id: "cmt-003",
    serviceId: "svc-001",
    parentId: null,
    authorName: "とり",
    commentType: "improvement",
    body: "履歴を残せると嬉しいです。生成した文章をあとから見返したいです。",
    riskScore: 0,
    riskLevel: "low",
    moderationStatus: "published",
    moderationReason: "問題となる表現は検出されませんでした",
    reportedCount: 0,
    isAuthorReply: false,
    createdAt: "2026-06-02T18:40:00.000Z",
    updatedAt: "2026-06-02T18:40:00.000Z",
  },
  {
    id: "cmt-004",
    serviceId: "svc-008",
    parentId: null,
    authorName: "なお",
    commentType: "good-point",
    body: "構成のたたき台がすぐできるのがいいですね。動画づくりが速くなりました。",
    riskScore: 0,
    riskLevel: "low",
    moderationStatus: "published",
    moderationReason: "問題となる表現は検出されませんでした",
    reportedCount: 0,
    isAuthorReply: false,
    createdAt: "2026-06-03T10:10:00.000Z",
    updatedAt: "2026-06-03T10:10:00.000Z",
  },
  {
    id: "cmt-005",
    serviceId: "svc-008",
    parentId: null,
    authorName: "けん",
    commentType: "question",
    body: "生成した台本はそのまま商用利用しても大丈夫でしょうか？",
    riskScore: 0,
    riskLevel: "low",
    moderationStatus: "published",
    moderationReason: "問題となる表現は検出されませんでした",
    reportedCount: 0,
    isAuthorReply: false,
    createdAt: "2026-06-04T08:55:00.000Z",
    updatedAt: "2026-06-04T08:55:00.000Z",
  },
];

/** 指定サービスの、現在表示してよいコメントの初期データを返す */
export function getSeedCommentsForService(serviceId: string): Comment[] {
  return seedComments.filter((c) => c.serviceId === serviceId);
}
