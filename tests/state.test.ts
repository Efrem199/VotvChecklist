import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, normalizeState, parseImport, progressFor, saveState, serializeState, tasksFor, uid } from '../src/lib/state';
import { BUILTIN_LOCATIONS, DEFAULT_TASKS } from '../src/data/locations';

test('экспорт и импорт не теряют прогресс, точки и настройки', () => {
  const state = defaultState();
  state.day = 14;
  state.progress['dish-b'] = { done: { visited: true, server: true }, note: 'проверка', day: 12 };
  state.custom.push({ id: 'custom-one', name: 'Точка', x: 10, y: -20 });
  state.tasks.dishes = [{ key: 'visited', label: 'Был' }];
  assert.deepEqual(JSON.parse(JSON.stringify(parseImport(JSON.parse(serializeState(state))))), JSON.parse(JSON.stringify(state)));
});

test('отклоняет чужой JSON и неподдерживаемую версию', () => {
  for (const raw of [null, {}, [], 'x', { app: 'votv-patrol-log', version: 2, state: defaultState() }, { ...defaultState(), version: 2 }]) {
    assert.throws(() => parseImport(raw));
  }
  assert.deepEqual(parseImport(defaultState()), defaultState());
});

test('нормализация устойчива к повреждённым полям', () => {
  const s = normalizeState({ day: -10, progress: { bad: 4, good: { done: { a: 1 }, note: 4 } }, log: Array.from({length: 20}, () => ({text:'x'})) });
  assert.equal(s.day, 1);
  assert.equal(s.progress.good.done.a, true);
  assert.equal(s.progress.good.note, '');
  assert.equal(s.log.length, 12);
});

test('ошибка записи не скрывается', () => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { setItem() { throw new Error('quota'); } } });
  assert.equal(saveState(defaultState()), false);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { setItem() {} } });
  assert.equal(saveState(defaultState()), true);
  Reflect.deleteProperty(globalThis, 'localStorage');
});

test('прогресс учитывает текущие колонки', () => {
  const state = defaultState();
  const dish = BUILTIN_LOCATIONS.find(l => l.id === 'dish-b')!;
  state.progress[dish.id] = { done: { visited: true }, note: '' };
  assert.equal(progressFor(state, dish).complete, false);
  state.tasks.dishes = [{ key: 'visited', label: 'Был' }];
  assert.equal(progressFor(state, dish).complete, true);
  assert.deepEqual(tasksFor(defaultState(), 'radars'), DEFAULT_TASKS.radars);
});

test('данные: уникальные ID, 21 сэндвич, все варианты Аргемии и источники', () => {
  assert.equal(new Set(BUILTIN_LOCATIONS.map(l => l.id)).size, BUILTIN_LOCATIONS.length);
  const burgers = BUILTIN_LOCATIONS.filter(l => l.group?.includes('Куриные сэндвичи'));
  assert.equal(burgers.length, 21);
  assert.ok(burgers.every(l => typeof l.x === 'number' && typeof l.y === 'number' && l.source));
  const plush = BUILTIN_LOCATIONS.filter(l => l.id.startsWith('argemia-'));
  assert.equal(plush.length, 12);
  assert.ok(plush.every(l => l.desc && l.source));
  assert.equal(BUILTIN_LOCATIONS.find(l => l.id === 's-burger-tr2')?.x, -549.8);
  assert.equal(BUILTIN_LOCATIONS.find(l => l.id === 's-fishing')?.x, 176.06);
});

test('ID не повторяются', () => {
  assert.equal(new Set(Array.from({ length: 10000 }, () => uid('custom'))).size, 10000);
});

test('планировщик мигрирует и экспортируется вместе с профилем',()=>{
 const old=defaultState();
 assert.deepEqual(normalizeState({...old,plannerSteps:undefined}).plannerSteps,{});
 old.plannerSteps={'omega:blueprint':true,'fishing:craft':false};
 assert.deepEqual(parseImport(JSON.parse(serializeState(old))).plannerSteps,old.plannerSteps);
 assert.deepEqual(normalizeState({...old,plannerSteps:{bad:'yes',ok:true}}).plannerSteps,{ok:true});
});
