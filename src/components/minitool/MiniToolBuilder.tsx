"use client";

import { useState } from "react";
import type {
  CalculatorConfig,
  ChecklistConfig,
  DiagnosisConfig,
  MiniToolConfig,
  MiniToolType,
  TemplateConfig,
  TextTransformConfig,
  TransformOp,
} from "@/lib/minitool/types";
import { miniToolTypeLabels, transformOpLabels } from "@/lib/minitool/types";
import { isValidExpression } from "@/lib/minitool/safeExpression";
import { MiniTool } from "@/components/minitool/MiniTool";

/**
 * AppPark内ミニツールの作成フォーム（type選択→設定→プレビュー）。
 * 投稿者はコードを書かず、フォーム入力でツールを作れます（自由JS実行なし）。
 */
const TYPE_OPTIONS: { type: Exclude<MiniToolType, "none">; example: string }[] = [
  { type: "diagnosis", example: "例：自分に合うAIツール診断、タイプ診断" },
  { type: "calculator", example: "例：料金見積もり、作業時間見積もり" },
  { type: "template_generator", example: "例：返信文メーカー、SNS投稿文メーカー" },
  { type: "checklist", example: "例：公開前チェック、引っ越し準備チェック" },
  { type: "text_transform", example: "例：改行整理、箇条書き整形、全角半角変換" },
];

function starterConfig(type: Exclude<MiniToolType, "none">): MiniToolConfig {
  switch (type) {
    case "diagnosis":
      return {
        questions: [
          { id: "q1", text: "質問1", options: [
            { id: "q1a", label: "選択肢A", resultKey: "a" },
            { id: "q1b", label: "選択肢B", resultKey: "b" },
          ] },
        ],
        results: [
          { key: "a", title: "結果A", body: "結果Aの説明" },
          { key: "b", title: "結果B", body: "結果Bの説明" },
        ],
      } as DiagnosisConfig;
    case "calculator":
      return {
        resultLabel: "計算結果",
        unit: "円",
        rounding: "round",
        formula: "a * b",
        inputs: [
          { id: "a", label: "単価", kind: "number", unit: "円", defaultValue: 1000 },
          { id: "b", label: "数量", kind: "number", unit: "個", defaultValue: 1 },
        ],
      } as CalculatorConfig;
    case "template_generator":
      return {
        fields: [{ id: "name", label: "宛名", placeholder: "○○様" }],
        template: "{name}\n\nお世話になっております。",
      } as TemplateConfig;
    case "checklist":
      return { items: [{ id: "c1", label: "確認項目1" }] } as ChecklistConfig;
    case "text_transform":
      return { operations: ["trim_lines", "remove_blank_lines"] } as TextTransformConfig;
  }
}

export function MiniToolBuilder() {
  const [type, setType] = useState<Exclude<MiniToolType, "none"> | "">("");
  const [config, setConfig] = useState<MiniToolConfig | null>(null);

  function pickType(t: Exclude<MiniToolType, "none">) {
    setType(t);
    setConfig(starterConfig(t));
  }

  return (
    <div className="space-y-5">
      {/* 作りたいタイプを先に選ぶ */}
      <div>
        <span className="field-label">作りたいミニツールのタイプを選ぶ</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TYPE_OPTIONS.map((o) => (
            <button
              key={o.type}
              type="button"
              onClick={() => pickType(o.type)}
              className={`rounded-xl border p-3 text-left transition ${
                type === o.type
                  ? "border-accent-300 bg-accent-50/50 ring-1 ring-accent-200"
                  : "border-gray-200 bg-white hover:border-brand-300"
              }`}
            >
              <span className="block text-sm font-bold text-brand-900">{miniToolTypeLabels[o.type]}</span>
              <span className="mt-0.5 block text-xs text-ink-faint">{o.example}</span>
            </button>
          ))}
        </div>
      </div>

      {type && config && (
        <>
          {/* 送信用：選択タイプとconfig（JSON）。本番では authorId と一緒に保存します */}
          <input type="hidden" name="miniToolType" value={type} />
          <input type="hidden" name="miniToolConfig" value={JSON.stringify(config)} />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-brand-800">設定</h4>
              {type === "diagnosis" && (
                <DiagnosisEditor config={config as DiagnosisConfig} onChange={setConfig} />
              )}
              {type === "calculator" && (
                <CalculatorEditor config={config as CalculatorConfig} onChange={setConfig} />
              )}
              {type === "template_generator" && (
                <TemplateEditor config={config as TemplateConfig} onChange={setConfig} />
              )}
              {type === "checklist" && (
                <ChecklistEditor config={config as ChecklistConfig} onChange={setConfig} />
              )}
              {type === "text_transform" && (
                <TextTransformEditor config={config as TextTransformConfig} onChange={setConfig} />
              )}
            </div>

            {/* プレビュー */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brand-800">プレビュー</h4>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <MiniTool type={type} config={config} storageKey="preview" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- 小さな入力部品 ---------------- */
function Row({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-2">
      <div className="flex-1 space-y-2">{children}</div>
      {onRemove && (
        <button type="button" onClick={onRemove} className="mt-1 text-xs font-bold text-rose-500 hover:text-rose-700">
          削除
        </button>
      )}
    </div>
  );
}
function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field-input !py-2 text-sm" />
  );
}
function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-brand-400">
      ＋ {label}
    </button>
  );
}

function uid(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 6)}`;
}

/* ---------------- 各エディタ ---------------- */
function DiagnosisEditor({ config, onChange }: { config: DiagnosisConfig; onChange: (c: MiniToolConfig) => void }) {
  const set = (c: DiagnosisConfig) => onChange({ ...c });
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-bold text-ink-faint">質問</p>
        {config.questions.map((q, qi) => (
          <Row key={q.id} onRemove={() => set({ ...config, questions: config.questions.filter((_, i) => i !== qi) })}>
            <TextInput value={q.text} placeholder="質問文" onChange={(v) => {
              const qs = [...config.questions]; qs[qi] = { ...q, text: v }; set({ ...config, questions: qs });
            }} />
            {q.options.map((o, oi) => (
              <div key={o.id} className="flex gap-2">
                <TextInput value={o.label} placeholder="選択肢" onChange={(v) => {
                  const qs = [...config.questions]; const os = [...q.options]; os[oi] = { ...o, label: v }; qs[qi] = { ...q, options: os }; set({ ...config, questions: qs });
                }} />
                <select value={o.resultKey} onChange={(e) => {
                  const qs = [...config.questions]; const os = [...q.options]; os[oi] = { ...o, resultKey: e.target.value }; qs[qi] = { ...q, options: os }; set({ ...config, questions: qs });
                }} className="field-input !w-32 !py-2 text-sm">
                  {config.results.map((r) => <option key={r.key} value={r.key}>{r.title}</option>)}
                </select>
              </div>
            ))}
            <AddBtn label="選択肢" onClick={() => {
              const qs = [...config.questions]; qs[qi] = { ...q, options: [...q.options, { id: uid("o"), label: "選択肢", resultKey: config.results[0]?.key ?? "a" }] }; set({ ...config, questions: qs });
            }} />
          </Row>
        ))}
        <AddBtn label="質問を追加" onClick={() => set({ ...config, questions: [...config.questions, { id: uid("q"), text: "質問", options: [{ id: uid("o"), label: "選択肢", resultKey: config.results[0]?.key ?? "a" }] }] })} />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold text-ink-faint">結果パターン</p>
        {config.results.map((r, ri) => (
          <Row key={r.key} onRemove={config.results.length > 1 ? () => set({ ...config, results: config.results.filter((_, i) => i !== ri) }) : undefined}>
            <TextInput value={r.title} placeholder="結果タイトル" onChange={(v) => { const rs = [...config.results]; rs[ri] = { ...r, title: v }; set({ ...config, results: rs }); }} />
            <textarea value={r.body} placeholder="結果本文" rows={2} onChange={(e) => { const rs = [...config.results]; rs[ri] = { ...r, body: e.target.value }; set({ ...config, results: rs }); }} className="field-input resize-y !py-2 text-sm" />
          </Row>
        ))}
        <AddBtn label="結果を追加" onClick={() => set({ ...config, results: [...config.results, { key: uid("r"), title: "結果", body: "説明" }] })} />
      </div>
    </div>
  );
}

function CalculatorEditor({ config, onChange }: { config: CalculatorConfig; onChange: (c: MiniToolConfig) => void }) {
  const set = (c: CalculatorConfig) => onChange({ ...c });
  const formulaOk = isValidExpression(config.formula);
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-ink-faint">入力項目（idは式で使う変数名）</p>
      {config.inputs.map((inp, i) => (
        <Row key={inp.id} onRemove={() => set({ ...config, inputs: config.inputs.filter((_, x) => x !== i) })}>
          <div className="flex gap-2">
            <TextInput value={inp.id} placeholder="変数名(id)" onChange={(v) => { const ins = [...config.inputs]; ins[i] = { ...inp, id: v.replace(/[^A-Za-z0-9_]/g, "") }; set({ ...config, inputs: ins }); }} />
            <TextInput value={inp.label} placeholder="ラベル" onChange={(v) => { const ins = [...config.inputs]; ins[i] = { ...inp, label: v }; set({ ...config, inputs: ins }); }} />
            <TextInput value={inp.unit ?? ""} placeholder="単位" onChange={(v) => { const ins = [...config.inputs]; ins[i] = { ...inp, unit: v }; set({ ...config, inputs: ins }); }} />
          </div>
        </Row>
      ))}
      <AddBtn label="入力項目を追加" onClick={() => set({ ...config, inputs: [...config.inputs, { id: uid("v"), label: "項目", kind: "number", defaultValue: 0 }] })} />
      <div>
        <label className="field-label">計算式（+ - * / ( ) と変数名のみ・JSは使えません）</label>
        <input value={config.formula} onChange={(e) => set({ ...config, formula: e.target.value })} className={`field-input ${formulaOk ? "" : "border-rose-300"}`} />
        {!formulaOk && <p className="mt-1 text-xs text-rose-600">式が正しくありません（使える記号は + - * / ( ) と変数名です）。</p>}
      </div>
      <div className="flex gap-2">
        <TextInput value={config.resultLabel} placeholder="結果ラベル" onChange={(v) => set({ ...config, resultLabel: v })} />
        <TextInput value={config.unit ?? ""} placeholder="結果の単位" onChange={(v) => set({ ...config, unit: v })} />
      </div>
    </div>
  );
}

function TemplateEditor({ config, onChange }: { config: TemplateConfig; onChange: (c: MiniToolConfig) => void }) {
  const set = (c: TemplateConfig) => onChange({ ...c });
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-ink-faint">入力フィールド（idはテンプレ内 {"{id}"} で使う）</p>
      {config.fields.map((f, i) => (
        <Row key={f.id} onRemove={() => set({ ...config, fields: config.fields.filter((_, x) => x !== i) })}>
          <div className="flex gap-2">
            <TextInput value={f.id} placeholder="id" onChange={(v) => { const fs = [...config.fields]; fs[i] = { ...f, id: v.replace(/[^A-Za-z0-9_]/g, "") }; set({ ...config, fields: fs }); }} />
            <TextInput value={f.label} placeholder="ラベル" onChange={(v) => { const fs = [...config.fields]; fs[i] = { ...f, label: v }; set({ ...config, fields: fs }); }} />
          </div>
        </Row>
      ))}
      <AddBtn label="フィールドを追加" onClick={() => set({ ...config, fields: [...config.fields, { id: uid("f"), label: "項目" }] })} />
      <div>
        <label className="field-label">出力テンプレート（{"{id}"} が置換されます）</label>
        <textarea value={config.template} rows={5} onChange={(e) => set({ ...config, template: e.target.value })} className="field-input resize-y text-sm" />
      </div>
    </div>
  );
}

function ChecklistEditor({ config, onChange }: { config: ChecklistConfig; onChange: (c: MiniToolConfig) => void }) {
  const set = (c: ChecklistConfig) => onChange({ ...c });
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-ink-faint">チェック項目</p>
      {config.items.map((it, i) => (
        <Row key={it.id} onRemove={() => set({ ...config, items: config.items.filter((_, x) => x !== i) })}>
          <div className="flex gap-2">
            <TextInput value={it.label} placeholder="項目" onChange={(v) => { const xs = [...config.items]; xs[i] = { ...it, label: v }; set({ ...config, items: xs }); }} />
            <TextInput value={it.category ?? ""} placeholder="カテゴリ(任意)" onChange={(v) => { const xs = [...config.items]; xs[i] = { ...it, category: v }; set({ ...config, items: xs }); }} />
          </div>
        </Row>
      ))}
      <AddBtn label="項目を追加" onClick={() => set({ ...config, items: [...config.items, { id: uid("c"), label: "確認項目" }] })} />
    </div>
  );
}

function TextTransformEditor({ config, onChange }: { config: TextTransformConfig; onChange: (c: MiniToolConfig) => void }) {
  const all = Object.keys(transformOpLabels) as TransformOp[];
  const toggle = (op: TransformOp) => {
    const has = config.operations.includes(op);
    onChange({ ...config, operations: has ? config.operations.filter((o) => o !== op) : [...config.operations, op] });
  };
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-ink-faint">使える変換（チェックした順に適用）</p>
      {all.map((op) => (
        <label key={op} className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={config.operations.includes(op)} onChange={() => toggle(op)} className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400" />
          {transformOpLabels[op]}
        </label>
      ))}
    </div>
  );
}
