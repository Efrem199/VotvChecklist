import type { Location } from './locations';

/** Сверка текста вики, а не проверка в игре. Версия игры не выводится из даты ревизии. */
export type ReviewStatus = 'wiki-reviewed' | 'disputed' | 'unreviewed' | 'user';
export interface Review {
  status: ReviewStatus;
  checkedAt?: string;
  scope?: string;
  gameVersion?: string;
  sources?: { label: string; url: string }[];
  note?: string;
}
const date = '2026-11-12';
const wiki = 'https://voicesofthevoid.wiki.gg/wiki/';
const misc = `${wiki}Secrets/Hidden_Items/Miscellaneous_Collectibles?oldid=24700`;
const plush = `${wiki}Secrets/Hidden_Items/Argemia_Plushies?oldid=25406`;
const tools = `${wiki}Secrets/Hidden_Items/Tools?oldid=25078`;
const digging = `${wiki}Digging?oldid=24727`;
const reviewed = (scope: string, sources: Review['sources']): Review => ({ status: 'wiki-reviewed', checkedAt: date, scope, sources });
const conflict = (scope: string, note: string, sources: Review['sources']): Review => ({status:'disputed', checkedAt:date, scope, note, sources});
const a = (label: string, url: string) => ({label, url});
const miscSource = [a('Страница коллекционных предметов (ревизия вики)',misc)];
const toolSource = [a('Инструменты (ревизия вики)',tools)];
const digSource = [a('Раскопки (ревизия вики)',digging)];
const plushIds = new Set(['argemia-red','argemia-green','argemia-blue','argemia-nuclear-pink','argemia-nuclear-yellow','argemia-nuclear-orange','argemia-magenta','argemia-cyan','argemia-yellow','argemia-black','argemia-white','argemia-gold']);
const toolIds = new Set(['tool-lead-pipe','tool-gas-can','tool-shovel-checkpoint','tool-shovel-tr2','tool-shovel-shack','tool-shovel-stonehenge','tool-axe','tool-hooks','tool-boots','tool-geiger','tool-generator','tool-lantern','tool-ritual-knife','tool-water-tr1','tool-water-tr2','tool-water-tr3','tool-helmet']);
const digIds = new Set(['dig-cactus','dig-maid-safe','dig-unnamed','dig-basalt','dig-dream','dig-joint-1','dig-joint-2','dig-joint-3','dig-joint-4','dig-joint-5','dig-joint-6','s-drives','s-emf']);
const burgerIds = new Set(['burger-server','burger-toilet','burger-oven','burger-basement','burger-garage','burger-vent','burger-dome','burger-tower','burger-bridge','s-burger-tr2','burger-lake','burger-juliett','burger-whiskey','burger-stonehenge','burger-shack','burger-ship','burger-trees','burger-hole','burger-cave','burger-mushrooms']);
const skullIds = new Set(['skull-1','skull-2','skull-3','skull-4','skull-5','skull-7']);
const tileIds = new Set(['tile-1','tile-2','tile-3','tile-4','tile-5','tile-6','tile-7','tile-8','tile-9']);
export function reviewFor(loc: Location): Review {
 if (loc.category === 'custom') return {status:'user'};
 if (loc.id === 'dig-cyan-disputed') return conflict('Название и координаты', 'Страница раскопок перечисляет Nuclear Cyan у X:634 / Y:181.4, но на странице Аргемий нет раздела Nuclear Cyan; там отдельно описана Nuclear Yellow у X:-634.14 / Y:181.37. Неясно, относятся ли записи к одному предмету или к разным.', [a('Раскопки: Nuclear Cyan',digging+'#Unique'),a('Аргемии: Nuclear Yellow',plush+'#Nuclear_Yellow')]);
 if (loc.id === 'burger-buried') return conflict('Координаты закопанного сэндвича', 'Список сэндвичей: X:157 / Y:-584.3; статья о раскопках: X:157 / Y:-584.7. Причина расхождения не указана.', [a('Сэндвичи',misc+'#Chicken_Sandwiches'),a('Раскопки',digging+'#Unique')]);
 if (loc.id === 'skull-6') return conflict('Координаты черепа под кораблём', 'Список черепов: X:637.3 / Y:44.2; статья о раскопках: X:637.4 / Y:44.2. Причина расхождения не указана.', [a('Черепа',misc+'#Human_Skull_Locations'),a('Раскопки',digging+'#Unique')]);
 if (loc.id === 's-fishing') return conflict('Координаты ящика рыбака', 'Страница инструментов: X:176.06 / Y:-460.41; статья о раскопках: X:176 / Y:-460.6. Причина расхождения не указана.', [a('Инструменты',tools+'#Fishing_Rod'),a('Раскопки',digging+'#Unique')]);
 if (burgerIds.has(loc.id)) return reviewed('Координаты и расположение сэндвича', miscSource);
 if (skullIds.has(loc.id) || tileIds.has(loc.id)) return reviewed('Координаты и расположение в списке предметов',miscSource);
 if (plushIds.has(loc.id)) return reviewed('Расположение и условия получения по странице Аргемий', [a('Аргемии (ревизия вики)',plush)]);
 if (toolIds.has(loc.id)) return reviewed('Расположение и способ получения по странице инструментов',toolSource);
 if (digIds.has(loc.id)) return reviewed('Координаты по списку раскопок; другие сведения проверены не полностью',digSource);
 if (['s-mug','s-limestone','tool-candle','plush-kel','plush-antibreather'].includes(loc.id)) return reviewed('Расположение и условия по странице предметов',miscSource);
 return {status:'unreviewed'};
}
