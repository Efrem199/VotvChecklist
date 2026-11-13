import type { Review } from '../review';

const scopes: Record<string,string> = {
 'Название и координаты':'Name and coordinates',
 'Координаты закопанного сэндвича':'Buried sandwich coordinates',
 'Координаты черепа под кораблём':'Coordinates of the skull under the ship',
 'Координаты ящика рыбака':'Fisherman’s box coordinates',
 'Координаты и расположение сэндвича':'Sandwich coordinates and location',
 'Координаты и расположение в списке предметов':'Coordinates and location in the item list',
 'Расположение и условия получения по странице Аргемий':'Location and requirements according to the Argemia page',
 'Расположение и способ получения по странице инструментов':'Location and method according to the tools page',
 'Координаты по списку раскопок; другие сведения проверены не полностью':'Coordinates from the digging list; other details were not fully checked',
 'Расположение и условия по странице предметов':'Location and requirements according to the item page',
};
const notes: Record<string,string> = {
 'dig-cyan-disputed':'The digging page lists Nuclear Cyan at X:634 / Y:181.4, but the Argemia page has no Nuclear Cyan section and separately describes Nuclear Yellow at X:-634.14 / Y:181.37. It is unclear whether these entries refer to the same item or different ones.',
 'burger-buried':'Sandwich list: X:157 / Y:-584.3; digging page: X:157 / Y:-584.7. The reason for the discrepancy is not stated.',
 'skull-6':'Skull list: X:637.3 / Y:44.2; digging page: X:637.4 / Y:44.2. The reason for the discrepancy is not stated.',
 's-fishing':'Tools page: X:176.06 / Y:-460.41; digging page: X:176 / Y:-460.6. The reason for the discrepancy is not stated.',
};
const labels: Record<string,string> = {
 'Страница коллекционных предметов (ревизия вики)':'Collectibles page (wiki revision)', 'Инструменты (ревизия вики)':'Tools (wiki revision)', 'Раскопки (ревизия вики)':'Digging (wiki revision)', 'Аргемии (ревизия вики)':'Argemias (wiki revision)', 'Раскопки: Nuclear Cyan':'Digging: Nuclear Cyan', 'Аргемии: Nuclear Yellow':'Argemias: Nuclear Yellow', 'Сэндвичи':'Sandwiches', 'Раскопки':'Digging', 'Черепа':'Skulls', 'Инструменты':'Tools',
};
export function englishReview(id:string, review:Review): Review {
 return {...review, scope:review.scope ? scopes[review.scope] ?? review.scope : undefined, note:review.note ? notes[id] ?? review.note : undefined, sources:review.sources?.map(s=>({...s, label:labels[s.label] ?? s.label}))};
}
