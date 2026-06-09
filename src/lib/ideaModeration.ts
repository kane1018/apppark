/**
 * アイデア投稿の危険度判定。
 * コメント用の moderation.ts（ルールベース）を再利用し、アイデア向けに
 * ステータスのマッピングだけ調整します（高リスクは即公開せず pending）。
 * 後から AI モデレーションに差し替える場合も、この関数の中身を置き換えるだけです。
 *
 * 判定対象：誹謗中傷 / 個人情報 / 違法行為 / 詐欺的内容 / アダルト・危険商材 /
 * 著作権侵害の助長 / 差別的表現 / スパム / 外部リンク過多 など。
 */
import { assessByRules } from "@/lib/moderation";
import type { ModerationStatus, RiskLevel } from "@/types";

export interface IdeaModerationResult {
  riskLevel: RiskLevel;
  moderationStatus: ModerationStatus;
  reason: string;
}

export async function moderateIdea(input: {
  title: string;
  problem: string;
  desiredTool: string;
  similarServiceUrl?: string | null;
  recentBodies?: string[];
}): Promise<IdeaModerationResult> {
  const body = [
    input.title,
    input.problem,
    input.desiredTool,
    input.similarServiceUrl ?? "",
  ].join("\n");

  const r = assessByRules({
    body,
    commentType: "other",
    recentBodies: input.recentBodies,
  });

  // アイデアは high でも自動非表示にせず、運営確認待ち（pending）にする
  const moderationStatus: ModerationStatus =
    r.riskLevel === "low" ? "published" : "pending";

  return {
    riskLevel: r.riskLevel,
    moderationStatus,
    reason: r.moderationReason,
  };
}

/** 投稿後にユーザーへ表示するメッセージ */
export function ideaSubmissionMessage(status: ModerationStatus): string {
  switch (status) {
    case "published":
      return "アイデアを投稿しました。掲示板に公開されました。";
    case "pending":
      return "アイデアを受け付けました。内容を確認のうえ公開されます（公開まで時間がかかる場合があります）。";
    default:
      return "アイデアを受け付けました。";
  }
}
