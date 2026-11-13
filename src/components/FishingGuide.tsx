import { useState } from 'react';
import GuideCheck from './GuideCheck';
import StepImages from './StepImages';
import { VERIFIED_WIKI_PAGES, type WikiLanguage } from '@/data/wikiTranslations';

export default function FishingGuide({ marks, onStep, disabled, language = 'ru' }: {marks: Record<string,boolean>; onStep:(id:string,value:boolean)=>void; disabled?:boolean; language?: WikiLanguage}) {
 const [open,setOpen] = useState(false);
 const count = ['fishing:treasure','fishing:craft'].filter(id => marks[id]).length;
 const en = language === 'en';
 return <section className="mt-4 border border-phos-800 p-3" aria-label={en ? 'Fishing rod guide' : 'Гайд по удочке'}><details open={open} onToggle={e=>setOpen(e.currentTarget.open)}><summary className="cursor-pointer font-bold text-phos-300">{en ? 'Fishing rod: guide and steps' : 'Удочка: гайд и шаги'} · {count}/2</summary>{open && <div className="mt-3 space-y-3 text-sm">
 <p className="text-xs text-amber-glow">{en ? 'Checks are saved manually in the selected profile; wiki information has not been tested in-game.' : 'Отметки сохраняются вручную в выбранном профиле; сведения вики в игре не проверены.'}</p>
 <div><p>{en ? 'Take a shovel and dig up the fisherman’s treasure near the eastern wind turbine: X:176/Y:-460.5. The box contains seven fishing rod parts and bait.' : 'Возьмите лопату и выкопайте клад рыбака у восточного ветряка: X:176/Y:-460.5. В ящике семь частей удочки и наживка.'}</p><StepImages language={language} images={[{file:'Item_Fishermans_treasure_Ingame_DiggedOut.png',caption:en ? 'Fisherman’s treasure dug up' : 'Выкопанный клад рыбака',width:180}]}/><GuideCheck id="fishing:treasure" label={en ? 'Treasure dug up' : 'Клад выкопан'} marks={marks} onStep={onStep} disabled={disabled}/></div>
 <div><p>{en ? 'Assemble the fishing rod from parts A–G at a workbench. Keep the parts in a container until assembly: they can clip through objects.' : 'Соберите удочку из частей A–G на верстаке. До сборки держите детали в контейнере: они могут провалиться сквозь объекты.'}</p><StepImages language={language} images={[{file:'Item_Workbench_Ingame_Transparent.png',caption:en ? 'Workbench — assembly location' : 'Верстак — место сборки',original:true}]}/><GuideCheck id="fishing:craft" label={en ? 'Fishing rod assembled' : 'Удочка собрана'} marks={marks} onStep={onStep} disabled={disabled}/></div>
 <p className="text-xs text-phos-500">{en ? 'Images: Voices of the Void Wiki; rights belong to MrDrNose and/or their licensors. If an image is unavailable, use the link below it.' : 'Изображения: Voices of the Void Wiki; права принадлежат MrDrNose и/или правообладателям. При недоступности используйте ссылку под изображением. Русская статья может описывать другую версию игры.'}</p><div className="flex flex-wrap gap-3 text-xs">{!en && <a className="text-phos-400 underline" href={VERIFIED_WIKI_PAGES.fishingRod.ru} lang="ru" target="_blank" rel="noreferrer">Удочка на русской вики ↗</a>}<a className="text-phos-400 underline" href={VERIFIED_WIKI_PAGES.fishingRod.en} lang="en" target="_blank" rel="noreferrer">{en ? 'Fishing rod on the English wiki ↗' : 'Английский источник ↗'}</a></div>
 </div>}</details></section>;
}
