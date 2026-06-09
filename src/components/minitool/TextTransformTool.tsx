"use client";

import { useMemo, useState } from "react";
import type { TextTransformConfig } from "@/lib/minitool/types";
import { applyTransforms } from "@/lib/minitool/textTransform";
import { transformOpLabels } from "@/lib/minitool/types";

/** 文章変換・整形ツール（ルールベース。AIは使いません） */
export function TextTransformTool({ config }: { config: TextTransformConfig }) {
  const [input, setInput] = useState("");
  const [enabledOps, setEnabledOps] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(config.operations.map((op) => [op, true]))
  );
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const ops = config.operations.filter((op) => enabledOps[op]);
    const result = applyTransforms(input, ops);
    return result;
  }, [input, enabledOps, config.operations]);

  const charCount = [...output].length;

  return (
    <div className="space-y-4">
      <div>
        <label className="field-label" htmlFor="tt-input">変換したい文章</label>
        <textarea
          id="tt-input"
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ここに文章を貼り付けてください。"
          className="field-input resize-y"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {config.operations.map((op) => (
          <label key={op} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft">
            <input
              type="checkbox"
              checked={!!enabledOps[op]}
              onChange={(e) => setEnabledOps((s) => ({ ...s, [op]: e.target.checked }))}
              className="h-3.5 w-3.5 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
            />
            {transformOpLabels[op]}
          </label>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="field-label mb-0">変換結果（{charCount}文字）</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(output);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-brand-400"
            disabled={!output}
          >
            {copied ? "コピー済" : "コピー"}
          </button>
        </div>
        <pre className="min-h-[6rem] whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-ink">{output}</pre>
      </div>
      {config.note && <p className="text-xs text-ink-faint">{config.note}</p>}
    </div>
  );
}
