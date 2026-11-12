import { useState } from 'react';
import { CATEGORIES, type Location } from '@/data/locations';
import { commandGroups } from '@/data/fun';
import { ACHIEVEMENTS } from '@/data/achievements';
import type { Route } from '@/lib/routes';
import type { LocState } from '@/lib/state';

type Props = { page: Route['page']; locations: Location[]; progress: Record<string, LocState> };
export default function SiteNav({ page, locations, progress }: Props) {
  const [query, setQuery] = useState('');
  const [spoilers, setSpoilers] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const q = query.trim().toLocaleLowerCase('ru');
  const results = q ? [
    ...CATEGORIES.filter(c => (spoilers || !c.spoiler) && `${c.title} ${c.subtitle}`.toLocaleLowerCase('ru').includes(q)).map(c => ({ type:'Категория', title:c.title, href:`#/journal?category=${c.id}` })),
    ...locations.filter(l => (spoilers || l.category !== 'secrets') && [l.name, l.alt, l.code, l.desc, l.group, progress[l.id]?.note, l.x?.toString(), l.y?.toString()].some(x => x?.toLocaleLowerCase('ru').includes(q))).map(l => ({ type:'Точка', title:l.name, href:`#/journal?loc=${encodeURIComponent(l.id)}` })),
    ...[{ title:'Песочница / Sandbox', text:'sandbox песочница меню читов предметы q num 0', section:'sandbox', spoiler:false }, { title:'Ещё пара пасхалок', text:'пасхалки секреты maxwell ведро бензин камера', section:'easter-eggs', spoiler:true }].filter(x => (spoilers || !x.spoiler) && `${x.title} ${x.text}`.toLocaleLowerCase('ru').includes(q)).map(x => ({type:'Раздел', title:x.title, href:`#/fun?section=${x.section}`})),
    ...commandGroups.flatMap((group,i) => group.commands.filter(c => (spoilers || i < 2) && `${c.command} ${c.description}`.toLocaleLowerCase('ru').includes(q)).map(c => ({ type:'Команда', title:c.command, href:`#/fun?q=${encodeURIComponent(c.command)}` }))),
    ...ACHIEVEMENTS.filter(a => (spoilers || !a.spoiler) && `${a.title} ${a.condition}`.toLocaleLowerCase('ru').includes(q)).map(a => ({ type:a.kind === 'achievement' ? 'Достижение' : 'Advancement', title:a.title, href:`#/achievements?item=${encodeURIComponent(a.id)}` })),
  ] : [];
  return <div className="panel mb-4 p-3">
    <nav aria-label="Разделы сайта" className="flex flex-wrap items-center gap-2 text-xs">
      <a href="#/" aria-current={page === 'journal' ? 'page' : undefined} className={`btn-term ${page === 'journal' ? 'border-phos-500 text-phos-200' : ''}`}>◈ Журнал обхода</a>
      <a href="#/achievements" aria-current={page === 'achievements' ? 'page' : undefined} className={`btn-term ${page === 'achievements' ? 'border-phos-500 text-phos-200' : ''}`}>★ Достижения</a>
      <a href="#/save-editor" aria-current={page === 'save-editor' ? 'page' : undefined} className={`btn-term ${page === 'save-editor' ? 'border-phos-500 text-phos-200' : ''}`}>▣ Редактор сохранений</a>
      <a href="#/fun" aria-current={page === 'fun' ? 'page' : undefined} className={`btn-term ${page === 'fun' ? 'border-amber-glow/70 text-amber-glow' : ''}`}>✦ Команды и приколы</a>
    </nav>
    <div className="mt-3 border-t border-phos-800/40 pt-3">
      <div className="flex flex-wrap items-center gap-3"><label htmlFor="site-search" className="text-xs text-phos-400">Поиск по сайту</label><input id="site-search" value={query} onChange={e=>{ setQuery(e.target.value); setShowAll(false); }} placeholder="Точка, команда или достижение…" className="input-term max-w-lg flex-1"/><label className="flex cursor-pointer items-center gap-2 text-xs text-phos-500"><input type="checkbox" checked={spoilers} onChange={e=>{ setSpoilers(e.target.checked); setShowAll(false); }} /> Искать и в спойлерах</label></div>
      {q && <div className="mt-2" aria-live="polite"><p className="text-xs text-phos-600">{results.length ? `Результаты: ${results.length}${results.length > 12 && !showAll ? ' · показаны первые 12' : ''}` : 'Ничего не найдено.'}</p><ul className="mt-2 flex flex-wrap gap-2">{(showAll ? results : results.slice(0,12)).map((r,i)=><li key={`${r.href}-${i}`}><a className="btn-term normal-case" href={r.href} onClick={() => { setQuery(''); if (window.location.hash === r.href) window.dispatchEvent(new window.HashChangeEvent('hashchange')); }}>{r.type}: {r.title} ↗</a></li>)}</ul>{results.length > 12 && <button type="button" className="btn-term mt-2" aria-expanded={showAll} onClick={()=>setShowAll(v=>!v)}>{showAll ? "Показать меньше" : `Показать все (${results.length})`}</button>}</div>}
    </div>
  </div>;
}
