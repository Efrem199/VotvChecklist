import { useEffect, useState } from 'react';
import bg from '@/assets/bg.jpg';
import { commandGroups, sources } from '@/data/fun';
import SiteNav from './SiteNav';
import type { Location } from '@/data/locations';
import type { LocState } from '@/lib/state';

export default function FunPage({ locations, progress, initialQuery, section }: { locations: Location[]; progress: Record<string, LocState>; initialQuery?: string; section?: string }) {
  useEffect(() => { if (section === 'sandbox' || section === 'easter-eggs') document.getElementById(`fun-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [section]);
  const [query, setQuery] = useState(initialQuery ?? '');
  const [copied, setCopied] = useState<{ command: string; message: string } | null>(null);
  const find = query.trim().toLocaleLowerCase('ru');
  const groups = commandGroups.map(group => ({ ...group, commands: group.commands.filter(item => `${item.command} ${item.description} ${item.warning ?? ''} ${group.title}`.toLocaleLowerCase('ru').includes(find)) })).filter(group => group.commands.length);
  async function copy(command: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(command);
      setCopied({ command, message: 'Скопировано' });
    } catch {
      setCopied({ command, message: 'Не удалось скопировать — выделите команду вручную.' });
    }
  }
  return <div className="relative min-h-screen">
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden><img src={bg} alt="" className="h-full w-full object-cover object-center opacity-85"/><div className="absolute inset-0 bg-ink-950/85"/><div className="absolute inset-0 noise"/></div>
    <div className="crt-overlay" aria-hidden />
    <div className="relative mx-auto max-w-[1200px] px-3 py-4 sm:px-5 lg:px-8">
      <SiteNav page="fun" locations={locations} progress={progress} />
      <header className="panel corner p-5 sm:p-6">
        <p className="panel-title">АРХИВ ОПЕРАТОРА / ДОПОЛНИТЕЛЬНЫЙ РАЗДЕЛ</p>
        <h1 className="glow mt-3 font-pixel text-lg leading-relaxed text-phos-300 sm:text-2xl">КОМАНДЫ И ПРИКОЛЫ</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-phos-200">Терминал базы, тайные команды, песочница и необычные находки. Здесь есть спойлеры и события, которые могут изменить игровой мир.</p>
        <p className="mt-3 border-l-2 border-amber-glow pl-3 text-xs leading-relaxed text-amber-glow">Сверено с вики 12.11.2026, не проверено в игре. Вики может отставать от вашей версии; условия и результаты могут отличаться. Перед экспериментами сохранитесь и сделайте копию сохранения игры.</p>
      </header>
      <main className="mt-4 space-y-4">
        <section className="panel corner p-4 sm:p-5"><h2 className="panel-title">Как пользоваться</h2><p className="mt-2 text-sm leading-relaxed">Подойдите к клавиатуре консоли в серверной базы или у тарелки и нажмите кнопку взаимодействия. Выход — ЛКМ, ПКМ или Escape. Это игровой терминал, а не консоль разработчика. Некоторые команды работают только у тарелки.</p><p className="mt-2 text-xs text-phos-500">Секретным командам требуется Funny в меню правил конкретного сохранения. Меню читов Sandbox — отдельное меню, а не команды терминала. <a href={sources.console} target="_blank" rel="noreferrer" className="underline">Консоль на вики ↗</a> · <a href={sources.funny} target="_blank" rel="noreferrer" className="underline">Funny rule ↗</a></p></section>
        <section className="panel corner p-4 sm:p-5" aria-label="Поиск команд">
          <label htmlFor="command-search" className="panel-title">Найти команду</label>
          <input id="command-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="например: Maxwell, радар, калибровка…" className="input-term mt-2" />
          <p className="mt-2 text-xs text-phos-600">Поиск по командам и их описаниям; пасхалки и песочница ниже.</p>
        </section>
        {groups.length === 0 && <p className="panel p-4 text-sm text-phos-500">По запросу «{query}» команды не найдены.</p>}
        {groups.map(group => <section className="panel corner overflow-hidden" key={group.title}>
          <div className="border-b border-phos-800/40 p-4 sm:p-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-base font-bold uppercase tracking-wider text-phos-300">{group.title}</h2><a href={group.source} target="_blank" rel="noreferrer" className="text-xs text-phos-400 underline">Источник ↗</a></div><p className="mt-2 text-xs leading-relaxed text-phos-500">{group.intro}</p></div>
          <ul className="divide-y divide-ink-700/60">{group.commands.map(item => <li key={item.command} className="flex flex-wrap items-start gap-2 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-5"><code className="min-w-0 break-all text-sm font-bold text-phos-300 sm:w-48 sm:shrink-0">{item.command}</code><div className="min-w-0 flex-1 text-sm leading-relaxed"><p>{item.description}</p>{item.warning && <p className="mt-1 text-xs leading-relaxed text-amber-glow">⚠ {item.warning}</p>}</div><div className="sm:text-right"><button type="button" onClick={()=>void copy(item.command)} className="btn-term" aria-label={`Скопировать ${item.command}`}>копировать</button>{copied?.command === item.command && <p role="status" className="mt-1 max-w-48 text-xs text-phos-400">{copied.message}</p>}</div></li>)}</ul>
        </section>)}
        <section id="fun-sandbox" className="panel corner p-4 sm:p-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-base font-bold uppercase tracking-wider text-phos-300">Песочница / Sandbox</h2><a href={sources.sandbox} target="_blank" rel="noreferrer" className="text-xs text-phos-400 underline">Источник ↗</a></div><p className="mt-2 text-sm leading-relaxed">В режиме Sandbox, по вики, удерживайте <kbd>Q</kbd> для меню предметов, <kbd>Z</kbd> отменяет последний созданный предмет, а <kbd>Num 0</kbd> открывает меню читов. Это не текстовые команды терминала; управление может отличаться в вашей версии.</p><p className="mt-2 text-xs text-amber-glow">В меню есть действия, меняющие события и удаляющие объекты. Не нажимайте неизвестные кнопки на важном сохранении.</p></section>
        <section id="fun-easter-eggs" className="panel corner p-4 sm:p-5"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-base font-bold uppercase tracking-wider text-phos-300">Ещё пара пасхалок</h2><a href={sources.funny} target="_blank" rel="noreferrer" className="text-xs text-phos-400 underline">Funny rule на вики ↗</a></div><ul className="mt-3 space-y-3 text-sm leading-relaxed"><li><strong className="text-phos-300">Сервер Maxwell.</strong> Команда <code>sv.target maxwell</code> указывает на закопанный сервер, а не на настоящего кота. По вики он находится на X:-166.50, Y:-665.75. <a className="text-phos-400 underline" href={sources.map} target="_blank" rel="noreferrer">Тайники карты ↗</a></li><li><strong className="text-phos-300">Каменный Maxwell.</strong> Камень в форме кота — X:529.4, Y:-425.4. <a className="text-phos-400 underline" href={sources.map} target="_blank" rel="noreferrer">Тайники карты ↗</a></li><li><strong className="text-phos-300">Ведро.</strong> С Funny и выносливостью ниже 5 взаимодействие с ведром создаёт известный результат и восстанавливает 25 выносливости.</li><li><strong className="text-phos-300">Бензин.</strong> С Funny можно выпить бензин из канистры через ПКМ; это наносит урон, а открытое пламя после этого вызывает взрыв и пожар. <span className="text-amber-glow">Опасно!</span></li><li><strong className="text-phos-300">Камера.</strong> По вики микроволновка и видеокамера дают камеру качества «Supershit» при включённом Funny.</li></ul><p className="mt-4 text-xs text-phos-600">Дополнительно: <a href={sources.rufus} target="_blank" rel="noreferrer" className="text-phos-400 underline">Rufus и Thiccfus ↗</a> · <a href={sources.kerfur} target="_blank" rel="noreferrer" className="text-phos-400 underline">Abandoned Kerfur ↗</a> · <a href={sources.radar} target="_blank" rel="noreferrer" className="text-phos-400 underline">Радар ↗</a>.</p><p className="mt-2 text-xs text-phos-600">Страницы Funny Rule и Map Secrets помечены вики как незавершённые. Координаты и эффекты приведены по вики, без проверки в игре.</p></section>
      </main>
      <footer className="mt-5 pb-4 text-xs text-phos-600">Справка сообщества · <a className="text-phos-400 underline" href="#/">← Вернуться в журнал</a></footer>
    </div>
  </div>;
}
