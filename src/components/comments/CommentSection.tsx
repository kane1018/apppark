"use client";

import { useMemo, useState } from "react";
import type { Comment, CommentType, RiskLevel } from "@/types";
import {
  moderateComment,
  submissionMessage,
  REPORT_THRESHOLD,
} from "@/lib/moderation";
import { commentTypeLabels, formatDate, selectableCommentTypes } from "@/lib/labels";
import { CommentRules } from "@/components/comments/CommentRules";

/**
 * コメント・返信機能（追加仕様）。
 *
 * - 各サービス詳細ページに設置
 * - 返信は1階層まで
 * - 投稿時に危険度判定（src/lib/moderation.ts）を実行し、
 *   riskLevel に応じて published / pending / hidden を切り替える
 * - 各コメントに通報ボタン。通報数が REPORT_THRESHOLD に達すると確認待ちに
 * - 作者本人の返信には「作者」ラベル
 *
 * MVPは永続化なし（リロードで初期状態に戻ります）。
 * 後から Supabase / Firebase 等に接続する場合は、setComments の箇所を
 * API 呼び出しに置き換えてください。
 */

const reportReasons = [
  "誹謗中傷",
  "スパム",
  "権利侵害",
  "個人情報",
  "危険な内容",
  "不適切な宣伝",
  "その他",
];

function newId(): string {
  return `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function CommentSection({
  serviceId,
  initialComments,
}: {
  serviceId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const topLevel = useMemo(
    () =>
      comments
        .filter((c) => c.parentId === null && c.moderationStatus !== "deleted")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [comments]
  );

  const repliesOf = (id: string) =>
    comments
      .filter((c) => c.parentId === id && c.moderationStatus !== "deleted")
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  // 公開済みコメントの件数（見出し用）
  const publishedCount = comments.filter(
    (c) => c.moderationStatus === "published"
  ).length;

  async function addComment(input: {
    parentId: string | null;
    authorName: string;
    authorEmail?: string;
    commentType: CommentType;
    body: string;
    isAuthorReply: boolean;
  }): Promise<RiskLevel> {
    const recentBodies = comments
      .filter((c) => c.authorName === input.authorName)
      .map((c) => c.body);

    const result = await moderateComment({
      body: input.body,
      commentType: input.commentType,
      authorName: input.authorName,
      recentBodies,
    });

    const now = new Date().toISOString();
    const comment: Comment = {
      id: newId(),
      serviceId,
      parentId: input.parentId,
      authorName: input.authorName.trim() || "名無しさん",
      authorEmail: input.authorEmail,
      commentType: input.isAuthorReply ? "author-reply" : input.commentType,
      body: input.body.trim(),
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      moderationStatus: result.moderationStatus,
      moderationReason: result.moderationReason,
      reportedCount: 0,
      isAuthorReply: input.isAuthorReply,
      createdAt: now,
      updatedAt: now,
    };

    setComments((prev) => [...prev, comment]);
    return result.riskLevel;
  }

  function reportComment(id: string) {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const reportedCount = c.reportedCount + 1;
        // 通報数が一定以上で、公開中なら確認待ち（pending）にする
        const moderationStatus =
          reportedCount >= REPORT_THRESHOLD && c.moderationStatus === "published"
            ? "pending"
            : c.moderationStatus;
        const moderationReason =
          moderationStatus === "pending" && c.moderationStatus === "published"
            ? `通報が${reportedCount}件に達したため確認待ち`
            : c.moderationReason;
        return {
          ...c,
          reportedCount,
          moderationStatus,
          moderationReason,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="section-title">コメント・返信</h2>
        <span className="text-sm text-ink-faint">{publishedCount}件のコメント</span>
      </div>

      <CommentRules />

      {/* 新規コメント投稿フォーム */}
      <CommentComposer mode="comment" onSubmit={(data) => addComment({ ...data, parentId: null })} />

      {/* コメント一覧 */}
      {topLevel.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-ink-faint">
          まだコメントはありません。最初のコメントを投稿してみましょう。
        </p>
      ) : (
        <ul className="space-y-4">
          {topLevel.map((c) => (
            <li key={c.id}>
              <CommentItem
                comment={c}
                onReport={reportComment}
                onReply={(data) => addComment({ ...data, parentId: c.id })}
                replies={repliesOf(c.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
 * 個々のコメント表示（＋返信）
 * ------------------------------------------------------------------ */

function CommentItem({
  comment,
  replies,
  onReport,
  onReply,
}: {
  comment: Comment;
  replies: Comment[];
  onReport: (id: string) => void;
  onReply: (data: ComposerData) => Promise<RiskLevel>;
}) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <CommentBody comment={comment} onReport={onReport} />

      {/* 返信導線（トップレベルのみ。1階層まで） */}
      <div className="mt-2">
        <button
          type="button"
          onClick={() => setShowReply((v) => !v)}
          className="btn-ghost"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M7.7 3.3a1 1 0 010 1.4L5.42 7H12a5 5 0 015 5v2a1 1 0 11-2 0v-2a3 3 0 00-3-3H5.41l2.3 2.3a1 1 0 11-1.42 1.4l-4-4a1 1 0 010-1.4l4-4a1 1 0 011.42 0z" />
          </svg>
          返信する
        </button>
      </div>

      {showReply && (
        <div className="mt-3 border-l-2 border-brand-100 pl-3">
          <CommentComposer
            mode="reply"
            onSubmit={async (data) => {
              const level = await onReply(data);
              setShowReply(false);
              return level;
            }}
          />
        </div>
      )}

      {/* 返信一覧（1階層） */}
      {replies.length > 0 && (
        <ul className="mt-3 space-y-3 border-l-2 border-gray-100 pl-3">
          {replies.map((r) => (
            <li key={r.id} className="rounded-xl bg-gray-50 p-3">
              <CommentBody comment={r} onReport={onReport} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** コメント本文＋メタ＋通報。モデレーション状態で表示を出し分け。 */
function CommentBody({
  comment,
  onReport,
}: {
  comment: Comment;
  onReport: (id: string) => void;
}) {
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-brand-900">{comment.authorName}</span>
        {comment.isAuthorReply && (
          <span className="rounded-md bg-accent-100 px-1.5 py-0.5 text-[11px] font-bold text-accent-700 ring-1 ring-inset ring-accent-600/30">
            作者
          </span>
        )}
        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft">
          {commentTypeLabels[comment.commentType]}
        </span>
        <ModerationBadge status={comment.moderationStatus} />
        <span className="text-[11px] text-ink-faint">{formatDate(comment.createdAt)}</span>
      </div>

      {/* 本文：hidden は内容を伏せる。
          ※ 投稿者を萎縮させないため、判定理由は表示せず「確認待ち」のみを伝える。
          （moderationReason はデータには保持され、後の管理画面で確認できます） */}
      {comment.moderationStatus === "hidden" ? (
        <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-ink-faint">
          このコメントは確認待ちです。
        </p>
      ) : (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
          {comment.body}
        </p>
      )}

      {comment.moderationStatus === "pending" && (
        <p className="mt-1.5 text-[11px] text-amber-600">
          ※ このコメントは確認中です。確認後に掲載される場合があります。
        </p>
      )}

      {/* 通報 */}
      <div className="mt-2 flex items-center gap-3">
        {reported ? (
          <span className="text-[11px] text-ink-faint">
            通報を受け付けました。内容を確認し、必要に応じて非表示・削除を検討します。
          </span>
        ) : reporting ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-ink-soft">通報理由：</span>
            <select
              aria-label="通報理由"
              className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
              defaultValue=""
              id={`report-${comment.id}`}
            >
              <option value="" disabled>
                選択
              </option>
              {reportReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                onReport(comment.id);
                setReported(true);
                setReporting(false);
              }}
              className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-rose-700"
            >
              通報する
            </button>
            <button
              type="button"
              onClick={() => setReporting(false)}
              className="text-xs text-ink-faint hover:text-ink"
            >
              やめる
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setReporting(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-faint transition hover:text-rose-600"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M3 3a1 1 0 011-1h9l-1.5 3L15 8H4v9a1 1 0 11-2 0V3z" />
            </svg>
            通報
          </button>
        )}
        {comment.reportedCount > 0 && (
          <span className="text-[11px] text-ink-faint">通報 {comment.reportedCount}</span>
        )}
      </div>
    </div>
  );
}

function ModerationBadge({ status }: { status: Comment["moderationStatus"] }) {
  if (status === "published") return null;
  const map = {
    pending: { label: "確認中", cls: "bg-amber-50 text-amber-700 ring-amber-600/20" },
    hidden: { label: "確認待ち", cls: "bg-amber-50 text-amber-700 ring-amber-600/20" },
    deleted: { label: "削除済み", cls: "bg-gray-100 text-gray-500 ring-gray-500/20" },
  } as const;
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

/* ------------------------------------------------------------------
 * 投稿フォーム（新規コメント / 返信 共通）
 * ------------------------------------------------------------------ */

interface ComposerData {
  authorName: string;
  authorEmail?: string;
  commentType: CommentType;
  body: string;
  isAuthorReply: boolean;
}

function CommentComposer({
  mode,
  onSubmit,
}: {
  mode: "comment" | "reply";
  onSubmit: (data: ComposerData) => Promise<RiskLevel>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<CommentType>("impression");
  const [body, setBody] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState<{ level: RiskLevel; text: string } | null>(
    null
  );
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !agree || pending) return;
    setPending(true);
    const level = await onSubmit({
      authorName: name,
      authorEmail: email || undefined,
      commentType: type,
      body,
      isAuthorReply: isAuthor,
    });
    setMessage({ level, text: submissionMessage(level) });
    setPending(false);
    // フォームをリセット（メッセージは残す）
    setBody("");
    setAgree(false);
    setIsAuthor(false);
  }

  const messageStyle: Record<RiskLevel, string> = {
    low: "border-emerald-200 bg-emerald-50 text-emerald-800",
    medium: "border-amber-200 bg-amber-50 text-amber-800",
    high: "border-rose-200 bg-rose-50 text-rose-800",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        mode === "comment"
          ? "rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
          : "rounded-xl border border-gray-200 bg-white p-3"
      }
    >
      {mode === "comment" && (
        <h3 className="mb-3 text-sm font-bold text-brand-800">コメントを投稿する</h3>
      )}

      {message && (
        <div className={`mb-3 rounded-lg border px-3 py-2 text-sm ${messageStyle[message.level]}`}>
          {message.text}
        </div>
      )}

      <div className={mode === "comment" ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>
        <div>
          <label className="field-label" htmlFor={`${mode}-name`}>
            表示名
          </label>
          <input
            id={`${mode}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
            placeholder="ニックネーム可"
          />
        </div>
        {mode === "comment" && (
          <div>
            <label className="field-label" htmlFor={`${mode}-email`}>
              メールアドレス（非公開・任意）
            </label>
            <input
              id={`${mode}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="公開されません"
            />
          </div>
        )}
      </div>

      {mode === "comment" && (
        <div className="mt-3">
          <label className="field-label" htmlFor={`${mode}-type`}>
            コメントの種類
          </label>
          <select
            id={`${mode}-type`}
            value={type}
            onChange={(e) => setType(e.target.value as CommentType)}
            className="field-input"
          >
            {selectableCommentTypes.map((t) => (
              <option key={t} value={t}>
                {commentTypeLabels[t]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-3">
        <label className="field-label" htmlFor={`${mode}-body`}>
          {mode === "reply" ? "返信内容" : "コメント本文"}
        </label>
        <textarea
          id={`${mode}-body`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={mode === "reply" ? 2 : 3}
          required
          className="field-input resize-y"
          placeholder="建設的な感想・質問・改善要望を歓迎します。個人情報は書かないでください。"
        />
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-soft">
        <input
          type="checkbox"
          checked={isAuthor}
          onChange={(e) => setIsAuthor(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
        />
        これは作者本人の返信です（「作者」ラベルが付きます）
      </label>

      <label className="mt-2 flex items-start gap-2 text-xs text-ink-soft">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
        />
        <span>
          <a href="/terms" className="text-brand-600 underline-offset-2 hover:underline">
            利用規約
          </a>
          ・コメントルールに同意します。
        </span>
      </label>

      <button
        type="submit"
        disabled={!body.trim() || !agree || pending}
        className="btn-primary mt-3 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "判定中…" : mode === "reply" ? "返信を投稿" : "コメントを投稿"}
      </button>
    </form>
  );
}
