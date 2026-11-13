import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { OMEGA_GUIDE } from '../src/data/achievementDetails';
import { OMEGA_GUIDE_EN } from '../src/data/en/omegaGuide';

test('English Omega guide covers every original section and item in the same order', () => {
  // Any source change requires a review of the translation and its alignment.
  assert.equal(createHash('sha256').update(JSON.stringify(OMEGA_GUIDE)).digest('hex'), '89e4ea4a6bd42623a6141d3dd9ff540b55060a14ca52a8f1ae00d782b88dec4c');
  assert.equal(OMEGA_GUIDE_EN.length, OMEGA_GUIDE.length);
  for (let i = 0; i < OMEGA_GUIDE.length; i++) {
    assert.equal(OMEGA_GUIDE_EN[i].items.length, OMEGA_GUIDE[i].items.length);
    assert.equal(OMEGA_GUIDE_EN[i].spoiler, OMEGA_GUIDE[i].spoiler);
    assert.ok(OMEGA_GUIDE_EN[i].title.trim());
    for (const item of OMEGA_GUIDE_EN[i].items) {
      assert.ok(item.trim());
      assert.doesNotMatch(item, /[А-Яа-яЁё]/);
    }
  }
});
