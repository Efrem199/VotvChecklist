import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, serializeState, parseImport, STORAGE_KEY } from '../src/lib/state';
import { loadProfiles, saveProfiles, PROFILES_KEY } from '../src/lib/profiles';
import { clusterPoints } from '../src/lib/mapClusters';
import { COLLECTIONS } from '../src/data/collections';
import { BUILTIN_LOCATIONS } from '../src/data/locations';
import { wikiImage } from '../src/data/wikiImages';

test('миграция старого журнала и раздельное хранение профилей', () => {
 const values = new Map<string,string>();
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(k:string)=>values.get(k) ?? null,setItem:(k:string,v:string)=>values.set(k,v)}});
 const old = defaultState(); old.day = 21; old.progress['dish-b'] = {done:{visited:true},note:'заметка'};
 values.set(STORAGE_KEY,JSON.stringify(old));
 const loaded = loadProfiles();
 assert.equal(loaded.error,false); assert.equal(loaded.data.profiles[0].state.day,21);
 const second = {id:'second',name:'Второй',createdAt:1,state:defaultState()};
 loaded.data.profiles.push(second); loaded.data.activeId='second';
 second.state.ritualSteps['argemia-white:0'] = true;
 assert.equal(saveProfiles(loaded.data),true);
 const reloaded=loadProfiles().data;
 assert.equal(reloaded.activeId,'second'); assert.equal(reloaded.profiles[0].state.progress['dish-b'].note,'заметка');
 assert.equal(reloaded.profiles[1].state.ritualSteps['argemia-white:0'],true);
 assert.equal(parseImport(JSON.parse(serializeState(second.state))).ritualSteps['argemia-white:0'],true);
 assert.equal(JSON.parse(values.get(STORAGE_KEY)!).day,21);
 Reflect.deleteProperty(globalThis,'localStorage');
});
test('повреждённый профиль не записывается автоматически при чтении', () => {
 const values = new Map([[PROFILES_KEY,'{broken']]);
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(k:string)=>values.get(k) ?? null,setItem:(k:string,v:string)=>values.set(k,v)}});
 assert.equal(loadProfiles().error,true); assert.equal(values.get(PROFILES_KEY),'{broken');
 Reflect.deleteProperty(globalThis,'localStorage');
});
test('кластеризация не теряет точки и распадается при увеличении', () => {
 const points = [{px:0,py:0,id:'a'},{px:20,py:0,id:'b'},{px:100,py:0,id:'c'}];
 const groups=clusterPoints(points,30);
 assert.deepEqual(groups.map(g=>g.length).sort(),[1,2]);
 assert.equal(groups.flat().length,points.length); assert.equal(clusterPoints(points,10).length,3);
});
test('коллекции и изображения привязаны к конкретным записям', () => {
 assert.equal(BUILTIN_LOCATIONS.filter(COLLECTIONS.find(c=>c.id==='sandwiches')!.matches).length,21);
 assert.equal(BUILTIN_LOCATIONS.filter(COLLECTIONS.find(c=>c.id==='skulls')!.matches).length,7);
 assert.equal(BUILTIN_LOCATIONS.filter(COLLECTIONS.find(c=>c.id==='tiles')!.matches).length,9);
 assert.match(wikiImage('burger-server')!.file,/ChickenSandwich_ServerRoom/);
 assert.equal(wikiImage('dish-b'),undefined);
});
