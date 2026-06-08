"use client";

import { useState } from "react";

/** パスワード生成（Web Crypto による安全な乱数。ブラウザ内処理） */
const SETS = {
  lower: "abcdefghijkmnpqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  digits: "23456789",
  symbols: "!@#$%^&*-_=+?",
};
const AMBIGUOUS = "0Oo1lI";

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let pool = "";
    if (opts.lower) pool += SETS.lower;
    if (opts.upper) pool += SETS.upper;
    if (opts.digits) pool += SETS.digits + "01";
    if (opts.symbols) pool += SETS.symbols;
    if (excludeAmbiguous) pool = [...pool].filter((c) => !AMBIGUOUS.includes(c)).join("");
    if (!pool) {
      setPassword("");
      return;
    }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const pw = Array.from(arr, (n) => pool[n % pool.length]).join("");
    setPassword(pw);
    setCopied(false);
  }

  const toggle = (k: keyof typeof opts) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-3">
        <input
          readOnly
          value={password}
          placeholder="「生成する」を押してください"
          className="min-w-0 flex-1 bg-transparent px-2 font-mono text-lg text-ink focus:outline-none"
          aria-label="生成されたパスワード"
        />
        <button
          type="button"
          onClick={() => {
            if (!password) return;
            navigator.clipboard?.writeText(password);
            setCopied(true);
          }}
          className="btn-outline"
          disabled={!password}
        >
          {copied ? "コピー済" : "コピー"}
        </button>
      </div>

      <label className="block">
        <span className="field-label">長さ：{length} 文字</span>
        <input
          type="range"
          min={6}
          max={48}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-accent-500"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {([
          ["lower", "英小文字"],
          ["upper", "英大文字"],
          ["digits", "数字"],
          ["symbols", "記号"],
        ] as const).map(([k, label]) => (
          <label key={k} className="inline-flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={opts[k]}
              onChange={() => toggle(k)}
              className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
            />
            {label}
          </label>
        ))}
        <label className="inline-flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(e) => setExcludeAmbiguous(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
          />
          紛らわしい文字（0/O,1/l）を除外
        </label>
      </div>

      <button type="button" onClick={generate} className="btn-primary">
        生成する
      </button>
      <p className="text-xs text-ink-faint">
        ※ 暗号学的に安全な乱数（Web Crypto）でブラウザ内生成しています。生成結果は保存・送信されません。
      </p>
    </div>
  );
}
