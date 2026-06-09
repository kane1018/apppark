"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { creatorNav, mainNav, siteConfig } from "@/config/site";
import { IconGlyph } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * サイトヘッダー。
 * 右上にログイン状態を表示（未ログイン：ログイン／掲載申請、
 * ログイン済み：公開表示名・マイページ・掲載申請・ログアウト）。
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const loginHref = `/login?next=${encodeURIComponent(pathname || "/")}`;
  const initial = user?.displayName?.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2" aria-label={`${siteConfig.name} トップ`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
            <IconGlyph name={siteConfig.logoIcon} size={18} strokeWidth={2.1} />
          </span>
          <span className="text-lg font-black tracking-tight text-brand-800">{siteConfig.name}</span>
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

        {/* 右側：ログイン状態 */}
        <div className="hidden items-center gap-2 md:flex">
          {!loading &&
            (user ? (
              <>
                <Link
                  href="/mypage"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-700 transition hover:bg-gray-100"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {initial}
                  </span>
                  <span className="max-w-[8rem] truncate">{user.displayName}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-faint transition hover:text-brand-700"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link href={loginHref} className="btn-primary px-4 py-2">
                ログイン
              </Link>
            ))}
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
            {/* ログイン状態 */}
            {!loading &&
              (user ? (
                <div className="mb-1 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <Link
                    href="/mypage"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-sm font-bold text-brand-800"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {initial}
                    </span>
                    {user.displayName}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="text-xs font-semibold text-ink-faint hover:text-brand-700"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <Link href={loginHref} onClick={() => setOpen(false)} className="btn-primary mb-1">
                  ログイン
                </Link>
              ))}

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
            {user && (
              <Link
                href="/mypage"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-gray-100"
              >
                マイページ
              </Link>
            )}

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
          </nav>
        </div>
      )}
    </header>
  );
}
