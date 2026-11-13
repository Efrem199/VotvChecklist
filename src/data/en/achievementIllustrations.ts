// Keyed by the original caption rather than file: the same image may have
// different meanings in different guides (item view, result, or example).
const captions: Record<string,string> = {
 'Духовка до ремонта':'Oven before repair', 'Панель с четырьмя винтами':'Panel with four screws', 'Пример соединения проводов, а не готовая схема':'Example wire connection, not a finished diagram', 'Починенная духовка':'Repaired oven',
 'Лопата на балке TR2':'Shovel on the TR2 beam', 'Закрытый сейф — вид предмета':'Closed safe · item view', 'Открытый сейф — результат':'Open safe · result', 'Удочка — вид предмета':'Fishing rod · item view',
 'Руна земли · вид предмета':'Earth rune · item view', 'Руна воздуха · вид предмета':'Air rune · item view', 'Руна огня · вид предмета':'Fire rune · item view', 'Руна воды · вид предмета':'Water rune · item view', 'Хижина с порталом':'Shack with portal', 'Алтарь финального ритуала':'Final ritual altar',
 'Место ритуала Erie у Sierra':'Erie ritual site at Sierra', 'Ожившая Erie — результат ритуала':'Living Erie · ritual result', 'Портал в центре Стоунхенджа':'Portal in the center of Stonehenge',
 'Шар теста · вид предмета':'Dough ball · item view', 'Основа пиццы после раскатывания · вид предмета':'Rolled pizza dough · item view', 'Готовый хлеб · вид предмета':'Finished bread · item view', 'Сырая булочка · вид предмета':'Uncooked bun · item view', 'Противень · вид предмета':'Baking tray · item view',
 'Метка противника на радаре':'Enemy marker on the radar', 'Топор в хижине':'Axe in the shack', 'Молотов · вид предмета':'Molotov · item view', 'Тоннель над бассейном в обучении':'Tunnel above the tutorial pool',
 'Место жёлтой ядерной Аргемии':'Nuclear Yellow Argemia location', 'Приблизительное место розовой ядерной Аргемии':'Approximate Nuclear Pink Argemia location', 'Место оранжевой ядерной Аргемии в небе':'Nuclear Orange Argemia location in the sky',
 'Костюм горничной':'Maid outfit', 'Красная Аргемия в кратере':'Red Argemia in the crater', 'Зелёная Аргемия на горе':'Green Argemia on the mountain', 'Синяя Аргемия в реке':'Blue Argemia in the river', 'Пример: сэндвич в серверной базы':'Example: sandwich in the base server room',
 'Зелёный огонь в закрытой зоне':'Green fire in the restricted area', 'Портал в Стоунхендже':'Portal at Stonehenge', 'Место появления игрушки Erie':'Erie plush spawn location', 'Подготовка ритуала Abandoned Kerfur':'Preparing the Abandoned Kerfur ritual', 'Пример: яйцо у координатного радара 1':'Example: egg at coordinate radar 1', 'Кулинарная книга':'Cooking book',
};
export function englishIllustrationCaption(caption:string):string | undefined {
 if (captions[caption]) return captions[caption];
 const numbered = /^(Сэндвич|Человеческий череп|Яйцо|Тыква) (\d+): место находки$/.exec(caption);
 if (!numbered) return undefined;
 const kind:Record<string,string> = {'Сэндвич':'Sandwich', 'Человеческий череп':'Human skull', 'Яйцо':'Egg', 'Тыква':'Pumpkin'};
 return `${kind[numbered[1]]} ${numbered[2]}: location`;
}
