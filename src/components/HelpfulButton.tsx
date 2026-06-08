"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThumbsUp } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * 「役に立った」リアクション（ログイン必須＝連打・重複・不正投票の防止）。
 * 未ログイン時はログイン案内を表示。
 * MVPでは集計・永続化なし（実データ接続後に件数表示・1ユーザー1回に対応）。
 */
export function HelpfulButton() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [done, setDone] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
        <Link
          href={`/login?next=${encodeURIComponent(pathname || "/")}`}
          className="btn-outline"
        >
          ログイン
        </Link>
        <span className="text-sm text-ink-soft">ログインすると「役に立った」を送信できます。</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
      <span className="text-sm text-ink-soft">このサービスは役に立ちましたか？</span>
      <button
        type="button"
        onClick={() => setDone((d) => !d)}
        aria-pressed={done}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
          done
            ? "bg-accent-500 text-white shadow-sm"
            : "border border-gray-300 bg-white text-ink hover:border-accent-300 hover:text-accent-600"
        }`}
      >
        <ThumbsUp size={16} strokeWidth={2} />
        {done ? "ありがとうございます！" : "役に立った"}
      </button>
    </div>
  );
}
