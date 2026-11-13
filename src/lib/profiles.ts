import { defaultState, loadState, normalizeState, type AppState } from './state';
export const PROFILES_KEY = 'votv-patrol-log:profiles:v1';
export interface Profile { id: string; name: string; createdAt: number; state: AppState }
export interface Profiles { version: 1; activeId: string; profiles: Profile[] }

export function initialProfiles(state: AppState = defaultState()): Profiles {
  return { version: 1, activeId: 'default', profiles: [{ id: 'default', name: 'Default', createdAt: Date.now(), state }] };
}

// Only migrate names previously assigned by the app to the original profile.
// All other profile IDs and user-selected names stay unchanged.
function profileName(id: string, name: string): string {
  return id === 'default' && (name === 'Основное прохождение' || name === 'Main playthrough') ? 'Default' : name;
}

export function loadProfiles(): { data: Profiles; error: boolean } {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return { data: initialProfiles(loadState()), error: false };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('Некорректные профили');
    const p = parsed as Partial<Profiles>;
    if (p.version !== 1 || !Array.isArray(p.profiles) || !p.profiles.length || typeof p.activeId !== 'string') throw new Error('Некорректные профили');
    const ids = new Set<string>();
    const profiles = p.profiles.map(item => {
      if (!item || typeof item.id !== 'string' || !item.id || typeof item.name !== 'string' || !item.state || typeof item.state !== 'object' || ids.has(item.id)) throw new Error('Некорректный профиль');
      ids.add(item.id);
      return { id: item.id, name: profileName(item.id, item.name), createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(), state: normalizeState(item.state) };
    });
    if (!ids.has(p.activeId)) throw new Error('Профиль не найден');
    return { data: { version: 1, activeId: p.activeId, profiles }, error: false };
  } catch { return { data: initialProfiles(loadState()), error: true }; }
}
export function saveProfiles(profiles: Profiles): boolean {
  try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); return true; } catch { return false; }
}
