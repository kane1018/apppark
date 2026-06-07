import Link from "next/link";
import type { Crumb } from "@/lib/seo";

/**
 * パンくずリスト（セクション22）。
 * 構造化データ（BreadcrumbList）は各ページ側で別途出力します。
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="パンくず" className="text-xs text-ink-faint">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="font-semibold text-ink-soft" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition hover:text-brand-600">
                    {item.name}
                  </Link>
                  <span aria-hidden className="text-gray-300">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
