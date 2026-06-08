"use client";

import { useEffect, useRef, useState } from "react";

/** ポモドーロタイマー（25分集中 / 5分休憩） */
const FOCUS = 25 * 60;
const BREAK = 5 * 60;

export function PomodoroTimerTool() {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [remaining, setRemaining] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // セッション終了
          beep();
          const nextMode = mode === "focus" ? "break" : "focus";
          if (mode === "focus") setCycles((c) => c + 1);
          setMode(nextMode);
          return nextMode === "focus" ? FOCUS : BREAK;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  function reset() {
    setRunning(false);
    setMode("focus");
    setRemaining(FOCUS);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const total = mode === "focus" ? FOCUS : BREAK;
  const progress = ((total - remaining) / total) * 100;

  return (
    <div className="space-y-6">
      <div
        className={`rounded-2xl p-8 text-center ${
          mode === "focus" ? "bg-brand-800 text-white" : "bg-emerald-600 text-white"
        }`}
      >
        <p className="text-sm font-bold uppercase tracking-wide opacity-90">
          {mode === "focus" ? "集中タイム" : "休憩タイム"}
        </p>
        <p className="mt-2 font-mono text-6xl font-black tabular-nums sm:text-7xl">
          {mm}:{ss}
        </p>
        <div className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/20">
          <div className="h-full bg-white/80 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => setRunning((v) => !v)} className="btn-primary">
          {running ? "一時停止" : "スタート"}
        </button>
        <button type="button" onClick={reset} className="btn-outline">
          リセット
        </button>
      </div>

      <p className="text-center text-sm text-ink-faint">
        完了した集中セッション：<span className="font-bold text-ink">{cycles}</span> 回
      </p>
      <p className="text-center text-xs text-ink-faint">
        ※ タブを閉じるとカウントはリセットされます。
      </p>
    </div>
  );
}

function beep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    /* 音が出せない環境では無視 */
  }
}
