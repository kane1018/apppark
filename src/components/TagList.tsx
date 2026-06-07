import Link from "next/link";

/**
 * タグの一覧表示。href を渡すとリンクになり、一覧の絞り込みに使えます。
 */
export function TagList({
  tags,
  linkToSearch = false,
  size = "sm",
}: {
  tags: string[];
  linkToSearch?: boolean;
  size?: "sm" | "xs";
}) {
  if (tags.length === 0) return null;
  const sizeCls = size === "xs" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs";

  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const cls = `inline-flex items-center rounded-md bg-gray-100 ${sizeCls} font-medium text-ink-soft`;
        return (
          <li key={tag}>
            {linkToSearch ? (
              <Link
                href={`/services?tag=${encodeURIComponent(tag)}`}
                className={`${cls} transition hover:bg-brand-50 hover:text-brand-700`}
              >
                #{tag}
              </Link>
            ) : (
              <span className={cls}>#{tag}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
