import { test } from 'node:test';
import assert from 'node:assert/strict';
import { commandGroups } from '../src/data/fun';
import { englishCommandGroups } from '../src/data/en/fun';
import { DEFAULT_TASKS } from '../src/data/locations';
import { displayTask } from '../src/data/en/tasks';

test('every command, warning and group has an English translation without changing commands or sources', () => {
 assert.equal(englishCommandGroups.length, commandGroups.length);
 commandGroups.forEach((group, i) => {
  const translated = englishCommandGroups[i];
  assert.equal(translated.source, group.source);
  assert.notEqual(translated.title, group.title);
  assert.notEqual(translated.intro, group.intro);
  assert.equal(translated.commands.length, group.commands.length);
  group.commands.forEach((command, j) => {
   const result = translated.commands[j];
   assert.equal(result.command, command.command);
   assert.notEqual(result.description, command.description, command.command);
   assert.doesNotMatch(result.description, /[а-яё]/i, command.command);
   if (command.warning) {
    assert.ok(result.warning, command.command);
    assert.notEqual(result.warning, command.warning, command.command);
    assert.doesNotMatch(result.warning!, /[а-яё]/i, command.command);
   } else assert.equal(result.warning, undefined);
  });
 });
});

test('only unchanged built-in column labels are translated', () => {
 const original = DEFAULT_TASKS.dishes[0];
 assert.equal(displayTask(original, 'dishes', 'en'), 'Visited');
 assert.equal(displayTask(original, 'dishes', 'ru'), original.label);
 assert.equal(displayTask({ ...original, label: 'Моя задача' }, 'dishes', 'en'), 'Моя задача');
 assert.equal(displayTask({ key: 't-custom', label: 'Был' }, 'dishes', 'en'), 'Был');
});
