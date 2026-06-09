/**
 * SEO用の本文・FAQ・注意文の自動生成。
 * 個別に文章を持たないページでも、検索エンジンと利用者に役立つ
 * 自然な説明文・FAQ・内部リンク文脈を提供します（キーワードの詰め込みはしません）。
 */
import type { Category, Purpose, Service } from "@/types";
import type { FaqItem } from "@/components/FaqSection";

/** AppPark内で使えるミニツールか */
function isInPageTool(s: Service): boolean {
  return s.isInternalMiniTool;
}

/* ---------------- 専門家確認の注意文（法務・お金・健康） ---------------- */
const CAUTION_SUBCATEGORIES = [
  "健康管理",
  "確定申告準備",
  "税金計算",
  "相続",
  "契約書チェック",
  "契約書作成補助",
];

export const PROFESSIONAL_CAUTION =
  "このツールは一般的な情報整理・確認補助を目的としたものです。法律、税務、医療、金融等に関する具体的な判断は、専門家または公的機関の情報をご確認ください。";

export function needsProfessionalCaution(
  category: string,
  subCategories: string[] = []
): boolean {
  if (["legal", "finance"].includes(category)) return true;
  return subCategories.some((s) => CAUTION_SUBCATEGORIES.includes(s));
}

/* ---------------- サービス（個別ツール） ---------------- */

export function serviceSeoTitle(s: Service): string {
  const tail = isInPageTool(s)
    ? "無料・登録不要で使えるWebツール"
    : s.shortDescription.replace(/[。．.]$/, "");
  return `${s.name}｜${tail}`;
}

export function serviceSeoDescription(s: Service): string {
  if (isInPageTool(s)) {
    return `${s.shortDescription} AppParkのページ内で、登録不要・インストール不要・無料で使えるミニツールです。`;
  }
  return s.shortDescription;
}

/** ミニツール向けのSEOリード文（自然にキーワードを含める） */
export function internalToolLead(s: Service): string {
  return `${s.name}は、ブラウザで使える無料Webツールです。インストール不要・登録不要で、AppParkのページ内からすぐに利用できます。`;
}

/** サービスFAQ（指定があればそれ、なければ一般FAQを自動生成） */
export function serviceFaq(s: Service): FaqItem[] {
  if (s.faq && s.faq.length > 0) return s.faq;
  const items: FaqItem[] = [
    {
      q: "無料で使えますか？",
      a:
        s.pricing === "free"
          ? "はい、無料で利用できます。"
          : "料金は提供元の情報をご確認ください。",
    },
  ];
  if (isInPageTool(s)) {
    items.push({
      q: "登録やインストールは必要ですか？",
      a: "登録・インストールは不要です。AppParkのページ内から、ブラウザですぐに使えます。",
    });
    items.push({
      q: "入力した内容は保存されますか？",
      a: "AppPark内（ブラウザ上）で処理し、入力内容を外部に送信・保存しない設計です。",
    });
  }
  items.push({
    q: "スマホでも使えますか？",
    a: "はい、スマホのブラウザからも利用できます。",
  });
  return items;
}

/* ---------------- カテゴリ ---------------- */

export function categorySeoLead(c: Category): string {
  const subs = (c.subCategories ?? []).slice(0, 6).join("、");
  return `${c.name}カテゴリでは、${subs}など、${c.name}に役立つWebサービス・便利ツールを掲載しています。無料で使えるツールや、AppPark内ですぐ使えるミニツールも探せます。`;
}

export function categoryFaq(c: Category): FaqItem[] {
  const subs = (c.subCategories ?? []).slice(0, 8).join("、");
  return [
    {
      q: `${c.name}のツールは無料で使えますか？`,
      a: "無料で使えるツールを中心に掲載しています。各ツールの料金は詳細ページでご確認ください。",
    },
    {
      q: "登録やインストールは必要ですか？",
      a: "AppPark内ミニツールは登録・インストール不要で、ブラウザのページ内からすぐに使えます。",
    },
    {
      q: `${c.name}にはどんなツールがありますか？`,
      a: `${subs}など、目的に合わせて探せます。`,
    },
  ];
}

/* ---------------- 目的タグ ---------------- */

export function purposeSeoTitle(p: Purpose): string {
  return `${p.name}人向けのWebツール一覧`;
}

export function purposeSeoDescription(p: Purpose): string {
  return `${p.name}人向けのWebサービス・便利ツールをAppParkで探せます。${p.description} 無料で使えるツールや、AppPark内ですぐ使えるミニツールも掲載しています。`;
}

export function purposeSeoLead(p: Purpose): string {
  return `「${p.name}」場面で使えるWebサービスやミニツールをまとめています。無料で使えるツールや、AppPark内ですぐ使えるテンプレート・診断・計算などのミニツールも掲載しています。`;
}

export function purposeFaq(p: Purpose): FaqItem[] {
  return [
    {
      q: "このページのツールは無料で使えますか？",
      a: "無料で使えるツールを中心に掲載しています。各ツールの料金は詳細ページでご確認ください。",
    },
    {
      q: "登録なしで使えますか？",
      a: "AppPark内ミニツールは登録・インストール不要で、ブラウザからすぐに使えます。",
    },
    {
      q: `${p.name}ときは、どんなツールを選べばいいですか？`,
      a: "目的タグやカテゴリで絞り込み、各ツールの「できること」「使い方」を確認して選べます。",
    },
  ];
}
