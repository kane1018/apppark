"use client";

import { useMemo, useState } from "react";
import type { RecruitmentStatus, Service } from "@/types";
import {
  defaultFilterState,
  filterAndSortServices,
  sortOptions,
  type FilterState,
  type SortKey,
} from "@/lib/filters";
import { categories, getCategory, getCategoryName } from "@/data/categories";
import { purposes, getPurposeName } from "@/data/purposes";
import {
  audienceTags,
  toolTypeTags,
  pricingTags as pricingTagDefs,
  statusTags as statusTagDefs,
  getTagName,
} from "@/data/tags";
import { recruitmentMeta } from "@/lib/recruitment";
import { ServiceGrid } from "@/components/ServiceGrid";
import { RecruitmentStatusFilter } from "@/components/recruitment/RecruitmentStatusFilter";

/**
 * サービス一覧の検索・絞り込み UI（セクション11）。
 * ローカルデータに対するフロント側フィルタリング。
 */
export function ServicesExplorer({
  allServices,
  allTags,
  initial,
}: {
  allServices: Service[];
  allTags: string[];
  initial?: Partial<FilterState>;
}) {
  const [state, setState] = useState<FilterState>({
    ...defaultFilterState,
    ...initial,
  });

  const results = useMemo(
    () => filterAndSortServices(allServices, state),
    [allServices, state]
  );

  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      // 大カテゴリを変えたら、詳細カテゴリの選択はリセット（不整合防止）
      if (key === "category") next.subCategory = "";
      return next;
    });
  }

  // 選択中の大カテゴリに紐づく詳細カテゴリ（未選択ならなし）
  const subCategoryOptions = state.category
    ? getCategory(state.category)?.subCategories ?? []
    : [];

  const isFiltered =
    state.keyword !== "" ||
    state.category !== "" ||
    state.subCategory !== "" ||
    state.purpose !== "" ||
    state.audience !== "" ||
    state.toolType !== "" ||
    state.pricingTag !== "" ||
    state.statusTag !== "" ||
    state.tag !== "" ||
    state.pricing !== "" ||
    state.status !== "" ||
    state.recruitment.length > 0 ||
    state.freeOnly ||
    state.aiOnly ||
    state.internalOnly;

  // 適用中の絞り込みチップ（個別解除用）
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (state.keyword)
    activeChips.push({ key: "kw", label: `「${state.keyword}」`, onRemove: () => update("keyword", "") });
  if (state.category)
    activeChips.push({ key: "cat", label: getCategoryName(state.category), onRemove: () => update("category", "") });
  if (state.subCategory)
    activeChips.push({ key: "sub", label: state.subCategory, onRemove: () => update("subCategory", "") });
  if (state.purpose)
    activeChips.push({ key: "pur", label: getPurposeName(state.purpose), onRemove: () => update("purpose", "") });
  if (state.audience)
    activeChips.push({ key: "aud", label: getTagName(state.audience), onRemove: () => update("audience", "") });
  if (state.toolType)
    activeChips.push({ key: "tt", label: getTagName(state.toolType), onRemove: () => update("toolType", "") });
  if (state.pricingTag)
    activeChips.push({ key: "pt", label: getTagName(state.pricingTag), onRemove: () => update("pricingTag", "") });
  if (state.statusTag)
    activeChips.push({ key: "st", label: getTagName(state.statusTag), onRemove: () => update("statusTag", "") });
  if (state.tag)
    activeChips.push({ key: "tag", label: `#${state.tag}`, onRemove: () => update("tag", "") });
  state.recruitment.forEach((r) =>
    activeChips.push({
      key: `rec-${r}`,
      label: recruitmentMeta[r].label,
      onRemove: () => update("recruitment", state.recruitment.filter((x) => x !== r)),
    })
  );
  if (state.freeOnly)
    activeChips.push({ key: "free", label: "無料のみ", onRemove: () => update("freeOnly", false) });
  if (state.aiOnly)
    activeChips.push({ key: "ai", label: "AI対応のみ", onRemove: () => update("aiOnly", false) });
  if (state.internalOnly)
    activeChips.push({ key: "internal", label: "AppPark内ミニツールのみ", onRemove: () => update("internalOnly", false) });

  return (
    <div className="space-y-6">
      <div className="card p-4 sm:p-5">
        {/* キーワード */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 103.4 9.8l3.15 3.15a1 1 0 001.4-1.42l-3.14-3.14A5.5 5.5 0 009 3.5zM5.5 9a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="search"
            value={state.keyword}
            onChange={(e) => update("keyword", e.target.value)}
            placeholder="キーワードで検索（サービス名・説明・タグ）"
            aria-label="キーワード検索"
            className="field-input pl-10"
          />
        </div>

        {/* セレクト類 */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="大カテゴリ"
            value={state.category}
            onChange={(v) => update("category", v)}
            options={[
              { value: "", label: "すべて" },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
          />
          <Select
            label="詳細カテゴリ"
            value={state.subCategory}
            disabled={subCategoryOptions.length === 0}
            onChange={(v) => update("subCategory", v)}
            options={[
              {
                value: "",
                label: state.category ? "すべて" : "まず大カテゴリを選択",
              },
              ...subCategoryOptions.map((s) => ({ value: s, label: s })),
            ]}
          />
          <Select
            label="目的"
            value={state.purpose}
            onChange={(v) => update("purpose", v)}
            options={[
              { value: "", label: "すべて" },
              ...purposes.map((p) => ({ value: p.slug, label: p.name })),
            ]}
          />
          <Select
            label="利用者・立場"
            value={state.audience}
            onChange={(v) => update("audience", v)}
            options={[
              { value: "", label: "すべて" },
              ...audienceTags.map((t) => ({ value: t.slug, label: t.name })),
            ]}
          />
          <Select
            label="ツール形式"
            value={state.toolType}
            onChange={(v) => update("toolType", v)}
            options={[
              { value: "", label: "すべて" },
              ...toolTypeTags.map((t) => ({ value: t.slug, label: t.name })),
            ]}
          />
          <Select
            label="料金形態"
            value={state.pricingTag}
            onChange={(v) => update("pricingTag", v)}
            options={[
              { value: "", label: "すべて" },
              ...pricingTagDefs.map((t) => ({ value: t.slug, label: t.name })),
            ]}
          />
          <Select
            label="運営状態"
            value={state.statusTag}
            onChange={(v) => update("statusTag", v)}
            options={[
              { value: "", label: "すべて" },
              ...statusTagDefs.map((t) => ({ value: t.slug, label: t.name })),
            ]}
          />
          <Select
            label="タグ"
            value={state.tag}
            onChange={(v) => update("tag", v)}
            options={[
              { value: "", label: "すべて" },
              ...allTags.map((t) => ({ value: t, label: `#${t}` })),
            ]}
          />
          <Select
            label="並び替え"
            value={state.sort}
            onChange={(v) => update("sort", v as SortKey)}
            options={sortOptions.map((o) => ({ value: o.key, label: o.label }))}
          />
        </div>

        {/* 募集・相談ステータスで絞り込み */}
        <div className="mt-3">
          <RecruitmentStatusFilter
            value={state.recruitment}
            onChange={(next: RecruitmentStatus[]) => update("recruitment", next)}
          />
        </div>

        {/* チェックボックス */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Toggle
            label="無料サービスだけ表示"
            checked={state.freeOnly}
            onChange={(v) => update("freeOnly", v)}
          />
          <Toggle
            label="AI対応だけ表示"
            checked={state.aiOnly}
            onChange={(v) => update("aiOnly", v)}
          />
          <Toggle
            label="AppPark内ミニツールだけ表示"
            checked={state.internalOnly}
            onChange={(v) => update("internalOnly", v)}
          />
          {isFiltered && (
            <button
              type="button"
              onClick={() => setState({ ...defaultFilterState })}
              className="ml-auto text-xs font-semibold text-ink-faint underline-offset-2 hover:text-brand-600 hover:underline"
            >
              条件をリセット
            </button>
          )}
        </div>
      </div>

      {/* 適用中の絞り込み（個別に解除できる） */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-faint">絞り込み中:</span>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/15 transition hover:bg-brand-100"
            >
              {chip.label}
              <span aria-hidden className="text-brand-400">
                ✕
              </span>
              <span className="sr-only">を解除</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-ink-soft">
        <span className="font-bold text-brand-800">{results.length}</span> 件のサービス
      </p>

      <ServiceGrid services={results} />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="field-input disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-ink-faint"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
      />
      {label}
    </label>
  );
}
