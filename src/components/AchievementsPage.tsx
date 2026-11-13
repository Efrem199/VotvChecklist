import { russianAchievementCounterpart } from '@/data/achievementSourceLinks';
import { useState } from 'react';
import bg from '@/assets/bg.jpg';
import { ACHIEVEMENTS, ACHIEVEMENTS_SOURCE, type AchievementKind } from '@/data/achievements';
import { englishAchievement } from '@/data/en/achievements';
import { useLanguage } from '@/lib/language';
import { STEP_ILLUSTRATIONS, SECTION_ILLUSTRATIONS, illustrationsFor } from '@/data/achievementIllustrations';
import { ACHIEVEMENT_DETAILS } from '@/data/achievementDetails';
import { ACHIEVEMENT_GUIDES, type AchievementGuide } from '@/data/achievementGuides';
import { ENGLISH_ACHIEVEMENT_GUIDES } from '@/data/en/achievementGuides';
import { ENGLISH_ACHIEVEMENT_DETAILS } from '@/data/en/achievementFull';
import { englishIllustrationCaption } from '@/data/en/achievementIllustrations';
import type { Marks } from '@/lib/achievements';
import type { Location } from '@/data/locations';
import type { LocState } from '@/lib/state';
import SiteNav from './SiteNav';
import StepImages from './StepImages';
import GuideCheck from './GuideCheck';
import { OMEGA_GUIDE_HREF } from '@/lib/routes';

function Guide({ guide, id, spoilers, marks, onStep, disabled }: { guide: AchievementGuide; id: string; spoilers: boolean; marks: Marks; onStep: (id:string,value:boolean)=>void; disabled:boolean }) {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const en = language === 'en';
  const translated = en ? ENGLISH_ACHIEVEMENT_GUIDES[id] : undefined;
  const shown = translated ?? guide;
  return <details className="mt-3 border-t border-phos-900 pt-3" onToggle={e => setOpen(e.currentTarget.open)}>
    <summary className="cursor-pointer text-sm font-bold text-phos-300">{en ? `How to obtain · step-by-step guide${translated ? '' : ' (Russian)'}` : 'Как получить · пошаговый гайд'}</summary>
    {open && <div lang={translated ? 'en' : 'ru'} className="mt-3 space-y-3 text-sm leading-relaxed">
      <p className="text-xs text-phos-500">{translated ? `Steps completed: ${guide.steps.filter((_, i) => marks[`guide:${id}:${i}`]).length} / ${guide.steps.length}. Checks are saved in the selected profile and included in its export; they do not unlock the achievement in-game.` : <>Выполнено шагов: {guide.steps.filter((_, i) => marks[`guide:${id}:${i}`]).length} / {guide.steps.length}. Отметки сохраняются в выбранном профиле и входят в его экспорт; они не открывают достижение в игре.</>}</p>
      {/* Match illustrations against the source text; indices are persistent IDs. */}
      <ol className="list-decimal space-y-3 pl-5">{guide.steps.map((step, i) => { const images = illustrationsFor(STEP_ILLUSTRATIONS[id], step); return <li key={i}><span>{translated ? translated.steps[i] : step}</span><StepImages language={translated ? 'en' : 'ru'} images={translated ? images.map(image => ({ ...image, caption: englishIllustrationCaption(image.caption) ?? image.caption })) : images}/><GuideCheck id={`guide:${id}:${i}`} label={translated ? `Step ${i + 1} completed` : `Шаг ${i + 1} выполнен`} marks={marks} onStep={onStep} disabled={disabled}/></li>; })}</ol>
      {ACHIEVEMENT_DETAILS[id]?.some(section => section.spoiler) && !spoilers && <p className="text-xs text-amber-glow">{translated ? 'Detailed recipes and locations are hidden. Enable “Show spoilers” in the filters.' : 'Подробные рецепты и расположения скрыты. Включите «Показать спойлеры» в фильтрах.'}</p>}
      {ACHIEVEMENT_DETAILS[id]?.map((original, sectionIndex) => ({original, sectionIndex})).filter(({original}) => !original.spoiler || spoilers).map(({original, sectionIndex}) => {
        const section = translated ? ENGLISH_ACHIEVEMENT_DETAILS[id]?.[sectionIndex] ?? original : original;
        return <section key={original.title} className="rounded border border-phos-900 p-3">
          <h3 className="font-bold text-phos-300">{section.title}</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5">{original.items.map((item, i) => {
            const images = illustrationsFor(SECTION_ILLUSTRATIONS[id]?.[original.title], item);
            return <li key={i}>{section.items[i]}<StepImages language={translated ? 'en' : 'ru'} images={translated ? images.map(image=>({...image,caption:englishIllustrationCaption(image.caption) ?? image.caption})) : images}/></li>;
          })}</ul>
          {section.images && <div className="mt-3 flex flex-wrap gap-3">{section.images.map(image => <figure key={image.file} className="w-40 max-w-full text-xs text-phos-500"><a href={`https://voicesofthevoid.wiki.gg/wiki/File:${image.file}`} target="_blank" rel="noreferrer"><img className="h-28 w-full object-contain" loading="lazy" src={`https://voicesofthevoid.wiki.gg/images/${image.file}`} alt={image.caption} onError={e => {e.currentTarget.hidden = true;}}/><figcaption className="mt-1 underline">{image.caption} · {translated ? 'wiki image' : 'изображение вики'} ↗</figcaption></a></figure>)}</div>}
          {section.images && <p className="mt-2 text-xs text-phos-500">{translated ? 'Images: Voices of the Void Wiki; rights belong to MrDrNose and/or their licensors. If an image is unavailable, open the link.' : 'Изображения: Voices of the Void Wiki; права принадлежат MrDrNose и/или правообладателям. Если изображение недоступно, откройте ссылку.'}</p>}
        </section>;
      })}
      {(STEP_ILLUSTRATIONS[id] || SECTION_ILLUSTRATIONS[id]) && <p className="text-xs text-phos-500">{translated ? 'Step illustrations: Voices of the Void Wiki. Rights belong to MrDrNose and/or their licensors; loading requires a connection to the wiki. If an image is unavailable, use the link below it.' : 'Иллюстрации к шагам: Voices of the Void Wiki. Права принадлежат MrDrNose и/или правообладателям; загрузка требует подключения к вики. Если изображение не появилось, используйте ссылку под ним.'}</p>}
      {shown.note && <p className="border-l-2 border-amber-glow pl-3 text-xs leading-relaxed text-amber-glow">{translated ? 'Important' : 'Важно'}: {shown.note}</p>}
      {shown.images && <div className="flex flex-wrap gap-3">{shown.images.map(image => <figure key={image.file} className="w-40 max-w-full text-xs text-phos-500">
        <a href={`https://voicesofthevoid.wiki.gg/wiki/File:${image.file}`} target="_blank" rel="noreferrer"><img className="h-28 w-full rounded object-contain" loading="lazy" src={`https://voicesofthevoid.wiki.gg/images/${image.file}`} alt={image.caption} onError={e => {e.currentTarget.hidden = true;}}/><figcaption className="mt-1 underline">{image.caption} · {translated ? 'wiki image' : 'изображение вики'} ↗</figcaption></a>
      </figure>)}</div>}
      {shown.images && <p className="text-xs text-phos-500">{translated ? 'Images: Voices of the Void Wiki; rights belong to MrDrNose and/or their licensors. If an image is unavailable, open the link below it.' : 'Изображения: Voices of the Void Wiki; права принадлежат MrDrNose и/или соответствующим правообладателям. Если изображение недоступно, откройте ссылку под ним.'}</p>}
      {shown.sources && <><div className="flex flex-wrap gap-3 text-xs">{shown.sources.map(source => {
        const counterpart = !en ? russianAchievementCounterpart(source.url) : undefined;
        return <span key={source.url} className="flex flex-wrap gap-3"><a className="text-phos-400 underline" href={source.url} target="_blank" rel="noreferrer">{source.label}{!en && source.url.includes('voicesofthevoid.wiki.gg/wiki/') ? ' (англ., источник)' : ''} ↗</a>{counterpart && <a className="text-phos-400 underline" href={counterpart.url} target="_blank" rel="noreferrer">{counterpart.label} ↗</a>}</span>;
      })}</div>{!en && shown.sources.some(source=>russianAchievementCounterpart(source.url)) && <p className="text-xs text-phos-500">Русские статьи могут отличаться по версии и содержанию; гайд основан на указанном английском источнике.</p>}</>}
    </div>}
  </details>;
}

type Props = {
  locations: Location[]; progress: Record<string, LocState>; item?: string; globalMarks: Marks; globalError: boolean; globalSaveFailed: boolean;
  advancements: Marks; profileName: string; profiles: { id: string; name: string }[]; profileId: string;
  profileError: boolean; profileSaveFailed: boolean;
  guideSteps: Marks; onGuideStep: (id:string,value:boolean)=>void;
  onProfile: (id: string) => void; onMark: (kind: AchievementKind, id: string, value: boolean) => void;
};
export default function AchievementsPage(props: Props) {
  const { language } = useLanguage();
  const en = language === 'en';
  const initial = ACHIEVEMENTS.find(a => a.id === props.item);
  const [kind, setKind] = useState<AchievementKind>(initial?.kind ?? 'achievement');
  const [query, setQuery] = useState(initial?.title ?? '');
  const [spoilers, setSpoilers] = useState(Boolean(initial?.spoiler));
  const [missing, setMissing] = useState(false);
  const [legacy, setLegacy] = useState(Boolean(initial?.legacy));
  const marks = kind === 'achievement' ? props.globalMarks : props.advancements;
  const entries = ACHIEVEMENTS.filter(a => a.kind === kind && (legacy || !a.legacy)).map(a => en ? englishAchievement(a) ?? a : a);
  const matching = entries.filter(a => (spoilers || !a.spoiler) && (!missing || !marks[a.id]) && `${a.title} ${a.condition} ${a.reward}`.toLocaleLowerCase(language).includes(query.trim().toLocaleLowerCase(language)));
  const count = entries.filter(a => marks[a.id]).length;
  const locked = kind === 'achievement' ? props.globalError : props.profileError;
  return <div className="relative min-h-screen">
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden><img src={bg} alt="" className="h-full w-full object-cover object-center opacity-85"/><div className="absolute inset-0 bg-ink-950/85"/><div className="absolute inset-0 noise"/></div><div className="crt-overlay" aria-hidden />
    <div className="relative mx-auto max-w-[1200px] px-3 py-4 sm:px-5 lg:px-8">
      <SiteNav page="achievements" locations={props.locations} progress={props.progress} />
      <header className="panel corner p-5 sm:p-6"><p className="panel-title">{en ? 'OPERATOR ARCHIVE / CHECKLIST' : 'АРХИВ ОПЕРАТОРА / ЧЕК-ЛИСТ'}</p><h1 className="glow mt-3 font-pixel text-lg leading-relaxed text-phos-300 sm:text-2xl">{en ? 'ACHIEVEMENTS' : 'ДОСТИЖЕНИЯ'}</h1><p className="mt-3 text-sm leading-relaxed">{en ? 'Mark items manually: the site does not read game data or unlock achievements. Global achievements and per-save advancements are separate lists.' : 'Отмечайте вручную: сайт не считывает данные игры и не открывает достижения. Общие достижения и advancements сохранения — разные списки.'}</p><p className="mt-3 border-l-2 border-amber-glow pl-3 text-xs leading-relaxed text-amber-glow">{en ? 'The wiki marks its list as incomplete; conditions and rewards may differ in your version. Guides summarize the wiki and have not been tested in-game. Checked 12 November 2026. ' : 'Вики помечает список как незавершённый; условия и награды могут отличаться в вашей версии. Гайды пересказаны по вики, в игре не проверены. Сверка 12.11.2026. '}<a className="underline" href={ACHIEVEMENTS_SOURCE} target="_blank" rel="noreferrer">{en ? 'Wiki revision ↗' : 'Ревизия вики (англ.) ↗'}</a>{!en && <> · <a className="underline" href="https://voicesofthevoid.wiki.gg/ru/wiki/Достижения" target="_blank" rel="noreferrer">Достижения на русской вики ↗</a> (статьи могут различаться по версии)</>}</p></header>
      <main className="mt-4 space-y-4">
        <section className="panel corner p-4" aria-label={en ? 'Achievement filters' : 'Фильтры достижений'}>
          <div className="flex flex-wrap gap-2"><button type="button" className={`btn-term ${kind === 'achievement' ? 'border-phos-500 text-phos-200' : ''}`} aria-pressed={kind === 'achievement'} onClick={()=>setKind('achievement')}>{en ? 'Game achievements' : 'Достижения игры'}</button><button type="button" className={`btn-term ${kind === 'advancement' ? 'border-phos-500 text-phos-200' : ''}`} aria-pressed={kind === 'advancement'} onClick={()=>setKind('advancement')}>{en ? 'Save advancements' : 'Advancements сохранения'}</button></div>
          <p className="mt-3 text-xs leading-relaxed text-phos-500">{kind === 'achievement' ? (en ? 'Game achievements are shared across site profiles, stored only in this browser and excluded from profile exports.' : 'Достижения общие для игры: отметки общие для всех профилей сайта, хранятся только в этом браузере и не входят в экспорт профиля.') : (en ? `Advancements belong to the save: checkmarks are tied to profile “${props.profileName}” and included in its export.` : `Advancements относятся к сохранению: отметки привязаны к профилю «${props.profileName}» и входят в его экспорт.`)}</p>
          <label className="mt-3 flex flex-wrap items-center gap-2 text-xs text-phos-400">{en ? 'Profile' : 'Прохождение'} <select className="input-term w-auto" aria-label={en ? 'Profile for guides and advancements' : 'Профиль для гайдов и advancements'} value={props.profileId} onChange={e=>props.onProfile(e.target.value)}>{props.profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <p className="mt-2 text-xs text-phos-500">{en ? 'Guide steps are saved in the selected profile, separately from achievement checkmarks.' : 'Шаги гайдов сохраняются отдельно от отметки достижения, в выбранном профиле.'}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4"><label className="flex min-w-48 flex-1 items-center gap-2 text-xs text-phos-400">{en ? 'Search' : 'Поиск'} <input aria-label={en ? 'Search achievements' : 'Поиск достижений'} value={query} onChange={e=>setQuery(e.target.value)} className="input-term" placeholder={en ? 'Title or condition…' : 'Название или условие…'} /></label><label className="flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={spoilers} onChange={e=>setSpoilers(e.target.checked)}/> {en ? 'Show spoilers' : 'Показать спойлеры'}</label><label className="flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={missing} onChange={e=>setMissing(e.target.checked)}/> {en ? 'Only unmarked' : 'Только неотмеченные'}</label><label className="flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={legacy} onChange={e=>setLegacy(e.target.checked)}/> {en ? 'Older versions' : 'Старые версии'}</label></div>
          <p className="mt-3 text-xs text-phos-500">{en ? `Marked ${count} / ${entries.length}${legacy ? ' (including older versions)' : ' · excluding older versions'} · showing ${matching.length}. Some entries are hidden while spoilers are off.` : `Отмечено ${count} / ${entries.length}${legacy ? ' (включая старые)' : ' · без старых версий'} · показано ${matching.length}. Часть записей скрыта, пока выключены спойлеры.`}</p>
          {locked && <p role="alert" className="mt-2 text-xs text-alert">{en ? 'Could not read saved checkmarks. Editing is disabled to avoid overwriting browser data.' : 'Не удалось прочитать сохранённые отметки. Изменение отключено, чтобы не перезаписать данные браузера.'}</p>}
          {!locked && (kind === 'achievement' ? props.globalSaveFailed : props.profileSaveFailed) && <p role="alert" className="mt-2 text-xs text-alert">{en ? 'Could not save checkmarks in the browser.' : 'Не удалось сохранить отметки в браузере.'}</p>}
          {kind === 'achievement' && props.profileError && <p role="alert" className="mt-2 text-xs text-alert">{en ? 'Could not read the profile: guide step checkmarks are disabled.' : 'Не удалось прочитать профиль: отметки шагов гайдов отключены.'}</p>}
          {kind === 'achievement' && !props.profileError && props.profileSaveFailed && <p role="alert" className="mt-2 text-xs text-alert">{en ? 'Could not save guide steps in the profile.' : 'Не удалось сохранить шаги гайдов в профиле.'}</p>}
        </section>
        {matching.length === 0 && <p className="panel p-4 text-sm text-phos-500">{en ? 'No results. Check the search, spoiler and older version filters.' : 'Ничего не найдено. Проверьте поиск и фильтры спойлеров и старых версий.'}</p>}
        <ul className="space-y-2">{matching.map(a=><li key={a.id} className="panel corner p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h2 className="text-sm font-bold text-phos-300">{a.title}{a.legacy && <span className="ml-2 text-xs font-normal text-amber-glow">{en ? 'older version' : 'старая версия'}</span>}</h2><p className="mt-2 text-sm leading-relaxed">{a.condition}</p><p className="mt-2 text-xs text-phos-500">{en ? 'Reward' : 'Награда'}: {a.reward}</p></div><label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-phos-300"><input type="checkbox" aria-label={`${en ? 'Obtained' : 'Получено'}: ${a.title} — ${a.condition}`} disabled={locked} checked={Boolean(marks[a.id])} onChange={e=>props.onMark(a.kind,a.id,e.target.checked)}/> {en ? 'Obtained' : 'Получено'}</label></div>{a.id === 'upgrade' && <a className="btn-term mt-3 normal-case" href={OMEGA_GUIDE_HREF}>{en ? 'Full Kerfur-Omega guide in the journal ↗' : 'Полный гайд Kerfur-Omega в журнале ↗'}</a>}{ACHIEVEMENT_GUIDES[a.id] && <Guide guide={ACHIEVEMENT_GUIDES[a.id]} id={a.id} spoilers={spoilers} marks={props.guideSteps} onStep={props.onGuideStep} disabled={props.profileError}/>}<div className="mt-3 flex flex-wrap gap-3 text-xs"><a className="text-phos-400 underline" href={ACHIEVEMENTS_SOURCE} target="_blank" rel="noreferrer">{en ? 'Requirements on the wiki ↗' : 'Источник условий (англ.) ↗'}</a>{!en && <a className="text-phos-400 underline" href="https://voicesofthevoid.wiki.gg/ru/wiki/Достижения" target="_blank" rel="noreferrer">Достижения на русской вики ↗</a>}{a.locationId && <a href={`#/journal?loc=${encodeURIComponent(a.locationId)}`} className="text-phos-400 underline">{en ? 'Related journal location ↗' : 'Связанная точка в журнале ↗'}</a>}{a.collection && <a href={`#/journal?collection=${a.collection}`} className="text-phos-400 underline">{en ? 'Related journal collection ↗' : 'Связанная коллекция в журнале ↗'}</a>}</div></li>)}</ul>
      </main>
    </div>
  </div>;
}
