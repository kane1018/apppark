"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 検索バー。送信するとサービス一覧（/services?q=...）へ遷移します。
 */
export function SearchBar({
  size = "lg",
  defaultValue = "",
  placeholder = "文章作成、画像圧縮、動画字幕、LP改善などで検索",
}: {
  size?: "lg" | "md";
  defaultValue?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/services?q=${encodeURIComponent(q)}` : "/services");
  }

  const big = size === "lg";

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={`flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-card ${
        big ? "sm:p-2.5" : ""
      }`}
    >
      <span className="pl-2 text-gray-400" aria-hidden>
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 103.4 9.8l3.15 3.15a1 1 0 001.4-1.42l-3.14-3.14A5.5 5.5 0 009 3.5zM5.5 9a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="サービスを検索"
        className={`min-w-0 flex-1 bg-transparent text-ink placeholder:text-gray-400 focus:outline-none ${
          big ? "py-2 text-base" : "py-1.5 text-sm"
        }`}
      />
      <button
        type="submit"
        className={`shrink-0 rounded-xl bg-accent-500 font-bold text-white transition hover:bg-accent-600 ${
          big ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm"
        }`}
      >
        検索
      </button>
    </form>
  );
}
