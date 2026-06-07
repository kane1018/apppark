"use client";

import { useState } from "react";
import { getCategory } from "@/data/categories";
import type { Service } from "@/types";
import { IconGlyph } from "@/components/icons";

/**
 * サービスのサムネイル（メイン画像）。
 *
 * - service.thumbnailUrl があれば <img> を 16:9・object-cover・角丸で表示
 * - 画像が読み込めない場合（onError）や URL が無い場合は、カテゴリアイコン＋
 *   グラデーションのプレースホルダにフォールバック（レイアウトは崩れません）
 * - alt は imageAlt があればそれを、無ければサービス名から自動生成
 */
const gradients = [
  "from-brand-500 to-brand-700",
  "from-sky-500 to-brand-600",
  "from-emerald-500 to-teal-700",
  "from-accent-400 to-accent-600",
  "from-violet-500 to-brand-700",
  "from-rose-400 to-accent-500",
  "from-teal-500 to-brand-600",
  "from-amber-400 to-accent-600",
];

function hashIndex(str: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 100000;
  }
  return h % mod;
}

export function Thumbnail({
  service,
  className = "",
  rounded = "rounded-t-2xl",
}: {
  service: Service;
  className?: string;
  rounded?: string;
}) {
  const [errored, setErrored] = useState(false);
  const alt = service.imageAlt || `${service.name}のサムネイル`;

  if (service.thumbnailUrl && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={service.thumbnailUrl}
        alt={alt}
        width={1280}
        height={720}
        className={`aspect-[16/9] w-full bg-gray-100 object-cover ${rounded} ${className}`}
        loading="lazy"
        onError={() => setErrored(true)}
      />
    );
  }

  return <ThumbnailPlaceholder service={service} className={className} rounded={rounded} />;
}

/** 画像が無い／読み込めないときのプレースホルダ */
function ThumbnailPlaceholder({
  service,
  className = "",
  rounded = "rounded-t-2xl",
}: {
  service: Service;
  className?: string;
  rounded?: string;
}) {
  const icon = getCategory(service.category)?.icon ?? "layout-template";
  const gradient = gradients[hashIndex(service.slug, gradients.length)];
  return (
    <div
      className={`relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${rounded} ${className}`}
      role="img"
      aria-label={`${service.name}のサムネイル（イメージ）`}
    >
      <IconGlyph name={icon} size={56} strokeWidth={1.6} className="text-white/95 drop-shadow-sm" />
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
    </div>
  );
}
