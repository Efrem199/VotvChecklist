import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { ACHIEVEMENTS_EN, englishAchievement } from '../src/data/en/achievements';

test('every achievement has an English condition and reward without changing identity or metadata', () => {
  // Re-review translations when the source list changes.
  assert.equal(createHash('sha256').update(JSON.stringify(ACHIEVEMENTS)).digest('hex'), '443e29dad40f657df2c0545d5ec7edde959b20bbd0f5fbf5398e038c26f7d81c');
  assert.equal(ACHIEVEMENTS_EN.length, ACHIEVEMENTS.length);
  for (const [index, original] of ACHIEVEMENTS.entries()) {
    const translated = ACHIEVEMENTS_EN[index];
    assert.ok(translated, `missing translation for ${original.id}`);
    assert.ok(translated.condition.trim());
    assert.ok(translated.reward.trim());
    assert.doesNotMatch(translated.condition + translated.reward, /[А-Яа-яЁё]/);
    assert.deepEqual({ ...translated, condition: original.condition, reward: original.reward }, original);
  }
  assert.equal(englishAchievement({ ...ACHIEVEMENTS[0], id: 'not-translated' }), undefined);
  assert.equal(englishAchievement({ ...ACHIEVEMENTS[0], reward: 'new reward' }), undefined);
});
