import { sponsorPlans } from "@/data/sponsor";

/**
 * スポンサー仮料金表（セクション16-4）。
 */
export function SponsorPricingTable() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sponsorPlans.map((plan) => {
          const isNumeric = /^\d/.test(plan.price);
          return (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-5 shadow-card ${
                plan.upcoming
                  ? "border-dashed border-gray-300 bg-gray-50/60"
                  : plan.highlight
                    ? "border-accent-300 bg-accent-50/50 ring-1 ring-accent-200"
                    : "border-gray-200 bg-white"
              }`}
            >
              {plan.upcoming ? (
                <span className="mb-2 inline-flex w-fit items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
                  将来プラン
                </span>
              ) : plan.highlight ? (
                <span className="mb-2 inline-flex w-fit items-center rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  おすすめ
                </span>
              ) : null}
              <h3 className="text-sm font-bold text-brand-900">{plan.name}</h3>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-brand-800">
                  {isNumeric ? `¥${plan.price}` : plan.price}
                </span>
                <span className="text-xs text-ink-faint">（{plan.unit}）</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                {plan.description}
              </p>
            </div>
          );
        })}
      </div>
      <p className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-ink-faint">
        ※ 上記はすべて<strong className="font-bold text-ink-soft">仮料金</strong>です。β版のため、料金・枠は要相談。
        いまは<strong className="font-bold text-accent-700">初期掲載パートナー</strong>を募集しています（特別条件をご相談ください）。
      </p>
    </div>
  );
}
