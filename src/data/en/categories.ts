import type { Category, CategoryId } from '../locations';

const categories: Record<CategoryId, { title: string; subtitle: string }> = {
 dishes: { title: 'Dishes', subtitle: '24 array antennas · Bravo – Yankee' },
 power: { title: 'Power grid', subtitle: 'Substation and three transformers' },
 radars: { title: 'Coordinate radars', subtitle: 'CR 1–3 · 8 fuses each' },
 poi: { title: 'Points of interest', subtitle: 'Station facilities, forest and restricted areas' },
 secrets: { title: 'Hidden items', subtitle: 'Buried and hidden · spoilers' },
 custom: { title: 'Custom locations', subtitle: 'Add anything you want to remember' },
};
export function englishCategory(category: Category): Category {
 return { ...category, ...categories[category.id] };
}
