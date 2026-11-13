import { useEffect, useState } from 'react';
import { OMEGA_GUIDE } from '@/data/achievementDetails';
import { OMEGA_ILLUSTRATIONS, illustrationsFor } from '@/data/achievementIllustrations';
import GuideCheck from './GuideCheck';
import StepImages from './StepImages';

const sources = [
 ['Kerfur-Omega', 'Kerfur-Omega'], ['Руководство-чертёж', 'Kerfur-Omega_Complete_Manual'],
 ['Шарниры', 'Ball_Joint'], ['Суставы', 'Limb_Joint'], ['Сейф', 'Safe'],
 ['Капсула', 'Radioactive_Capsule'], ['Лом', 'Scrap'], ['Вход в бункер', 'Keycard'],
];
// Old planner IDs remain unchanged so previously checked steps stay checked.
const steps: Record<string, {id: string; label: string; location?: string; locationLabel?: string}> = {
 'Для поиска и доступа': {id:'omega:materials', label:'Лом, камера Good и верстак подготовлены'},
 'Настоящий Complete Manual': {id:'omega:blueprint', label:'Руководство-чертёж найдено'},
 'Kerfur Parts:': {id:'omega:parts', label:'Kerfur Parts получены'},
 'Limb Joints:': {id:'omega:joints', label:'Все шаровые шарниры и шарниры конечностей собраны', location:'dish-r', locationLabel:'Romeo на карте'},
 'Omega AI Module:': {id:'omega:ai', label:'Модуль Omega AI получен', location:'lake', locationLabel:'Озеро на карте'},
 'Капсула:': {id:'omega:capsule', label:'Капсула получена', location:'s-capsule', locationLabel:'Капсула на карте'},
 'Положите на верстак все семь': {id:'omega:craft', label:'Детали созданы и Kerfur-Omega собран'},
};
export default function OmegaGuide({ target, navigationId, marks, onStep, disabled }: {target: boolean; navigationId: number; marks: Record<string,boolean>; onStep: (id:string,value:boolean)=>void; disabled?:boolean}) {
 const [open, setOpen] = useState(false);
 useEffect(() => { if (target) setOpen(true); }, [target, navigationId]);
 const count = Object.values(steps).filter(step => marks[step.id]).length;
 return <section className="mt-4 border border-phos-800 p-3" aria-label="Гайд Kerfur-Omega">
  <details open={open} onToggle={e => setOpen(e.currentTarget.open)}>
   <summary className="cursor-pointer font-bold text-phos-300">Гайд Kerfur-Omega · спойлеры · {count}/7</summary>
   {open && <div className="mt-3 space-y-3 text-sm leading-relaxed">
    <p className="text-xs text-amber-glow">Отметки вручную сохраняются в выбранном профиле. Рецепты и расположения пересказаны по вики, в игре не проверены и могут отличаться между версиями.</p>
    {OMEGA_GUIDE.map(section => <section key={section.title} className="rounded border border-phos-900 p-3">
     <h4 className="font-bold text-phos-300">{section.title}</h4>
     <ul className="mt-2 list-disc space-y-3 pl-5">{section.items.map(item => { const step = Object.entries(steps).find(([prefix]) => item.startsWith(prefix))?.[1]; return <li key={item}>{item}<StepImages images={illustrationsFor(OMEGA_ILLUSTRATIONS[section.title], item)}/>{step?.location && <a className="mt-2 block text-xs text-phos-400 underline" href={`#/journal?loc=${encodeURIComponent(step.location)}`}>{step.locationLabel} ↗</a>}{step && <GuideCheck id={step.id} label={step.label} marks={marks} onStep={onStep} disabled={disabled}/>}</li>; })}</ul>
    </section>)}
    <p className="text-xs text-phos-500">Иллюстрации: Voices of the Void Wiki; права принадлежат MrDrNose и/или правообладателям. При недоступности изображения откройте ссылку под ним.</p>
    <div className="flex flex-wrap gap-3 text-xs">{sources.map(([label,path]) => <a key={path} className="text-phos-400 underline" href={`https://voicesofthevoid.wiki.gg/wiki/${path}`} target="_blank" rel="noreferrer">{label} ↗</a>)}</div>
   </div>}
  </details>
 </section>;
}
