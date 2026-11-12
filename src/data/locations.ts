export type CategoryId = "dishes" | "power" | "radars" | "poi" | "secrets" | "custom";

export type MarkerKind = "dish" | "tr" | "cr" | "base" | "poi" | "secret" | "custom";

export interface TaskDef {
  key: string;
  label: string;
}

export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  spoiler?: boolean;
}

export interface Location {
  id: string;
  category: CategoryId;
  kind: MarkerKind;
  name: string;
  alt?: string;
  code?: string;
  x?: number;
  y?: number;
  desc?: string;
  group?: string;
}

export const CATEGORIES: Category[] = [
  { id: "dishes", title: "Тарелки", subtitle: "24 антенны массива · Bravo – Yankee" },
  { id: "power", title: "Энергосеть", subtitle: "Подстанция и три трансформатора" },
  { id: "radars", title: "Координатные радары", subtitle: "CR 1–3 · по 8 предохранителей в каждом" },
  { id: "poi", title: "Точки интереса", subtitle: "Объекты станции, лес и закрытые зоны" },
  { id: "secrets", title: "Тайники", subtitle: "Закопанное и спрятанное · спойлеры", spoiler: true },
  { id: "custom", title: "Свои точки", subtitle: "Добавляй всё, что хочешь помнить" },
];

const VISITED: TaskDef = { key: "visited", label: "Был" };
const CAMERA: TaskDef = { key: "camera", label: "Камера" };

export const DEFAULT_TASKS: Record<CategoryId, TaskDef[]> = {
  dishes: [VISITED, CAMERA, { key: "server", label: "Апгрейд сервера" }],
  power: [VISITED, CAMERA, { key: "upgrade", label: "Апгрейд" }, { key: "clean", label: "Прибрано" }],
  radars: [VISITED, CAMERA, { key: "fuses", label: "Предохранители" }],
  poi: [VISITED, CAMERA, { key: "explored", label: "Обыскано" }],
  secrets: [VISITED, { key: "found", label: "Найдено" }],
  custom: [VISITED, CAMERA, { key: "done", label: "Готово" }],
};

/** Ключи задач, которые считаются «апгрейдом/обслуживанием» для режима карты */
export const UPGRADE_KEYS = ["server", "upgrade", "fuses"];

const RING_INNER = "Внутреннее кольцо · ~200 м от базы";
const RING_MID = "Среднее кольцо · ~300 м";
const RING_OUTER = "Внешнее кольцо · ~500 м";

const dish = (
  code: string,
  name: string,
  alt: string,
  x: number,
  y: number,
  group: string,
  desc?: string,
): Location => ({
  id: `dish-${code.toLowerCase()}`,
  category: "dishes",
  kind: "dish",
  code,
  name,
  alt,
  x,
  y,
  group,
  desc,
});

export const DISHES: Location[] = [
  dish("B", "Bravo", "Barbel", -100, -200, RING_INNER),
  dish("C", "Charlie", "Caspari", 0, -200, RING_INNER),
  dish("D", "Delta", "Delaina", 100, -200, RING_INNER),
  dish("E", "Echo", "Eggen", 200, -100, RING_INNER),
  dish("F", "Foxtrot", "Fabia", 200, 0, RING_INNER, "Под фундаментом — Foxtrot Depths (секрет, 03:00)"),
  dish("G", "Golf", "Giotto", 200, 100, RING_INNER),
  dish("H", "Hotel", "Hagan", 100, 200, RING_INNER),
  dish("I", "India", "Ingo", 0, 200, RING_INNER),
  dish("J", "Juliett", "Joelle", -100, 200, RING_INNER),
  dish("K", "Kilo", "Khalid", -200, 100, RING_INNER),
  dish("L", "Lima", "Lea", -200, 0, RING_INNER),
  dish("M", "Mike", "Marcel", -200, -100, RING_INNER),
  dish("N", "November", "Noemie", -300, -300, RING_MID),
  dish("O", "Oscar", "Orell", 300, -300, RING_MID),
  dish("P", "Papa", "Pascale", 300, 300, RING_MID),
  dish("Q", "Quebec", "Quirin", -300, 300, RING_MID),
  dish("R", "Romeo", "Regula", -500, -500, RING_OUTER, "Рядом CR 3 и пещера"),
  dish("S", "Sierra", "Sergio", 0, -500, RING_OUTER, "Граффити «Erie Zone» на фундаменте"),
  dish("T", "Tango", "Teresa", 500, -500, RING_OUTER, "Рядом озеро и радиоактивные бочки в реке"),
  dish("U", "Uniform", "Ulrich", 500, 0, RING_OUTER, "Рядом заброшенная хижина и колодец"),
  dish("V", "Victor", "Vanessa", 500, 500, RING_OUTER, "Самый дальний юго-восточный угол"),
  dish("W", "Whiskey", "Walter", 0, 500, RING_OUTER, "Над ней — статуя Уильяма-защитника"),
  dish("X", "Xray", "Xaviera", -500, 500, RING_OUTER, "Рядом TR 2"),
  dish("Y", "Yankee", "Yacine", -500, 0, RING_OUTER, "Рядом Яма и трейлерный парк"),
];

export const POWER: Location[] = [
  {
    id: "substation",
    category: "power",
    kind: "tr",
    code: "ПС",
    name: "Подстанция",
    alt: "Substation",
    x: 64,
    y: 64,
    desc: "Узел всех ЛЭП рядом с базой. Три лампы показывают, какой TR упал. Есть верстак.",
  },
  {
    id: "tr1",
    category: "power",
    kind: "tr",
    code: "TR1",
    name: "Трансформатор 1",
    alt: "TR 1",
    x: 400,
    y: 200,
    desc: "Между Uniform и Papa. Записка с рецептом коктейля Молотова, газовые горелки.",
  },
  {
    id: "tr2",
    category: "power",
    kind: "tr",
    code: "TR2",
    name: "Трансформатор 2",
    alt: "TR 2",
    x: -540,
    y: 232,
    desc: "Западный край, у Xray. Лопата на балке под потолком, верстак в офисе, бургер на крыше.",
  },
  {
    id: "tr3",
    category: "power",
    kind: "tr",
    code: "TR3",
    name: "Трансформатор 3",
    alt: "TR 3",
    x: -400,
    y: -475,
    desc: "Северо-запад, у Romeo. Заколочен и завален мусором. Записка с рецептом кулера. Рядом могилы.",
  },
];

export const RADARS: Location[] = [
  {
    id: "cr1",
    category: "radars",
    kind: "cr",
    code: "CR1",
    name: "Координатный радар 1",
    alt: "CR 1",
    x: 104,
    y: 446,
    desc: "Чуть юго-восточнее Whiskey. Ничего примечательного.",
  },
  {
    id: "cr2",
    category: "radars",
    kind: "cr",
    code: "CR2",
    name: "Координатный радар 2",
    alt: "CR 2",
    x: 540,
    y: -325,
    desc: "Между Tango и Oscar. На втором ярусе — записка с рецептом предохранителя и пчелиный блок питания.",
  },
  {
    id: "cr3",
    category: "radars",
    kind: "cr",
    code: "CR3",
    name: "Координатный радар 3",
    alt: "CR 3",
    x: -624,
    y: -370,
    desc: "Северо-западнее Romeo, в папоротниках. Плитка за лестницей на третьем ярусе.",
  },
];

const G_STATION = "Объекты станции";
const G_FOREST = "Лес";
const G_RESTRICTED = "Закрытые зоны · за забором";

const poi = (
  id: string,
  name: string,
  alt: string | undefined,
  x: number | undefined,
  y: number | undefined,
  group: string,
  desc: string,
  kind: MarkerKind = "poi",
): Location => ({ id, category: "poi", kind, name, alt, x, y, group, desc });

export const POIS: Location[] = [
  {
    id: "base",
    category: "poi",
    kind: "base",
    code: "A",
    name: "База Alpha",
    alt: "Alpha Root Base",
    x: 0,
    y: 0,
    group: G_STATION,
    desc: "Центр массива. Дом, милый дом. Три этажа, гараж, подвал с автоматами.",
  },
  poi("tower", "Вышка связи", "Radio Tower", 20, -30, G_STATION, "Красно-белая мачта рядом с базой. Маяк для дрона."),
  poi(
    "hideout",
    "Бункер «Alpha Hideout»",
    "Alpha Hideout",
    20,
    25,
    G_STATION,
    "Подземное укрытие у базы. Ключ-карта достаётся крюком через щель. Внутри чертёж Kerfur-Omega.",
  ),
  poi(
    "turbines",
    "Ветряные турбины",
    "Wind Turbines",
    90,
    -400,
    G_STATION,
    "Четыре ветряка между Sierra и линией B–C–D. У западной турбины — ящик рыбака.",
  ),
  poi(
    "checkpoint",
    "КПП",
    "Security Booth",
    -370,
    700,
    G_STATION,
    "Точка старта на юго-западе. Шлагбаум опущен навсегда. Внутри лопата и диск с сигналом «funny».",
  ),
  poi("lake", "Озеро", "The Lake", 400, -400, G_FOREST, "Между Oscar и Tango. На дне сейф, кирка, табличка Воды и кое-что мясное."),
  poi(
    "shack",
    "Заброшенная хижина",
    "Abandoned Shack",
    410,
    25,
    G_FOREST,
    "Недалеко от Uniform. Вход через дыру в крыше. Лопата, топор, звериный череп. В 03:33 — портал.",
  ),
  poi(
    "trailers",
    "Трейлерный парк",
    "Trailer Park",
    -560,
    -55,
    G_FOREST,
    "Три вагончика строителей и брошенная техника рядом с Ямой. Место сюжетного события.",
  ),
  poi("hole", "Яма", "The Hole", -615, -30, G_FOREST, "Огороженная бездонная дыра у Yankee. Фонарь, консервы, куртки для Kerfur, тулбокс."),
  poi(
    "cave",
    "Пещера",
    "The Cave",
    -650,
    -590,
    G_FOREST,
    "Северо-западный угол. Гнёзда Вольфганга и Антибризера. Глубже — уголь, кварц и радиоактивные кристаллы.",
  ),
  poi("william", "Статуя Уильяма", "William The Protector", 10, 575, G_FOREST, "Смотровая над Whiskey. Медный козёл с четырьмя рогами. Иногда постамент пуст."),
  poi("well", "Колодец", "The Well", 564, 266, G_FOREST, "Южнее Uniform, заколочен досками. На дне кости и два полукрюка. Спать рядом — опасно."),
  poi("cabinet", "Зелёный шкаф", "Green Cabinet", 615, 628, G_FOREST, "Среди камней на юго-востоке. Панель для девяти плиток."),
  poi("swing", "Качели", "Swing", -416, -97, G_FOREST, "Хлипкие качели на обрыве с видом на массив. Внизу — скелет."),
  poi("graves", "Могилы", "Graves", -347, -563, G_FOREST, "Два замшелых надгробия над TR 3. Копать перед ними — плохая идея."),
  poi("sewer", "Сток в реке", "Sewer Opening", 672, -275, G_FOREST, "Труба в реке юго-восточнее Tango."),
  poi("barrels", "Бочки под водой", "Underwater Barrels", 570, -518, G_FOREST, "Радиоактивные бочки в реке восточнее Tango. Снижают макс. здоровье."),
  poi("car", "Машина под водой", "Underwater Car", -210, 307, G_FOREST, "Радиоактивный остов в реке восточнее Quebec. Одиннадцать костей рядом."),
  poi("fencetree", "Дерево в заборе", "Fence Tree", -700, -80, G_FOREST, "Забор проходит прямо сквозь дерево. На коре — предупреждение."),
  poi("newtrees", "Новые деревья", "New Tree Models", 516, -211, G_RESTRICTED, "Огороженная рощица: табличка Земли, ящики, пицца и записка «Have some food»."),
  poi("hatch", "Зелёный люк", "Green Hatch", 60, 625, G_RESTRICTED, "Люк не открывается. Рядом записка про снасти, счётчик Гейгера и очки."),
  poi("stonehenge", "Стоунхендж", "Stonehenge", 213, 541, G_RESTRICTED, "Каменный круг за забором. Место ритуала с семью черепами."),
  poi("village", "Заброшенная деревня", "Abandoned Village", 666, -666, G_RESTRICTED, "Руины и церковь со статуей Столаса. Ночью статуя бьёт молниями."),
];

const secret = (id: string, name: string, x: number | undefined, y: number | undefined, desc: string): Location => ({
  id,
  category: "secrets",
  kind: "secret",
  name,
  x,
  y,
  desc,
});

export const SECRETS: Location[] = [
  secret("s-capsule", "Радиоактивная капсула", -570, 303, "Закопана западнее Quebec, в пятне тёмной земли. Нужна для Kerfur-Omega."),
  secret("s-drives", "Коробка дисков LVL 3", -118, -41, "У бетонного столба рядом с базой. Ищется металлоискателем."),
  secret("s-emf", "EMF-детектор", -622, -31, "Закопан у Ямы."),
  secret("s-fishing", "Снасти рыбака", 90, -400, "Ящик у самой западной ветряной турбины: части удочки и наживка."),
  secret("s-mre", "Бочка с пайками", 235, -323, "Внутри полого бревна. 50 MRE."),
  secret("s-pickaxe", "Кирка", 391, -384, "На дне озера, воткнута в дерево."),
  secret("s-wasps", "Осиное гнездо", 420, 265, "Закопано северо-восточнее Papa. Лучше не ломать."),
  secret("s-limestone", "Известняковый блок", 567, 237, "Огромный блок южнее Uniform, у колодца."),
  secret("s-mug", "Кружка Аргемии", -58, -295, "На вершине столба ЛЭП. Только руками."),
  secret("s-candles", "Каменные свечи", undefined, undefined, "Восемь свечей кругом радиусом 650 вокруг базы. Зажигаются зажигалкой."),
  secret("s-burger-tr2", "Бургер на крыше TR 2", -540, 232, "Куриный бургер лежит на крыше второго трансформатора."),
];

export const BUILTIN_LOCATIONS: Location[] = [...DISHES, ...POWER, ...RADARS, ...POIS, ...SECRETS];

export const MAP_EXTENT = 750;
export const FENCE = 700;
export const CANDLE_RADIUS = 650;
