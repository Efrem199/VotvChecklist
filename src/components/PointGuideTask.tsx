import { OMEGA_GUIDE_HREF } from '@/lib/routes';
import GuideCheck from './GuideCheck';

// One shared flag per objective; checking it here also checks it in the full guide.
const tasks: Record<string, { id: string; label: string }> = {
 lake: { id:'omega:ai', label:'Модуль Omega AI получен' },
 's-capsule': { id:'omega:capsule', label:'Капсула получена' },
 'dish-r': { id:'omega:joints', label:'Все шаровые шарниры и шарниры конечностей собраны' },
};
export default function PointGuideTask({ locationId, marks, onStep, disabled }: {locationId:string; marks:Record<string,boolean>; onStep:(id:string,value:boolean)=>void; disabled?:boolean}) {
 const task=tasks[locationId];
 if (!task) return null;
 return <details className="mt-4 border border-phos-800 p-3"><summary className="cursor-pointer text-phos-300">Kerfur-Omega · связанная задача · спойлеры</summary>
  <GuideCheck {...task} marks={marks} onStep={onStep} disabled={disabled}/>
  <a className="mt-2 inline-block text-xs text-phos-400 underline" href={OMEGA_GUIDE_HREF}>Полный гайд в Alpha Hideout ↗</a>
 </details>;
}
