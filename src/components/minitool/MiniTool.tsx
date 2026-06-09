"use client";

import type {
  CalculatorConfig,
  ChecklistConfig,
  DiagnosisConfig,
  MiniToolConfig,
  MiniToolType,
  TemplateConfig,
  TextTransformConfig,
} from "@/lib/minitool/types";
import { DiagnosisTool } from "@/components/minitool/DiagnosisTool";
import { CalculatorTool } from "@/components/minitool/CalculatorTool";
import { TemplateTool } from "@/components/minitool/TemplateTool";
import { ChecklistTool } from "@/components/minitool/ChecklistTool";
import { TextTransformTool } from "@/components/minitool/TextTransformTool";

/**
 * AppPark内ミニツールの描画ディスパッチャ。
 * 設定（config）からUIを描画するだけで、投稿者のコードは実行しません。
 */
export function MiniTool({
  type,
  config,
  storageKey,
}: {
  type: MiniToolType;
  config: MiniToolConfig | null;
  storageKey: string;
}) {
  if (!config || type === "none") {
    return <p className="text-sm text-ink-faint">このミニツールは準備中です。</p>;
  }
  switch (type) {
    case "diagnosis":
      return <DiagnosisTool config={config as DiagnosisConfig} />;
    case "calculator":
      return <CalculatorTool config={config as CalculatorConfig} />;
    case "template_generator":
      return <TemplateTool config={config as TemplateConfig} />;
    case "checklist":
      return <ChecklistTool config={config as ChecklistConfig} storageKey={storageKey} />;
    case "text_transform":
      return <TextTransformTool config={config as TextTransformConfig} />;
    default:
      return null;
  }
}
