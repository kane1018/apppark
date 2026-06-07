import Link from "next/link";
import { purposes } from "@/data/purposes";
import { IconGlyph } from "@/components/icons";

/**
 * 目的の横断ナビ（目的ページ上部で使用）。
 */
export function PurposeNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav aria-label="目的" className="flex flex-wrap gap-2">
      <Link href="/purposes" className={chipClass(!activeSlug)}>
        すべて
      </Link>
      {purposes.map((p) => (
        <Link
          key={p.slug}
          href={`/purposes/${p.slug}`}
          className={chipClass(activeSlug === p.slug)}
        >
          <IconGlyph name={p.icon} size={15} />
          {p.name}
        </Link>
      ))}
    </nav>
  );
}

function chipClass(active: boolean): string {
  return [
    "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition",
    active
      ? "bg-accent-500 text-white"
      : "bg-white text-ink-soft ring-1 ring-inset ring-gray-200 hover:bg-accent-50 hover:text-accent-700",
  ].join(" ");
}
