import type { GuideSection } from '../achievementDetails';

// Translation of OMEGA_GUIDE. Sections and items have the same order as the
// Russian source: illustrations and existing planner IDs must still be matched
// against the original text, never against these translated strings.
export const OMEGA_GUIDE_EN: GuideSection[] = [
 { title: 'What you need for one Kerfur-Omega', spoiler: true, items: [
  'A workbench, the Kerfur-Omega complete manual blueprint, 5 boxes of Kerfur Parts, 1 Omega AI Module, 1 radioactive capsule and 1 Good camera.',
  'Total scrap: 14 plastic, 7 metal, 8 electronic and 1 glass. Joints: 8 Ball Joints and 4 Limb Joints.',
  'For the search and access, bring a shovel or rake, a hook and a flashlight. For the safe, bring a diving mask with a tank or a hook, and optionally a hacksaw. For the capsule, bring a Hazmat suit and Heavy Meds. Make room in your inventory.'
 ]},
 { title: 'The manual and bunker entrance', spoiler: true, items: [
  'Alpha Hideout is near the base at X:20.5, Y:25.0. Look through the small window on the back of the entrance: a keycard lies on the stairs. Aim the hook at the card and use the mouse wheel to pull it through the window. While holding the card, left-click the slot to the right of the first door’s keypad.',
  'Open the second door with a Password Changer or break it with a melee weapon. The Documents Binder on the table near the entrance contains hints; it is not the blueprint.',
  'The actual Complete Manual is a small brown book in the corner behind the crates. Place it on the workbench with the ingredients for each part: the book is not consumed and can be reused.'
 ]},
 { title: 'Where to find the components', spoiler: true, items: [
  'Kerfur Parts: dismantle a regular blue, pink or red Kerfur at the workbench. Each gives 3 boxes, a wheel and a color. You usually need two robots for 5 boxes; each costs 500 points in the store. Boss remains do not work, and the orange Kerfur reward cannot be dismantled into these boxes.',
  'Ball Joints: six wooden boxes, each containing 2 joints, are buried in the gravel pile near Romeo. Box coordinates: X:-524.1 Y:-479.1; X:-532.6 Y:-481.1; X:-524.1 Y:-471.1; X:-532.0 Y:-472.4; X:-541.1 Y:-475.4; X:-529.8 Y:-462.7. Four boxes are enough for one robot. Bring a shovel; a metal detector helps.',
  'Limb Joints: there are 2 in each transformer. TR1: in a bucket in the office; TR2: on a crate under the workbench; TR3: on the top shelf of the bookcase. You need 4 in total, so two transformers are enough.',
  'Omega AI Module: in a safe on the bottom of the lake between Oscar and Tango, at X:405.5, Y:-406.0. Retrieve the safe with diving gear or pull it to shore with a hook. Hold Use on the door and turn the wheel; change direction when the click sounds different, repeating until the lock opens, then pull the door. Alternatively, dismantle the safe with a hacksaw. In an older save during winter, the safe may be under the ice until the thaw.',
  'Capsule: dig it up near TR2 at X:-570.0, Y:303.3; it is slightly visible above ground. The capsule emits intense radiation: wear a Hazmat suit or quickly place it in your inventory or a container, taking it out only for crafting. Heavy Meds restore lost maximum health.',
  'Capsule alternative: the blueprint near Green Hatch, 4 compressed radioactive materials, 4 metal scrap and a gas torch. Wiki pages disagree about a capsule drop from Abandoned Kerfur: the capsule page says it no longer drops as of 0.9.0, so do not rely on it without checking.',
  'The Good camera is sold in the store for 120 points. The AI module and joints are sold too, but unlock only after the Upgrade achievement, so for the first robot in a world you must find them or obtain them another way.'
 ]},
 { title: 'How to make scrap', spoiler: true, items: [
  'Combine suitable items at a workbench: 6 plastic bottles, empty bags or pieces of plastic trash make 1 Plastic Scrap.',
  '4 empty cans or pieces of metal trash make 1 Metal Scrap; alternatively, 1 broken fuse gives 1 scrap, and a toolbox gives 2.',
  '4 pieces of electronic trash or 4 drives make 1 Electronic Scrap; one monitor or power supply gives electronic and plastic scrap.',
  '4 empty beer bottles or pieces of glass trash make 1 Glass Scrap; alternatively, use 1 quartz shard. Do not dismantle equipment you need or drives with valuable signals.'
 ]},
 { title: 'Recipes and final assembly', spoiler: true, items: [
  'Head: 1 Kerfur Parts + 1 Omega AI Module + 2 Plastic Scrap + 1 Metal Scrap + 2 Electronic Scrap + 1 Glass Scrap.',
  'Chest: 1 Kerfur Parts + 1 Camera Good + 3 Plastic Scrap + 1 Metal Scrap + 2 Electronic Scrap.',
  'Pelvis: 1 Kerfur Parts + 1 radioactive capsule + 1 Plastic Scrap + 1 Metal Scrap + 1 Electronic Scrap.',
  'Two arms in one craft: 1 Kerfur Parts + 2 Limb Joints + 4 Ball Joints + 4 Plastic Scrap + 2 Metal Scrap + 1 Electronic Scrap.',
  'Two legs in one craft: 1 Kerfur Parts + 2 Limb Joints + 4 Ball Joints + 4 Plastic Scrap + 2 Metal Scrap + 2 Electronic Scrap.',
  'For each of the five crafts, physically place the blueprint and components on top of the workbench, look at the tabletop and press E or choose Craft from the action menu. Select the recipe; the ingredients are consumed but the blueprint remains.',
  'Place all seven resulting parts—the head, chest, pelvis, two arms and two legs—on the workbench and assemble the white Kerfur-Omega. The blueprint is not needed for final assembly; the saved color of a regular Kerfur can be applied separately.'
 ]},
 { title: 'After assembly', spoiler: true, items: [
  'If your helper breaks, the wiki says all seven parts can be reassembled at a workbench at no cost. Do not leave important items in its hands when saving: the wiki warns that items it carries are not saved.',
  'The robot repairs servers and transformers, and collects hashes when given a floppy disk. Controlling it through a camera or loading while it is collecting may make it restart the list and use up the floppy disk’s durability.'
 ]}
];
