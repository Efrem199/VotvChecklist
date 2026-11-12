// Прямые ссылки на файлы вики. Изображения принадлежат правообладателям игры,
// не копируются в репозиторий и запрашиваются только после открытия карточки.
const burgers: Record<string,string> = {
 'burger-server':'ServerRoom','burger-toilet':'Toilet','burger-oven':'Oven','burger-basement':'Basement','burger-garage':'GarageRoof','burger-vent':'OnVent','burger-dome':'Radome','burger-tower':'RadioTower','burger-bridge':'UnderBridge','s-burger-tr2':'OnTR2','burger-lake':'Lake','burger-buried':'Buried','burger-juliett':'Juliett','burger-whiskey':'Whiskey','burger-stonehenge':'Stonehenge','burger-shack':'Shack','burger-ship':'RozitalShip','burger-trees':'NewTrees','burger-hole':'TheHole','burger-cave':'CaveEntrance','burger-mushrooms':'Cave'
};
const names: Record<string,string> = {
 'skull-1':'Item_Skull_Basement.png', 'skull-2':'Item_Skull_BoneBox.png', 'skull-3':'Item_Skull_GravelSpot.png', 'skull-4':'Item_Skull_RadPlace.png', 'skull-5':'Item_Skull_Cave.png', 'skull-6':'Item_Skull_RozShip.png', 'skull-7':'Item_Skull_Stonehenge.png',
 'tile-1':'Item_Tile_Base.png', 'tile-2':'Item_Tile_Bridge.png', 'tile-3':'Item_Tile_LightningRod.png', 'tile-4':'Item_Tile_Forest.png', 'tile-5':'Item_Tile_TheHole.png', 'tile-6':'Item_Tile_CR3.png', 'tile-7':'Item_Tile_Sierra.png', 'tile-8':'Item_Tile_Church.png', 'tile-9':'Item_Tile_GreenCabinet.png',
 'argemia-red':'Item_ArgemiaPlushRed_CraterLocation.png', 'argemia-green':'Item_ArgemiaPlushGreen_MountainLocation.png', 'argemia-blue':'Item_ArgemiaPlushBlue_RiverLocation.png',
 'argemia-nuclear-pink':'Item_ArgemiaPlushNuclearPink_ApproximateLocation.png', 'argemia-nuclear-yellow':'Item_ArgemiaPlushNuclearYellow_HillLocation.png', 'argemia-nuclear-orange':'Item_ArgemiaPlushNuclearOrange_SkyLocation.png',
 'argemia-magenta':'Item_ArgemiaPlushMagenta_RozitalVesselLocation.png', 'argemia-cyan':'Secret_CyanArgemia_Ingame.png', 'argemia-yellow':'Secret_YellowArgemia_Ingame.png', 'argemia-black':'Secret_BlackArgemia_Ingame.png', 'argemia-white':'Secret_WhiteArgemia_Guide.png', 'argemia-gold':'Secret_GoldBarArgemia_Ingame.png',
 's-pickaxe':'Item_Pickaxe_LakeLocation.png', 's-fishing':'Item_FishingRod_BoxLocation.png', 'tool-axe':'Item_Axe_AbandonedShackLocation.png', 'tool-hooks':'Item_Hook_WellLocation.png', 'tool-boots':'Item_HikingBoots_Location.png', 'tool-geiger':'Item_GeigerCounter_GreenHatchBunkerLocation.png', 'tool-helmet':'Item_BikeHelmet_CliffLocation.png',
};
export function wikiImage(id: string): { url: string; file: string } | undefined {
 const filename = burgers[id] ? `Item_ChickenSandwich_${burgers[id]}.png` : names[id];
 if (!filename) return undefined;
 return {url:`https://voicesofthevoid.wiki.gg/images/thumb/${filename}/480px-${filename}`,file:`https://voicesofthevoid.wiki.gg/wiki/File:${filename}`};
}
