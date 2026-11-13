import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VERIFIED_WIKI_PAGES } from '../src/data/wikiTranslations';

test('verified wiki counterparts use the requested language, not generated paths', () => {
  for (const pair of Object.values(VERIFIED_WIKI_PAGES)) {
    const en = new URL(pair.en);
    const ru = new URL(pair.ru);
    assert.equal(en.hostname, 'voicesofthevoid.wiki.gg');
    assert.equal(ru.hostname, 'voicesofthevoid.wiki.gg');
    assert.ok(en.pathname.startsWith('/wiki/'));
    assert.ok(ru.pathname.startsWith('/ru/wiki/'));
    assert.notEqual(decodeURIComponent(en.pathname.slice('/wiki/'.length)), decodeURIComponent(ru.pathname.slice('/ru/wiki/'.length)));
  }
});
