"use client";

import { useState } from "react";

/** カラーコード変換（HEX ↔ RGB） */
function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function toHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b].map((n) => clamp(n).toString(16).padStart(2, "0")).join("").toUpperCase()
  );
}
function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(m)) {
    const r = parseInt(m[0] + m[0], 16);
    const g = parseInt(m[1] + m[1], 16);
    const b = parseInt(m[2] + m[2], 16);
    return { r, g, b };
  }
  if (/^[0-9a-fA-F]{6}$/.test(m)) {
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16),
    };
  }
  return null;
}

export function ColorConverterTool() {
  const [rgb, setRgb] = useState({ r: 47, g: 77, b: 122 });
  const [hexInput, setHexInput] = useState("#2F4D7A");
  const [error, setError] = useState("");

  const hex = toHex(rgb.r, rgb.g, rgb.b);

  function applyHex(value: string) {
    setHexInput(value);
    const parsed = parseHex(value);
    if (parsed) {
      setRgb(parsed);
      setError("");
    } else {
      setError("HEXは #RRGGBB または #RGB 形式で入力してください。");
    }
  }

  function setChannel(k: "r" | "g" | "b", v: number) {
    const next = { ...rgb, [k]: clamp(v) };
    setRgb(next);
    setHexInput(toHex(next.r, next.g, next.b));
    setError("");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div
          className="h-20 w-20 shrink-0 rounded-2xl border border-gray-200 shadow-inner"
          style={{ backgroundColor: hex }}
          aria-label={`プレビュー ${hex}`}
        />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-12 text-xs font-semibold text-ink-faint">HEX</span>
            <input
              value={hexInput}
              onChange={(e) => applyHex(e.target.value)}
              className="field-input w-40 font-mono"
              aria-label="HEXコード"
            />
            <CopyBtn text={hex} />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-xs font-semibold text-ink-faint">RGB</span>
            <code className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </code>
            <CopyBtn text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      <div className="space-y-3">
        {(["r", "g", "b"] as const).map((k) => (
          <label key={k} className="block">
            <span className="field-label">
              {k.toUpperCase()}：{rgb[k]}
            </span>
            <input
              type="range"
              min={0}
              max={255}
              value={rgb[k]}
              onChange={(e) => setChannel(k, Number(e.target.value))}
              className="w-full accent-accent-500"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
      className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:border-brand-400"
    >
      {done ? "✓" : "コピー"}
    </button>
  );
}
