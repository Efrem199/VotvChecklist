import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { DEFAULT_TASKS, type Category, type Location, type TaskDef } from "@/data/locations";
import { EMPTY_LOC, progressFor, type AppState } from "@/lib/state";
import LocationRow from "./LocationRow";
import { toneFor } from "./TaskChip";

interface Props {
  category: Category;
  state: AppState;
  all: Location[];
  visible: Location[];
  tasks: TaskDef[];
  selectedId: string | null;
  flashId: string | null;
  onToggleCollapse: () => void;
  onToggleTask: (locId: string, key: string) => void;
  onNote: (locId: string, text: string) => void;
  onRitualStep: (key: string, value: boolean) => void;
  onSelect: (locId: string) => void;
  onHover: (locId: string | null) => void;
  onRemoveCustom?: (locId: string) => void;
  onSetTasks: (tasks: TaskDef[]) => void;
  onRevealSecrets?: () => void;
  children?: ReactNode;
}

const TONE_TEXT = {
  green: "text-phos-400",
  cyan: "text-cam",
  amber: "text-amber-glow",
};

export default function CategorySection({
  category,
  state,
  all,
  visible,
  tasks,
  selectedId,
  flashId,
  onToggleCollapse,
  onToggleTask,
  onNote,
  onRitualStep,
  onSelect,
  onHover,
  onRemoveCustom,
  onSetTasks,
  onRevealSecrets,
  children,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [newTask, setNewTask] = useState("");
  const collapsed = Boolean(state.collapsed[category.id]);
  const masked = Boolean(category.spoiler) && !state.showSecrets;

  const stats = useMemo(() => {
    let complete = 0;
    const perTask: Record<string, number> = {};
    for (const loc of all) {
      const p = progressFor(state, loc);
      if (p.complete) complete += 1;
      const ls = state.progress[loc.id] ?? EMPTY_LOC;
      for (const t of tasks) if (ls.done[t.key]) perTask[t.key] = (perTask[t.key] ?? 0) + 1;
    }
    return { complete, perTask };
  }, [all, state, tasks]);

  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, Location[]>();
    for (const loc of visible) {
      const g = loc.group ?? "";
      if (!map.has(g)) {
        map.set(g, []);
        order.push(g);
      }
      map.get(g)!.push(loc);
    }
    return order.map((g) => ({ label: g, items: map.get(g)! }));
  }, [visible]);

  const pct = all.length ? Math.round((stats.complete / all.length) * 100) : 0;

  const renameTask = (i: number, label: string) => {
    const next = tasks.map((t, idx) => (idx === i ? { ...t, label } : t));
    onSetTasks(next);
  };
  const removeTask = (i: number) => {
    if (tasks.length <= 1) return;
    if (!window.confirm("Удалить колонку? Её отметки сохранятся и восстановятся при возврате стандартной колонки.")) return;
    onSetTasks(tasks.filter((_, idx) => idx !== i));
  };
  const addTask = () => {
    const label = newTask.trim();
    if (!label) return;
    const key = `t-${crypto.randomUUID()}`;
    onSetTasks([...tasks, { key, label }]);
    setNewTask("");
  };
  const resetTasks = () => onSetTasks(DEFAULT_TASKS[category.id]);

  return (
    <section className="panel corner relative" id={`cat-${category.id}`}>
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-phos-800/40 px-4 py-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none"
          aria-expanded={!collapsed}
        >
          <span className="text-phos-500 transition-transform duration-200" style={{ transform: collapsed ? "rotate(-90deg)" : "none" }}>
            ▾
          </span>
          <div className="min-w-0">
            <h2 className="flex flex-wrap items-baseline gap-x-2 text-base font-bold uppercase tracking-[0.18em] text-phos-300">
              {category.title}
              <span className="text-xs font-normal tracking-normal text-phos-600">
                {stats.complete}/{all.length}
              </span>
              {category.spoiler && (
                <span className="border border-alert/40 px-1 text-[9px] font-normal uppercase tracking-widest text-alert/80">
                  спойлеры
                </span>
              )}
            </h2>
            <p className="text-[11px] text-phos-600">{category.subtitle}</p>
          </div>
        </button>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-wider">
          {tasks.map((t) => (
            <span key={t.key} className={cn("tabular-nums", TONE_TEXT[toneFor(t.key)])} title={t.label}>
              {t.label}: {stats.perTask[t.key] ?? 0}/{all.length}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden h-1.5 w-28 overflow-hidden bg-ink-800 sm:block" aria-hidden>
            <div className="h-full bg-phos-500/80 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className={cn("btn-term", editing && "border-phos-600 text-phos-300")}
            title="Настроить колонки категории"
            aria-expanded={editing}
          >
            ⚙ колонки
          </button>
        </div>
      </header>

      {editing && (
        <div className="animate-rise border-b border-phos-800/40 bg-ink-950/50 px-4 py-3">
          <p className="panel-title mb-2">Колонки «{category.title}»</p>
          <div className="flex flex-wrap gap-2">
            {tasks.map((t, i) => (
              <div key={t.key} className="flex items-center gap-1">
                <input
                  value={t.label}
                  onChange={(e) => renameTask(i, e.target.value)}
                  className="input-term w-40 text-xs"
                  aria-label={`Название колонки ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeTask(i)}
                  disabled={tasks.length <= 1}
                  className="btn-term px-2 hover:border-alert/60 hover:text-alert"
                  title="Удалить колонку (отметки в ней сохранятся скрытыми)"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Новая колонка, напр. «Щит»"
              className="input-term w-56 text-xs"
            />
            <button type="button" onClick={addTask} className="btn-term" disabled={!newTask.trim()}>
              + добавить
            </button>
            <button type="button" onClick={resetTasks} className="btn-term">
              ⟲ по умолчанию
            </button>
          </div>
        </div>
      )}

      {!collapsed && (
        <div className="relative">
          {masked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-950/40">
              <button type="button" onClick={onRevealSecrets} className="btn-term border-alert/50 px-4 py-2 text-alert hover:border-alert hover:text-alert">
                ▣ показать спойлеры
              </button>
            </div>
          )}
          <div className={cn(masked && "spoiler-mask")} inert={masked}>
            {visible.length === 0 && (
              <p className="px-4 py-6 text-center text-xs uppercase tracking-widest text-phos-700">
                {all.length === 0 ? "— пусто —" : "— ничего не найдено по фильтру —"}
              </p>
            )}
            {groups.map((g) => (
              <div key={g.label || "default"}>
                {g.label && (
                  <div className="flex items-center gap-3 px-4 pb-1 pt-3">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-phos-600">{g.label}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-phos-800/60 to-transparent" />
                  </div>
                )}
                <ul className="divide-y divide-ink-700/60">
                  {g.items.map((loc) => (
                    <LocationRow
                      key={loc.id}
                      loc={loc}
                      ritualSteps={state.ritualSteps}
                      onRitualStep={onRitualStep}
                      tasks={tasks}
                      ls={state.progress[loc.id] ?? EMPTY_LOC}
                      progress={progressFor(state, loc)}
                      selected={selectedId === loc.id}
                      flash={flashId === loc.id}
                      onToggle={(key) => onToggleTask(loc.id, key)}
                      onNote={(text) => onNote(loc.id, text)}
                      onSelect={() => onSelect(loc.id)}
                      onHover={(h) => onHover(h ? loc.id : null)}
                      onRemove={onRemoveCustom ? () => onRemoveCustom(loc.id) : undefined}
                    />
                  ))}
                </ul>
              </div>
            ))}
            {children}
          </div>
        </div>
      )}
    </section>
  );
}
