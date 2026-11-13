import { useState } from 'react';
import type { AppState } from '@/lib/state';
import { OMEGA_GUIDE_HREF } from '@/lib/routes';

const goals = {
 omega: { title: 'Kerfur-Omega', items: [], steps: [
  ['blueprint', 'Найти руководство-чертёж в Alpha Hideout'],
  ['ai', 'Достать модуль Omega AI'],
  ['capsule', 'Добыть радиоактивную капсулу'],
  ['joints', 'Собрать шарниры'],
  ['parts', 'Получить Kerfur Parts'],
  ['materials', 'Подготовить лом, камеру и верстак'],
  ['craft', 'Создать детали и собрать Kerfur-Omega'],
 ] },
 fishing: { title: 'Удочка', items: ['Лопата', 'Семь частей удочки A–G'], steps: [
  ['treasure', 'Выкопайте клад рыбака у X:176/Y:-460.'],
  ['craft', 'Держите части в контейнере: они могут провалиться сквозь объекты. Соберите удочку из семи частей на верстаке.'],
 ] },
} as const;
type Goal = keyof typeof goals;
export default function Planner({ state, onStep }: { state: AppState; onStep: (id: string, checked: boolean) => void }) {
 const [goal, setGoal] = useState<Goal>('omega');
 const data = goals[goal];
 const count = data.steps.filter(([id]) => state.plannerSteps[`${goal}:${id}`]).length;
 return <section className="panel corner mt-4 p-4" aria-label="Планировщик задач">
  <details><summary className="panel-title cursor-pointer">Планировщик задач · спойлеры</summary>
  <div className="mt-3 flex flex-wrap items-center gap-3"><label htmlFor="goal" className="text-sm text-phos-400">Цель</label><select id="goal" className="input-term max-w-xs" value={goal} onChange={e=>setGoal(e.target.value as Goal)}>{Object.entries(goals).map(([id,g])=><option key={id} value={id}>{g.title}</option>)}</select><span className="text-xs text-phos-400">Шагов выполнено: {count} / {data.steps.length}</span></div>
  <p className="mt-3 text-xs text-phos-500">Отметки сохраняются в выбранном профиле и входят в его экспорт. Список включает спойлеры; условия могут отличаться между версиями.</p>
  {data.items.length > 0 && <><h3 className="mt-3 text-sm text-phos-300">Подготовка и компоненты</h3><ul className="mt-1 list-inside list-disc text-sm text-phos-400">{data.items.map(item=><li key={item}>{item}</li>)}</ul></>}
  <h3 className="mt-3 text-sm text-phos-300">Точки и шаги</h3><ol className="mt-2 space-y-2">{data.steps.map(([id,text])=><li key={id}><label className="flex cursor-pointer items-start gap-2 text-sm text-phos-400"><input className="mt-1 shrink-0" type="checkbox" checked={!!state.plannerSteps[`${goal}:${id}`]} onChange={e=>onStep(`${goal}:${id}`,e.target.checked)} /><span>{text}</span></label></li>)}</ol>
  {goal === 'omega' && <a className="btn-term mt-3 normal-case" href={OMEGA_GUIDE_HREF} onClick={() => { if (window.location.hash === OMEGA_GUIDE_HREF) window.dispatchEvent(new window.HashChangeEvent("hashchange")); }}>Полный гайд, компоненты и места в журнале ↗</a>}
  </details>
 </section>;
}
