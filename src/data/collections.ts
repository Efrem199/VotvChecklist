import type { Location } from './locations';
export type CollectionId = 'all' | 'sandwiches' | 'argemias' | 'skulls' | 'tiles' | 'tools';
export const COLLECTIONS: { id: CollectionId; label: string; matches: (l: Location) => boolean }[] = [
 {id:'all',label:'Все точки',matches:()=>true},
 {id:'sandwiches',label:'Сэндвичи',matches:l=>l.id.startsWith('burger-') || l.id==='s-burger-tr2'},
 {id:'argemias',label:'Аргемии',matches:l=>l.id.startsWith('argemia-')},
 {id:'skulls',label:'Черепа',matches:l=>l.id.startsWith('skull-')},
 {id:'tiles',label:'Плитки',matches:l=>l.id.startsWith('tile-')},
 {id:'tools',label:'Инструменты',matches:l=>l.id.startsWith('tool-') || ['s-fishing','s-pickaxe','s-emf'].includes(l.id)},
];
export function collectionMatches(id: CollectionId, loc: Location) { return COLLECTIONS.find(c=>c.id===id)!.matches(loc); }
