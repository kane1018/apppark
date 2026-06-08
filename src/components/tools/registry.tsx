import type { ComponentType } from "react";
import { CharCountTool } from "./CharCountTool";
import { ImageCompressTool } from "./ImageCompressTool";
import { PasswordGeneratorTool } from "./PasswordGeneratorTool";
import { PriceCalcTool } from "./PriceCalcTool";
import { ColorConverterTool } from "./ColorConverterTool";
import { PomodoroTimerTool } from "./PomodoroTimerTool";

/**
 * 運営作成ツールの実体（slug → コンポーネント）。
 * services.ts の url "/tools/<slug>" と対応します。
 */
export const toolRegistry: Record<string, ComponentType> = {
  "char-count": CharCountTool,
  "image-compress": ImageCompressTool,
  "password-generator": PasswordGeneratorTool,
  "price-calc": PriceCalcTool,
  "color-converter": ColorConverterTool,
  "pomodoro-timer": PomodoroTimerTool,
};
