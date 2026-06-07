"use client";

import { useEffect, useState } from "react";

/**
 * サービスのスクリーンショット等を並べるギャラリー（詳細ページ）。
 * - 各画像は 16:9・object-cover・角丸で表示（width/height 指定でCLS対策）
 * - クリックで拡大（ライトボックス）。Esc/ 背景クリックで閉じる
 * - 読み込めない画像はその枠だけプレースホルダに置き換え（レイアウトは崩れません）
 * - alt にサービス名を含めます
 */
export function ServiceGallery({
  images,
  serviceName,
}: {
  images: string[];
  serviceName: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {images.map((src, i) => (
          <li key={`${src}-${i}`}>
            <GalleryImage
              src={src}
              alt={`${serviceName} のスクリーンショット ${i + 1}`}
              onOpen={() => setActive(i)}
            />
          </li>
        ))}
      </ul>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${serviceName} のスクリーンショット（拡大）`}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="閉じる"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`${serviceName} のスクリーンショット ${active + 1}（拡大）`}
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function GalleryImage({
  src,
  alt,
  onOpen,
}: {
  src: string;
  alt: string;
  onOpen: () => void;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-xs text-ink-faint">
        画像を読み込めませんでした
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-xl border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      aria-label={`${alt} を拡大表示`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1280}
        height={720}
        loading="lazy"
        onError={() => setErrored(true)}
        className="aspect-[16/9] w-full bg-gray-100 object-cover transition group-hover:scale-[1.02]"
      />
      <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
        クリックで拡大
      </span>
    </button>
  );
}
