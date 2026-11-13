import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { BUILTIN_LOCATIONS } from '../src/data/locations';
import { acquisitionFor } from '../src/data/acquisition';

test('every built-in acquisition warning and requirement has an English translation', () => {
 const original = BUILTIN_LOCATIONS.map(l => [l.id, acquisitionFor(l.id)]).filter(([, value]) => value);
 assert.equal(createHash('sha256').update(JSON.stringify(original)).digest('hex'), '425de37613cb0609c27836977b8496a6faa84c70e1f6828a7b8ba157f840db59');
 for (const loc of BUILTIN_LOCATIONS) {
  const ru = acquisitionFor(loc.id);
  const en = acquisitionFor(loc.id, 'en');
  assert.equal(Boolean(en), Boolean(ru), loc.id);
  if (ru && en) {
   assert.equal(Boolean(en.requirements), Boolean(ru.requirements), loc.id);
   assert.equal(Boolean(en.warning), Boolean(ru.warning), loc.id);
   assert.doesNotMatch(`${en.requirements ?? ''} ${en.warning ?? ''}`, /[А-Яа-яЁё]/);
  }
 }
 assert.equal(acquisitionFor('user-defined', 'en'), undefined);
});
