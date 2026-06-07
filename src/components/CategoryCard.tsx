import Link from "next/link";
import type { Category } from "@/types";
import { IconBadge } from "@/components/icons";

/**
 * カテゴリカード（トップ・カテゴリ一覧で使用）。
 */
export function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count?: number;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card group flex items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
    >
      <IconBadge name={category.icon} tone="navy" size="md" />
      <div className="min-w-0">
        <h3 className="flex items-center gap-1 font-bold text-brand-900">
          {category.name}
          <span className="text-brand-400 transition group-hover:translate-x-0.5">→</span>
        </h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">
          {category.description}
        </p>
        {typeof count === "number" && (
          <p className="mt-1 text-[11px] font-semibold text-ink-faint">
            {count}件のサービス
          </p>
        )}
      </div>
    </Link>
  );
}
