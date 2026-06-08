"use client";

import { useMemo, useState } from "react";

/** 税込・税抜・割引計算 */
export function PriceCalcTool() {
  const [amount, setAmount] = useState("1000");
  const [taxRate, setTaxRate] = useState(10);
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive"); // 入力が税抜か税込か
  const [discount, setDiscount] = useState("0");

  const result = useMemo(() => {
    const a = Number(amount) || 0;
    const d = Math.min(100, Math.max(0, Number(discount) || 0));
    const r = taxRate / 100;
    let net: number; // 税抜
    let gross: number; // 税込
    if (mode === "exclusive") {
      net = a;
      gross = a * (1 + r);
    } else {
      gross = a;
      net = a / (1 + r);
    }
    const discountedGross = gross * (1 - d / 100);
    const tax = gross - net;
    return {
      net: Math.round(net),
      gross: Math.round(gross),
      tax: Math.round(tax),
      discountedGross: Math.round(discountedGross),
      hasDiscount: d > 0,
    };
  }, [amount, taxRate, mode, discount]);

  const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">金額</span>
          <input
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="field-input"
          />
        </label>
        <label className="block">
          <span className="field-label">割引率（%）</span>
          <input
            type="number"
            inputMode="numeric"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="field-input"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div>
          <span className="field-label">入力した金額は</span>
          <div className="flex gap-3">
            {([
              ["exclusive", "税抜"],
              ["inclusive", "税込"],
            ] as const).map(([v, label]) => (
              <label key={v} className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === v}
                  onChange={() => setMode(v)}
                  className="h-4 w-4 border-gray-300 text-accent-500 focus:ring-accent-400"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <span className="field-label">税率</span>
          <div className="flex gap-3">
            {[10, 8, 0].map((r) => (
              <label key={r} className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
                <input
                  type="radio"
                  name="tax"
                  checked={taxRate === r}
                  onChange={() => setTaxRate(r)}
                  className="h-4 w-4 border-gray-300 text-accent-500 focus:ring-accent-400"
                />
                {r}%
              </label>
            ))}
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "税抜", value: yen(result.net) },
          { label: "消費税", value: yen(result.tax) },
          { label: "税込", value: yen(result.gross) },
          {
            label: result.hasDiscount ? "割引後（税込）" : "割引後",
            value: yen(result.discountedGross),
            highlight: true,
          },
        ].map((it) => (
          <div
            key={it.label}
            className={`rounded-xl border px-3 py-3 text-center ${
              it.highlight ? "border-accent-300 bg-accent-50/50" : "border-gray-200 bg-white"
            }`}
          >
            <dt className="text-[11px] text-ink-faint">{it.label}</dt>
            <dd className="mt-1 text-lg font-black text-brand-800">{it.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-ink-faint">※ 表示は小数点以下を四捨五入しています。端数処理は用途に応じてご確認ください。</p>
    </div>
  );
}
