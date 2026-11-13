import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BUILTIN_LOCATIONS } from '../src/data/locations';
import { englishLocation } from '../src/data/en/locations';
import { RITUALS } from '../src/data/rituals';
import { ENGLISH_RITUALS } from '../src/data/en/rituals';
import { reviewFor } from '../src/data/review';
import { englishReview } from '../src/data/en/review';

test('built-in location translations cover names, descriptions and groups without changing keys, coordinates or sources', () => {
 for (const loc of BUILTIN_LOCATIONS) {
  const translated = englishLocation(loc);
  for (const field of ['id','category','kind','x','y','source'] as const) assert.equal(translated[field], loc[field], `${loc.id}: ${field}`);
  for (const field of ['name','desc','group','alt','code'] as const) assert.doesNotMatch(translated[field] ?? '', /[а-яё]/i, `${loc.id}: ${field}`);
  if (loc.desc) assert.ok(translated.desc, loc.id);
  const review = englishReview(loc.id, reviewFor(loc));
  assert.equal(review.status, reviewFor(loc).status);
  for (const field of ['scope','note'] as const) assert.doesNotMatch(review[field] ?? '', /[а-яё]/i, `${loc.id}: review ${field}`);
  for (const source of review.sources ?? []) assert.doesNotMatch(source.label, /[а-яё]/i, loc.id);
 }
 const custom = {id:'custom-1',category:'custom',kind:'custom',name:'Моя база',desc:'Личные данные'} as const;
 assert.strictEqual(englishLocation(custom), custom);
});

test('ritual translations keep step counts, order and storage indices', () => {
 assert.deepEqual(Object.keys(ENGLISH_RITUALS).sort(), Object.keys(RITUALS).sort());
 for (const [id, steps] of Object.entries(RITUALS)) {
  assert.equal(ENGLISH_RITUALS[id].length, steps.length, id);
  for (const step of ENGLISH_RITUALS[id]) assert.doesNotMatch(step, /[а-яё]/i, id);
 }
});
