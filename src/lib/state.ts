import { CategoryId, TaskDef, DEFAULT_TASKS, Location } from "@/data/locations";

export interface LocState {
  done: Record<string, boolean>;
  note: string;
  day?: number;
  updatedAt?: number;
}

export interface CustomLocation {
  id: string;
  name: string;
  x?: number;
  y?: number;
  desc?: string;
}

export interface LogEntry {
  t: number;
  day: number;
  text: string;
  ok: boolean;
}

export interface AppState {
  version: 1;
  day: number;
  sound: boolean;
  progress: Record<string, LocState>;
  custom: CustomLocation[];
  tasks: Partial<Record<CategoryId, TaskDef[]>>;
  collapsed: Partial<Record<CategoryId, boolean>>;
  showSecrets: boolean;
  log: LogEntry[];
}

export const LOG_LIMIT = 12;
export const STORAGE_KEY = "votv-patrol-log:v1";

export const EMPTY_LOC: LocState = { done: {}, note: "" };

export function defaultState(): AppState {
  return {
    version: 1,
    day: 1,
    sound: true,
    progress: {},
    custom: [],
    tasks: {},
    collapsed: {},
    showSecrets: false,
    log: [],
  };
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Аккуратно сливает произвольный JSON с дефолтным состоянием. */
export function normalizeState(raw: unknown): AppState {
  const base = defaultState();
  if (!isObject(raw)) return base;
  const src = isObject(raw.state) && raw.app === "votv-patrol-log" ? raw.state : raw;
  if (!isObject(src)) return base;

  const progress: Record<string, LocState> = {};
  if (isObject(src.progress)) {
    for (const [id, v] of Object.entries(src.progress)) {
      if (!isObject(v)) continue;
      const done: Record<string, boolean> = {};
      if (isObject(v.done)) {
        for (const [k, b] of Object.entries(v.done)) done[k] = Boolean(b);
      }
      progress[id] = {
        done,
        note: typeof v.note === "string" ? v.note : "",
        day: typeof v.day === "number" ? v.day : undefined,
        updatedAt: typeof v.updatedAt === "number" ? v.updatedAt : undefined,
      };
    }
  }

  const custom: CustomLocation[] = Array.isArray(src.custom)
    ? src.custom
        .filter(isObject)
        .filter((c) => typeof c.id === "string" && typeof c.name === "string")
        .map((c) => ({
          id: c.id as string,
          name: c.name as string,
          x: typeof c.x === "number" ? c.x : undefined,
          y: typeof c.y === "number" ? c.y : undefined,
          desc: typeof c.desc === "string" ? c.desc : undefined,
        }))
    : [];

  const tasks: Partial<Record<CategoryId, TaskDef[]>> = {};
  if (isObject(src.tasks)) {
    for (const [cat, list] of Object.entries(src.tasks)) {
      if (!(cat in DEFAULT_TASKS) || !Array.isArray(list)) continue;
      const clean = list
        .filter(isObject)
        .filter((t) => typeof t.key === "string" && typeof t.label === "string")
        .map((t) => ({ key: t.key as string, label: t.label as string }));
      if (clean.length) tasks[cat as CategoryId] = clean;
    }
  }

  const collapsed: Partial<Record<CategoryId, boolean>> = {};
  if (isObject(src.collapsed)) {
    for (const [cat, v] of Object.entries(src.collapsed)) {
      if (cat in DEFAULT_TASKS) collapsed[cat as CategoryId] = Boolean(v);
    }
  }

  const log: LogEntry[] = Array.isArray(src.log)
    ? src.log
        .filter(isObject)
        .filter((e) => typeof e.text === "string")
        .map((e) => ({
          t: typeof e.t === "number" ? e.t : Date.now(),
          day: typeof e.day === "number" ? e.day : 1,
          text: e.text as string,
          ok: e.ok !== false,
        }))
        .slice(0, LOG_LIMIT)
    : [];

  return {
    version: 1,
    day: typeof src.day === "number" && src.day > 0 ? Math.floor(src.day) : 1,
    sound: typeof src.sound === "boolean" ? src.sound : true,
    progress,
    custom,
    tasks,
    collapsed,
    showSecrets: Boolean(src.showSecrets),
    log,
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Импорт только известных экспортов или полноценного состояния версии 1. */
export function parseImport(raw: unknown): AppState {
  if (!isObject(raw)) throw new Error("Неверный формат журнала");
  const wrapped = raw.app === "votv-patrol-log";
  if (wrapped && raw.version !== 1) throw new Error("Неподдерживаемая версия журнала");
  const src = wrapped ? raw.state : raw;
  if (!isObject(src) || src.version !== 1 || !isObject(src.progress) || !Array.isArray(src.custom) || !isObject(src.tasks)) {
    throw new Error("Файл не является журналом VoTV версии 1");
  }
  return normalizeState(src);
}

export function serializeState(state: AppState): string {
  return JSON.stringify(
    { app: "votv-patrol-log", version: 1, exportedAt: new Date().toISOString(), state },
    null,
    2,
  );
}

export function tasksFor(state: AppState, cat: CategoryId): TaskDef[] {
  return state.tasks[cat] ?? DEFAULT_TASKS[cat];
}

export function customToLocation(c: CustomLocation): Location {
  return {
    id: c.id,
    category: "custom",
    kind: "custom",
    name: c.name,
    x: c.x,
    y: c.y,
    desc: c.desc,
  };
}

export interface LocProgress {
  done: number;
  total: number;
  complete: boolean;
  started: boolean;
}

export function progressFor(state: AppState, loc: Location): LocProgress {
  const tasks = tasksFor(state, loc.category);
  const ls = state.progress[loc.id] ?? EMPTY_LOC;
  const done = tasks.reduce((n, t) => n + (ls.done[t.key] ? 1 : 0), 0);
  return { done, total: tasks.length, complete: tasks.length > 0 && done === tasks.length, started: done > 0 };
}

export function uid(prefix = "id"): string {
  return `${prefix}-${globalThis.crypto.randomUUID()}`;
}
