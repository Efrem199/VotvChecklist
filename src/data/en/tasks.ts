import { DEFAULT_TASKS, type CategoryId, type TaskDef } from '../locations';

const labels: Record<string, string> = {
 visited: 'Visited', camera: 'Camera', server: 'Server upgrade', upgrade: 'Upgrade',
 clean: 'Cleaned', fuses: 'Fuses', explored: 'Explored', found: 'Found', done: 'Done',
};

// Translate only unchanged built-in labels; a renamed or custom column is user data.
export function displayTask(task: TaskDef, category: CategoryId, language: 'en' | 'ru'): string {
 const original = DEFAULT_TASKS[category].find(t => t.key === task.key);
 return language === 'en' && original?.label === task.label ? labels[task.key] ?? task.label : task.label;
}
