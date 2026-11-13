import type { Location } from '@/data/locations';
import type { WikiLanguage } from '@/data/wikiTranslations';

export function routeDistance(points: Location[]): number {
  return points.slice(1).reduce((sum, point, i) => sum + Math.hypot(point.x! - points[i].x!, point.y! - points[i].y!), 0);
}

export function routeSupplies(points: Location[], language: WikiLanguage = 'ru'): string[] {
  const en = language === 'en';
  const items = new Set<string>([en ? 'Flashlight and spare energy; check the weather and transport.' : 'Фонарик и запас энергии; проверьте погоду и транспорт.']);
  for (const p of points) {
    if (p.id === 'tr2') items.add(en ? 'At TR2: a shovel for the capsule, radiation protection and a container for transport.' : 'У TR2: лопата для капсулы, защита от радиации и контейнер для перевозки.');
    if (p.id === 'dish-r') items.add(en ? 'At Romeo: a shovel for the ball joint boxes.' : 'У Romeo: лопата для ящиков с шаровыми шарнирами.');
    if (p.id === 'hideout') items.add(en ? 'At Alpha Hideout: a hook for the keycard and a tool to break the second door.' : 'У Alpha Hideout: крюк для карты доступа; инструмент, чтобы сломать вторую дверь.');
    if (p.id === 's-fishing') items.add(en ? 'A shovel is needed for the fisherman’s treasure.' : 'Для клада рыбака нужна лопата.');
    if (p.id === 'lake') items.add(en ? 'At the lake: the safe is underwater; prepare to dive and transport it.' : 'В озере: сейф под водой; подготовьтесь к погружению и перевозке.');
  }
  return [...items];
}
