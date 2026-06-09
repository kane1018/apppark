"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChecklistConfig } from "@/lib/minitool/types";

/** チェックリストツール（進捗率・ローカル保存・ログイン不要） */
export function ChecklistTool({ config, storageKey }: { config: ChecklistConfig; storageKey: string }) {
  const key = `apppark.checklist.${storageKey}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, [key]);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }

  const done = config.items.filter((it) => checked[it.id]).length;
  const total = config.items.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  // カテゴリでグループ化
  const groups = useMemo(() => {
    const map = new Map<string, typeof config.items>();
    for (const it of config.items) {
      const c = it.category ?? "";
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(it);
    }
    return Array.from(map.entries());
  }, [config.items]);

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-bold text-brand-800">進捗 {done}/{total}</span>
          <span className="font-black text-brand-700">{percent}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {groups.map(([cat, items]) => (
        <div key={cat || "_"}>
          {cat && <p className="mb-1.5 text-xs font-bold text-ink-faint">{cat}</p>}
          <ul className="space-y-1.5">
            {items.map((it) => (
              <li key={it.id}>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={!!checked[it.id]}
                    onChange={() => toggle(it.id)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
                  />
                  <span>
                    <span className={`text-sm ${checked[it.id] ? "text-ink-faint line-through" : "font-semibold text-ink"}`}>
                      {it.label}
                      {it.required && <span className="ml-1 text-[11px] font-bold text-rose-500">必須</span>}
                    </span>
                    {it.help && <span className="mt-0.5 block text-xs text-ink-faint">{it.help}</span>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setChecked({});
            try { localStorage.removeItem(key); } catch { /* noop */ }
          }}
          className="btn-outline"
        >
          リセット
        </button>
        {percent === 100 && <span className="text-sm font-bold text-emerald-600">すべて完了しました！</span>}
      </div>
      {config.note && <p className="text-xs text-ink-faint">{config.note}</p>}
    </div>
  );
}
