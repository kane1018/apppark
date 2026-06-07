import type { Service } from "@/types";
import { ServiceCard } from "@/components/ServiceCard";

/**
 * サービスカードのグリッド表示。
 */
export function ServiceGrid({
  services,
  emptyMessage = "条件に合うサービスが見つかりませんでした。",
}: {
  services: Service[];
  emptyMessage?: string;
}) {
  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-sm text-ink-faint">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
