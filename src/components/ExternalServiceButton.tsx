"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * 外部サービスを開くボタン（セクション13-2）。
 * クリック時に「外部サービスへ移動する」ことがわかる確認を挟みます。
 * （閲覧者が、サイトの外へ出ることを理解できるようにする）
 *
 * クリック数は本番では計測する想定。MVPではローカルのカウント表示のデモのみ。
 */
export function ExternalServiceButton({
  url,
  serviceName,
  variant = "primary",
  children,
}: {
  url: string;
  serviceName: string;
  variant?: "primary" | "outline";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  let host = url;
  try {
    host = new URL(url).host;
  } catch {
    /* noop */
  }

  const cls = variant === "primary" ? "btn-primary w-full sm:w-auto" : "btn-outline w-full sm:w-auto";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cls}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ext-dialog-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-accent-600">
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M11 3a1 1 0 100 2h2.59l-6.3 6.29a1 1 0 101.42 1.42L15 6.41V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              <span className="text-xs font-bold">外部サービスへ移動します</span>
            </div>
            <h2 id="ext-dialog-title" className="mt-2 text-lg font-bold text-brand-900">
              「{serviceName}」を開きます
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              これから {siteConfig.name} の外にある外部サービス（
              <span className="font-semibold text-ink">{host}</span>
              ）を新しいタブで開きます。{siteConfig.name}は、リンク先の内容・安全性・利用規約について責任を負いません。利用前に、リンク先の利用規約・プライバシーポリシーをご確認ください。
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-outline"
              >
                キャンセル
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => setOpen(false)}
                className="btn-primary"
              >
                外部サービスを開く ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
