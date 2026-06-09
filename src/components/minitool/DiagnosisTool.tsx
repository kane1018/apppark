"use client";

import { useState } from "react";
import type { DiagnosisConfig } from "@/lib/minitool/types";

/** 診断ツール（質問→選択→結果）。結果は保存しません。 */
export function DiagnosisTool({ config }: { config: DiagnosisConfig }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const answeredAll = config.questions.every((q) => answers[q.id]);

  function computeResult() {
    const tally: Record<string, number> = {};
    for (const q of config.questions) {
      const optId = answers[q.id];
      const opt = q.options.find((o) => o.id === optId);
      if (opt) tally[opt.resultKey] = (tally[opt.resultKey] ?? 0) + 1;
    }
    let bestKey: string | null = null;
    let best = -1;
    for (const r of config.results) {
      const score = tally[r.key] ?? 0;
      if (score > best) {
        best = score;
        bestKey = r.key;
      }
    }
    return config.results.find((r) => r.key === bestKey) ?? config.results[0] ?? null;
  }

  if (showResult) {
    const result = computeResult();
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
          <p className="text-xs font-bold text-brand-600">診断結果</p>
          <h3 className="mt-1 text-xl font-black text-brand-900">{result?.title}</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{result?.body}</p>
          {result?.ctaUrl && result.ctaLabel && (
            <a
              href={result.ctaUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn-primary mt-4"
            >
              {result.ctaLabel} ↗
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setShowResult(false);
            setAnswers({});
          }}
          className="btn-outline"
        >
          もう一度診断する
        </button>
        {config.note && <p className="text-xs text-ink-faint">{config.note}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {config.questions.map((q, i) => (
        <fieldset key={q.id} className="rounded-2xl border border-gray-200 bg-white p-4">
          <legend className="px-1 text-sm font-bold text-brand-800">
            Q{i + 1}. {q.text}
          </legend>
          <div className="mt-2 space-y-2">
            {q.options.map((o) => (
              <label key={o.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-soft hover:bg-gray-50">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === o.id}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                  className="h-4 w-4 border-gray-300 text-accent-500 focus:ring-accent-400"
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => setShowResult(true)}
        disabled={!answeredAll}
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        結果を見る
      </button>
      {config.note && <p className="text-xs text-ink-faint">{config.note}</p>}
    </div>
  );
}
