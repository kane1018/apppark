import type { TransformOp } from "@/lib/minitool/types";

/** ルールベースの文章変換（AIは使わない）。順番に適用。 */
export function applyTransforms(input: string, ops: TransformOp[]): string {
  let text = input;
  for (const op of ops) {
    switch (op) {
      case "trim_lines":
        text = text
          .split(/\r\n|\r|\n/)
          .map((l) => l.trim())
          .join("\n");
        break;
      case "remove_blank_lines":
        text = text
          .split(/\r\n|\r|\n/)
          .filter((l) => l.trim() !== "")
          .join("\n");
        break;
      case "collapse_spaces":
        text = text.replace(/[ \t]{2,}/g, " ");
        break;
      case "to_bullets":
        text = text
          .split(/\r\n|\r|\n/)
          .map((l) => (l.trim() === "" ? l : l.replace(/^(\s*)(・|-|\*|●|◦)?\s*/, "$1・")))
          .join("\n");
        break;
      case "remove_bullets":
        text = text
          .split(/\r\n|\r|\n/)
          .map((l) => l.replace(/^(\s*)(・|-|\*|●|◦|\d+[.)])\s*/, "$1"))
          .join("\n");
        break;
      case "normalize_width":
        text = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
          String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
        );
        break;
      case "fullwidth_space_to_half":
        text = text.replace(/　/g, " ");
        break;
    }
  }
  return text;
}
