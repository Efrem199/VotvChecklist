// Иллюстрации wiki.gg привязаны к конкретному тексту; item — изображение предмета, а не процесса.
// Исходные страницы: Oven?oldid=12917, Kerfur-Omega, Ball_Joint, Safe, Easter_Eggs?oldid=24446,
// Halloween, Secrets/Hidden_Items/Miscellaneous_Collectibles, Cooking_Book?oldid=23010, Rituals?oldid=25741.
import { EXTRA_SECRETS } from './wikiItems';
import { wikiImage } from './wikiImages';

export interface GuideIllustration { file: string; caption: string; width?: number; original?: boolean }
type Images = Record<string, GuideIllustration[]>; // начало строки → изображения, в том же порядке
const shot = (file: string, caption: string, width?: number): GuideIllustration => width ? ({file,caption,width}) : ({file,caption,original:true});
const item = (file: string, caption: string): GuideIllustration => ({file,caption: `${caption} · вид предмета`,original:true});
const oven: Images = {
 'Возьмите отвёртку': [shot('Item_Oven_Ingame_Broken.png','Духовка до ремонта',120)],
 'Открутите четыре': [shot('Item_Oven_Ingame_RepairMenu.png','Панель с четырьмя винтами',120)],
 'Искры означают': [shot('Item_Oven_Ingame_RepairWires.png','Пример соединения проводов, а не готовая схема',120)],
 'С ключом в руках': [shot('Item_Oven_Ingame_Repaired.png','Починенная духовка',120)],
};
const runes: Images = {
 'Земля:': [item('Item_RuneEarth_Ingame_Transparent.png','Руна земли')],
 'Воздух:': [item('Item_RuneAir_Ingame_Transparent.png','Руна воздуха')],
 'Огонь:': [item('Item_RuneFire_Ingame_Transparent.png','Руна огня')],
 'Вода:': [item('Item_RuneWater_Ingame_Transparent.png','Руна воды')],
 'Хижина находится': [shot('Location_AbandonedShack.png','Хижина с порталом',240)],
 'Возьмите ритуальный нож': [shot('Secrets_LambertRitual_PayTribute.png','Алтарь финального ритуала',210)],
};
const dough = item('Item_DoughBall_Ingame_Transparent.png','Шар теста');
export const STEP_ILLUSTRATIONS: Record<string, Images> = {
 'oven-repair':oven,
 'charcoal-fish': {
  'Возьмите лопату': [shot('Item_Fishermans_treasure_Ingame_DiggedOut.png','Выкопанный клад рыбака',180)],
  'Соберите удочку': [shot('Item_Workbench_Ingame_Transparent.png','Верстак — место сборки')],
  'У воды': [shot('Item_FishingRod_Ingame.png','Удочка — вид предмета')],
 },
 'red-crown':runes,
 'shes-alive':{
  'Получите игрушку Erie': [shot('Secrets_SummoningErieRitual.png','Место ритуала Erie у Sierra',210)],
  'Положите на игрушку': [shot('Entity_LiveEriePlush.png','Ожившая Erie — результат ритуала',240)],
 },
 'portal':{'Положите все семь': [shot('Secrets_Stonehenge_PortalToHellRitual.png','Портал в центре Стоунхенджа')]},
 'adv-pizza': {
  'Сделайте тесто': [dough,item('Item_PizzaDough_Ingame_Transparent.png','Основа пиццы после раскатывания')],
 },
 'adv-bread': {
  'Сделайте шар теста': [dough],
  'Держа тесто': [item('Item_Bread_Ingame_Transparent.png','Готовый хлеб')],
 },
 'adv-cookie': {
  'Сделайте шар теста': [dough,item('Item_DoughBunBurger_Ingame_Transparent.png','Сырая булочка')],
  'Держа тесто': [item('Item_BakingTray_Ingame_Transparent.png','Противень')],
 },
};
const omega: Record<string, Images> = {
 'Руководство и вход в бункер': {
  'Alpha Hideout находится': [shot('Location_Bunker_Entrance.png','Вход в бункер Alpha Hideout')],
  'Вторую дверь откройте': [item('Item_KerfurOmegaDocumentsBinder_Ingame_Transparent.png','Папка с подсказками, не чертёж')],
  'Настоящий Complete Manual': [item('Item_KerfurManual_Ingame_Transparent.png','Чертёж Complete Manual')],
 },
 'Где взять компоненты': {
  'Kerfur Parts:': [item('Item_KerfurParts_Ingame_Transparent.png','Коробка Kerfur Parts')],
  'Ball Joints:': [shot('Item_BallJoint_BoxDigLocations.png','Места коробок шарниров у Romeo',240),item('Item_BallJoint_Ingame_Transparent.png','Ball Joint')],
  'Limb Joints:': [item('Item_LimbJoint_Ingame_Transparent.png','Limb Joint')],
  'Omega AI Module:': [shot('Object_VaultUnderwater_Ingame.png','Сейф на дне озера',120),item('Item_OmegaAIModule_Ingame_Transparent.png','Omega AI Module')],
  'Капсула:': [item('Item_RadioactiveCapsule_Ingame_Transparent.png','Радиоактивная капсула')],
  'Камера Good': [item('Item_CameraGood_Ingame_Transparent.png','Камера Good')],
 },
 'Как сделать лом': {
  'На верстаке соединяйте': [item('Item_PlasticScrap_Ingame_Transparent.png','Пластиковый лом')],
  '4 пустые банки': [item('Item_MetalScrap_Ingame_Transparent.png','Металлический лом')],
  '4 предмета электронного': [item('Item_ElectronicScrap_Ingame_Transparent.png','Электронный лом')],
  '4 пустые пивные': [item('Item_GlassScrap_Ingame_Transparent.png','Стеклянный лом')],
 },
 'Рецепты и окончательная сборка': {
  'Голова:': [shot('Item_KerfurOmegaHeadNoColor_Ingame_Transparent.png','Готовая голова Kerfur-Omega',130)],
  'Грудь:': [shot('Item_KerfurOmegaChestNoColor_Ingame_Transparent.png','Готовая грудь Kerfur-Omega',130)],
  'Таз:': [shot('Item_KerfurOmegaPelvisNoColor_Ingame_Transparent.png','Готовый таз Kerfur-Omega',130)],
  'Две руки': [shot('Item_KerfurOmegaArmNoColor_Ingame_Transparent.png','Одна из двух готовых рук',130)],
  'Две ноги': [shot('Item_KerfurOmegaLegNoColor_Ingame_Transparent.png','Одна из двух готовых ног',130)],
 },
};
const pumpkins = ['Cremator','TR3','Cave','TrailerPark','Well','UtilityPole','WindTurbine','Log','Pond','RiverEnd','DrainPipe','William','Stonehenge'];
const pumpkinCoordinates = ['X:-21.5','X:-400.7','X:-651.5','X:-547.0','X:564.4','X:173.9','X:118.4','X:349.7','X:394.2','X:543.1','X:671.7','X:12.6','X:210.4'];
const pumpkinImages: Images = Object.fromEntries(pumpkins.map((name, i) => [pumpkinCoordinates[i], [shot(`Item_HalloweenPumpkin_${name}.png`, `Тыква ${i + 1}: место находки`,100)]]));
const eggImages: Images = Object.fromEntries(Array.from({length:12}, (_, i) => [`#${i+1} `,[shot(`Item_EasterEgg${i+1}_Location.png`, `Яйцо ${i+1}: место находки`,180)]]));
const journalImages = (prefix: string, extraId?: string): Images => Object.fromEntries(
 EXTRA_SECRETS.filter(loc => loc.id.startsWith(prefix) || loc.id === extraId).flatMap(loc => {
  const image = wikiImage(loc.id);
  return image ? [[`${loc.name}:`,[shot(image.file.split('/File:')[1], `${loc.name}: место находки`,120)]]] : [];
 })
);
const burgers = journalImages('burger-', 's-burger-tr2');
const skulls = journalImages('skull-');
const boss: Record<string, Images> = {
 'Поиск и фазы': {'После ритуала': [shot('Event_AbandonedKerfur_RadarIndicator.jpg','Метка противника на радаре',120)]},
 'Подготовка и тактика': {
  'Перед боем': [shot('Item_Axe_AbandonedShackLocation.png','Топор в хижине')],
  'Вики рекомендует': [item('Item_Molotov_Ingame_Transparent.png','Молотов')],
 },
};
export const SECTION_ILLUSTRATIONS: Record<string, Record<string, Images>> = {
 upgrade:omega,
 'super-burger':{'Все 21 сэндвич':burgers}, 'adv-burger':{'Все 21 сэндвич':burgers},
 portal:{'Все семь человеческих черепов':skulls},
 easter:{'Все 12 пасхальных яиц':eggImages},
 'halloween-1':{'Все 13 тыкв Halloween':pumpkinImages}, horse:{'Все 13 тыкв Halloween':pumpkinImages},
 'abandoned-kerfur':boss, 'no-damage':boss,
 'seven-hours':{'Где искать игрушку':{'Во втором слое': [shot('Tutorial_7Hours.jpg','Тоннель над бассейном в обучении',120)]}},
 'sandbox-ariral':{'Где взять ядерную Аргемию':{
  'Самый простой вариант': [shot('Item_ArgemiaPlushNuclearYellow_HillLocation.png','Место жёлтой ядерной Аргемии')],
  'Розовая невидимо': [shot('Item_ArgemiaPlushNuclearPink_ApproximateLocation.png','Приблизительное место розовой ядерной Аргемии')],
  'Оранжевая находится': [shot('Item_ArgemiaPlushNuclearOrange_SkyLocation.png','Место оранжевой ядерной Аргемии в небе')],
 }},
};
export function illustrationsFor(mapping: Images | undefined, text: string): GuideIllustration[] {
 return mapping ? Object.entries(mapping).filter(([prefix]) => text.startsWith(prefix)).flatMap(([,images]) => images) : [];
}
export function imageUrl(image: GuideIllustration): string {
 return image.original ? `https://voicesofthevoid.wiki.gg/images/${image.file}` : `https://voicesofthevoid.wiki.gg/images/thumb/${image.file}/${image.width ?? 210}px-${image.file}`;
}
