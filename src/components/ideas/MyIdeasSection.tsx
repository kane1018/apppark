"use client";

import Link from "next/link";
import type { Idea } from "@/types";
import { ideaStatusLabels } from "@/data/ideas";
import { useIdeas } from "@/components/ideas/IdeaProvider";

/**
 * マイページのアイデア連携。
 * 自分が投稿した／共感した／コメントしたアイデアを表示します（クライアント・ストア）。
 */
export function MyIdeasSection() {
  const { myIdeas, myLikedIdeas, myCommentedIdeas } = useIdeas();

  return (
    <div className="space-y-6">
      <Group title="自分が投稿したアイデア" ideas={myIdeas} emptyHref empty="まだアイデアを投稿していません。" />
      <Group title="共感したアイデア" ideas={myLikedIdeas} empty="まだ共感したアイデアはありません。" />
      <Group title="コメントしたアイデア" ideas={myCommentedIdeas} empty="まだコメントしたアイデアはありません。" />
    </div>
  );
}

function Group({
  title,
  ideas,
  empty,
  emptyHref = false,
}: {
  title: string;
  ideas: Idea[];
  empty: string;
  emptyHref?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-brand-800">{title}</h3>
      {ideas.length > 0 ? (
        <ul className="space-y-2">
          {ideas.map((i) => (
            <li key={i.id} className="card flex items-center justify-between gap-3 p-3">
              <Link href={`/ideas/${i.id}`} className="min-w-0 text-sm font-semibold text-brand-900 hover:text-brand-600">
                <span className="line-clamp-1">{i.title}</span>
              </Link>
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
                {ideaStatusLabels[i.status]}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-4 text-xs text-ink-faint">
          {empty}
          {emptyHref && (
            <Link href="/ideas" className="ml-1 font-semibold text-brand-600 underline-offset-2 hover:underline">
              アイデアを投稿する →
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
