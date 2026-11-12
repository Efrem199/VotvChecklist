import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACHIEVEMENTS, ACHIEVEMENTS_SOURCE } from '../src/data/achievements';
import { BUILTIN_LOCATIONS } from '../src/data/locations';
import { COLLECTIONS } from '../src/data/collections';
import { ACHIEVEMENTS_KEY, loadAchievementMarks, saveAchievementMarks } from '../src/lib/achievements';
import { defaultState, normalizeState, parseImport, serializeState } from '../src/lib/state';
import { parseRoute } from '../src/lib/routes';

test('записи достижений имеют уникальные ID и действующие ссылки на журнал', () => {
 assert.equal(new Set(ACHIEVEMENTS.map(a=>a.id)).size, ACHIEVEMENTS.length);
 assert.ok(ACHIEVEMENTS.length >= 80);
 assert.match(ACHIEVEMENTS_SOURCE,/oldid=25059/);
 for (const a of ACHIEVEMENTS) {
  assert.ok(a.title && a.condition && a.reward);
  if (a.locationId) assert.ok(BUILTIN_LOCATIONS.some(l=>l.id===a.locationId),a.id);
  if (a.collection) assert.ok(COLLECTIONS.some(c=>c.id===a.collection),a.id);
 }
 assert.equal(ACHIEVEMENTS.filter(a=>a.title==='Halloween begin').length,2);
 assert.ok(ACHIEVEMENTS.some(a=>a.kind==='advancement' && a.legacy));
});
test('advancements мигрируют из старого журнала и входят в экспорт активного профиля', () => {
 assert.deepEqual(normalizeState({}).advancements,{});
 const state=defaultState(); state.advancements['adv-burger']=true;
 assert.equal(parseImport(JSON.parse(serializeState(state))).advancements['adv-burger'],true);
 assert.deepEqual(normalizeState({advancements:{ok:true,bad:'true'}}).advancements,{ok:true});
});
test('общие отметки сохраняются отдельно и повреждённые данные не перезаписываются', () => {
 const data=new Map<string,string>();
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>data.get(key)??null,setItem:(key:string,v:string)=>data.set(key,v)}});
 assert.equal(loadAchievementMarks().error,false);
 assert.equal(saveAchievementMarks({sandbox:true}),true);
 assert.deepEqual(loadAchievementMarks().marks,{sandbox:true});
 data.set(ACHIEVEMENTS_KEY,'{broken');
 assert.equal(loadAchievementMarks().error,true);
 assert.equal(data.get(ACHIEVEMENTS_KEY),'{broken');
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>null,setItem:()=>{throw Error('quota')}}});
 assert.equal(saveAchievementMarks({sandbox:true}),false);
 Reflect.deleteProperty(globalThis,'localStorage');
});
test('маршруты работают с query и прямыми ссылками Pages', () => {
 assert.deepEqual(parseRoute('#/achievements?item=adv-burger').item,'adv-burger');
 assert.equal(parseRoute('#/fun?q=sv.ping').page,'fun');
 assert.equal(parseRoute('#/journal?loc=hole').location,'hole');
 assert.equal(parseRoute('#/journal?category=secrets').category,'secrets');
 assert.equal(parseRoute('#/').page,'journal');
});

test('для каждой записи есть гайд с шагами и корректными источниками', async () => {
 const { ACHIEVEMENT_GUIDES } = await import('../src/data/achievementGuides');
 assert.deepEqual(Object.keys(ACHIEVEMENT_GUIDES).sort(), ACHIEVEMENTS.map(a => a.id).sort());
 for (const [id, guide] of Object.entries(ACHIEVEMENT_GUIDES)) {
  assert.ok(guide.steps.length > 0, id);
  assert.ok(guide.steps.every(step => step.trim().length > 0), id);
  for (const source of guide.sources ?? []) assert.equal(new URL(source.url).hostname, 'voicesofthevoid.wiki.gg', id);
  for (const image of guide.images ?? []) assert.match(image.file, /^[A-Za-z0-9_]+\.png$/, id);
 }
});

test('расширенные гайды содержат рецепты, места и предупреждения', async () => {
 const { ACHIEVEMENT_DETAILS } = await import('../src/data/achievementDetails');
 for (const id of Object.keys(ACHIEVEMENT_DETAILS)) assert.ok(ACHIEVEMENTS.some(a => a.id === id), id);
 const omega = ACHIEVEMENT_DETAILS.upgrade;
 assert.ok(omega.every(section => section.spoiler));
 const text = omega.flatMap(section => section.items).join(' ');
 for (const expected of ['14 пластикового', '7 металлического', '8 электронного', '1 стеклянного', '8 Ball Joints', '4 Limb Joints', 'X:405.5', 'X:-570.0', 'Complete Manual', 'Две руки', 'Две ноги', '0.9.0']) assert.ok(text.includes(expected), expected);
 assert.equal(ACHIEVEMENT_DETAILS['super-burger'][0].items.length, 21);
 assert.equal(ACHIEVEMENT_DETAILS['adv-burger'][0].items.length, 21);
 assert.equal(ACHIEVEMENT_DETAILS.portal[0].items.length, 7);
 assert.equal(ACHIEVEMENT_DETAILS.easter[0].items.length, 12);
 assert.equal(ACHIEVEMENT_DETAILS['halloween-1'][0].items.length, 14);
 assert.ok(ACHIEVEMENT_DETAILS['super-burger'][0].items.some(item => item.includes('-584.7')));
 assert.ok(ACHIEVEMENT_DETAILS.portal[0].items.some(item => item.includes('637.4')));
});
