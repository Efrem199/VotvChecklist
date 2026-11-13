import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import type { Location, TaskDef, MarkerKind } from "@/data/locations";
import type { LocState, LocProgress } from "@/lib/state";
import { wikiImage } from "@/data/wikiImages";
import { ACHIEVEMENTS } from "@/data/achievements";
import { RITUALS } from "@/data/rituals";
import { reviewFor } from "@/data/review";
import { acquisitionFor } from "@/data/acquisition";
import OmegaGuide from "./OmegaGuide";
import FishingGuide from "./FishingGuide";
import PointGuideTask from "./PointGuideTask";
import TaskChip, { toneFor } from "./TaskChip";

interface Props {
  loc: Location;
  tasks: TaskDef[];
  ls: LocState;
  progress: LocProgress;
  selected: boolean;
  selectionSerial?: number;
  flash: boolean;
  onToggle: (taskKey: string) => void;
  onNote: (text: string) => void;
  onSelect: () => void;
  onHover: (hover: boolean) => void;
  onRemove?: () => void;
  plannerSteps?: Record<string, boolean>;
  onGuideStep?: (key: string, value: boolean) => void;
  guideTarget?: boolean; navigationId?: number; guideLocked?: boolean;
  ritualSteps: Record<string, boolean>;
  onRitualStep: (key: string, value: boolean) => void;
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
  selectionSerial,
  flash,
  onToggle,
  onNote,
  onSelect,
  onHover,
  onRemove,
  ritualSteps,
  onRitualStep,
  plannerSteps = {}, onGuideStep = () => {}, guideTarget = false, navigationId = 0, guideLocked = false,
}: Props) {
  const [noteOpen, setNoteOpen] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => { if (selected) setDetailsOpen(true); }, [selected, selectionSerial]);
  const [imageFailed, setImageFailed] = useState(false);
  const image = wikiImage(loc.id);
  const steps = RITUALS[loc.id];
  const linkedAchievements = ACHIEVEMENTS.filter(a => a.locationId === loc.id);
  const review = reviewFor(loc);
  const acquisition = acquisitionFor(loc.id);
  const status = progress.complete ? "done" : progress.started ? "partial" : "none";
  const hasCoords = typeof loc.x === "number" && typeof loc.y === "number";
  const showNote = noteOpen || detailsOpen;

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
          onClick={() => {
            if (!detailsOpen) onSelect();
            setDetailsOpen(v => !v);
          }}
          className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-phos-500"
          title={detailsOpen ? "Свернуть карточку" : "Открыть карточку и показать на карте"}
          aria-label={`Карточка: ${loc.name}`}
          aria-expanded={detailsOpen}
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
            {ls.note && !showNote && (
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
          <button type="button" className="btn-term" onClick={() => setDetailsOpen(v => !v)} aria-expanded={detailsOpen} aria-label={`Подробности: ${loc.name}`}>{detailsOpen ? "ℹ свернуть" : "ℹ подробно"}</button>
          <button
            type="button"
            onClick={() => { if (detailsOpen) noteRef.current?.focus(); else setNoteOpen(v => !v); }}
            className={cn(
              "border px-2 py-1 text-[11px] transition",
              ls.note
                ? "border-amber-glow/50 text-amber-glow"
                : "border-ink-600 text-phos-700 hover:border-phos-700 hover:text-phos-500",
              showNote && "bg-ink-800",
            )}
            title="Заметка"
            aria-label={`Заметка: ${loc.name}`}
            aria-expanded={showNote}
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

      {detailsOpen && (
        <div className="border-t border-phos-800/40 bg-ink-950/60 p-4 text-sm text-phos-200">
          <h3 className="font-bold text-phos-300">{loc.name}</h3>
          {hasCoords ? <p className="mt-1 tabular-nums text-phos-500">X: {loc.x} · Y: {loc.y}</p> : <p className="mt-1 text-phos-600">Точные координаты не указаны.</p>}
          {loc.desc && <p className="mt-2">{loc.desc}</p>}
          {acquisition?.requirements && <div className="mt-3 border-l-2 border-cam pl-3"><p className="font-bold text-cam">Условия и подготовка</p><p className="mt-1">{acquisition.requirements}</p></div>}
          {acquisition?.warning && <div className="mt-3 border border-amber-glow/60 bg-amber-950/30 p-3 text-amber-glow"><p className="font-bold">⚠ Важно перед получением</p><p className="mt-1">{acquisition.warning}</p></div>}
          {loc.id === "hideout" && <OmegaGuide target={guideTarget} navigationId={navigationId} marks={plannerSteps} onStep={onGuideStep} disabled={guideLocked}/>}
          {loc.id === "s-fishing" && <FishingGuide marks={plannerSteps} onStep={onGuideStep} disabled={guideLocked}/>}
          <PointGuideTask locationId={loc.id} marks={plannerSteps} onStep={onGuideStep} disabled={guideLocked}/>
          {linkedAchievements.length > 0 && <details className="mt-3 text-xs"><summary className="cursor-pointer text-phos-400">Связанные достижения · возможны спойлеры</summary><ul className="mt-2 space-y-1">{linkedAchievements.map(a => <li key={a.id}><a className="text-phos-400 underline" href={`#/achievements?item=${encodeURIComponent(a.id)}`}>{a.title} ↗</a></li>)}</ul></details>}
          <section aria-label={`Достоверность: ${loc.name}`} className="mt-4 border border-ink-600 p-3 text-xs">
            <h4 className="font-bold text-phos-300">Источник и достоверность</h4>
            <p className="mt-1">{review.status === 'wiki-reviewed' ? 'Сверено с текстом вики (не проверено в игре)' : review.status === 'disputed' ? '⚠ Данные различаются или требуют уточнения' : review.status === 'user' ? 'Пользовательская точка — данные вики не применяются' : 'Не сверено в рамках этой проверки'}</p>
            {review.scope && <p className="mt-1 text-phos-500">Что сверено: {review.scope}.</p>}
            {review.checkedAt && <p className="mt-1 text-phos-500">Сверка источников: {review.checkedAt.split('-').reverse().join('.')}.</p>}
            {review.status !== 'user' && <p className="mt-1 text-phos-500">Версия игры: {review.gameVersion ?? 'не установлена; совместимость с вашей версией не подтверждена'}.</p>}
            {review.note && <p className="mt-2 text-amber-glow">{review.note}</p>}
            {review.sources && <ul className="mt-2 space-y-1">{review.sources.map(source => <li key={source.url}><a className="text-phos-400 underline" href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul>}
          </section>
          {image && <div className="mt-3"><p className="mb-2 text-xs text-phos-600">Изображение загружается с Voices of the Void Wiki и может содержать спойлеры.</p>{!imageFailed ? <a href={image.file} target="_blank" rel="noreferrer"><img src={image.url} alt={`Расположение: ${loc.name}`} loading="lazy" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} className="max-h-72 max-w-full border border-phos-700 object-contain" /></a> : <p className="text-xs text-amber-glow">Не удалось загрузить изображение; <a href={image.file} target="_blank" rel="noreferrer" className="underline">открыть файл на вики</a>.</p>}<a href={image.file} target="_blank" rel="noreferrer" className="text-xs text-phos-400 underline">Страница файла и права ↗</a></div>}
          {steps && <fieldset className="mt-4"><legend className="text-phos-300">Шаги ритуала</legend><p className="text-xs text-phos-600">Отметки шагов независимы от отметки «Найдено».</p><ol className="mt-2 space-y-2">{steps.map((step, i) => { const key = `${loc.id}:${i}`; return <li key={key}><label className="flex cursor-pointer gap-2"><input type="checkbox" checked={Boolean(ritualSteps[key])} onChange={e => onRitualStep(key, e.target.checked)} /><span>{step}</span></label></li>; })}</ol></fieldset>}
          {loc.source && <p className="mt-3"><a className="text-phos-400 underline" href={loc.source} target="_blank" rel="noreferrer">Описание на вики ↗</a></p>}
          <div className="mt-3 flex flex-wrap gap-2">{tasks.map(t=><TaskChip key={t.key} label={t.label} checked={Boolean(ls.done[t.key])} tone={toneFor(t.key)} onToggle={()=>onToggle(t.key)} />)}</div>
        </div>
      )}
      {showNote && (
        <div className="animate-rise px-3 pb-3 pl-14">
          <label className="block text-xs text-phos-600">
          Заметка
          <textarea
            ref={noteRef}
            value={ls.note}
            onChange={(e) => onNote(e.target.value)}
            placeholder="Заметка: что оставил, что сломано, куда смотрит камера…"
            rows={2}
            className="input-term resize-y text-xs"
            autoFocus={noteOpen && !detailsOpen}
          />
          </label>
        </div>
      )}
    </li>
  );
}
