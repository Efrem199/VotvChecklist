import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/lib/language";

export interface OverallStats {
  tasksDone: number;
  tasksTotal: number;
  locsComplete: number;
  locsTotal: number;
  visited: number;
  cameras: number;
  servers: number;
  dishes: number;
}

interface Props {
  day: number;
  onDay: (n: number) => void;
  sound: boolean;
  onToggleSound: () => void;
  stats: OverallStats;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Header({ day, onDay, sound, onToggleSound, stats, onExport, onImport, onReset }: Props) {
  const { language } = useLanguage();
  const en = language === 'en';
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  const fileRef = useRef<HTMLInputElement>(null);
  const pct = stats.tasksTotal ? Math.round((stats.tasksDone / stats.tasksTotal) * 100) : 0;
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const creepy = hh === "03" && mm === "33";
  const bars = 28;
  const filled = Math.round((pct / 100) * bars);

  return (
    <header className="panel corner relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 noise" aria-hidden />
      <div className="relative grid gap-5 px-5 py-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="min-w-0">
          <p className="panel-title animate-flicker">
            Alpen Signal Observatorium · Dunkeltaler Forest · Alpha Root Base
          </p>
          <h1 className="glow mt-2 font-pixel text-xl leading-relaxed text-phos-300 sm:text-2xl md:text-3xl">
            {en ? "FIELD JOURNAL" : "ЖУРНАЛ ОБХОДА"}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-wider">
            <span className="text-phos-400">
              {en ? "Progress" : "Прогресс"} <span className="font-bold text-phos-300">{pct}%</span>
            </span>
            <span className="text-phos-600">
              {en ? "completed" : "закрыто точек"} <span className="text-phos-400">{stats.locsComplete}/{stats.locsTotal}</span>
            </span>
            <span className="text-phos-600">
              {en ? "visited" : "посещено"} <span className="text-phos-400">{stats.visited}/{stats.locsTotal}</span>
            </span>
            <span className="text-cam/80">
              {en ? "cameras" : "камер"} <span className="font-bold text-cam">{stats.cameras}</span>
            </span>
            <span className="text-amber-glow/80">
              {en ? "servers" : "серверов"} <span className="font-bold text-amber-glow">{stats.servers}/{stats.dishes}</span>
            </span>
          </div>
          <div className="mt-2 font-mono text-sm tracking-[0.1em] text-phos-500" aria-hidden>
            <span className="text-phos-700">[</span>
            <span className="text-phos-400 glow">{"█".repeat(filled)}</span>
            <span className="text-ink-500">{"░".repeat(bars - filled)}</span>
            <span className="text-phos-700">]</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-phos-700/50 bg-ink-950/70">
              <button
                type="button"
                onClick={() => onDay(Math.max(1, day - 1))}
                className="px-3 py-2 text-phos-500 transition hover:bg-ink-800 hover:text-phos-300"
                aria-label={en ? "Previous day" : "Предыдущий день"}
              >
                −
              </button>
              <div className="px-2 text-center">
                <div className="text-[9px] uppercase tracking-[0.3em] text-phos-600">{en ? "Day" : "День"}</div>
                <input
                  type="number"
                  min={1}
                  value={day}
                  onChange={(e) => onDay(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
                  className="glow w-14 bg-transparent text-center font-pixel text-base text-phos-300 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label={en ? "Current game day" : "Текущий игровой день"}
                />
              </div>
              <button
                type="button"
                onClick={() => onDay(day + 1)}
                className="px-3 py-2 text-phos-500 transition hover:bg-ink-800 hover:text-phos-300"
                aria-label={en ? "Next day" : "Следующий день"}
              >
                +
              </button>
            </div>
            <div className="border border-phos-700/50 bg-ink-950/70 px-3 py-2 text-center">
              <div className="text-[9px] uppercase tracking-[0.3em] text-phos-600">{en ? "Time" : "Время"}</div>
              <div className={cn("font-pixel text-sm tabular-nums", creepy ? "glow-red text-alert" : "text-phos-300")}>
                {hh}:{mm}
                <span className="text-phos-700">:{ss}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button type="button" onClick={onToggleSound} className={cn("btn-term", sound && "border-phos-600 text-phos-300")} title={en ? "Checkmark sounds" : "Звук отметок"}>
              {sound ? (en ? "♪ sound on" : "♪ звук вкл") : (en ? "♪ sound off" : "♪ звук выкл")}
            </button>
            <button type="button" onClick={onExport} className="btn-term" title={en ? "Download journal as JSON" : "Скачать журнал в JSON"}>
              ⤓ {en ? "export" : "экспорт"}
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-term" title={en ? "Import journal from JSON" : "Загрузить журнал из JSON"}>
              ⤒ {en ? "import" : "импорт"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImport(f);
                e.target.value = "";
              }}
            />
            <button type="button" onClick={onReset} className="btn-term hover:border-alert/60 hover:text-alert" title={en ? "Clear checkmarks" : "Снять все отметки"}>
              ⟲ {en ? "reset" : "сброс"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
