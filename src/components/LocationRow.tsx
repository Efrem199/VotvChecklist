import { useState } from "react";
import { cn } from "@/utils/cn";
import type { Location, TaskDef, MarkerKind } from "@/data/locations";
import type { LocState, LocProgress } from "@/lib/state";
import TaskChip, { toneFor } from "./TaskChip";

interface Props {
  loc: Location;
  tasks: TaskDef[];
  ls: LocState;
  progress: LocProgress;
  selected: boolean;
  flash: boolean;
  onToggle: (taskKey: string) => void;
  onNote: (text: string) => void;
  onSelect: () => void;
  onHover: (hover: boolean) => void;
  onRemove?: () => void;
}

function Glyph({ kind, code, status }: { kind: MarkerKind; code?: string; status: "none" | "partial" | "done" }) {
  const stroke = status === "done" ? "#6cff5c" : status === "partial" ? "#ffb454" : "#3a5240";
  const fill = status === "done" ? "rgba(108,255,92,0.28)" : status === "partial" ? "rgba(255,180,84,0.16)" : "rgba(10,13,11,0.8)";
  const common = { stroke, fill, strokeWidth: 2 } as const;
  const glow = status === "done" ? "drop-shadow(0 0 4px rgba(108,255,92,0.6))" : undefined;
  return (
    <svg viewBox="-20 -20 40 40" className="h-8 w-8 shrink-0" style={{ filter: glow }} aria-hidden>
      {kind === "dish" && <circle r={15} {...common} />}
      {kind === "base" && <rect x={-14} y={-14} width={28} height={28} {...common} />}
      {kind === "tr" && <rect x={-13} y={-13} width={26} height={26} {...common} />}
      {kind === "cr" && <polygon points="0,-16 15,12 -15,12" {...common} />}
      {kind === "poi" && <polygon points="0,-16 16,0 0,16 -16,0" {...common} />}
      {kind === "secret" && (
        <>
          <circle r={14} {...common} strokeDasharray="4 3" />
          <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke={stroke} strokeWidth={2} />
        </>
      )}
      {kind === "custom" && (
        <>
          <circle r={14} {...common} />
          <circle r={5} fill={stroke} />
        </>
      )}
      {code && kind !== "secret" && kind !== "custom" && kind !== "poi" && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={code.length > 1 ? 10 : 15}
          fontWeight={700}
          fill={status === "none" ? "#5c7a63" : "#e9ffe6"}
          fontFamily="inherit"
        >
          {code}
        </text>
      )}
    </svg>
  );
}

export default function LocationRow({
  loc,
  tasks,
  ls,
  progress,
  selected,
  flash,
  onToggle,
  onNote,
  onSelect,
  onHover,
  onRemove,
}: Props) {
  const [noteOpen, setNoteOpen] = useState(false);
  const status = progress.complete ? "done" : progress.started ? "partial" : "none";
  const hasCoords = typeof loc.x === "number" && typeof loc.y === "number";
  const showNote = noteOpen;

  return (
    <li
      id={`loc-${loc.id}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "relative border-l-2 transition-colors",
        status === "done" ? "border-l-phos-500" : status === "partial" ? "border-l-amber-glow/70" : "border-l-ink-600",
        selected ? "bg-phos-900/25" : "hover:bg-ink-800/50",
        flash && "animate-flash",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none"
          title="Показать на карте"
        >
          <Glyph kind={loc.kind} code={loc.code} status={status} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span
                className={cn(
                  "truncate text-sm font-semibold",
                  status === "done" ? "text-phos-300 glow" : status === "partial" ? "text-phos-200" : "text-phos-200/90",
                )}
              >
                {loc.name}
              </span>
              {loc.alt && <span className="text-xs text-phos-600">/ {loc.alt}</span>}
              {hasCoords && (
                <span className="text-[10px] tabular-nums tracking-wider text-phos-700">
                  X:{loc.x} Y:{loc.y}
                </span>
              )}
              {progress.complete && <span className="text-[10px] uppercase tracking-[0.2em] text-phos-500">✓ закрыто</span>}
            </div>
            {loc.desc && <p className="mt-0.5 text-xs leading-snug text-phos-500">{loc.desc}</p>}
            {ls.note && !noteOpen && (
              <p className="mt-1 truncate text-xs italic text-amber-glow/80">✎ {ls.note}</p>
            )}
          </div>
        </button>

        {loc.source && <a href={loc.source} target="_blank" rel="noreferrer" className="text-xs text-phos-500 underline" aria-label={`Источник: ${loc.name}`}>вики ↗</a>}
        <div className="flex flex-wrap items-center gap-1.5">
          {tasks.map((t) => (
            <TaskChip
              key={t.key}
              label={t.label}
              checked={Boolean(ls.done[t.key])}
              tone={toneFor(t.key)}
              onToggle={() => onToggle(t.key)}
            />
          ))}
          <button
            type="button"
            onClick={() => setNoteOpen((v) => !v)}
            className={cn(
              "border px-2 py-1 text-[11px] transition",
              ls.note
                ? "border-amber-glow/50 text-amber-glow"
                : "border-ink-600 text-phos-700 hover:border-phos-700 hover:text-phos-500",
              noteOpen && "bg-ink-800",
            )}
            title="Заметка"
            aria-label={`Заметка: ${loc.name}`}
            aria-expanded={noteOpen}
          >
            ✎
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="border border-ink-600 px-2 py-1 text-[11px] text-phos-700 transition hover:border-alert/60 hover:text-alert"
              title="Удалить точку"
              aria-label={`Удалить точку: ${loc.name}`}
            >
              ×
            </button>
          )}
          {typeof ls.day === "number" && (
            <span className="ml-1 text-[10px] uppercase tracking-wider text-phos-700" title="День последней отметки">
              д.{String(ls.day).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {showNote && (
        <div className="animate-rise px-3 pb-3 pl-14">
          <textarea
            value={ls.note}
            onChange={(e) => onNote(e.target.value)}
            placeholder="Заметка: что оставил, что сломано, куда смотрит камера…"
            rows={2}
            className="input-term resize-y text-xs"
            autoFocus
          />
        </div>
      )}
    </li>
  );
}
