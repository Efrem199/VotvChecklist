import { useState } from 'react';
import { CATEGORIES, type Location } from '@/data/locations';
import { commandGroups } from '@/data/fun';
import { englishCommandGroups } from '@/data/en/fun';
import { ACHIEVEMENTS } from '@/data/achievements';
import { englishAchievement } from '@/data/en/achievements';
import { englishCategory } from '@/data/en/categories';
import { useLanguage } from '@/lib/language';
import type { Route } from '@/lib/routes';
import type { LocState } from '@/lib/state';

type Props = { page: Route['page']; locations: Location[]; progress: Record<string, LocState> };
export default function SiteNav({ page, locations, progress }: Props) {
  const { language, setLanguage, storageError } = useLanguage();
  const en = language === 'en';
  const [query, setQuery] = useState('');
  const [spoilers, setSpoilers] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const q = query.trim().toLocaleLowerCase(language);
  const sections = en ? [
    { title:'Sandbox', text:'sandbox cheats menu items q num 0', section:'sandbox', spoiler:false },
    { title:'More Easter eggs', text:'easter eggs secrets maxwell bucket gasoline camera', section:'easter-eggs', spoiler:true },
  ] : [
    { title:'Песочница / Sandbox', text:'sandbox песочница меню читов предметы q num 0', section:'sandbox', spoiler:false },
    { title:'Ещё пара пасхалок', text:'пасхалки секреты maxwell ведро бензин камера', section:'easter-eggs', spoiler:true },
  ];
  const results = q ? [
    ...CATEGORIES.map(c => en ? englishCategory(c) : c).filter(c => (spoilers || !c.spoiler) && `${c.title} ${c.subtitle}`.toLocaleLowerCase(language).includes(q)).map(c => ({ type:en ? 'Category' : 'Категория', title:c.title, href:`#/journal?category=${c.id}` })),
    ...locations.filter(l => (spoilers || l.category !== 'secrets') && [l.name, l.alt, l.code, l.desc, l.group, progress[l.id]?.note, l.x?.toString(), l.y?.toString()].some(x => x?.toLocaleLowerCase(language).includes(q))).map(l => ({ type:en ? 'Location' : 'Точка', title:l.name, href:`#/journal?loc=${encodeURIComponent(l.id)}` })),
    ...sections.filter(x => (spoilers || !x.spoiler) && `${x.title} ${x.text}`.toLocaleLowerCase(language).includes(q)).map(x => ({type:en ? 'Section' : 'Раздел', title:x.title, href:`#/fun?section=${x.section}`})),
    ...(en ? englishCommandGroups : commandGroups).flatMap((group,i) => group.commands.filter(c => (spoilers || i < 2) && `${c.command} ${c.description}`.toLocaleLowerCase(language).includes(q)).map(c => ({ type:en ? 'Command' : 'Команда', title:c.command, href:`#/fun?q=${encodeURIComponent(c.command)}` }))),
    ...ACHIEVEMENTS.map(a => en ? englishAchievement(a) ?? a : a).filter(a => (spoilers || !a.spoiler) && `${a.title} ${a.condition}`.toLocaleLowerCase(language).includes(q)).map(a => ({ type:a.kind === 'achievement' ? (en ? 'Achievement' : 'Достижение') : 'Advancement', title:a.title, href:`#/achievements?item=${encodeURIComponent(a.id)}` })),
  ] : [];
  return <div className="panel mb-4 p-3">
    <nav aria-label={en ? 'Site sections' : 'Разделы сайта'} className="site-nav flex flex-wrap items-center gap-2 text-xs">
      <a href="#/" aria-current={page === 'journal' ? 'page' : undefined} className={`btn-term ${page === 'journal' ? 'border-phos-500 text-phos-200' : ''}`}>◈ {en ? 'Field journal' : 'Журнал обхода'}</a>
      <a href="#/achievements" aria-current={page === 'achievements' ? 'page' : undefined} className={`btn-term ${page === 'achievements' ? 'border-phos-500 text-phos-200' : ''}`}>★ {en ? 'Achievements' : 'Достижения'}</a>
      <a href="#/save-editor" aria-current={page === 'save-editor' ? 'page' : undefined} className={`btn-term ${page === 'save-editor' ? 'border-phos-500 text-phos-200' : ''}`}>▣ {en ? 'Save editor' : 'Редактор сохранений'}</a>
      <a href="#/fun" aria-current={page === 'fun' ? 'page' : undefined} className={`btn-term ${page === 'fun' ? 'border-amber-glow/70 text-amber-glow' : ''}`}>✦ {en ? 'Commands and fun' : 'Команды и приколы'}</a>
      <label className="site-language ml-auto flex items-center gap-2 text-phos-400">{en ? 'Language' : 'Язык'} <select className="input-term w-auto" aria-label={en ? 'Language' : 'Язык'} value={language} onChange={e => setLanguage(e.target.value as 'ru' | 'en')}><option value="en" lang="en">English</option><option value="ru" lang="ru">Русский</option></select></label>
    </nav>
    {storageError && <p role="alert" className="mt-2 text-xs text-alert">{en ? 'Language preference could not be saved in this browser.' : 'Не удалось сохранить выбор языка в браузере.'}</p>}
    <div className="mt-3 border-t border-phos-800/40 pt-3">
      <div className="site-search flex flex-wrap items-center gap-3"><label htmlFor="site-search" className="text-xs text-phos-400">{en ? 'Search the site' : 'Поиск по сайту'}</label><input id="site-search" value={query} onChange={e=>{ setQuery(e.target.value); setShowAll(false); }} placeholder={en ? 'Location, command or achievement…' : 'Точка, команда или достижение…'} className="input-term min-w-0 max-w-lg flex-1"/><label className="flex cursor-pointer items-center gap-2 text-xs text-phos-500"><input type="checkbox" checked={spoilers} onChange={e=>{ setSpoilers(e.target.checked); setShowAll(false); }} /> {en ? 'Include spoilers' : 'Искать и в спойлерах'}</label></div>
      {q && <div className="mt-2" aria-live="polite"><p className="text-xs text-phos-600">{results.length ? en ? `Results: ${results.length}${results.length > 12 && !showAll ? ' · first 12 shown' : ''}` : `Результаты: ${results.length}${results.length > 12 && !showAll ? ' · показаны первые 12' : ''}` : en ? 'No results found.' : 'Ничего не найдено.'}</p><ul className="mt-2 flex flex-wrap gap-2">{(showAll ? results : results.slice(0,12)).map((r,i)=><li key={`${r.href}-${i}`}><a className="btn-term normal-case" href={r.href} onClick={() => { setQuery(''); if (window.location.hash === r.href) window.dispatchEvent(new window.HashChangeEvent('hashchange')); }}>{r.type}: {r.title} ↗</a></li>)}</ul>{results.length > 12 && <button type="button" className="btn-term mt-2" aria-expanded={showAll} onClick={()=>setShowAll(v=>!v)}>{showAll ? (en ? 'Show less' : 'Показать меньше') : en ? `Show all (${results.length})` : `Показать все (${results.length})`}</button>}</div>}
    </div>
  </div>;
}
