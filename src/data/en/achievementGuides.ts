import { ACHIEVEMENT_GUIDES, type AchievementGuide } from '../achievementGuides';
import { FULL_ENGLISH_GUIDES } from './achievementFull';

// Entries retain the original step order so guide:<id>:<index> keys stay stable.
export const ENGLISH_ACHIEVEMENT_GUIDES: Record<string, AchievementGuide> = {
 maid: {
  steps: [
   'Enable Funny in the save rules. Take a shovel; a metal detector may help. A shovel is on a beam under the ceiling at TR2.',
   'Behind the logs at TR3, dig up the safe at X:-357.4, Y:-488.8.',
   'To open the safe, hold Use on the door and turn the lock with the mouse wheel. Change direction when the click sounds different; repeat until it unlocks, then pull the door. Alternatively, dismantle the safe with a hacksaw.',
   'Take the outfit and check the achievement in-game.',
  ],
  note: 'Without Funny the safe is empty. The sources describe the mechanic, but it has not been tested in-game.',
  sources: [
   { label: 'Outfit and requirements', url: 'https://voicesofthevoid.wiki.gg/wiki/Maid_Outfit#Obtaining' },
   { label: 'Opening the safe', url: 'https://voicesofthevoid.wiki.gg/wiki/Safe' },
  ],
  images: [{ file:'Item_MaidOutfit_Ingame_Transparent.png', caption:'Maid outfit' }],
 },
};
const illustrationCaptions: Record<string, string> = {
 'Item_Shovel_Transformer2Location.png': 'Shovel on the TR2 beam',
 'Object_VaultClosed_Ingame.png': 'Closed safe · item view',
 'Object_VaultOpen_Ingame.png': 'Open safe · result',
};
export function englishMaidCaption(file: string): string | undefined { return illustrationCaptions[file]; }

// Steps are parallel to the Russian source: never reorder them, as the index is
// part of the persisted checklist key. Source URLs remain the cited revisions.

const shortGuides: Record<string, { steps:string[]; note?:string }> = {
 'tutorial-09':{steps:['Start the tutorial and complete its first layer.','The wiki allows most of it to be skipped, but not the first information message or the first two code panels.']},
 'alpha-player':{steps:['Start Story, Infinite or Ambience for the first time.','This is a game-wide achievement, not one for a particular save.']},
 sandbox:{steps:['Start a Story playthrough and continue until in-game day 31.','Check whether Sandbox has appeared in the mode selection.']},
 'alpha-completed':{steps:['Continue Story until day 48.','Check the achievement and the newly unlocked Sandbox items.']},
 yoink:{steps:['Wait for the event in which Igetis drops a Rozital capsule into the Hole.','According to the wiki, you can descend with a hook and find it at the bottom; a fast player may catch it in mid-air, and sometimes it misses the hole.'],note:'Dangerous location: save first. The source does not specify the event time.'},
 maxwell:{steps:['Enable Funny in the rules of the relevant save.','Interact with the terminal keyboard in the base server room and enter maxwell.','According to the wiki, the object appears at a random place on the map; listen for the nearby melody to find it.'],note:'The location is random; follow the sound. Do not pet the cat too long: the wiki warns of an explosion.'},
 argemwell:{steps:['Enable Funny in the rules of the relevant save.','Interact with the terminal keyboard in the base server room and enter argemwell.','According to the wiki, the object appears at a random place on the map; listen for the nearby melody to find it.'],note:'The location is random; follow the sound. Do not pet the cat too long: the wiki warns of an explosion.'},
 'super-gnarpy':{steps:['Enable Funny and the Kick props/trip over setting.','Enter gnarpwell in the terminal, find the spawned Gnarpwell and kick it 1,000 times.'],note:'Its exact spawn location is random.'},
 jackpot:{steps:['Open MREs until you get a completely filled pack.','Check the achievement in-game.'],note:'Contents are random; the wiki does not give a guaranteed method.'},
 'ripped-off':{steps:['Open MREs until you get exactly one cracker.','Check the achievement in-game.'],note:'Contents are random; the wiki does not give a guaranteed method.'},
 robbed:{steps:['Open MREs until you get a completely empty pack.','Check the achievement in-game.'],note:'The wiki describes this result as rare and random.'},
 suboptimal:{steps:['Catch a live fish.','Heat the live fish until it becomes cooked; the wiki suggests putting it in an oven.']},
 'treasure-hunter':{steps:['Take a metal detector and a shovel.','Dig at spots found by the detector until you have found every possible type of underground loot.'],note:'The achievements page does not give an exact list or counter; random finds may take many attempts.'},
 woo:{steps:['Enable Kick props/trip over in settings.','Kick a drive into any slot.'],note:'The wiki links to a video demonstration from the achievement page.'},
 'deer-eater':{steps:['Receive the deer signal and find the spawned deer carcass.','Eat the entire carcass.'],note:'The wiki does not specify a guaranteed way to receive the signal.'},
 'welcome-earth':{steps:['Obtain feces: the wiki suggests eating snowberries or using a bucket with stamina below 5.','Leave the “gift” at the treehouse.'],note:'The wiki says Funny is required to produce feces using the bucket.'},
 'return-sender':{steps:['Enable Funny in the save rules and prepare a trampoline before the warning obelisk story event.','Place the trampoline at the landing location: the achievements guide gives X:80.5, Y:1.75. Wait for the obelisk.'],note:'The Funny Rule page gives X:80.0, Y:1.75; the sources differ. Save beforehand.'},
 insomniac:{steps:['Do not sleep for seven consecutive in-game days in one save.','Check for the achievement in-game.'],note:'The wiki notes a 0.8.2b bug where reloading a save could prevent it; whether this still applies is unverified.'},
 cigarettes:{steps:['Prepare 500 cigarettes — 25 full packs according to the wiki.','Smoke each one completely; the wiki recommends Heavy Meds to restore maximum health.'],note:'The wiki estimates almost six real days of uninterrupted smoking at minimum; this takes a very long time.'},
 'sky-falling':{steps:['Wait for the random camouflage panel event.','Get hit by the falling panel.'],note:'The wiki gives no guaranteed way to trigger the event; save before attempting it.'},
 'atv-stunts':{steps:['Perform an ATV jump lasting at least one second.','Repeat a qualifying stunt 100 times. The wiki also mentions using balloons.']},
 'atv-frontflip':{steps:['Perform 100 front flips on the ATV.','According to the wiki, moving backward in the air tilts the ATV forward and makes rotation easier.'],note:'Protect your vehicle and save before experimenting.'},
 'atv-backflip':{steps:['Perform 100 backflips on the ATV.','Check progress in the in-game achievement menu.'],note:'The wiki page does not give detailed technique for this stunt.'},
 'object-woods':{steps:['In Story, head to the valley near the Romeo dish.','Find the Ariral picnic and a strange white object.'],note:'See the story event description for picnic timing and conditions.'},
 'the-hole':{steps:['Go to the fenced Hole near Yankee.','Approach it; coordinates and a landmark are in the linked location card.'],note:'Save before attempting a risky descent.'},
 going:{steps:['Head toward Yankee and find the nearby gap in the fence.','Approach the gap.'],note:'The achievements page does not give exact coordinates for the gap.'},
 fossilhound:{steps:['Encounter a Fossilhound and let it kill the player.','The wiki describes a bug workaround: open settings before the attack and press Apply during death.'],note:'The wiki reports that the achievement may not save on death. The workaround and current status of the bug have not been tested in-game; make a backup first.'},
 revenge:{steps:['Encounter and defeat a Fossilhound.','The wiki recommends Molotov cocktails.'],note:'The creature is dangerous; save and prepare healing.'},
 'bright-death':{steps:['Encounter a yellow Killer Wisp and let it kill the player.'],note:'This achievement requires a death; save beforehand.'},
 miracle:{steps:['Find Big Piramid and lead a Killer Wisp to it.','Let the wisp catch the player close enough to Piramid for it to save you before your limbs are torn off.'],note:'The wiki recommends a backup: timing this is difficult.'},
 unleashed:{steps:['Find a deer skull.','Burn it or heat it in a microwave.'],note:'This starts a dangerous event; save beforehand.'},
 'cave-sleeper':{steps:['Take a sleeping bag or sleeping pills and reach the cave.','Fall asleep inside; the journal has a cave landmark.'],note:'The cave can be dangerous; save before going.'},
 thingy:{steps:['Obtain the Erie plush and place it in a microwave or cremator.','Defeat the Angry Erie that appears; the wiki recommends Molotov cocktails.'],note:'Dangerous mini-boss: save and prepare healing.'},
 'rufus-no-more':{steps:['Enable Funny and enter gooseworx.rufus in the in-game terminal.','Defeat Rufus: according to the wiki one explosion, such as a Molotov, is sufficient.'],note:'The rufus.fuckoff command removes the enemy but does not give the reward. Save before summoning it.'},
 'thiccfus-no-more':{steps:['Enable Funny and enter gooseworx.thiccfus in the in-game terminal.','Defeat Thiccfus; the wiki suggests an explosion, such as a Molotov.'],note:'According to the wiki, touching Thiccfus kills instantly, and removing it by command is not a victory. Save first.'},
 drowned:{steps:['Stay underwater until the character drowns.'],note:'This requires the character to die: save beforehand.'},
 nightmare:{steps:['While inside the cremator, use the lever and quickly close the door.'],note:'This causes death; the wiki says the 25 points cannot be retained. Save beforehand.'},
 'big-brain':{steps:['Find the special sw_fork on a table near the Hole; the wiki notes that it has an empty name in the inventory.','Insert the fork into an electrical outlet.'],note:'There will be an explosion and the breakers will trip. Save beforehand.'},
 'mannequin-dream':{steps:['Survive for 120 seconds during Mannequin Dream.','The wiki suggests running circles around the room.'],note:'The dream is an event; the achievement page gives no guaranteed way to trigger it.'},
 'burger-dream':{steps:['During Burger dream, find and touch all 10 sandwiches.','Do not confuse the dream items with the 21-sandwich collection on the map.']},
 'bad-sun':{steps:['Wait for the Bad Sun event and survive it by sheltering from the dangerous light.','Check that Solar mode has unlocked.'],note:'The wiki says the event is guaranteed on the 24th of a real-world month if not already completed; otherwise it may occur randomly. Conditions can change between versions.'},
 'seen-everything':{steps:['During Bad Sun, go out into the sunlight and die from it.'],note:'This causes a special Game Over screen; save beforehand.'},
 'worst-ending':{steps:['Receive the End is Near signal and process it to level 3.','Do not delete the signal after the Arirals’ warning.'],note:'The wiki describes a special Game Over screen; it is best to back up the save first.'},
 'halloween-launch':{steps:['According to the wiki, launch the game during the Halloween seasonal event, from October 25 to November 8.'],note:'Dates depend on the real calendar; their applicability to your version is unconfirmed.'},
 'halloween-play':{steps:['Start a new save in the Halloween game mode.'],note:'The wiki lists two achievements both called Halloween begin, with different requirements.'},
 christmas:{steps:['According to the wiki, launch the game during the Christmas event, from December 5 to January 23.'],note:'Dates depend on the real calendar and may differ in your version.'},
 snowman:{steps:['In winter or during Christmas, collect snowballs by right-clicking snow. Eight regular snowballs make one large snowball at a workbench; you need three large snowballs.','Assemble the snowman and add a foil hat, two rocks, sticks and a cucumber.'],note:'The achievement page does not specify the number of sticks.'},
 krampus:{steps:['Fill a bucket with water, put bread and a sugar pack in it, and wait five real minutes.','While holding a clean jar, left-click the bucket to collect alcohol. Leave the jar in front of the entrance and wait for Krampus to take it.'],note:'The item page describes collecting the drink in a clean jar.'},
 'demo-completed':{steps:['Complete the demo in an old demo version.'],note:'The wiki places this achievement before Pre-Alpha 0.6.3a and says it is unavailable in the latest version described.'},
 'demo-player':{steps:['Launch an old demo version of the game.'],note:'The wiki lists this as obsolete and does not give detailed requirements.'},
 'halloween-finish':{steps:['In an older Halloween version, collect 13 pumpkins, then download and play the Skeleton signal.'],note:'The wiki says the signal has been unavailable since Pre-Alpha 0.8.1.'},
 'launch-tutorial':{steps:['Launch the tutorial in a version before Alpha 0.9.0.'],note:'The wiki lists this as unavailable in the latest version described; detailed requirements are not given.'},
 'prealpha-player':{steps:['In a version before Alpha 0.9.0, start Story, Infinite or Ambience for the first time.'],note:'An obsolete achievement; availability depends on the version.'},
 'prealpha-completed':{steps:['The wiki associates this achievement with completing the pre-alpha in a version before Alpha 0.9.0.'],note:'The wiki description and guide disagree: the guide says to launch a mode for the first time. Exact requirements are unconfirmed.'},
 'adv-funguy':{steps:['Collect 1,000 mushrooms found in the world.','Check progress on the in-game computer.'],note:'According to the wiki, player-grown mushrooms do not count.'},
 'adv-chipper':{steps:['Put a total of 1,000 items into the chipper.','The wiki suggests toilet paper rolls: each produces 25 items for shredding when fully used.']},
 'adv-roach':{steps:['Eat 1,000 cockroaches.','The wiki suggests leaving food out, setting cockroaches to maximum in settings and removing repellents.']},
 'adv-piramid':{steps:['Reach the Piramid arrival event on day 31 in Story.','Survive the event and check the advancement on the computer.']},
 'adv-kerfur':{steps:['Open the in-game store and buy a Kerfur.','According to the wiki, it costs 500 points.'],note:'The price may differ in your version.'},
 'adv-toilet':{steps:['Take a sponge and clean the toilet in the base bathroom.','Check the advancement on the in-game computer.']},
 'adv-sink':{steps:['Take a sponge and clean the sink in the base bathroom.','Check the advancement on the in-game computer.']},
 'adv-shower':{steps:['Take a sponge and clean the shower in the base bathroom.','Check the advancement on the in-game computer.']},
 'adv-alone':{steps:['In older versions you had to see an alien ship.'],note:'The wiki provides no further steps and lists this advancement as unavailable in the latest version described.'},
 'adv-day':{steps:['Complete in-game days in demo versions before Demo 0.4.1e.'],note:'According to the wiki, the advancement repeated Day 13 after day 13; applicability to other versions is unverified.'},
};
for (const [id, seconds] of Object.entries({'atv-air-1':1,'atv-air-2':3,'atv-air-3':5,'atv-air-4':10})) {
 shortGuides[id] = {steps:[`Ride the ATV and keep it continuously off the ground for ${seconds} seconds.`, 'The wiki counts the ATV as “in the air” even underwater if it does not touch the ground; balloons can help hold it up longer.'], note:'A single flight is counted; experiment carefully to avoid wrecking the ATV.'};
}
const sourceLabels: Record<string,string> = {
 'Команды терминала':'Terminal commands', 'Правило Funny':'Funny rule', 'Funny и команды':'Funny and commands', 'Раскопки':'Digging', 'Funny rule':'Funny rule', 'Пикник ариралов':'Ariral picnic', 'Funny и события':'Funny and events', 'Шуточные существа':'Joke entities', 'Bad Sun':'Bad Sun', 'Событие сигнала':'Signal event', 'Кулинарная книга':'Cooking book', 'Kerfur':'Kerfur',
};
for (const [id, translated] of Object.entries(shortGuides)) {
 const original = ACHIEVEMENT_GUIDES[id];
 ENGLISH_ACHIEVEMENT_GUIDES[id] = {...translated, sources:original.sources?.map(source => ({...source,label:sourceLabels[source.label] ?? source.label}))};
}

Object.assign(ENGLISH_ACHIEVEMENT_GUIDES, FULL_ENGLISH_GUIDES);
