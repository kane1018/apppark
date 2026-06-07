"use client";

import { useState } from "react";

/**
 * サービスのスクリーンショット等を並べるギャラリー（詳細ページ）。
 * - 各画像は 16:9・object-cover・角丸で表示
 * - 読み込めない画像はその枠だけプレースホルダに置き換え（レイアウトは崩れません）
 * - alt にサービス名を含めます
 *
 * 将来の拡張（アップロード／並び替え／管理者削除）にも、この配列を差し替えるだけで対応できます。
 */
export function ServiceGallery({
  images,
  serviceName,
}: {
  images: string[];
  serviceName: string;
}) {
  if (!images || images.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {images.map((src, i) => (
        <li key={`${src}-${i}`}>
          <GalleryImage src={src} alt={`${serviceName} のスクリーンショット ${i + 1}`} />
        </li>
      ))}
    </ul>
  );
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-xs text-ink-faint">
        画像を読み込めませんでした
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className="aspect-[16/9] w-full rounded-xl border border-gray-200 bg-gray-100 object-cover"
    />
  );
}
