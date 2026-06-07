"use client";

import Link from "next/link";
import { useState } from "react";
import { creatorNav, mainNav, siteConfig, subNav } from "@/config/site";
import { IconGlyph } from "@/components/icons";

/**
 * サイトヘッダー。
 * 主要ナビ（探す系）を中心に、投稿者・スポンサー向けの補助導線は
 * 目立たせすぎない位置（右側の小さなリンク）に置いています（セクション5・10）。
 */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2" aria-label={`${siteConfig.name} トップ`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
            <IconGlyph name={siteConfig.logoIcon} size={18} strokeWidth={2.1} />
          </span>
          <span className="text-lg font-black tracking-tight text-brand-800">
            {siteConfig.name}
          </span>
          {siteConfig.isBeta && (
            <span className="rounded bg-accent-100 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-accent-700 ring-1 ring-inset ring-accent-600/30">
              {siteConfig.betaLabel}
            </span>
          )}
        </Link>

        {/* PC ナビ */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビ">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-gray-100 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右側：補助導線（控えめ） */}
        <div className="hidden items-center gap-2 md:flex">
          {subNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-faint transition hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/services" className="btn-primary px-4 py-2">
            サービスを探す
          </Link>
        </div>

        {/* モバイルメニューボタン */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-soft hover:bg-gray-100 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="メニューを開閉"
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div id="mobile-menu" className="border-t border-gray-200 bg-white md:hidden">
          <nav className="container-content flex flex-col gap-1 py-3" aria-label="モバイルナビ">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-gray-100" />
            <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
              Webサービスを作った方・スポンサーの方へ
            </p>
            {creatorNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              サービスを探す
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
