import type { Location } from '@/data/locations';

export function routeDistance(points: Location[]): number {
  return points.slice(1).reduce((sum, point, i) => sum + Math.hypot(point.x! - points[i].x!, point.y! - points[i].y!), 0);
}

export function routeSupplies(points: Location[]): string[] {
  const items = new Set<string>(['Фонарик и запас энергии; проверьте погоду и транспорт.']);
  for (const p of points) {
    if (p.id === 'tr2') items.add('У TR2: лопата для капсулы, защита от радиации и контейнер для перевозки.');
    if (p.id === 'dish-r') items.add('У Romeo: лопата для ящиков с шаровыми шарнирами.');
    if (p.id === 'hideout') items.add('У Alpha Hideout: крюк для карты доступа; инструмент, чтобы сломать вторую дверь.');
    if (p.id === 's-fishing') items.add('Для клада рыбака нужна лопата.');
    if (p.id === 'lake') items.add('В озере: сейф под водой; подготовьтесь к погружению и перевозке.');
  }
  return [...items];
}
