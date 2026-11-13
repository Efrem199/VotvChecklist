import { test } from 'node:test';
import assert from 'node:assert/strict';
import { russianAchievementCounterpart } from '../src/data/achievementSourceLinks';
import { ACHIEVEMENT_GUIDES } from '../src/data/achievementGuides';

test('achievement source counterparts are explicit, without fabricating Russian URLs', () => {
 const fishing = ACHIEVEMENT_GUIDES['charcoal-fish'].sources!.find(s=>s.label==='Рыбалка')!;
 assert.equal(russianAchievementCounterpart(fishing.url)?.url,'https://voicesofthevoid.wiki.gg/ru/wiki/Рыбалка');
 const halloween = ACHIEVEMENT_GUIDES.horse.sources!.find(s=>s.label==='Halloween')!;
 assert.equal(russianAchievementCounterpart(halloween.url)?.url,'https://voicesofthevoid.wiki.gg/ru/wiki/Хэллоуин');
 const eggs = ACHIEVEMENT_GUIDES.easter.sources![0];
 assert.equal(russianAchievementCounterpart(eggs.url),undefined);
 assert.equal(russianAchievementCounterpart('https://voicesofthevoid.wiki.gg/wiki/Unknown'),undefined);
});
