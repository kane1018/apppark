import Link from "next/link";
import type { Service } from "@/types";
import { getCategoryName } from "@/data/categories";
import { PricingBadge } from "@/components/badges";
import { Thumbnail } from "@/components/Thumbnail";

/**
 * 類似サービス（セクション13-10）。同じカテゴリ or 目的タグのサービスを表示。
 */
export function SimilarServices({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <p className="text-sm text-ink-faint">
        現在、類似サービスは見つかりませんでした。
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {services.map((s) => (
        <li key={s.id}>
          <Link
            href={`/services/${s.slug}`}
            className="card group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <Thumbnail service={s} />
            <div className="space-y-1.5 p-3">
              <div className="flex items-center gap-1.5">
                <PricingBadge pricing={s.pricing} />
                <span className="text-[11px] text-ink-faint">
                  {getCategoryName(s.category)}
                </span>
              </div>
              <h3 className="text-sm font-bold text-brand-900 group-hover:text-brand-600">
                {s.name}
              </h3>
              <p className="line-clamp-2 text-xs text-ink-soft">
                {s.shortDescription}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
