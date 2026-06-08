"use client";

import { useMemo, useState } from "react";

/** 文字数カウント（ブラウザ内で処理） */
export function CharCountTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = [...text].length;
    const charsNoSpace = [...text.replace(/\s/g, "")].length;
    const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const manuscript = Math.ceil(chars / 400); // 原稿用紙(400字)換算
    return { chars, charsNoSpace, lines, words, manuscript };
  }, [text]);

  const items = [
    { label: "文字数（スペース込み）", value: stats.chars },
    { label: "文字数（スペース除く）", value: stats.charsNoSpace },
    { label: "行数", value: stats.lines },
    { label: "単語数", value: stats.words },
    { label: "原稿用紙（400字）", value: `${stats.manuscript} 枚` },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="ここに文章を貼り付けてください。"
        className="field-input resize-y"
        aria-label="文字数を数える文章"
      />
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center">
            <dt className="text-[11px] text-ink-faint">{it.label}</dt>
            <dd className="mt-1 text-xl font-black text-brand-800">{it.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(text)}
          className="btn-outline"
          disabled={!text}
        >
          コピー
        </button>
        <button type="button" onClick={() => setText("")} className="btn-outline" disabled={!text}>
          クリア
        </button>
      </div>
    </div>
  );
}
