import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { copyrightYears } from "@/lib/seo";
import { IconGlyph } from "@/components/icons";

/**
 * サイトフッター。リンク群とコピーライトは config/site.ts を参照（一元管理）。
 */
export function Footer() {
  const groups = Object.values(footerNav);

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-content py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* ブランド */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
                <IconGlyph name={siteConfig.logoIcon} size={18} strokeWidth={2.1} />
              </span>
              <span className="text-lg font-black text-brand-800">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              面白い・便利なWebサービスを探せて、ノーコードで自分のミニツールも作れる、ユーザー投稿型の発見サイトです。
            </p>
          </div>

          {/* リンク群 */}
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-bold text-brand-800">{group.title}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-ink-soft transition hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-gray-100 pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {copyrightYears()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            掲載サービスは各提供者によるものです。{siteConfig.name}は内容・安全性を保証しません。
          </p>
        </div>
      </div>
    </footer>
  );
}
