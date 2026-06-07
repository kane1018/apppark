import Link from "next/link";

/**
 * 汎用CTAセクション。投稿者向け・スポンサー向けの控えめな導線などに使用。
 */
export function CTASection({
  title,
  description,
  ctaLabel,
  ctaHref,
  tone = "brand",
}: {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  tone?: "brand" | "accent" | "muted";
}) {
  const styles = {
    brand: "bg-brand-800 text-white",
    accent: "bg-accent-500 text-white",
    muted: "bg-white text-ink ring-1 ring-inset ring-gray-200",
  }[tone];

  const btn =
    tone === "muted"
      ? "bg-brand-700 text-white hover:bg-brand-800"
      : "bg-white text-brand-800 hover:bg-gray-100";

  const desc = tone === "muted" ? "text-ink-soft" : "text-white/85";

  return (
    <section className={`overflow-hidden rounded-2xl ${styles}`}>
      <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
          <p className={`mt-1.5 text-sm ${desc}`}>{description}</p>
        </div>
        <Link
          href={ctaHref}
          className={`shrink-0 rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition ${btn}`}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
