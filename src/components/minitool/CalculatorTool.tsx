"use client";

import { useMemo, useState } from "react";
import type { CalculatorConfig } from "@/lib/minitool/types";
import { evaluateExpression } from "@/lib/minitool/safeExpression";

/** 計算・見積もりツール（安全な式評価。evalは使いません） */
export function CalculatorTool({ config }: { config: CalculatorConfig }) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const inp of config.inputs) {
      init[inp.id] = inp.defaultValue ?? (inp.kind === "select" ? inp.options?.[0]?.value ?? 0 : 0);
    }
    return init;
  });

  const result = useMemo(() => {
    const raw = evaluateExpression(config.formula, values);
    if (raw === null) return null;
    switch (config.rounding) {
      case "floor": return Math.floor(raw);
      case "ceil": return Math.ceil(raw);
      case "none": return raw;
      case "round":
      default: return Math.round(raw);
    }
  }, [config.formula, config.rounding, values]);

  function setVal(id: string, v: number) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {config.inputs.map((inp) => (
          <div key={inp.id}>
            <label className="field-label" htmlFor={`calc-${inp.id}`}>
              {inp.label}
              {inp.unit ? `（${inp.unit}）` : ""}
            </label>
            {inp.kind === "select" ? (
              <select
                id={`calc-${inp.id}`}
                value={values[inp.id]}
                onChange={(e) => setVal(inp.id, Number(e.target.value))}
                className="field-input"
              >
                {(inp.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                id={`calc-${inp.id}`}
                type="number"
                inputMode="decimal"
                value={Number.isFinite(values[inp.id]) ? values[inp.id] : 0}
                min={inp.min}
                max={inp.max}
                onChange={(e) => {
                  let v = Number(e.target.value);
                  if (Number.isNaN(v)) v = 0;
                  if (inp.min !== undefined) v = Math.max(inp.min, v);
                  if (inp.max !== undefined) v = Math.min(inp.max, v);
                  setVal(inp.id, v);
                }}
                className="field-input"
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-accent-300 bg-accent-50/50 p-5 text-center">
        <p className="text-xs font-bold text-ink-faint">{config.resultLabel}</p>
        <p className="mt-1 text-3xl font-black text-brand-800">
          {result === null ? "—" : result.toLocaleString("ja-JP")}
          {config.unit ? <span className="ml-1 text-base font-bold">{config.unit}</span> : null}
        </p>
      </div>
      {config.note && <p className="text-xs text-ink-faint">{config.note}</p>}
    </div>
  );
}
