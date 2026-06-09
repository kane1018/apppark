import Link from "next/link";
import type { Idea } from "@/types";
import { getCategoryName } from "@/data/categories";
import {
  ideaStatusLabels,
  ideaStatusStyles,
  wantLevelLabels,
  ideaAuthorName,
} from "@/data/ideas";

/**
 * アイデアカード（一覧・トップ・カテゴリページで使用）。
 * 表示のみ（フックなし）。共感数・コメント数は props で受け取ります
 * （クライアント側ではストアの最新値、サーバー側ではシード値）。
 */
export function IdeaCard({
  idea,
  likeCount,
  commentCount,
}: {
  idea: Idea;
  likeCount?: number;
  commentCount?: number;
}) {
  const likes = likeCount ?? idea.likeCount;
  const comments = commentCount ?? idea.commentCount;

  return (
    <article className="card flex h-full flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${ideaStatusStyles[idea.status]}`}
        >
          {ideaStatusLabels[idea.status]}
        </span>
        <Link
          href={`/categories/${idea.category}`}
          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-700"
        >
          {getCategoryName(idea.category)}
        </Link>
      </div>

      <h3 className="mt-2 text-sm font-bold leading-snug text-brand-900">
        <Link href={`/ideas/${idea.id}`} className="hover:text-brand-600">
          {idea.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
        {idea.problem}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[11px] text-ink-faint">
        <span className="inline-flex items-center gap-1 font-semibold text-rose-500">
          ♥ {likes}
          <span className="ml-2 text-ink-faint">💬 {comments}</span>
        </span>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
          ほしい度 {wantLevelLabels[idea.wantLevel]}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-ink-faint">投稿者：{ideaAuthorName(idea)}</p>
    </article>
  );
}
