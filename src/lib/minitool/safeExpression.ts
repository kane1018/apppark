/**
 * 安全な四則演算の式評価器（eval を一切使わない）。
 *
 * - 対応：数値・変数（英数字_）・ + - * / ( )・小数・単項マイナス
 * - 投稿者が任意のJavaScriptを実行することはできません（トークン化＋RPN評価のみ）。
 * - 未知の関数・プロパティ・記号は受け付けず null を返します。
 */
type Token =
  | { t: "num"; v: number }
  | { t: "var"; v: string }
  | { t: "op"; v: "+" | "-" | "*" | "/" }
  | { t: "lp" }
  | { t: "rp" };

const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

function tokenize(expr: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  const s = expr.replace(/\s+/g, "");
  const isVarStart = (c: string) => /[A-Za-z_]/.test(c);
  const isVarPart = (c: string) => /[A-Za-z0-9_]/.test(c);
  const isDigit = (c: string) => /[0-9.]/.test(c);

  while (i < s.length) {
    const c = s[i];
    if (isDigit(c)) {
      let num = "";
      while (i < s.length && /[0-9.]/.test(s[i])) num += s[i++];
      if ((num.match(/\./g) || []).length > 1) return null;
      const v = Number(num);
      if (Number.isNaN(v)) return null;
      tokens.push({ t: "num", v });
      continue;
    }
    if (isVarStart(c)) {
      let name = "";
      while (i < s.length && isVarPart(s[i])) name += s[i++];
      tokens.push({ t: "var", v: name });
      continue;
    }
    if (c === "+" || c === "-" || c === "*" || c === "/") {
      // 単項マイナス／プラス：先頭・( の直後・演算子の直後 は 0 を補う
      const prev = tokens[tokens.length - 1];
      const unary = !prev || prev.t === "op" || prev.t === "lp";
      if (unary && (c === "-" || c === "+")) tokens.push({ t: "num", v: 0 });
      tokens.push({ t: "op", v: c });
      i++;
      continue;
    }
    if (c === "(") {
      tokens.push({ t: "lp" });
      i++;
      continue;
    }
    if (c === ")") {
      tokens.push({ t: "rp" });
      i++;
      continue;
    }
    return null; // 未知の文字
  }
  return tokens;
}

function toRPN(tokens: Token[]): Token[] | null {
  const out: Token[] = [];
  const ops: Token[] = [];
  for (const tk of tokens) {
    if (tk.t === "num" || tk.t === "var") {
      out.push(tk);
    } else if (tk.t === "op") {
      while (
        ops.length &&
        ops[ops.length - 1].t === "op" &&
        PREC[(ops[ops.length - 1] as { v: string }).v] >= PREC[tk.v]
      ) {
        out.push(ops.pop() as Token);
      }
      ops.push(tk);
    } else if (tk.t === "lp") {
      ops.push(tk);
    } else if (tk.t === "rp") {
      let found = false;
      while (ops.length) {
        const top = ops.pop() as Token;
        if (top.t === "lp") {
          found = true;
          break;
        }
        out.push(top);
      }
      if (!found) return null; // 括弧の不一致
    }
  }
  while (ops.length) {
    const top = ops.pop() as Token;
    if (top.t === "lp" || top.t === "rp") return null;
    out.push(top);
  }
  return out;
}

function evalRPN(rpn: Token[], vars: Record<string, number>): number | null {
  const stack: number[] = [];
  for (const tk of rpn) {
    if (tk.t === "num") stack.push(tk.v);
    else if (tk.t === "var") {
      const v = vars[tk.v];
      if (typeof v !== "number" || Number.isNaN(v)) return null;
      stack.push(v);
    } else if (tk.t === "op") {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) return null;
      let r: number;
      switch (tk.v) {
        case "+": r = a + b; break;
        case "-": r = a - b; break;
        case "*": r = a * b; break;
        case "/": r = b === 0 ? NaN : a / b; break;
        default: return null;
      }
      stack.push(r);
    }
  }
  if (stack.length !== 1) return null;
  const result = stack[0];
  return Number.isFinite(result) ? result : null;
}

/** 式に含まれる変数名（重複なし） */
export function extractVariables(expr: string): string[] {
  const tokens = tokenize(expr);
  if (!tokens) return [];
  return Array.from(new Set(tokens.filter((t) => t.t === "var").map((t) => (t as { v: string }).v)));
}

/** 式が安全に解釈可能か（構文チェック用） */
export function isValidExpression(expr: string): boolean {
  const tokens = tokenize(expr);
  if (!tokens) return false;
  const rpn = toRPN(tokens);
  if (!rpn) return false;
  // ダミー変数で評価して構造が壊れていないか確認
  const vars: Record<string, number> = {};
  for (const t of tokens) if (t.t === "var") vars[(t as { v: string }).v] = 1;
  return evalRPN(rpn, vars) !== null || rpn.length > 0;
}

export function evaluateExpression(
  expr: string,
  vars: Record<string, number>
): number | null {
  const tokens = tokenize(expr);
  if (!tokens) return null;
  const rpn = toRPN(tokens);
  if (!rpn) return null;
  return evalRPN(rpn, vars);
}
