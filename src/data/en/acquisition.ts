import type { Acquisition } from '../acquisition';

const details: Record<string, Acquisition> = {
 'argemia-blue': { warning: 'If the save was started before winter, the frozen river may leave the plush under the ice until winter ends.' },
 'argemia-nuclear-pink': { requirements: 'Story or Infinite mode; an object to knock the plush down. A drone and digital map make it easier to find.', warning: 'The plush is invisible until physically interacted with and can bounce a long way after falling.' },
 'argemia-nuclear-yellow': { requirements: 'Story or Infinite mode; a shovel and digital map. A metal detector is optional but helps.' },
 'argemia-nuclear-orange': { requirements: 'Story or Infinite mode; a way to fly or climb, such as hook halves.', warning: 'A drone cannot knock the plush down: it remains stationary until the player first touches it.' },
 'argemia-magenta': { requirements: 'Receive and begin downloading the rare random lifecrystal signal, then go to the Rozital ship.' },
 'argemia-cyan': { requirements: '12 packs containing at least one shrimp each and explosives.', warning: 'The ritual can only be performed once per save.' },
 'argemia-yellow': { requirements: 'Five shrimp packs; be in the basement between 00:00 and 01:00.', warning: 'The ritual can only be performed once per save; after day 12, Arirals may eat shrimp left outside if reputation is too low.' },
 'argemia-black': { requirements: 'Story or Infinite mode, seven human skulls, a hook or hook half, and the six Argemias listed.', warning: 'One-time ritual: the portal consumes six plushies. Do not remove the hook or the portal may pull the player in.' },
 'argemia-white': { requirements: 'Red, green, blue, magenta, yellow and cyan Argemias.', warning: 'One-time ritual: the six plushies combine and disappear. If the Hole is open, cover it so the white plush does not fall in.' },
 'argemia-gold': { requirements: 'A gold bar from random digs, a shovel or rake, and a metal detector.', warning: 'The bar turns into the plush; pausing, losing sight of it or unstable FPS resets the one-hour timer.' },
 'tool-shovel-checkpoint': { requirements: 'Break down the checkpoint office door with an object.' },
 'tool-hooks': { requirements: 'Descend to the bottom of the well; two hook halves can be combined at a workbench.' },
 'tool-ritual-knife': { requirements: 'Story mode; enter the abandoned shack portal at 03:33.' },
 's-fishing': { requirements: 'A shovel; dig up the box and assemble the fishing rod from its parts at a workbench.' },
 's-limestone': { requirements: 'A shovel and metal detector; dig up the block in the forest.' },
 's-mug': { requirements: 'A hook, hook half or another way to climb the pole.' },
 'tool-candle': { requirements: 'A shovel; crouch inside the partially submerged log near the boardwalk and dig.' },
 'plush-kel': { requirements: 'Loyal reputation with the Arirals by day 25 and the note from the Brownie Trail event read.' },
 'plush-antibreather': { requirements: 'Wait for the creature to leave, reach the large nest in the cave and be there at 03:33.' },
 'burger-buried': { requirements: 'A shovel or rake for digging.' },
 'skull-5': { warning: 'The skull at the cave entrance is fixed in place until interacted with via the context menu.' },
};

export function englishAcquisitionFor(id: string): Acquisition | undefined {
 if (details[id]) return details[id];
 if (['skull-1', 'skull-3', 'skull-4', 'skull-7'].includes(id)) return { warning: 'The wiki says that skulls above ground can be scattered by explosions or other physical impacts.' };
 return undefined;
}
