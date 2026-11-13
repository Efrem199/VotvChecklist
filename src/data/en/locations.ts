import type { Location } from '../locations';

// IDs are the storage and navigation keys; only built-in presentation changes.
type Text = { name?: string; desc?: string };
const text: Record<string, Text> = {
 'dish-f': {desc:'Foxtrot Depths lies below the foundation (secret, 03:00).'},
 'dish-r': {desc:'CR 3 and the cave are nearby.'},
 'dish-s': {desc:'“Erie Zone” graffiti on the foundation.'},
 'dish-t': {desc:'The lake and radioactive barrels in the river are nearby.'},
 'dish-u': {desc:'The abandoned shack and well are nearby.'},
 'dish-v': {desc:'The farthest southeast corner.'},
 'dish-w': {desc:'William the Protector’s statue is above the dish.'},
 'dish-x': {desc:'TR 2 is nearby.'},
 'dish-y': {desc:'The Hole and trailer park are nearby.'},
 substation:{name:'Substation',desc:'The power-line hub near the base. Three lights indicate which TR is down. There is a workbench.'},
 tr1:{name:'Transformer 1',desc:'Between Uniform and Papa. A Molotov recipe note and gas burners are here.'},
 tr2:{name:'Transformer 2',desc:'At the western edge near Xray. A shovel on a ceiling beam, a workbench in the office, and a sandwich on the roof.'},
 tr3:{name:'Transformer 3',desc:'In the northwest near Romeo. Boarded up and full of trash. A cooler recipe note is inside; graves are nearby.'},
 cr1:{name:'Coordinate radar 1',desc:'Just southeast of Whiskey. Nothing remarkable.'},
 cr2:{name:'Coordinate radar 2',desc:'Between Tango and Oscar. A fuse recipe note and bee power supply are on the second level.'},
 cr3:{name:'Coordinate radar 3',desc:'Northwest of Romeo among the ferns. A tile is behind the stairs on the third level.'},
 base:{name:'Alpha Root Base',desc:'The center of the array. Home sweet home. Three floors, a garage and a basement with vending machines.'},
 tower:{name:'Radio Tower',desc:'The red-and-white mast near the base. A beacon for the drone.'},
 hideout:{name:'Alpha Hideout',desc:'An underground shelter near the base. Retrieve the keycard through the gap with a hook. The Kerfur-Omega blueprint is inside.'},
 turbines:{name:'Wind Turbines',desc:'Four turbines between Sierra and the B–C–D line. The fisherman’s box is near the western turbine.'},
 checkpoint:{name:'Security Booth',desc:'The southwestern starting point. The barrier is permanently lowered. Inside are a shovel and a drive with the “funny” signal.'},
 lake:{name:'The Lake',desc:'Between Oscar and Tango. At the bottom are a safe, a pickaxe, the Water tablet and something meaty.'},
 shack:{name:'Abandoned Shack',desc:'Near Uniform. Enter through the hole in the roof. A shovel, an axe and an animal skull are inside. A portal appears at 03:33.'},
 trailers:{name:'Trailer Park',desc:'Three builders’ trailers and abandoned equipment near the Hole. A story event occurs here.'},
 hole:{name:'The Hole',desc:'A fenced, bottomless hole near Yankee. A lantern, canned food, Kerfur jackets and a toolbox are here.'},
 cave:{name:'The Cave',desc:'Northwestern corner. Wolfgang and Antibreather nests. Farther in are coal, quartz and radioactive crystals.'},
 william:{name:'William the Protector',desc:'An overlook above Whiskey. A four-horned copper goat; the pedestal is sometimes empty.'},
 well:{name:'The Well',desc:'South of Uniform, boarded up. Bones and two half hooks are at the bottom. Sleeping nearby is dangerous.'},
 cabinet:{name:'Green Cabinet',desc:'Among rocks in the southeast. It has a panel for nine tiles.'},
 swing:{name:'Swing',desc:'A rickety swing on a cliff overlooking the array. A skeleton lies below.'},
 graves:{name:'Graves',desc:'Two mossy gravestones above TR 3. Digging in front of them is a bad idea.'},
 sewer:{name:'Sewer Opening',desc:'A pipe in the river southeast of Tango.'},
 barrels:{name:'Underwater Barrels',desc:'Radioactive barrels in the river east of Tango. They reduce maximum health.'},
 car:{name:'Underwater Car',desc:'A radioactive wreck in the river east of Quebec. Eleven bones are nearby.'},
 fencetree:{name:'Fence Tree',desc:'The fence passes straight through a tree. There is a warning on its bark.'},
 newtrees:{name:'New Tree Models',desc:'A fenced grove: Earth tablet, crates, pizza and a “Have some food” note.'},
 hatch:{name:'Green Hatch',desc:'The hatch cannot be opened. A fishing gear note, Geiger counter and glasses are nearby.'},
 stonehenge:{name:'Stonehenge',desc:'A stone circle beyond the fence. Site of the seven-skull ritual.'},
 village:{name:'Abandoned Village',desc:'Ruins and a church with a Stolas statue. At night the statue strikes with lightning.'},
 's-capsule':{name:'Radioactive Capsule',desc:'Buried west of Quebec in a patch of dark soil. Needed for Kerfur-Omega.'},
 's-drives':{name:'Old drive box',desc:'A full box of drives buried near the base. Use a metal detector to find it.'},
 's-emf':{name:'EMF detector',desc:'Buried near the Hole beside a fallen construction light.'},
 's-fishing':{name:'Fisherman’s gear',desc:'Dig up the Fisherman’s Treasure box near the turbines; assemble the fishing rod from the parts at a workbench.'},
 's-mre':{name:'MRE barrel',desc:'Inside a hollow log. Contains 50 MREs.'},
 's-pickaxe':{name:'Pickaxe',desc:'Stuck in a tree at the bottom of the lake.'},
 's-wasps':{name:'Wasp nest',desc:'Buried northeast of Papa. Best not to break it.'},
 's-limestone':{name:'Limestone block',desc:'A giant slab buried in the forest near the Arirals’ treehouse.'},
 's-mug':{name:'Argemia mug',desc:'At the top of a power pole near Bravo and the turbines. A hook or another way to climb is needed.'},
 's-candles':{name:'Stone candles',desc:'Eight candles in a circle with a radius of 650 around the base. Light them with a lighter.'},
 'argemia-red':{name:'Argemia · Red',desc:'In the deep crater near Uniform. The nearby donut teleports you to the base.'},
 'argemia-green':{name:'Argemia · Green',desc:'On a mountaintop beyond the fence; reach it via the security booth roof or the gap near the Hole.'},
 'argemia-blue':{name:'Argemia · Blue',desc:'At the bottom of the river near the security booth, between the first two bridges. In winter it lies on the ice in a new save; in an old save it may remain underneath.'},
 'argemia-nuclear-pink':{name:'Argemia · Nuclear Pink',desc:'Story or Infinite mode. Invisible in the air at the height of the radio tower railing; knock it down with an object or drone and watch where it bounces.'},
 'argemia-nuclear-yellow':{name:'Argemia · Nuclear Yellow',desc:'Story or Infinite mode. Buried on a hill near TR 2; bring a shovel, digital map and preferably a metal detector.'},
 'argemia-nuclear-orange':{name:'Argemia · Nuclear Orange',desc:'Story or Infinite mode. High in the air beyond the fence on an invisible cube; reach it by flying or using half hooks along the boundary. A drone will not knock it down.'},
 'argemia-magenta':{name:'Argemia · Magenta',desc:'At the Rozital ship after finding the lifecrystal signal: start downloading the signal and head to the ship.'},
 'argemia-cyan':{name:'Argemia · Cyan',desc:'Place 12 shrimp packs in the emergency shower basin in the base signal room and blow them up, for example with a Molotov.'},
 'argemia-yellow':{name:'Argemia · Yellow',desc:'Place one shrimp pack at each of the four outer fence corners, and a fifth on the basement drain. Between 00:00 and 01:00, move away and look away, slightly upward.'},
 'argemia-black':{name:'Argemia · Black',desc:'At Stonehenge, open the portal with seven human skulls and sacrifice Red, Green, Blue, Magenta, Yellow and Cyan. A hook is required; Story/Infinite only.'},
 'argemia-white':{name:'Argemia · White',desc:'Arrange Red, Green, Blue, Magenta, Yellow and Cyan in a hexagon with sides about 5 m long. The plushies are consumed; the Hole fence can be used as a guide.'},
 'argemia-gold':{name:'Argemia · Gold',desc:'Dig up a rare gold ingot and watch it continuously for one real hour. Pausing, losing sight of it or unstable FPS resets the timer.'},
 'tool-lead-pipe':{name:'Lead pipe',desc:'In the base ventilation, near two MREs and a burning Molotov.'},
 'tool-gas-can':{name:'Small gas can',desc:'On the base garage roof. Initially contains 256 units of fuel; the increased capacity is lost once emptied.'},
 'tool-shovel-checkpoint':{name:'Shovel · Security Booth',desc:'In the security booth office; break the door open with an object.'},
 'tool-shovel-tr2':{name:'Shovel · TR 2',desc:'On the beams under the second transformer’s roof.'},
 'tool-shovel-shack':{name:'Shovel · Shack',desc:'Inside the abandoned shack, by the wall.'},
 'tool-shovel-stonehenge':{name:'Shovel · Stonehenge',desc:'At the supply crates near Stonehenge.'},
 'tool-axe':{name:'Axe',desc:'Under the dirty bed in the abandoned shack.'},
 'tool-hooks':{name:'Two half hooks',desc:'At the bottom of the well alongside bones.'},
 'tool-boots':{name:'Hiking boots',desc:'In the TR 3 office under a plastic garden chair.'},
 'tool-geiger':{name:'Geiger counter and capsule blueprint',desc:'On the ground near the green hatch.'},
 'tool-generator':{name:'Electric generator',desc:'Near the Hole; a portable fuel-powered supply.'},
 'tool-lantern':{name:'Lantern',desc:'On a metal table near the Hole, next to two MREs.'},
 'tool-ritual-knife':{name:'Ritual knife',desc:'In Story mode, enter the portal in the abandoned shack at 03:33; the knife is on the altar.'},
 'tool-water-tr1':{name:'Watering can · TR 1',desc:'On a shelf at the first transformer.'},
 'tool-water-tr2':{name:'Watering can · TR 2',desc:'On the beams at the second transformer.'},
 'tool-water-tr3':{name:'Watering can · TR 3',desc:'On a pile of items in the third transformer’s office.'},
 'tool-helmet':{name:'Bike helmet',desc:'On a rock south of Whiskey.'},
 'tool-candle':{name:'Librarian’s candle',desc:'Dig it up in a flooded log near the lake boardwalk; a shovel is required.'},
 'dig-cactus':{name:'Cacti',desc:'Buried; requires a shovel or rake.'},
 'dig-maid-safe':{name:'Safe with maid outfit',desc:'Dig up the safe containing the maid outfit.'},
 'dig-unnamed':{name:'“unnamed” level 3 drive',desc:'Buried near the base.'},
 'dig-basalt':{name:'Basalt columns',desc:'Buried; requires a shovel or rake.'},
 'dig-dream':{name:'Dream Plush',desc:'A buried plushie.'},
 'dig-cyan-disputed':{name:'Nuclear Cyan Argemia · disputed',desc:'The digging page lists Nuclear Cyan at this location; the Argemia page has no such section and separately describes Nuclear Yellow with the opposite X sign. Needs verification.'},
 'plush-kel':{name:'Kel doll',desc:'At the Arirals’ treehouse on day 25 after the Brownie Trail note; loyal reputation is required.'},
 'plush-antibreather':{name:'Antibreather plush',desc:'In the large nest in the cave at exactly 03:33; wait until the creature leaves and you can enter.'},
};
const burgers: Record<string,string> = {
 server:'On a server in the base server room.', toilet:'On the toilet in the base bathroom.', oven:'In the oven in the base living quarters.', basement:'Under the stairs in the base basement.', garage:'Under the hatch on the garage roof.', vent:'On the ventilation unit on the base roof.', dome:'Atop the base radar dome.', tower:'On one of the radio tower lights.', bridge:'In the river under the bridge closest to the base.', tr2:'Behind the high-voltage box on the TR 2 roof.', lake:'Under rocks inside a log by the lake.', buried:'Buried in the ground; a shovel is needed.', juliett:'On the walkway around the Juliett dish.', whiskey:'Behind rocks near the Whiskey dish.', stonehenge:'On the Stonehenge structure.', shack:'Under a table in the abandoned shack.', ship:'Near the abandoned Rozital ship.', trees:'In the fenced new-tree area.', hole:'Under the electric generator near the Hole.', cave:'Outside the cave entrance.', mushrooms:'In a pile of mushrooms in the cave.',
};
const skulls = ['Behind crates in a corner of the base basement.','In a buried wooden box.','Near the gravel circle.','Near the buried radioactive capsule.','At the cave entrance; fixed in place until interacted with through the context menu.','Buried beneath the Rozital ship.','At Stonehenge.'];
const tiles = ['On the roof of the base living quarters.','On the bridge near the base.','On a lightning rod near Xray.','At the base of a tree near TR 2.','Behind rocks near the Hole.','Behind the third-floor stairs at CR 3.','To the right of the Sierra server room.','In the highest window of the Stolas church.','Near the green cabinet.'];
const groups: Record<string,string> = {
 'Внутреннее кольцо · ~200 м от базы':'Inner ring · ~200 m from base', 'Среднее кольцо · координаты ±300':'Middle ring · coordinates ±300', 'Внешнее кольцо · координаты ±500':'Outer ring · coordinates ±500',
 'Объекты станции':'Station facilities', 'Лес':'Forest', 'Закрытые зоны':'Restricted areas', 'Другие находки':'Other finds', 'Куриные сэндвичи · 21':'Chicken sandwiches · 21', 'Плюшевые Аргемии':'Argemia plushies', 'Полезные инструменты · координаты предмета не указаны в источнике':'Useful tools · item coordinates not specified by the source', 'Полезные инструменты':'Useful tools', 'Закопанные находки':'Buried finds', 'Черепа для ритуала · 7':'Ritual skulls · 7', 'Плитки · 9':'Tiles · 9',
};
export function englishLocation(loc: Location): Location {
 if (loc.category === 'custom') return loc;
 let translated = text[loc.id];
 const burgerKey = loc.id === 's-burger-tr2' ? 'tr2' : loc.id.startsWith('burger-') ? loc.id.slice(7) : undefined;
 if (burgerKey && burgers[burgerKey]) translated = {name: loc.name.replace('Сэндвич', 'Sandwich'), desc:burgers[burgerKey]};
 const skull = /^skull-(\d+)$/.exec(loc.id);
 if (skull) translated = {name:`Human skull ${skull[1]}`, desc:skulls[Number(skull[1])-1]};
 const tile = /^tile-(\d+)$/.exec(loc.id);
 if (tile) translated = {name:`Tile ${tile[1]}`, desc:tiles[Number(tile[1])-1]};
 const joint = /^dig-joint-(\d+)$/.exec(loc.id);
 if (joint) translated = {name:`Joint box ${joint[1]}`, desc:'A buried box of joints; a shovel or rake is required.'};
 const name = translated?.name ?? loc.name;
 return {...loc, ...translated, name, code:loc.id === "substation" ? "SS" : loc.code, alt: loc.alt === name ? undefined : loc.alt, group:loc.group ? groups[loc.group] ?? loc.group : undefined};
}
