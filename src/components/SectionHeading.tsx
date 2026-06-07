import Link from "next/link";

/**
 * セクション見出し（任意で「もっと見る」リンク付き）。
 */
export function SectionHeading({
  title,
  description,
  moreHref,
  moreLabel = "もっと見る",
  as = "h2",
}: {
  title: string;
  description?: string;
  moreHref?: string;
  moreLabel?: string;
  as?: "h2" | "h3";
}) {
  const Tag = as;
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <Tag className="section-title">{title}</Tag>
        {description && (
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        )}
      </div>
      {moreHref && (
        <Link
          href={moreHref}
          className="shrink-0 whitespace-nowrap text-sm font-bold text-brand-600 transition hover:text-brand-800"
        >
          {moreLabel} →
        </Link>
      )}
    </div>
  );
}
