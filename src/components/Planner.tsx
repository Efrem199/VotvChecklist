import { useState } from 'react';
import type { AppState } from '@/lib/state';

const goals = {
 omega: { title: 'Kerfur-Omega', items: ['Модуль Omega AI ×1, камера Good ×1, радиоактивная капсула ×1', 'Kerfur Parts ×5, шаровые шарниры ×8, шарниры конечностей ×4', 'Пластиковый лом ×14, металлический ×7, электронный ×8, стеклянный ×1'], steps: [
  ['blueprint', 'Alpha Hideout (X:20.5/Y:25): крюком достаньте карту с лестницы через окно; вторую дверь сломайте, чертёж за ящиками.'],
  ['ai', 'На дне озера (X:405.5/Y:-406) найдите сейф с модулем AI.'],
  ['capsule', 'У TR2 (X:-570/Y:303.3) выкопайте капсулу. Защититесь от радиации; контейнер или инвентарь блокирует урон.'],
  ['joints', 'У Romeo выкопайте ящики с шаровыми шарнирами; шарниры конечностей ищите в трансформаторах.'],
  ['parts', 'Добудьте 5 коробок Kerfur Parts; разбор одного обычного Kerfur даёт три.'],
  ['materials', 'Соберите лом и камеру Good. Подготовьте верстак и чертёж.'],
  ['craft', 'На верстаке соберите голову, грудь, таз, две руки и две ноги, затем соедините части. Подробные рецепты — в гайде Upgrade.'],
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
  <h3 className="mt-3 text-sm text-phos-300">Подготовка и компоненты</h3><ul className="mt-1 list-inside list-disc text-sm text-phos-400">{data.items.map(item=><li key={item}>{item}</li>)}</ul>
  <h3 className="mt-3 text-sm text-phos-300">Точки и шаги</h3><ol className="mt-2 space-y-2">{data.steps.map(([id,text])=><li key={id}><label className="flex cursor-pointer items-start gap-2 text-sm text-phos-400"><input className="mt-1 shrink-0" type="checkbox" checked={!!state.plannerSteps[`${goal}:${id}`]} onChange={e=>onStep(`${goal}:${id}`,e.target.checked)} /><span>{text}</span></label></li>)}</ol>
  {goal === 'omega' && <a className="btn-term mt-3 normal-case" href="#/achievements?item=upgrade">Открыть гайд Upgrade ↗</a>}
  </details>
 </section>;
}
