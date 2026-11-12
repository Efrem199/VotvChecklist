export default function SiteNav({ page }: { page: 'journal' | 'fun' }) {
  return <nav aria-label="Разделы сайта" className="panel mb-4 flex flex-wrap items-center gap-2 p-2 text-xs">
    <a href="#/" aria-current={page === 'journal' ? 'page' : undefined} className={`btn-term ${page === 'journal' ? 'border-phos-500 text-phos-200' : ''}`}>◈ Журнал обхода</a>
    <a href="#/fun" aria-current={page === 'fun' ? 'page' : undefined} className={`btn-term ${page === 'fun' ? 'border-amber-glow/70 text-amber-glow' : ''}`}>✦ Команды и приколы</a>
    <span className="px-2 text-phos-600">Отдельная страница · содержит спойлеры</span>
  </nav>;
}
