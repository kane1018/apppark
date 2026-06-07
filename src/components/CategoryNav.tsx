import Link from "next/link";
import { categories } from "@/data/categories";
import { IconGlyph } from "@/components/icons";

/**
 * カテゴリの横断ナビ（一覧・カテゴリページ上部で使用）。
 * activeSlug を渡すと現在のカテゴリを強調します。
 */
export function CategoryNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav aria-label="カテゴリ" className="flex flex-wrap gap-2">
      <Link
        href="/categories"
        className={chipClass(!activeSlug)}
      >
        すべて
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/categories/${c.slug}`}
          className={chipClass(activeSlug === c.slug)}
        >
          <IconGlyph name={c.icon} size={15} />
          {c.name}
        </Link>
      ))}
    </nav>
  );
}

function chipClass(active: boolean): string {
  return [
    "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition",
    active
      ? "bg-brand-700 text-white"
      : "bg-white text-ink-soft ring-1 ring-inset ring-gray-200 hover:bg-brand-50 hover:text-brand-700",
  ].join(" ");
}
