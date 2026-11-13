import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ACHIEVEMENT_GUIDES } from '../src/data/achievementGuides';
import { ACHIEVEMENT_DETAILS } from '../src/data/achievementDetails';
import { STEP_ILLUSTRATIONS, SECTION_ILLUSTRATIONS } from '../src/data/achievementIllustrations';
import { ENGLISH_ACHIEVEMENT_GUIDES } from '../src/data/en/achievementGuides';
import { ENGLISH_ACHIEVEMENT_DETAILS } from '../src/data/en/achievementFull';
import { englishIllustrationCaption } from '../src/data/en/achievementIllustrations';

test('all achievement guides retain checklist steps, warnings, sources and translated illustrations', () => {
 // A source edit requires a human review of its translation and illustration alignment.
 assert.equal(createHash('sha256').update(JSON.stringify(ACHIEVEMENT_GUIDES)).digest('hex'), 'ed78f7e3dd4c1dc574f097b3f1e93a903917d016e1a879482c435ca4cc127fb2');
 assert.equal(createHash('sha256').update(JSON.stringify(ACHIEVEMENT_DETAILS)).digest('hex'), 'a6c11e897e66bcbf48b41b2666bcc92332838a141b04107fce238316f7f115f6');
 assert.deepEqual(Object.keys(ENGLISH_ACHIEVEMENT_GUIDES).sort(), Object.keys(ACHIEVEMENT_GUIDES).sort());
 for (const [id, original] of Object.entries(ACHIEVEMENT_GUIDES)) {
  const translated = ENGLISH_ACHIEVEMENT_GUIDES[id];
  assert.equal(translated.steps.length, original.steps.length, id);
  assert.equal(Boolean(translated.note), Boolean(original.note), id);
  assert.deepEqual(translated.sources?.map(s=>s.url), original.sources?.map(s=>s.url), id);
  assert.deepEqual(translated.images?.map(s=>s.file), original.images?.map(s=>s.file), id);
  assert.doesNotMatch(JSON.stringify(translated), /[а-яё]/i, id);
  const detail = ACHIEVEMENT_DETAILS[id];
  const translatedDetail = ENGLISH_ACHIEVEMENT_DETAILS[id];
  assert.equal(translatedDetail?.length, detail?.length, id);
  detail?.forEach((section,i)=>{
   assert.equal(translatedDetail![i].items.length, section.items.length, id);
   assert.equal(translatedDetail![i].spoiler, section.spoiler, id);
   assert.doesNotMatch(JSON.stringify(translatedDetail![i]), /[а-яё]/i, id);
  });
  for (const images of Object.values(STEP_ILLUSTRATIONS[id] ?? {})) for (const image of images) assert.ok(englishIllustrationCaption(image.caption), `${id}: ${image.caption}`);
  for (const group of Object.values(SECTION_ILLUSTRATIONS[id] ?? {})) for (const images of Object.values(group)) for (const image of images) assert.ok(englishIllustrationCaption(image.caption), `${id}: ${image.caption}`);
 }
});
