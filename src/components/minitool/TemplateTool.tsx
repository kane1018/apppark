"use client";

import { useMemo, useState } from "react";
import type { TemplateConfig } from "@/lib/minitool/types";

/** テンプレート生成ツール（{id} を入力値で置換） */
export function TemplateTool({ config }: { config: TemplateConfig }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    return config.template.replace(/\{([A-Za-z0-9_]+)\}/g, (_m, id) => {
      const v = values[id];
      return v && v.trim() !== "" ? v : `（${labelOf(config, id)}）`;
    });
  }, [config, values]);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {config.fields.map((f) => (
          <div key={f.id}>
            <label className="field-label" htmlFor={`tpl-${f.id}`}>{f.label}</label>
            {f.multiline ? (
              <textarea
                id={`tpl-${f.id}`}
                rows={3}
                value={values[f.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                placeholder={f.placeholder}
                className="field-input resize-y"
              />
            ) : (
              <input
                id={`tpl-${f.id}`}
                value={values[f.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                placeholder={f.placeholder}
                className="field-input"
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="field-label mb-0">生成された文章</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(output);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-brand-400"
          >
            {copied ? "コピー済" : "コピー"}
          </button>
        </div>
        <pre className="whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-ink">{output}</pre>
      </div>
      {config.note && <p className="text-xs text-ink-faint">{config.note}</p>}
    </div>
  );
}

function labelOf(config: TemplateConfig, id: string): string {
  return config.fields.find((f) => f.id === id)?.label ?? id;
}
