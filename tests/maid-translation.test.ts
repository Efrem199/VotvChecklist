import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ACHIEVEMENT_GUIDES } from '../src/data/achievementGuides';
import { ACHIEVEMENT_DETAILS } from '../src/data/achievementDetails';
import { STEP_ILLUSTRATIONS } from '../src/data/achievementIllustrations';
import { ENGLISH_ACHIEVEMENT_GUIDES, englishMaidCaption } from '../src/data/en/achievementGuides';

test('translated Maid guide keeps the same steps and illustration coverage', () => {
 const source = ACHIEVEMENT_GUIDES.maid;
 const translated = ENGLISH_ACHIEVEMENT_GUIDES.maid;
 assert.equal(createHash('sha256').update(JSON.stringify(source)).digest('hex'), '8448064e6a8852a188d4e105f5166aa57b00d1ab03e296c09dac04257e3c2edf');
 assert.equal(translated.steps.length, source.steps.length);
 assert.equal(ACHIEVEMENT_DETAILS.maid, undefined, 'new detail sections also need translation');
 for (const images of Object.values(STEP_ILLUSTRATIONS.maid)) for (const image of images) assert.ok(englishMaidCaption(image.file));
 assert.doesNotMatch(JSON.stringify(translated), /[А-Яа-яЁё]/);
});
