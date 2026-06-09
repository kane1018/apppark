"use client";

import { useMemo, useState } from "react";
import type { Idea, IdeaStatus } from "@/types";
import { categories } from "@/data/categories";
import { purposes } from "@/data/purposes";
import { ideaStatusLabels } from "@/data/ideas";
import { useIdeas } from "@/components/ideas/IdeaProvider";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { IdeaForm } from "@/components/ideas/IdeaForm";
import { AuthGate } from "@/components/auth/AuthGate";

type SortKey = "new" | "likes" | "comments" | "created" | "open";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "new", label: "新着順" },
  { key: "likes", label: "共感が多い順" },
  { key: "comments", label: "コメントが多い順" },
  { key: "created", label: "作成済み順" },
  { key: "open", label: "募集中順" },
];

const STATUSES: IdeaStatus[] = ["open", "planned", "in_progress", "created", "closed"];

export function IdeasExplorer() {
  const { ideas, likeCountOf, commentCountOf } = useIdeas();
  const [showForm, setShowForm] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState<IdeaStatus | "">("");
  const [sort, setSort] = useState<SortKey>("new");

  const results = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    let list = ideas.filter((i) => {
      if (k && ![i.title, i.problem, i.desiredTool].join(" ").toLowerCase().includes(k)) return false;
      if (category && i.category !== category) return false;
      if (purpose && !i.purposeTags.includes(purpose)) return false;
      if (status && i.status !== status) return false;
      return true;
    });
    list = [...list];
    switch (sort) {
      case "likes":
        list.sort((a, b) => likeCountOf(b) - likeCountOf(a));
        break;
      case "comments":
        list.sort((a, b) => commentCountOf(b) - commentCountOf(a));
        break;
      case "created":
        list.sort((a, b) => Number(b.status === "created") - Number(a.status === "created"));
        break;
      case "open":
        list.sort((a, b) => Number(b.status === "open") - Number(a.status === "open"));
        break;
      case "new":
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return list;
  }, [ideas, keyword, category, purpose, status, sort, likeCountOf, commentCountOf]);

  return (
    <div className="space-y-6">
      {/* 投稿トグル */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          <span className="font-bold text-brand-800">{results.length}</span> 件のアイデア
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary"
        >
          {showForm ? "閉じる" : "アイデアを投稿する"}
        </button>
      </div>

      {showForm && (
        <section className="card p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-bold text-brand-900">アイデアを投稿する</h2>
          <AuthGate
            returnTo="/ideas"
            heading="アイデアを投稿するにはログインが必要です。"
            body="AppParkでは、スパム防止と投稿内容の管理のため、アイデア投稿にはログインをお願いしています。Googleアカウントでログインするとアイデアを投稿できます。"
          >
            <IdeaForm />
          </AuthGate>
        </section>
      )}

      {/* フィルター */}
      <div className="card p-4 sm:p-5">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="キーワードで検索（タイトル・困りごと・欲しいツール）"
          aria-label="アイデア検索"
          className="field-input"
        />
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="カテゴリ" value={category} onChange={setCategory} options={[{ value: "", label: "すべて" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]} />
          <Select label="目的タグ" value={purpose} onChange={setPurpose} options={[{ value: "", label: "すべて" }, ...purposes.map((p) => ({ value: p.slug, label: p.name }))]} />
          <Select label="ステータス" value={status} onChange={(v) => setStatus(v as IdeaStatus | "")} options={[{ value: "", label: "すべて" }, ...STATUSES.map((s) => ({ value: s, label: ideaStatusLabels[s] }))]} />
          <Select label="並び替え" value={sort} onChange={(v) => setSort(v as SortKey)} options={SORTS.map((s) => ({ value: s.key, label: s.label }))} />
        </div>
      </div>

      {/* 一覧 */}
      {results.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center text-sm text-ink-faint">
          条件に合うアイデアはありません。最初のアイデアを投稿してみませんか？
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((i: Idea) => (
            <IdeaCard key={i.id} idea={i} likeCount={likeCountOf(i)} commentCount={commentCountOf(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field-input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
