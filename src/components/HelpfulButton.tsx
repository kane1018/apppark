"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { formatNumber } from "@/lib/labels";

/**
 * 「役に立った」リアクションボタン（トップの使い方「役に立ったら反応する」に対応）。
 * MVPでは永続化なし（リロードで戻ります）。本番では実データのカウントに接続してください。
 */
export function HelpfulButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  function toggle() {
    setLiked((prev) => {
      setCount((c) => c + (prev ? -1 : 1));
      return !prev;
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
      <span className="text-sm text-ink-soft">このサービスは役に立ちましたか？</span>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={liked}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
          liked
            ? "bg-accent-500 text-white shadow-sm"
            : "border border-gray-300 bg-white text-ink hover:border-accent-300 hover:text-accent-600"
        }`}
      >
        <ThumbsUp size={16} strokeWidth={2} className={liked ? "fill-white/20" : ""} />
        役に立った
        <span className={`rounded-md px-1.5 py-0.5 text-xs ${liked ? "bg-white/20" : "bg-gray-100 text-ink-soft"}`}>
          {formatNumber(count)}
        </span>
      </button>
      <span className="text-[11px] text-ink-faint">※ デモのため保存されません</span>
    </div>
  );
}
