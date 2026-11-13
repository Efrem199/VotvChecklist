// Manually checked counterparts, not URL-prefix substitutions. These pages can
// describe different game versions; a translated link is not a replacement
// for the original source of a claim. Add an entry only after checking both pages.
export type WikiLanguage = 'ru' | 'en';
export const VERIFIED_WIKI_PAGES = {
  omega: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Kerfur-Omega',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Омега-Кёрфур',
  },
  omegaManual: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Kerfur-Omega_Complete_Manual',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Кёрфур_Омега_Полная_инструкция',
  },
  ballJoint: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Ball_Joint',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Шарниры',
  },
  limbJoint: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Limb_Joint',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Шарниры',
  },
  safe: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Safe',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Сейф',
  },
  scrap: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Scrap',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Вторсырьё',
  },
  capsule: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Radioactive_Capsule',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Радиоактивная_капсула',
  },
  keycard: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Keycard',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Ключ_карта',
  },
  fishingRod: {
    en: 'https://voicesofthevoid.wiki.gg/wiki/Fishing_Rod',
    ru: 'https://voicesofthevoid.wiki.gg/ru/wiki/Удочка',
  },
} as const satisfies Record<string, Record<WikiLanguage, string>>;
