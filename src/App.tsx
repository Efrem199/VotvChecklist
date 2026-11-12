import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import bg from "@/assets/bg.jpg";
import { cn } from "@/utils/cn";
import { BUILTIN_LOCATIONS, CATEGORIES, DISHES, type CategoryId, type Location, type TaskDef } from "@/data/locations";
import {
  EMPTY_LOC,
  customToLocation,
  defaultState,
  parseImport,
  LOG_LIMIT,
  progressFor,
  serializeState,
  tasksFor,
  uid,
  type AppState,
  type LogEntry,
} from "@/lib/state";
import { loadProfiles, saveProfiles } from "@/lib/profiles";
import { COLLECTIONS, collectionMatches, type CollectionId } from "@/data/collections";
import { blip, chime, tick } from "@/lib/sound";
import Header, { type OverallStats } from "@/components/Header";
import ArrayMap, { type MapMode } from "@/components/ArrayMap";
import CategorySection from "@/components/CategorySection";
import EventLog from "@/components/EventLog";
import AddCustomLocation from "@/components/AddCustomLocation";
import SiteNav from "@/components/SiteNav";
import FunPage from "@/components/FunPage";


export default function App() {
  const [page, setPage] = useState(() => window.location.hash === '#/fun' ? 'fun' : 'journal');
  useEffect(() => {
    const navigate = () => {
      setPage(window.location.hash === '#/fun' ? 'fun' : 'journal');
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  const [loaded] = useState(() => loadProfiles());
  const [profiles, setProfiles] = useState(loaded.data);
  const activeProfile = profiles.profiles.find(p => p.id === profiles.activeId)!;
  const state = activeProfile.state;
  const setState = useCallback((update: AppState | ((current: AppState) => AppState)) => {
    setProfiles(current => ({ ...current, profiles: current.profiles.map(p => p.id === current.activeId ? { ...p, state: typeof update === "function" ? update(p.state) : update } : p) }));
  }, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>("overall");
  const [query, setQuery] = useState("");
  const [onlyUnfinished, setOnlyUnfinished] = useState(false);
  const [collection, setCollection] = useState<CollectionId>("all");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [dismissBackup, setDismissBackup] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [saveFailed, setSaveFailed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const flashTimer = useRef<number | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => { if (!loaded.error) setSaveFailed(!saveProfiles(profiles)); }, [profiles, loaded.error]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const allLocations = useMemo<Location[]>(
    () => [...BUILTIN_LOCATIONS, ...state.custom.map(customToLocation)],
    [state.custom],
  );
  const byId = useMemo(() => new Map(allLocations.map((l) => [l.id, l])), [allLocations]);

  const byCategory = useMemo(() => {
    const m: Record<CategoryId, Location[]> = { dishes: [], power: [], radars: [], poi: [], secrets: [], custom: [] };
    for (const l of allLocations) m[l.category].push(l);
    return m;
  }, [allLocations]);

  const q = query.trim().toLowerCase();
  const matches = useCallback(
    (loc: Location) => {
      if (!collectionMatches(collection, loc)) return false;
      if (onlyMissing && state.progress[loc.id]?.done.found) return false;
      if (onlyUnfinished && progressFor(state, loc).complete) return false;
      if (!q) return true;
      const hay = [loc.name, loc.alt, loc.code, loc.desc, loc.group, state.progress[loc.id]?.note]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    },
    [q, onlyUnfinished, onlyMissing, collection, state],
  );

  const mapLocations = useMemo(
    () => allLocations.filter((l) => (l.category !== "secrets" || state.showSecrets) && matches(l)),
    [allLocations, state.showSecrets, matches],
  );

  const stats = useMemo<OverallStats>(() => {
    let tasksDone = 0;
    let tasksTotal = 0;
    let locsComplete = 0;
    let visited = 0;
    let cameras = 0;
    let servers = 0;
    for (const loc of allLocations) {
      const p = progressFor(state, loc);
      tasksDone += p.done;
      tasksTotal += p.total;
      if (p.complete) locsComplete += 1;
      const ls = state.progress[loc.id];
      if (ls?.done.visited) visited += 1;
      if (ls?.done.camera) cameras += 1;
      if (loc.category === "dishes" && ls?.done.server) servers += 1;
    }
    return { tasksDone, tasksTotal, locsComplete, locsTotal: allLocations.length, visited, cameras, servers, dishes: DISHES.length };
  }, [allLocations, state]);

  /* ---------- handlers ---------- */

  const pushLog = (log: LogEntry[], entry: LogEntry) => [entry, ...log].slice(0, LOG_LIMIT);

  const toggleTask = (locId: string, key: string) => {
    const loc = byId.get(locId);
    if (!loc) return;
    const prev = state.progress[locId] ?? EMPTY_LOC;
    const nextVal = !prev.done[key];
    const catTasks = tasksFor(state, loc.category);
    const task = catTasks.find((t) => t.key === key);
    const done = { ...prev.done, [key]: nextVal };
    // поставил камеру или апгрейд — значит, точно там был
    if (nextVal && key !== "visited" && catTasks.some((t) => t.key === "visited")) done.visited = true;
    const nextLs = {
      ...prev,
      done,
      day: nextVal ? state.day : prev.day,
      updatedAt: Date.now(),
    };
    const next: AppState = {
      ...state,
      progress: { ...state.progress, [locId]: nextLs },
      log: pushLog(state.log, {
        t: Date.now(),
        day: state.day,
        text: `${loc.name} — ${task?.label ?? key} ${nextVal ? "✓" : "✗"}`,
        ok: nextVal,
      }),
    };
    setState(next);
    if (state.sound) {
      const nowComplete = progressFor(next, loc).complete;
      if (nextVal && nowComplete) chime();
      else blip(nextVal);
    }
  };

  const setNote = (locId: string, text: string) =>
    setState((s) => ({
      ...s,
      progress: { ...s.progress, [locId]: { ...(s.progress[locId] ?? EMPTY_LOC), note: text, updatedAt: Date.now() } },
    }));

  const setDay = (n: number) => setState((s) => ({ ...s, day: n }));

  const toggleSound = () => {
    const nextSound = !state.sound;
    setState((s) => ({ ...s, sound: nextSound }));
    if (nextSound) tick();
  };

  const toggleCollapse = (cat: CategoryId) =>
    setState((s) => ({ ...s, collapsed: { ...s.collapsed, [cat]: !s.collapsed[cat] } }));

  const setAllCollapsed = (v: boolean) =>
    setState((s) => ({
      ...s,
      collapsed: Object.fromEntries(CATEGORIES.map((c) => [c.id, v])) as Partial<Record<CategoryId, boolean>>,
    }));

  const setTasks = (cat: CategoryId, tasks: TaskDef[]) => setState((s) => ({ ...s, tasks: { ...s.tasks, [cat]: tasks } }));

  const revealSecrets = () => setState((s) => ({ ...s, showSecrets: true }));
  const toggleSecrets = () => {
    if (state.showSecrets && selectedId && byId.get(selectedId)?.category === "secrets") setSelectedId(null);
    if (state.showSecrets) setHoverId(null);
    setState((s) => ({ ...s, showSecrets: !s.showSecrets }));
  };

  const addCustom = (c: { name: string; x?: number; y?: number; desc?: string }) => {
    const id = uid("custom");
    setState((s) => ({
      ...s,
      custom: [...s.custom, { id, ...c }],
      log: pushLog(s.log, { t: Date.now(), day: s.day, text: `Добавлена точка «${c.name}»`, ok: true }),
    }));
    if (state.sound) tick();
  };

  const removeCustom = (id: string) => {
    const loc = byId.get(id);
    if (!loc) return;
    if (!window.confirm(`Удалить точку «${loc.name}»?`)) return;
    setState((s) => {
      const progress = { ...s.progress };
      delete progress[id];
      return { ...s, custom: s.custom.filter((c) => c.id !== id), progress };
    });
    if (selectedId === id) setSelectedId(null);
  };

  const select = (id: string) => {
    const loc = byId.get(id);
    if (!loc) return;
    setSelectedId(id);
    if (!matches(loc)) { setQuery(""); setOnlyUnfinished(false); setOnlyMissing(false); setCollection("all"); }
    if (loc.category === "secrets" && !state.showSecrets) setState(s => ({ ...s, showSecrets: true }));
    if (state.collapsed[loc.category]) {
      setState((s) => ({ ...s, collapsed: { ...s.collapsed, [loc.category]: false } }));
    }
    window.setTimeout(() => {
      document.getElementById(`loc-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    setFlashId(null);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    window.requestAnimationFrame(() => {
      setFlashId(id);
      flashTimer.current = window.setTimeout(() => setFlashId(null), 1700);
    });
    if (state.sound) tick();
  };

  const exportJson = () => {
    const exported = { ...state, lastExportAt: Date.now() };
    const blob = new Blob([serializeState(exported)], { type: "application/json" });
    setState(exported);
    setDismissBackup(false);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `votv-journal-day${String(state.day).padStart(2, "0")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Журнал выгружен в JSON");
  };

  const importJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const next = parseImport(parsed);
      if (!window.confirm("Заменить текущий журнал данными из файла?")) return;
      setState(next);
      showToast(`Журнал загружен · день ${next.day}`);
    } catch {
      showToast("Не удалось прочитать файл — это точно наш JSON?");
    }
  };

  const resetAll = () => {
    if (!window.confirm("Снять ВСЕ отметки и очистить заметки? Свои точки и настройки колонок останутся.")) return;
    setState((s) => ({ ...defaultState(), day: s.day, sound: s.sound, custom: s.custom, tasks: s.tasks, showSecrets: s.showSecrets }));
    setSelectedId(null);
    showToast("Журнал очищен. Новый обход.");
  };

  const switchProfile = (id: string) => {
    setProfiles(p => ({ ...p, activeId: id })); setSelectedId(null); setHoverId(null); setQuery(""); setCollection("all"); setOnlyMissing(false); setOnlyUnfinished(false); setDismissBackup(false);
  };
  const createProfile = () => {
    const name = window.prompt("Название нового прохождения:")?.trim();
    if (!name) return;
    const id = uid("profile");
    setProfiles(p => ({ ...p, activeId: id, profiles: [...p.profiles, { id, name: name.slice(0, 80), createdAt: Date.now(), state: defaultState() }] }));
    setSelectedId(null); setHoverId(null); setQuery(""); setCollection("all"); setOnlyMissing(false); setOnlyUnfinished(false); setDismissBackup(false);
  };
  const renameProfile = () => {
    const name = window.prompt("Новое название прохождения:", activeProfile.name)?.trim();
    if (name) setProfiles(p => ({ ...p, profiles: p.profiles.map(x => x.id === p.activeId ? { ...x, name: name.slice(0, 80) } : x) }));
  };
  const deleteProfile = () => {
    if (profiles.profiles.length <= 1) return;
    if (!window.confirm(`Удалить прохождение «${activeProfile.name}» со всеми отметками? Действие необратимо. Сначала экспортируйте резервную копию.`)) return;
    setProfiles(p => { const remaining = p.profiles.filter(x => x.id !== p.activeId); return { ...p, profiles: remaining, activeId: remaining[0].id }; });
    setSelectedId(null); setHoverId(null); setDismissBackup(false);
  };
  const chooseCollection = (id: CollectionId, missing = false) => {
    if (id !== "all" && !state.showSecrets && !window.confirm("Показать спойлерные находки и карту?")) return;
    if (id !== "all" && !state.showSecrets) revealSecrets();
    setCollection(id); setOnlyMissing(missing); setOnlyUnfinished(false); setQuery("");
    if (id !== "all") setState(s => ({ ...s, collapsed: { ...s.collapsed, secrets: false } }));
  };
  /* ---------- flavour ---------- */

  const trDots = ["tr1", "tr2", "tr3"].map((id) => {
    const ls = state.progress[id];
    const level = ls?.done.upgrade ? 2 : ls?.done.visited ? 1 : 0;
    return { id, level };
  });
  const creepy = now.getHours() === 3 && now.getMinutes() === 33;
  const selected = selectedId ? byId.get(selectedId) : undefined;
  const nearby = selected && typeof selected.x === "number" && typeof selected.y === "number"
    ? allLocations.filter(l => l.id !== selected.id && (state.showSecrets || l.category !== "secrets") && typeof l.x === "number" && typeof l.y === "number")
      .map(l => ({ loc: l, distance: Math.hypot(l.x! - selected.x!, l.y! - selected.y!) })).sort((a,b) => a.distance - b.distance).slice(0, 5) : [];
  const backupDue = Date.now() - (state.lastExportAt ?? activeProfile.createdAt) > 7 * 24 * 60 * 60 * 1000;

  if (page === 'fun') return <FunPage />;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <img src={bg} alt="" className="h-full w-full object-cover object-center opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/50 via-ink-950/70 to-ink-950/95" />
        <div className="absolute inset-0 noise" />
      </div>
      <div className="crt-overlay" aria-hidden />

      <div className="relative mx-auto max-w-[1540px] px-3 py-4 sm:px-5 lg:px-8">
        <SiteNav page="journal" />
        <Header
          day={state.day}
          onDay={setDay}
          sound={state.sound}
          onToggleSound={toggleSound}
          stats={stats}
          onExport={exportJson}
          onImport={importJson}
          onReset={resetAll}
        />

        <section className="panel mt-4 flex flex-wrap items-center gap-2 p-3" aria-label="Профили прохождений">
          <label className="text-xs text-phos-400">Прохождение <select className="input-term ml-2 w-auto" aria-label="Выбрать прохождение" value={profiles.activeId} onChange={e => switchProfile(e.target.value)}>{profiles.profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <button type="button" className="btn-term" onClick={createProfile}>+ новое</button><button type="button" className="btn-term" onClick={renameProfile}>переименовать</button><button type="button" className="btn-term" disabled={profiles.profiles.length <= 1} onClick={deleteProfile}>удалить</button>
          <span className="text-xs text-phos-600">Экспорт и импорт относятся к выбранному прохождению.</span>
        </section>
        {backupDue && !dismissBackup && <div className="panel mt-4 flex flex-wrap items-center gap-3 p-3 text-xs text-amber-glow">Пора сохранить резервную копию этого прохождения. <button type="button" className="btn-term" onClick={exportJson}>Экспорт JSON</button><button type="button" className="btn-term" onClick={() => setDismissBackup(true)}>Напомнить позже</button></div>}
        {loaded.error && <div role="alert" className="panel mt-4 border-alert p-4 text-sm text-alert">Не удалось прочитать профили; автоматическая запись отключена, чтобы не перезаписать данные. Экспортируйте доступный журнал и проверьте хранилище браузера.</div>}
        {saveFailed && <div role="alert" className="panel mt-4 border-alert p-4 text-sm text-alert">Не удалось сохранить журнал в браузере. Скачайте резервную копию кнопкой «экспорт» и проверьте доступность хранилища.</div>}

        <div className="mt-4 grid gap-4 lg:grid-cols-[440px_minmax(0,1fr)] xl:grid-cols-[500px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <div className="panel corner relative p-4">
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <p className="panel-title">Схема массива</p>
                <p className="text-[10px] uppercase tracking-wider text-phos-700">
                  {selected ? (
                    <>
                      цель: <span className="text-phos-400">{selected.name}</span>
                    </>
                  ) : (
                    "клик по маркеру — переход к точке"
                  )}
                </p>
              </div>
              <ArrayMap
                state={state}
                locations={mapLocations}
                mode={mapMode}
                onModeChange={setMapMode}
                selectedId={selectedId}
                hoverId={hoverId}
                onSelect={select}
                onHover={setHoverId}
              />
            </div>
            {selected && nearby.length > 0 && <div className="panel corner p-4"><p className="panel-title">Рядом с «{selected.name}»</p><p className="mt-1 text-xs text-phos-600">По прямой на плоскости карты; высота и препятствия не учитываются.</p><ul className="mt-2 space-y-1">{nearby.map(({loc,distance}) => <li key={loc.id}><button type="button" className="text-left text-xs text-phos-400 underline" onClick={() => select(loc.id)}>{loc.name} · ≈{Math.round(distance)} м</button></li>)}</ul></div>}
            <div className="panel corner relative p-4">
              <EventLog log={state.log} />
            </div>
          </aside>

          <main className="min-w-0 space-y-4">
            <div className="panel corner relative flex flex-wrap items-center gap-2 p-3">
              <div className="relative min-w-[200px] flex-1">
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-phos-700">&gt;</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="поиск: bravo, TR 2, колодец, заметка…"
                  className="input-term pl-6"
                  aria-label="Поиск по точкам"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-phos-600 hover:text-phos-300"
                    aria-label="Очистить поиск"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOnlyUnfinished((v) => !v)}
                aria-pressed={onlyUnfinished}
                className={cn("btn-term", onlyUnfinished && "border-amber-glow/70 text-amber-glow")}
              >
                {onlyUnfinished ? "[■]" : "[ ]"} только незакрытые
              </button>
              <button type="button" onClick={toggleSecrets} aria-pressed={state.showSecrets} className={cn("btn-term", state.showSecrets && "border-alert/60 text-alert")}>
                {state.showSecrets ? "[■]" : "[ ]"} спойлеры
              </button>
              <div className="flex gap-1">
                <button type="button" onClick={() => setAllCollapsed(false)} className="btn-term" title="Развернуть все категории">
                  ▾ все
                </button>
                <button type="button" onClick={() => setAllCollapsed(true)} className="btn-term" title="Свернуть все категории">
                  ▸ все
                </button>
              </div>
            </div>

            <section className="panel corner p-3" aria-label="Коллекции">
              <p className="panel-title">Коллекции · найдено</p>
              <div className="mt-2 flex flex-wrap gap-2">{COLLECTIONS.filter(c => c.id !== "all").map(c => { const items = allLocations.filter(c.matches); const found = items.filter(l => state.progress[l.id]?.done.found).length; return <div key={c.id} className="flex gap-1"><button type="button" className={cn("btn-term", collection === c.id && "border-phos-500 text-phos-200")} aria-pressed={collection === c.id && !onlyMissing} onClick={()=>chooseCollection(c.id)}>{c.label} {found}/{items.length}</button><button type="button" className="btn-term" aria-label={`Показать недостающие: ${c.label}`} onClick={()=>chooseCollection(c.id, true)}>осталось {items.length-found}</button></div>; })}<button type="button" className="btn-term" aria-pressed={collection === "all"} onClick={()=>chooseCollection("all")}>Все точки</button></div>
              {collection !== "all" && <p className="mt-2 text-xs text-phos-600">Фильтр: {COLLECTIONS.find(c => c.id === collection)?.label}{onlyMissing ? " · только без отметки «Найдено»" : ""}. Отметки считаются независимо от остальных колонок.</p>}
            </section>
            {CATEGORIES.map((cat) => {
              const all = byCategory[cat.id];
              const visible = all.filter(matches);
              return (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  state={state}
                  all={all}
                  visible={visible}
                  tasks={tasksFor(state, cat.id)}
                  selectedId={selectedId}
                  flashId={flashId}
                  onToggleCollapse={() => toggleCollapse(cat.id)}
                  onToggleTask={toggleTask}
                  onNote={setNote}
                  onRitualStep={(key, value) => setState(s => ({ ...s, ritualSteps: { ...s.ritualSteps, [key]: value } }))}
                  onSelect={select}
                  onHover={setHoverId}
                  onRemoveCustom={cat.id === "custom" ? removeCustom : undefined}
                  onSetTasks={(tasks) => setTasks(cat.id, tasks)}
                  onRevealSecrets={cat.spoiler ? revealSecrets : undefined}
                >
                  {cat.id === "custom" && <AddCustomLocation onAdd={addCustom} />}
                </CategorySection>
              );
            })}
          </main>
        </div>

        <footer className="panel mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-phos-600">
          <span>
            сигнал:{" "}
            {creepy ? <span className="glow-red text-alert">помехи</span> : <span className="text-phos-400">стабильный</span>}
          </span>
          <span className="flex items-center gap-2">
            питание:
            {trDots.map((d) => (
              <span key={d.id} className="flex items-center gap-1">
                {d.id.toUpperCase()}
                <span
                  className={cn(
                    "inline-block h-2 w-2 rounded-full",
                    d.level === 2 ? "bg-phos-400 shadow-[0_0_6px_rgba(108,255,92,0.9)]" : d.level === 1 ? "bg-amber-glow" : "bg-ink-500 animate-pulse-dot",
                  )}
                />
              </span>
            ))}
          </span>
          <span>
            день <span className="text-phos-400">{String(state.day).padStart(2, "0")}</span>
          </span>
          <span className="ml-auto normal-case tracking-normal text-phos-700">
            источники: <a className="underline" href="https://voicesofthevoid.wiki.gg/wiki/Secrets/Hidden_Items" target="_blank" rel="noreferrer">Voices of the Void Wiki</a> · сведения могут зависеть от версии игры · сохраняется в браузере
          </span>
        </footer>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-[70] animate-rise border border-phos-500/70 bg-ink-950/95 px-4 py-2 text-xs text-phos-300 shadow-[0_0_20px_rgba(108,255,92,0.25)]">
          <span className="text-phos-600">&gt; </span>
          {toast}
        </div>
      )}
    </div>
  );
}
