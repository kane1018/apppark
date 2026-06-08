"use client";

import { useState } from "react";

/** 画像圧縮・リサイズ（Canvasでブラウザ内処理。アップロードしない） */
function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function ImageCompressTool() {
  const [origin, setOrigin] = useState<{ name: string; size: number; url: string } | null>(null);
  const [result, setResult] = useState<{ size: number; url: string } | null>(null);
  const [maxWidth, setMaxWidth] = useState(1600);
  const [quality, setQuality] = useState(0.7);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function process(file: File, mw: number, q: number) {
    setError("");
    setBusy(true);
    try {
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      const scale = Math.min(1, mw / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas未対応");
      ctx.drawImage(img, 0, 0, w, h);
      const blob: Blob | null = await new Promise((res) =>
        canvas.toBlob((b) => res(b), "image/jpeg", q)
      );
      if (!blob) throw new Error("変換に失敗しました");
      setOrigin({ name: file.name, size: file.size, url });
      setResult({ size: blob.size, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError("この画像を処理できませんでした。別の画像でお試しください。");
    } finally {
      setBusy(false);
    }
  }

  function onFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選んでください。");
      return;
    }
    process(file, maxWidth, quality);
  }

  return (
    <div className="space-y-5">
      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-brand-400"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFile(e.dataTransfer.files?.[0]);
        }}
      >
        <span className="text-sm font-bold text-ink">画像を選ぶ / ドラッグ＆ドロップ</span>
        <span className="mt-1 text-xs text-ink-faint">JPEG・PNG・WebP（端末内で処理し、アップロードしません）</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">最大幅：{maxWidth}px</span>
          <input
            type="range"
            min={320}
            max={3000}
            step={20}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-full accent-accent-500"
          />
        </label>
        <label className="block">
          <span className="field-label">画質：{Math.round(quality * 100)}%</span>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-accent-500"
          />
        </label>
      </div>

      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {busy && <p className="text-sm text-ink-faint">処理中…</p>}

      {origin && result && !busy && (
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-xl bg-gray-50 px-3 py-3">
              <p className="text-xs text-ink-faint">変換前</p>
              <p className="mt-1 font-bold text-ink">{formatBytes(origin.size)}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-3">
              <p className="text-xs text-emerald-700">変換後</p>
              <p className="mt-1 font-bold text-emerald-800">
                {formatBytes(result.size)}
                <span className="ml-1 text-xs font-semibold">
                  （-{Math.max(0, Math.round((1 - result.size / origin.size) * 100))}%）
                </span>
              </p>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.url} alt="圧縮後のプレビュー" className="max-h-72 w-full rounded-xl object-contain" />
          <a
            href={result.url}
            download={`compressed-${origin.name.replace(/\.[^.]+$/, "")}.jpg`}
            className="btn-primary w-full sm:w-auto"
          >
            圧縮した画像をダウンロード
          </a>
        </div>
      )}
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
