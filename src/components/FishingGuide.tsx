import { useState } from 'react';
import GuideCheck from './GuideCheck';
import StepImages from './StepImages';

export default function FishingGuide({ marks, onStep, disabled }: {marks: Record<string,boolean>; onStep:(id:string,value:boolean)=>void; disabled?:boolean}) {
 const [open,setOpen] = useState(false);
 const count = ['fishing:treasure','fishing:craft'].filter(id => marks[id]).length;
 return <section className="mt-4 border border-phos-800 p-3" aria-label="Гайд по удочке"><details open={open} onToggle={e=>setOpen(e.currentTarget.open)}><summary className="cursor-pointer font-bold text-phos-300">Удочка: гайд и шаги · {count}/2</summary>{open && <div className="mt-3 space-y-3 text-sm">
 <p className="text-xs text-amber-glow">Отметки сохраняются вручную в выбранном профиле; сведения вики в игре не проверены.</p>
 <div><p>Возьмите лопату и выкопайте клад рыбака у восточного ветряка: X:176/Y:-460.5. В ящике семь частей удочки и наживка.</p><StepImages images={[{file:'Item_Fishermans_treasure_Ingame_DiggedOut.png',caption:'Выкопанный клад рыбака',width:180}]}/><GuideCheck id="fishing:treasure" label="Клад выкопан" marks={marks} onStep={onStep} disabled={disabled}/></div>
 <div><p>Соберите удочку из частей A–G на верстаке. До сборки держите детали в контейнере: они могут провалиться сквозь объекты.</p><StepImages images={[{file:'Item_Workbench_Ingame_Transparent.png',caption:'Верстак — место сборки',original:true}]}/><GuideCheck id="fishing:craft" label="Удочка собрана" marks={marks} onStep={onStep} disabled={disabled}/></div>
 <p className="text-xs text-phos-500">Изображения: Voices of the Void Wiki; права принадлежат MrDrNose и/или правообладателям. При недоступности используйте ссылку под изображением.</p><a className="text-xs text-phos-400 underline" href="https://voicesofthevoid.wiki.gg/wiki/Fishing_Rod" target="_blank" rel="noreferrer">Удочка на вики ↗</a>
 </div>}</details></section>;
}
