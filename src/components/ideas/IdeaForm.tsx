"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MiniToolPotential, WantLevel } from "@/types";
import { categories } from "@/data/categories";
import { purposes } from "@/data/purposes";
import { audienceTags } from "@/data/tags";
import { miniToolPotentialLabels, wantLevelLabels } from "@/data/ideas";
import { ideaSubmissionMessage } from "@/lib/ideaModeration";
import { useIdeas } from "@/components/ideas/IdeaProvider";

const POTENTIALS: MiniToolPotential[] = ["yes", "maybe", "no", "unknown"];
const WANT_LEVELS: WantLevel[] = [1, 2, 3, 4, 5];

/** アイデア投稿フォーム（ログイン済み前提。AuthGate の内側で使用） */
export function IdeaForm() {
  const router = useRouter();
  const { addIdea } = useIdeas();

  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [desiredTool, setDesiredTool] = useState("");
  const [category, setCategory] = useState("");
  const [purposeTags, setPurposeTags] = useState<string[]>([]);
  const [audience, setAudience] = useState<string[]>([]);
  const [useCase, setUseCase] = useState("");
  const [similarUrl, setSimilarUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [potential, setPotential] = useState<MiniToolPotential>("unknown");
  const [wantLevel, setWantLevel] = useState<WantLevel>(3);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [agree, setAgree] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function toggle(list: string[], set: (v: string[]) => void, value: string) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  const canSubmit =
    title.trim() && problem.trim() && desiredTool.trim() && category && purposeTags.length > 0 && agree && !pending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    const res = await addIdea({
      title,
      problem,
      desiredTool,
      category,
      purposeTags,
      audienceTags: audience,
      useCase: useCase || null,
      similarServiceUrl: similarUrl || null,
      referenceImageUrl: imageUrl || null,
      miniToolPotential: potential,
      wantLevel,
      isAnonymous,
    });
    setPending(false);
    setMessage(ideaSubmissionMessage(res.status));
    if (res.status === "published") {
      router.push(`/ideas/${res.id}`);
      return;
    }
    // pending：フォームは閉じてメッセージのみ表示
    setTitle("");
    setProblem("");
    setDesiredTool("");
    setPurposeTags([]);
    setAudience([]);
    setUseCase("");
    setSimilarUrl("");
    setImageUrl("");
    setAgree(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 投稿前の注意文 */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900/90">
        投稿されたアイデアは、他のユーザーや開発者が参考にしてサービスを作成する場合があります。秘密情報、権利化したい未公開アイデア、第三者の権利を侵害する内容は投稿しないでください。アイデア投稿によって、報酬や権利の発生が保証されるものではありません。
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </div>
      )}

      <Field label="アイデアタイトル" required>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="field-input"
          placeholder="例：面接日程の返信文を一瞬で作れるツールが欲しい"
        />
      </Field>

      <Field label="困っていること・解決したいこと" required>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          required
          rows={3}
          className="field-input resize-y"
          placeholder="例：企業ごとに丁寧な返信文を考えるのが面倒で、失礼がないか不安になる"
        />
      </Field>

      <Field label="こんなツールが欲しい" required>
        <textarea
          value={desiredTool}
          onChange={(e) => setDesiredTool(e.target.value)}
          required
          rows={3}
          className="field-input resize-y"
          placeholder="例：企業名、担当者名、希望日時を入れるだけで、自然な返信文を作ってくれるツール"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="カテゴリ" required>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required className="field-input">
            <option value="">選択してください</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="作ってほしい度">
          <select value={wantLevel} onChange={(e) => setWantLevel(Number(e.target.value) as WantLevel)} className="field-input">
            {WANT_LEVELS.map((w) => (
              <option key={w} value={w}>{wantLevelLabels[w]}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="目的タグ（1つ以上選択）" required>
        <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-gray-200 p-3 sm:grid-cols-2">
          {purposes.map((p) => (
            <Check key={p.slug} label={p.name} checked={purposeTags.includes(p.slug)} onChange={() => toggle(purposeTags, setPurposeTags, p.slug)} />
          ))}
        </div>
      </Field>

      <Field label="想定利用者（任意・複数可）">
        <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-gray-200 p-3 sm:grid-cols-2">
          {audienceTags.map((t) => (
            <Check key={t.slug} label={t.name} checked={audience.includes(t.slug)} onChange={() => toggle(audience, setAudience, t.slug)} />
          ))}
        </div>
      </Field>

      <Field label="使いたい場面（任意）">
        <input value={useCase} onChange={(e) => setUseCase(e.target.value)} className="field-input" placeholder="例：面接日程の候補を返信するとき" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="似ているサービスURL（任意）">
          <input value={similarUrl} onChange={(e) => setSimilarUrl(e.target.value)} type="url" className="field-input" placeholder="https://..." />
        </Field>
        <Field label="参考画像URL（任意）">
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} type="url" className="field-input" placeholder="https://..." />
        </Field>
      </div>

      <Field label="AppPark内ミニツールで作れそうか（任意）">
        <select value={potential} onChange={(e) => setPotential(e.target.value as MiniToolPotential)} className="field-input">
          {POTENTIALS.map((p) => (
            <option key={p} value={p}>{miniToolPotentialLabels[p]}</option>
          ))}
        </select>
      </Field>

      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400" />
        匿名で投稿する（公開ページでは「匿名」と表示されます）
      </label>

      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400" />
        <span>
          <a href="/terms" className="text-brand-600 underline-offset-2 hover:underline">利用規約</a>
          に同意し、秘密情報・権利化したい内容・第三者の権利を侵害する内容を含まないことを確認しました。
        </span>
      </label>

      <button type="submit" disabled={!canSubmit} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
        {pending ? "判定中…" : "アイデアを投稿する"}
      </button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <span className="field-label">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      {children}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-start gap-2 text-sm text-ink-soft">
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400" />
      <span>{label}</span>
    </label>
  );
}
