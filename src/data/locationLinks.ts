import type { Location } from './locations';
import { VERIFIED_WIKI_PAGES } from './wikiTranslations';

const enTools = 'https://voicesofthevoid.wiki.gg/wiki/Secrets/Hidden_Items/Tools';
const enMisc = 'https://voicesofthevoid.wiki.gg/wiki/Secrets/Hidden_Items/Miscellaneous_Collectibles';
const enDigging = 'https://voicesofthevoid.wiki.gg/wiki/Digging?oldid=24727#Unique';
const ruTools = 'https://voicesofthevoid.wiki.gg/ru/wiki/Секреты/Скрытые_Инструменты';
const ruPlush = 'https://voicesofthevoid.wiki.gg/ru/wiki/Секреты/Скрытые_предметы/Плюшевые_Аргемии';
const legacy: Record<string,{en:string;ru?:string}> = {
 's-capsule': VERIFIED_WIKI_PAGES.capsule,
 's-fishing': {en:enTools+'#Fishing_Rod',ru:ruTools+'#Удочка'},
 's-emf': {en:enTools+'#EMF_Detector',ru:ruTools+'#EMF_детектор'},
 's-pickaxe': {en:enTools+'#Pickaxe',ru:ruTools+'#Кирка'},
 's-mre': {en:'https://voicesofthevoid.wiki.gg/wiki/Barrel#World',ru:'https://voicesofthevoid.wiki.gg/ru/wiki/Бочка#Локации'},
 's-drives': {en:enDigging},
 's-wasps': {en:enDigging},
 's-limestone': {en:enMisc+'#Giant_Limestone_Slab'},
 's-mug': {en:enMisc+'#Argemia_Mug'},
};
/** Return only manually checked subject matches. The review panel retains its
 * original revision URLs; localized pages may describe other game versions. */
export function locationWikiLinks(loc: Location, language:'en'|'ru'): {url:string; label:string}[] {
 if (!loc.source) return [];
 const isLegacy = loc.source.startsWith('https://eternitydev.wiki.gg/');
 if (isLegacy) {
  const pair = legacy[loc.id];
  if (!pair) return [];
  return language === 'ru' && pair.ru ? [{url:pair.ru,label:'вики ↗'}] : [{url:pair.en,label:language === 'ru' ? 'вики (англ.) ↗' : 'wiki ↗'}];
 }
 const links = [{url:loc.source,label:language === 'ru' ? 'источник (англ.) ↗' : 'wiki ↗'}];
 if (language === 'ru' && loc.source === enTools) links.unshift({url:ruTools,label:'вики на русском ↗'});
 if (language === 'ru' && loc.source === 'https://voicesofthevoid.wiki.gg/wiki/Secrets/Hidden_Items/Argemia_Plushies') links.unshift({url:ruPlush,label:'вики на русском ↗'});
 return links;
}
