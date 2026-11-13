import { useEffect, useRef, useState } from 'react';
import { OMEGA_GUIDE } from '@/data/achievementDetails';
import { OMEGA_ILLUSTRATIONS, illustrationsFor } from '@/data/achievementIllustrations';
import StepImages from './StepImages';

const sources = [
 ['Kerfur-Omega', 'Kerfur-Omega'], ['Руководство-чертёж', 'Kerfur-Omega_Complete_Manual'],
 ['Шарниры', 'Ball_Joint'], ['Суставы', 'Limb_Joint'], ['Сейф', 'Safe'],
 ['Капсула', 'Radioactive_Capsule'], ['Лом', 'Scrap'], ['Вход в бункер', 'Keycard'],
];

export default function OmegaGuide({ target, navigationId }: { target: boolean; navigationId: number }) {
 const details = useRef<HTMLDetailsElement>(null);
 const [open, setOpen] = useState(false);
 useEffect(() => {
  if (!target) return;
  setOpen(true);
  const timer = window.setTimeout(() => details.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  return () => window.clearTimeout(timer);
 }, [target, navigationId]);
 return <section className="panel corner mt-4 p-4" aria-label="Гайд Kerfur-Omega">
  <details ref={details} open={open} onToggle={e => setOpen(e.currentTarget.open)}>
   <summary className="panel-title cursor-pointer">Гайд Kerfur-Omega · спойлеры</summary>
   {open && <div className="mt-3 space-y-3 text-sm leading-relaxed">
    <p className="text-xs text-amber-glow">Рецепты и расположения пересказаны по вики, в игре не проверены и могут отличаться между версиями.</p>
    {OMEGA_GUIDE.map(section => <section key={section.title} className="rounded border border-phos-900 p-3">
     <h3 className="font-bold text-phos-300">{section.title}</h3>
     <ul className="mt-2 list-disc space-y-2 pl-5">{section.items.map(item => <li key={item}>{item}<StepImages images={illustrationsFor(OMEGA_ILLUSTRATIONS[section.title], item)}/></li>)}</ul>
    </section>)}
    <p className="text-xs text-phos-500">Иллюстрации: Voices of the Void Wiki; права принадлежат MrDrNose и/или правообладателям. При недоступности изображения откройте ссылку под ним.</p>
    <div className="flex flex-wrap gap-3 text-xs">{sources.map(([label,path]) => <a key={path} className="text-phos-400 underline" href={`https://voicesofthevoid.wiki.gg/wiki/${path}`} target="_blank" rel="noreferrer">{label} ↗</a>)}</div>
   </div>}
  </details>
 </section>;
}
