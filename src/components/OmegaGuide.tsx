import { useEffect, useState } from 'react';
import { OMEGA_GUIDE } from '@/data/achievementDetails';
import { OMEGA_ILLUSTRATIONS, illustrationsFor } from '@/data/achievementIllustrations';
import { VERIFIED_WIKI_PAGES, type WikiLanguage } from '@/data/wikiTranslations';
import { OMEGA_GUIDE_EN } from '@/data/en/omegaGuide';
import { englishOmegaIllustration } from '@/data/en/omegaIllustrations';
import GuideCheck from './GuideCheck';
import StepImages from './StepImages';

const sources = [
 ['Kerfur-Omega', 'Kerfur-Omega', VERIFIED_WIKI_PAGES.omega], ['Руководство-чертёж', 'Manual blueprint', VERIFIED_WIKI_PAGES.omegaManual],
 ['Шарниры', 'Ball joints', VERIFIED_WIKI_PAGES.ballJoint], ['Суставы', 'Limb joints', VERIFIED_WIKI_PAGES.limbJoint], ['Сейф', 'Safe', VERIFIED_WIKI_PAGES.safe],
 ['Капсула', 'Capsule', VERIFIED_WIKI_PAGES.capsule], ['Лом', 'Scrap', VERIFIED_WIKI_PAGES.scrap], ['Вход в бункер', 'Bunker entrance', VERIFIED_WIKI_PAGES.keycard],
] as const;
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
const englishStepLabels: Record<string, string> = {
 'omega:materials': 'Scrap, Good camera and workbench ready',
 'omega:blueprint': 'Manual blueprint found',
 'omega:parts': 'Kerfur Parts obtained',
 'omega:joints': 'All ball and limb joints collected',
 'omega:ai': 'Omega AI Module obtained',
 'omega:capsule': 'Capsule obtained',
 'omega:craft': 'Parts crafted and Kerfur-Omega assembled',
};
const englishLocationLabels: Record<string, string> = {
 'dish-r': 'Romeo on the map', lake: 'Lake on the map', 's-capsule': 'Capsule on the map',
};
export default function OmegaGuide({ target, navigationId, marks, onStep, disabled, language = 'ru' }: {target: boolean; navigationId: number; marks: Record<string,boolean>; onStep: (id:string,value:boolean)=>void; disabled?:boolean; language?: WikiLanguage}) {
 const [open, setOpen] = useState(false);
 useEffect(() => { if (target) setOpen(true); }, [target, navigationId]);
 const count = Object.values(steps).filter(step => marks[step.id]).length;
 const en = language === 'en';
 return <section className="mt-4 border border-phos-800 p-3" aria-label={en ? 'Kerfur-Omega guide' : 'Гайд Kerfur-Omega'}>
  <details open={open} onToggle={e => setOpen(e.currentTarget.open)}>
   <summary className="cursor-pointer font-bold text-phos-300">{en ? 'Kerfur-Omega guide · spoilers' : 'Гайд Kerfur-Omega · спойлеры'} · {count}/7</summary>
   {open && <div className="mt-3 space-y-3 text-sm leading-relaxed">
    <p className="text-xs text-amber-glow">{en ? 'Checks are saved manually in the selected profile. Recipes and locations are summarized from the wiki, have not been tested in-game and may differ between versions.' : 'Отметки вручную сохраняются в выбранном профиле. Рецепты и расположения пересказаны по вики, в игре не проверены и могут отличаться между версиями.'}</p>
    {OMEGA_GUIDE.map((section, sectionIndex) => <section key={section.title} className="rounded border border-phos-900 p-3">
     <h4 className="font-bold text-phos-300">{en ? OMEGA_GUIDE_EN[sectionIndex].title : section.title}</h4>
     <ul className="mt-2 list-disc space-y-3 pl-5">{section.items.map((item, itemIndex) => {
      // Match illustrations and persistent checklist IDs using the original text.
      const step = Object.entries(steps).find(([prefix]) => item.startsWith(prefix))?.[1];
      const images = illustrationsFor(OMEGA_ILLUSTRATIONS[section.title], item);
      const translatedImages = en ? images.map(image => englishOmegaIllustration(image) ?? image) : images;
      return <li key={item}>{en ? OMEGA_GUIDE_EN[sectionIndex].items[itemIndex] : item}<StepImages images={translatedImages} language={language}/>{step?.location && <a className="mt-2 block text-xs text-phos-400 underline" href={`#/journal?loc=${encodeURIComponent(step.location)}`}>{en ? englishLocationLabels[step.location] : step.locationLabel} ↗</a>}{step && <GuideCheck id={step.id} label={en ? englishStepLabels[step.id] : step.label} marks={marks} onStep={onStep} disabled={disabled}/>}</li>;
     })}</ul>
    </section>)}
    <p className="text-xs text-phos-500">{en ? 'Illustrations: Voices of the Void Wiki; rights belong to MrDrNose and/or their licensors. If an image is unavailable, open the link below it.' : 'Иллюстрации: Voices of the Void Wiki; права принадлежат MrDrNose и/или правообладателям. При недоступности изображения откройте ссылку под ним.'}</p>
    {!en && <p className="text-xs text-phos-500">Статьи вики на русском могут быть неполными или относиться к другой версии игры. Английские ссылки ведут к источникам, по которым подготовлен гайд.</p>}
    <div className="flex flex-wrap gap-3 text-xs">{sources.map(([label, enLabel, urls]) => <span key={label}>{en ? enLabel : label}: {en ? <a className="text-phos-400 underline" href={urls.en} lang="en" target="_blank" rel="noreferrer">English wiki ↗</a> : <><a className="text-phos-400 underline" href={urls.ru} lang="ru" target="_blank" rel="noreferrer">русская вики ↗</a> · <a className="text-phos-400 underline" href={urls.en} lang="en" target="_blank" rel="noreferrer">английский источник ↗</a></>}</span>)}</div>
   </div>}
  </details>
 </section>;
}
