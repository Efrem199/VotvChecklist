import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import React from 'react';

test('command search uses the selected language and switching preserves its input', async () => {
 const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'https://example.com/#/fun' });
 Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, localStorage: dom.window.localStorage });
 dom.window.scrollTo = () => {};
 const out = '.fun-i18n-test-bundle.mjs';
 try {
  await build({entryPoints:['src/App.tsx'], bundle:true, platform:'node', format:'esm', packages:'external', loader:{'.jpg':'dataurl'}, outfile:out, logLevel:'silent'});
  const {default:App} = await import(pathToFileURL(process.cwd()+'/'+out).href);
  const {render, fireEvent, cleanup} = await import('@testing-library/react');
  const view = render(React.createElement(App));
  assert.ok(view.getByRole('heading', {name:'COMMANDS AND FUN'}));
  const search = view.getByLabelText('Find a command') as HTMLInputElement;
  fireEvent.change(search, {target:{value:'calibration'}});
  assert.ok(view.getByText('sd.calch'));
  assert.equal(view.queryByText('debug scrape'), null);
  fireEvent.change(view.getByRole('combobox', {name:'Language'}), {target:{value:'ru'}});
  assert.equal(search.value, 'calibration');
  assert.ok(view.getByText(/команды не найдены/));
  fireEvent.change(search, {target:{value:'калибровк'}});
  assert.ok(view.getByText('sd.calch'));
  assert.ok(view.getByRole('button', {name:'Скопировать sd.calch'}));
  assert.ok(view.getByText(/клавиша Insert/));
  cleanup();
 } finally { await rm(out, {force:true}); dom.window.close(); }
});
