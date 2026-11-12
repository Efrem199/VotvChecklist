import { useMemo, useRef, useState } from "react";
import { clusterPoints } from "@/lib/mapClusters";
import { cn } from "@/utils/cn";
import { CANDLE_RADIUS, FENCE, MAP_EXTENT, UPGRADE_KEYS, type Location, type MarkerKind } from "@/data/locations";
import { EMPTY_LOC, progressFor, tasksFor, type AppState } from "@/lib/state";

export type MapMode = "overall" | "visited" | "camera" | "upgrades";

export const MAP_MODES: { id: MapMode; label: string; hint: string }[] = [
  { id: "overall", label: "Всё", hint: "Общий прогресс по точке" },
  { id: "visited", label: "Был", hint: "Где уже бывал" },
  { id: "camera", label: "Камеры", hint: "Где стоят камеры" },
  { id: "upgrades", label: "Апгрейды", hint: "Серверы, апгрейды, предохранители" },
];

type Status = "na" | "none" | "partial" | "done";

const E = MAP_EXTENT;

const DISPLAY_POS: Record<string, [number, number]> = {
  tower: [45, -58],
  hideout: [-48, 50],
  "s-fishing": [176.06, -460.41],
  "s-burger-tr2": [-505, 205],
  "s-pickaxe": [365, -372],
  "s-limestone": [592, 224],
  "s-emf": [-655, -5],
};

const COLORS: Record<Status, { stroke: string; fill: string; text: string }> = {
  na: { stroke: "#22302a", fill: "#0a0d0b", text: "#2f4236" },
  none: { stroke: "#3a5240", fill: "#0d120f", text: "#6b8a72" },
  partial: { stroke: "#ffb454", fill: "rgba(255,180,84,0.18)", text: "#ffd9a8" },
  done: { stroke: "#6cff5c", fill: "rgba(108,255,92,0.32)", text: "#e9ffe6" },
};

function statusFor(state: AppState, loc: Location, mode: MapMode): Status {
  if (mode === "overall") {
    const p = progressFor(state, loc);
    return p.complete ? "done" : p.started ? "partial" : "none";
  }
  const keys = mode === "visited" ? ["visited"] : mode === "camera" ? ["camera"] : UPGRADE_KEYS;
  const relevant = tasksFor(state, loc.category).filter((t) => keys.includes(t.key));
  if (relevant.length === 0) return "na";
  const ls = state.progress[loc.id] ?? EMPTY_LOC;
  const done = relevant.filter((t) => ls.done[t.key]).length;
  return done === relevant.length ? "done" : done > 0 ? "partial" : "none";
}

function Shape({ kind, status, active }: { kind: MarkerKind; status: Status; active: boolean }) {
  const c = COLORS[status];
  const stroke = active ? "#ffffff" : c.stroke;
  const sw = active ? 5 : 3;
  const common = { fill: c.fill, stroke, strokeWidth: sw, vectorEffect: "non-scaling-stroke" as const };
  switch (kind) {
    case "dish":
      return <circle r={28} {...common} />;
    case "base":
      return <rect x={-24} y={-24} width={48} height={48} {...common} />;
    case "tr":
      return <rect x={-22} y={-22} width={44} height={44} {...common} />;
    case "cr":
      return <polygon points="0,-28 26,20 -26,20" {...common} />;
    case "poi":
      return <polygon points="0,-20 20,0 0,20 -20,0" {...common} />;
    case "secret":
      return (
        <>
          <circle r={14} {...common} strokeDasharray="6 4" />
          <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
        </>
      );
    case "custom":
      return (
        <>
          <circle r={18} {...common} />
          <circle r={6} fill={stroke} />
        </>
      );
  }
}

interface Props {
  state: AppState;
  locations: Location[];
  mode: MapMode;
  onModeChange: (m: MapMode) => void;
  selectedId: string | null;
  hoverId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function ArrayMap({ state, locations, mode, onModeChange, selectedId, hoverId, onSelect, onHover }: Props) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [openCluster, setOpenCluster] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);
  const radius = E / zoom;
  const clampCenter = (v: number) => Math.max(-E + radius, Math.min(E - radius, v));
  const pan = (dx: number, dy: number) => setCenter(c => ({ x: clampCenter(c.x + dx), y: clampCenter(c.y + dy) }));
  const changeZoom = (next: number) => { const z = Math.max(1, Math.min(4, next)); const r = E / z; setZoom(z); setCenter(c => ({ x: Math.max(-E+r,Math.min(E-r,c.x)), y: Math.max(-E+r,Math.min(E-r,c.y)) })); setOpenCluster(null); };
  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const placed = useMemo(
    () =>
      locations
        .filter((l) => typeof l.x === "number" && typeof l.y === "number")
        .map((l) => {
          const [dx, dy] = DISPLAY_POS[l.id] ?? [l.x!, l.y!];
          return { loc: l, px: dx, py: dy, status: statusFor(state, l, mode) };
        }),
    [locations, state, mode],
  );

  const clusters = useMemo(() => clusterPoints(placed, 70 / zoom).map(items => ({
    key: items.map(p => p.loc.id).sort().join('|'), items,
    px: items.reduce((n,p)=>n+p.px,0)/items.length,
    py: items.reduce((n,p)=>n+p.py,0)/items.length,
  })), [placed, zoom]);
  const opened = clusters.find(c => c.key === openCluster);
  const activeId = hoverId ?? selectedId;
  const active = placed.find((p) => p.loc.id === activeId) ?? null;

  const candles = state.progress["s-candles"] ?? EMPTY_LOC;
  const candlesLit = Object.values(candles.done).some(Boolean);

  const tooltip = useMemo(() => {
    if (!active) return null;
    const tasks = tasksFor(state, active.loc.category);
    const ls = state.progress[active.loc.id] ?? EMPTY_LOC;
    const done = tasks.filter((t) => ls.done[t.key]).map((t) => t.label);
    const l = ((active.px - center.x + radius) / (2 * radius)) * 100;
    const t = ((active.py - center.y + radius) / (2 * radius)) * 100;
    if (l < 0 || l > 100 || t < 0 || t > 100) return null;
    return { l, t, done, below: t < 18, loc: active.loc, ls };
  }, [active, state, center, radius]);

  const gridLines: number[] = [];
  for (let v = -FENCE; v <= FENCE; v += 100) gridLines.push(v);

  const sweepPath = `M0 0 L0 ${-E} A${E} ${E} 0 0 1 ${E * Math.sin(Math.PI / 4)} ${-E * Math.cos(Math.PI / 4)} Z`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Режим карты">
        {MAP_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => onModeChange(m.id)}
            title={m.hint}
            className={cn(
              "btn-term",
              mode === m.id && "border-phos-500 bg-phos-900/50 text-phos-300 shadow-[0_0_10px_rgba(108,255,92,0.2)]",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1" aria-label="Управление картой">
        <button type="button" className="btn-term" onClick={() => changeZoom(zoom * 2)} disabled={zoom >= 4} aria-label="Приблизить карту">＋</button>
        <button type="button" className="btn-term" onClick={() => changeZoom(zoom / 2)} disabled={zoom <= 1} aria-label="Отдалить карту">−</button>
        <button type="button" className="btn-term" onClick={() => pan(-radius/2,0)} disabled={zoom <= 1} aria-label="Сдвинуть карту влево">←</button><button type="button" className="btn-term" onClick={() => pan(0,-radius/2)} disabled={zoom <= 1} aria-label="Сдвинуть карту вверх">↑</button><button type="button" className="btn-term" onClick={() => pan(0,radius/2)} disabled={zoom <= 1} aria-label="Сдвинуть карту вниз">↓</button><button type="button" className="btn-term" onClick={() => pan(radius/2,0)} disabled={zoom <= 1} aria-label="Сдвинуть карту вправо">→</button>
        <button type="button" className="btn-term" onClick={() => { setZoom(1); setCenter({x:0,y:0}); setOpenCluster(null); }}>сброс · {zoom}×</button>
      </div>
      <p className="text-xs text-phos-600">Приблизьте и перетащите карту. Число на маркере — группа точек; нажмите, чтобы выбрать.</p>
      <div className="relative select-none" onMouseLeave={() => onHover(null)}>
        <svg
          viewBox={`${center.x - radius} ${center.y - radius} ${2 * radius} ${2 * radius}`}
          className="block h-auto w-full" style={{ touchAction: zoom > 1 ? "none" : "auto" }}
          onPointerDown={e => { if (zoom <= 1 || (e.target as Element).closest('[data-marker]')) return; drag.current = {x:e.clientX,y:e.clientY,cx:center.x,cy:center.y}; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={e => { if (!drag.current) return; const box=e.currentTarget.getBoundingClientRect(); setCenter({x:clampCenter(drag.current.cx-(e.clientX-drag.current.x)*2*radius/box.width),y:clampCenter(drag.current.cy-(e.clientY-drag.current.y)*2*radius/box.height)}); }}
          onPointerUp={() => { drag.current=null; }} onPointerCancel={() => { drag.current=null; }}
          role="group"
          aria-label="Схема массива Dunkeltaler Forest"
        >
          <defs>
            <radialGradient id="mapbg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0d1510" />
              <stop offset="100%" stopColor="#050706" />
            </radialGradient>
            <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6cff5c" stopOpacity="0" />
              <stop offset="100%" stopColor="#6cff5c" stopOpacity="0.22" />
            </linearGradient>
            <filter id="mglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="mapclip">
              <rect x={-E} y={-E} width={2 * E} height={2 * E} />
            </clipPath>
          </defs>

          <rect x={-E} y={-E} width={2 * E} height={2 * E} fill="url(#mapbg)" />

          {/* grid */}
          <g stroke="#15241a" strokeWidth={2.5}>
            {gridLines.map((v) => (
              <g key={v}>
                <line x1={v} y1={-FENCE} x2={v} y2={FENCE} stroke={v === 0 ? "#22402a" : undefined} strokeWidth={v === 0 ? 4 : undefined} />
                <line x1={-FENCE} y1={v} x2={FENCE} y2={v} stroke={v === 0 ? "#22402a" : undefined} strokeWidth={v === 0 ? 4 : undefined} />
              </g>
            ))}
          </g>

          {/* range rings */}
          <g fill="none" stroke="#1f3a28" strokeWidth={3} strokeDasharray="8 10">
            <circle r={200} />
            <circle r={300} />
            <circle r={500} />
          </g>

          {/* fence */}
          <rect
            x={-FENCE}
            y={-FENCE}
            width={2 * FENCE}
            height={2 * FENCE}
            fill="none"
            stroke="#2b4a33"
            strokeWidth={3.5}
            strokeDasharray="16 12"
          />

          {/* lake */}
          <ellipse cx={400} cy={-400} rx={52} ry={38} transform="rotate(-20 400 -400)" fill="#0b1a24" stroke="#1b4258" strokeWidth={3} />

          {/* rock candles */}
          <g>
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <circle
                  key={i}
                  cx={Math.cos(a) * CANDLE_RADIUS}
                  cy={Math.sin(a) * CANDLE_RADIUS}
                  r={6}
                  fill={candlesLit ? "#ffb454" : "#1e2d22"}
                  style={candlesLit ? { filter: "drop-shadow(0 0 6px rgba(255,180,84,0.9))" } : undefined}
                />
              );
            })}
          </g>

          {/* radar sweep */}
          {!reduceMotion && (
            <g clipPath="url(#mapclip)" style={{ mixBlendMode: "screen" }}>
              <path d={sweepPath} fill="url(#sweep)">
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="9s" repeatCount="indefinite" />
              </path>
            </g>
          )}

          {/* compass & scale */}
          <g fill="#3fd93a" fontSize={32} fontWeight={700} textAnchor="middle" fontFamily="inherit" opacity={0.9}>
            <text x={0} y={-E + 34}>
              N
            </text>
            <text x={0} y={E - 12}>
              S
            </text>
            <text x={-E + 22} y={11}>
              W
            </text>
            <text x={E - 22} y={11}>
              E
            </text>
          </g>
          <g stroke="#3fd93a" strokeWidth={3} opacity={0.8}>
            <line x1={-E + 40} y1={E - 44} x2={-E + 140} y2={E - 44} />
            <line x1={-E + 40} y1={E - 54} x2={-E + 40} y2={E - 34} />
            <line x1={-E + 140} y1={E - 54} x2={-E + 140} y2={E - 34} />
          </g>
          <text x={-E + 90} y={E - 60} fill="#3fd93a" fontSize={24} textAnchor="middle" fontFamily="inherit" opacity={0.8}>
            100 м
          </text>

          {/* markers */}
          {clusters.map(cluster => {
            const { items, px, py } = cluster;
            if (items.length > 1) return <g key={cluster.key} data-marker="cluster" className="cursor-pointer map-marker" role="button" tabIndex={0} aria-label={`Группа: ${items.length} точек`} transform={`translate(${px} ${py})`} onClick={() => setOpenCluster(cluster.key)} onKeyDown={e => { if(e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenCluster(cluster.key); } }}><circle r={32 / zoom} fill="#17351c" stroke="#6cff5c" strokeWidth={3 / zoom} /><text textAnchor="middle" dominantBaseline="central" fontSize={25 / zoom} fill="#e9ffe6">{items.length}</text></g>;
            const { loc, status } = items[0];
            const isActive = activeId === loc.id;
            const isSelected = selectedId === loc.id;
            const ls = state.progress[loc.id] ?? EMPTY_LOC;
            const cam = Boolean(ls.done.camera) && mode !== "camera";
            const label =
              loc.kind === "dish" || loc.kind === "base" ? loc.code : loc.kind === "tr" || loc.kind === "cr" ? loc.code : undefined;
            const labelBelow = loc.kind === "tr" || loc.kind === "cr";
            return (
              <g
                key={loc.id}
                data-marker="point"
                transform={`translate(${px} ${py}) scale(${1 / zoom})`}
                className="cursor-pointer map-marker"
                role="button"
                tabIndex={0}
                aria-label={`Показать точку ${loc.name}`}
                onFocus={() => onHover(loc.id)}
                onBlur={() => onHover(null)}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(loc.id); } }}
                onClick={() => onSelect(loc.id)}
                onMouseEnter={() => onHover(loc.id)}
                onMouseLeave={() => onHover(null)}
                style={status === "done" ? { filter: "url(#mglow)" } : undefined}
              >
                {isSelected && (
                  <circle r={40} fill="none" stroke="#6cff5c" strokeWidth={2} opacity={0.8}>
                    {!reduceMotion && (
                      <>
                        <animate attributeName="r" values="30;58;30" dur="1.6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0;0.9" dur="1.6s" repeatCount="indefinite" />
                      </>
                    )}
                  </circle>
                )}
                {/* невидимая зона наведения побольше */}
                <circle r={36} fill="transparent" />
                <Shape kind={loc.kind} status={status} active={isActive} />
                {label && !labelBelow && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={loc.kind === "base" ? 34 : 32}
                    fontWeight={700}
                    fill={COLORS[status].text}
                    fontFamily="inherit"
                    style={{ pointerEvents: "none" }}
                  >
                    {label}
                  </text>
                )}
                {label && labelBelow && (
                  <text
                    y={44}
                    textAnchor="middle"
                    fontSize={22}
                    fontWeight={700}
                    fill={COLORS[status].text}
                    fontFamily="inherit"
                    style={{ pointerEvents: "none" }}
                  >
                    {label}
                  </text>
                )}
                {cam && (
                  <circle cx={loc.kind === "dish" ? 22 : 18} cy={loc.kind === "dish" ? -22 : -18} r={7} fill="#67e8f9" stroke="#050706" strokeWidth={2}>
                    <title>Камера установлена</title>
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {tooltip && (
          <div
            className="pointer-events-none absolute z-20 w-max max-w-[240px] border border-phos-600/60 bg-ink-950/95 px-2.5 py-1.5 text-[11px] shadow-[0_0_18px_rgba(0,0,0,0.8)]"
            style={{
              left: `${tooltip.l}%`,
              top: `${tooltip.t}%`,
              transform: `translate(${tooltip.l < 18 ? "0%" : tooltip.l > 82 ? "-100%" : "-50%"}, ${tooltip.below ? "22px" : "calc(-100% - 22px)"})`,
            }}
          >
            <div className="font-bold text-phos-200">
              {tooltip.loc.name}
              {tooltip.loc.alt && <span className="ml-1 font-normal text-phos-600">/ {tooltip.loc.alt}</span>}
            </div>
            {typeof tooltip.loc.x === "number" && (
              <div className="text-[10px] tabular-nums text-phos-700">
                X:{tooltip.loc.x} Y:{tooltip.loc.y}
              </div>
            )}
            <div className={cn("mt-0.5 uppercase tracking-wider", tooltip.done.length ? "text-phos-400" : "text-phos-700")}>
              {tooltip.done.length ? tooltip.done.join(" · ") : "— не отмечено"}
            </div>
            {tooltip.ls.note && <div className="mt-0.5 italic text-amber-glow/90">✎ {tooltip.ls.note}</div>}
          </div>
        )}
      </div>

      {opened && <div className="border border-phos-700 p-3"><div className="flex justify-between gap-2"><p className="text-xs text-phos-300">Точки в группе ({opened.items.length})</p><button type="button" className="btn-term" onClick={() => setOpenCluster(null)}>закрыть</button></div><ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">{opened.items.map(({loc})=><li key={loc.id}><button type="button" className="text-left text-xs text-phos-400 underline" onClick={() => { setOpenCluster(null); onSelect(loc.id); }}>{loc.name}{typeof loc.x === 'number' && ` · X:${loc.x} Y:${loc.y}`}</button></li>)}</ul></div>}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-wider text-phos-600">
        <span>○ тарелка</span>
        <span>□ трансформатор</span>
        <span>△ радар</span>
        <span>◇ точка</span>
        <span>⊗ тайник</span>
        <span>◉ своя</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-wider">
        <span className="text-phos-700">▣ не был</span>
        <span className="text-amber-glow">▣ частично</span>
        <span className="text-phos-400">▣ готово</span>
        <span className="text-cam">● камера</span>
      </div>
    </div>
  );
}
