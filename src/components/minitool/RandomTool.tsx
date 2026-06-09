"use client";

import { useState } from "react";
import type { RandomConfig } from "@/lib/minitool/types";

/**
 * ランダム生成ツール（お題・ネタ）。
 * 設定（config）に入っている候補からランダムに1つ表示するだけで、
 * 投稿者のコードは実行しません。結果は保存しません。
 */
export function RandomTool({ config }: { config: RandomConfig }) {
  const categories = config.categories ?? [];
  const [categoryId, setCategoryId] = useState<string>(
    categories[0]?.id ?? ""
  );
  const [result, setResult] = useState<string | null>(null);

  const current = categories.find((c) => c.id === categoryId) ?? categories[0];

  function draw() {
    const items = current?.items ?? [];
    if (items.length === 0) {
      setResult(null);
      return;
    }
    // 直前と同じものは避ける（候補が2つ以上あるとき）
    let next = items[Math.floor(Math.random() * items.length)];
    if (items.length > 1) {
      let guard = 0;
      while (next === result && guard < 10) {
        next = items[Math.floor(Math.random() * items.length)];
        guard += 1;
      }
    }
    setResult(next);
  }

  return (
    <div className="space-y-4">
      {categories.length > 1 && (
        <div>
          <label className="field-label" htmlFor="random-category">
            カテゴリを選ぶ
          </label>
          <select
            id="random-category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setResult(null);
            }}
            className="field-input"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
        {result ? (
          <p className="text-lg font-bold leading-relaxed text-brand-900">
            {result}
          </p>
        ) : (
          <p className="text-sm text-ink-faint">
            下のボタンを押すと、お題がランダムに表示されます。
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={draw} className="btn-primary">
          {result ? "もう一度引く" : "お題を引く"}
        </button>
        {current && (
          <span className="text-xs text-ink-faint">
            「{current.label}」から表示中
          </span>
        )}
      </div>

      {config.note && <p className="text-xs text-ink-faint">{config.note}</p>}
    </div>
  );
}
