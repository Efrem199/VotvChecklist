import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BUILTIN_LOCATIONS } from '../src/data/locations';
import { locationWikiLinks } from '../src/data/locationLinks';

test('location links use verified language counterparts and suppress obsolete generic links', () => {
 const loc = (id:string) => BUILTIN_LOCATIONS.find(l=>l.id===id)!;
 assert.match(locationWikiLinks(loc('s-mre'),'en')[0].url, /voicesofthevoid\.wiki\.gg\/wiki\/Barrel/);
 assert.match(locationWikiLinks(loc('s-mre'),'ru')[0].url, /\/ru\/wiki\/Бочка/);
 assert.match(locationWikiLinks(loc('argemia-red'),'ru')[0].url, /Плюшевые_Аргемии/);
 assert.match(locationWikiLinks(loc('tool-lead-pipe'),'ru')[0].url, /Скрытые_Инструменты/);
 assert.deepEqual(locationWikiLinks(loc('s-candles'),'en'), []);
 for (const l of BUILTIN_LOCATIONS) for (const language of ['ru','en'] as const) {
  for (const link of locationWikiLinks(l,language)) assert.doesNotMatch(link.url, /eternitydev\.wiki\.gg/);
 }
});
