export const ACHIEVEMENTS_KEY = 'votv-patrol-log:achievements:v1';
export type Marks = Record<string, boolean>;

export function loadAchievementMarks(): { marks: Marks; error: boolean } {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw === null) return { marks: {}, error: false };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid');
    const data = parsed as { version?: unknown; marks?: unknown };
    if (data.version !== 1 || !data.marks || typeof data.marks !== 'object' || Array.isArray(data.marks) || Object.values(data.marks).some(v => typeof v !== 'boolean')) throw new Error('Invalid');
    return { marks: data.marks as Marks, error: false };
  } catch { return { marks: {}, error: true }; }
}
export function saveAchievementMarks(marks: Marks): boolean {
  try { localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify({ version: 1, marks })); return true; } catch { return false; }
}
