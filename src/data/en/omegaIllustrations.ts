import type { GuideIllustration } from '../achievementIllustrations';

const captions: Record<string, string> = {
 'Location_Bunker_Entrance.png': 'Alpha Hideout entrance',
 'Item_KerfurOmegaDocumentsBinder_Ingame_Transparent.png': 'Documents binder with hints, not the blueprint · item view',
 'Item_KerfurManual_Ingame_Transparent.png': 'Complete Manual blueprint · item view',
 'Item_KerfurParts_Ingame_Transparent.png': 'Kerfur Parts box · item view',
 'Item_BallJoint_BoxDigLocations.png': 'Joint box dig locations near Romeo',
 'Item_BallJoint_Ingame_Transparent.png': 'Ball Joint · item view',
 'Item_LimbJoint_Ingame_Transparent.png': 'Limb Joint · item view',
 'Object_VaultUnderwater_Ingame.png': 'Safe at the bottom of the lake',
 'Item_OmegaAIModule_Ingame_Transparent.png': 'Omega AI Module · item view',
 'Item_RadioactiveCapsule_Ingame_Transparent.png': 'Radioactive capsule · item view',
 'Item_CameraGood_Ingame_Transparent.png': 'Good camera · item view',
 'Item_PlasticScrap_Ingame_Transparent.png': 'Plastic scrap · item view',
 'Item_MetalScrap_Ingame_Transparent.png': 'Metal scrap · item view',
 'Item_ElectronicScrap_Ingame_Transparent.png': 'Electronic scrap · item view',
 'Item_GlassScrap_Ingame_Transparent.png': 'Glass scrap · item view',
 'Item_KerfurOmegaHeadNoColor_Ingame_Transparent.png': 'Finished Kerfur-Omega head',
 'Item_KerfurOmegaChestNoColor_Ingame_Transparent.png': 'Finished Kerfur-Omega chest',
 'Item_KerfurOmegaPelvisNoColor_Ingame_Transparent.png': 'Finished Kerfur-Omega pelvis',
 'Item_KerfurOmegaArmNoColor_Ingame_Transparent.png': 'One of the two finished arms',
 'Item_KerfurOmegaLegNoColor_Ingame_Transparent.png': 'One of the two finished legs',
};
export function englishOmegaIllustration(image: GuideIllustration): GuideIllustration | undefined {
 const caption = captions[image.file];
 return caption ? { ...image, caption } : undefined;
}
