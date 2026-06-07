import type { HelpfulRating, UsageVoice } from "@/types";
import { helpfulRatingLabels } from "@/lib/labels";

/**
 * 利用者の声（セクション13-8）。MVPはデモデータ。
 * 後から DB（利用者の声テーブル）に接続できます。
 */
const ratingStyle: Record<HelpfulRating, string> = {
  "very-helpful": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  helpful: "bg-sky-50 text-sky-700 ring-sky-600/20",
  "slightly-helpful": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "not-helpful": "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export function UsageVoiceSection({ voices }: { voices: UsageVoice[] }) {
  if (voices.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-ink-faint">
        まだ利用者の声がありません。使ってみた感想は、下のコメント欄から投稿できます。
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {voices.map((v) => (
        <li key={v.id} className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-brand-700">
              使用目的：{v.purpose}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${ratingStyle[v.rating]}`}
            >
              {helpfulRatingLabels[v.rating]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.comment}</p>
        </li>
      ))}
    </ul>
  );
}
