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
 assert.equal(loadProfiles('en').data.profiles[0].name, 'Main playthrough');
 assert.equal(loadProfiles('ru').data.profiles[0].name, 'Основное прохождение');
 const second = {id:'second',name:'Второй',createdAt:1,state:defaultState()};
 loaded.data.profiles.push(second); loaded.data.activeId='second';
 second.state.ritualSteps['argemia-white:0'] = true;
 assert.equal(saveProfiles(loaded.data),true);
 assert.equal(loadProfiles('en').data.profiles[0].name,'Основное прохождение'); // Existing names are user data.
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

test('достоверность: пользовательские и несверенные точки не выдаются за подтверждённые', async () => {
 const {reviewFor} = await import('../src/data/review');
 const find = (id:string) => BUILTIN_LOCATIONS.find(l=>l.id===id)!;
 const burger = reviewFor(find('burger-server'));
 assert.equal(burger.status,'wiki-reviewed'); assert.equal(burger.checkedAt,'2026-11-12'); assert.equal(burger.gameVersion,undefined);
 assert.match(burger.sources![0].url,/oldid=24700/);
 const disputed = reviewFor(find('burger-buried'));
 assert.equal(disputed.status,'disputed'); assert.equal(disputed.sources?.length,2); assert.match(disputed.note!,/-584\.3/); assert.match(disputed.note!,/-584\.7/);
 assert.equal(reviewFor(find('dish-b')).status,'unreviewed');
 assert.equal(reviewFor({id:'x',name:'моя',category:'custom',kind:'custom'}).status,'user');
});

test('предупреждения о расходовании и одноразовых ритуалах связаны с предметами', async () => {
 const {acquisitionFor} = await import('../src/data/acquisition');
 assert.match(acquisitionFor('argemia-black')!.warning!,/Одноразовый/);
 assert.match(acquisitionFor('argemia-white')!.warning!,/исчезают/);
 assert.equal(acquisitionFor('dish-b'),undefined);
});
