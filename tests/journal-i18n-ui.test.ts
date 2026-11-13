import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import React from 'react';

test('location search, custom data and progress survive switching languages', async () => {
 const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {url:'https://example.com/#/'});
 Object.assign(globalThis, {window:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement, Element:dom.window.Element, localStorage:dom.window.localStorage});
 dom.window.scrollTo = () => {};
 dom.window.requestAnimationFrame = (callback) => dom.window.setTimeout(() => callback(Date.now()), 0);
 dom.window.HTMLElement.prototype.scrollIntoView = () => {};
 const out = '.journal-i18n-test-bundle.mjs';
 try {
  await build({entryPoints:['src/App.tsx'], bundle:true, platform:'node', format:'esm', packages:'external', loader:{'.jpg':'dataurl'}, outfile:out, logLevel:'silent'});
  const {default:App} = await import(pathToFileURL(process.cwd()+'/'+out).href);
  const {render, fireEvent, cleanup, within} = await import('@testing-library/react');
  const view = render(React.createElement(App));
  assert.equal((view.getByRole('combobox',{name:'Select profile'}) as HTMLSelectElement).selectedOptions[0].textContent,'Main playthrough');
  const power = document.getElementById('cat-power')!;
  fireEvent.click(within(power).getByRole('button',{name:'⚙ columns'}));
  const column = within(power).getByRole('textbox',{name:'Column 1 name'}) as HTMLInputElement;
  assert.equal(column.value, 'Visited');
  fireEvent.change(column,{target:{value:'My custom column'}});
  fireEvent.change(view.getByRole('combobox',{name:'Language'}),{target:{value:'ru'}});
  assert.equal((within(power).getByRole('textbox',{name:'Название колонки 1'}) as HTMLInputElement).value,'My custom column');
  fireEvent.click(within(power).getByRole('button',{name:'⟲ по умолчанию'}));
  assert.equal((within(power).getByRole('textbox',{name:'Название колонки 1'}) as HTMLInputElement).value,'Был');
  fireEvent.change(view.getByRole('combobox',{name:'Язык'}),{target:{value:'en'}});
  assert.equal((within(power).getByRole('textbox',{name:'Column 1 name'}) as HTMLInputElement).value,'Visited');
  fireEvent.click(within(power).getByRole('button',{name:'⚙ columns'}));
  const search = view.getByRole('textbox',{name:'Search locations'});
  fireEvent.change(search,{target:{value:'Substation'}});
  const row = document.getElementById('loc-substation')!;
  assert.ok(row);
  fireEvent.click(within(row).getByRole('button',{name:'Visited'}));
  assert.equal(within(row).getByRole('button',{name:'Visited'}).getAttribute('aria-pressed'),'true');
  fireEvent.click(within(row).getByRole('button',{name:'Card: Substation'}));
  assert.match(view.getByRole('tooltip').textContent!, /Visited/);
  fireEvent.change(view.getByRole('combobox',{name:'Language'}),{target:{value:'ru'}});
  // Query is retained and now filters the Russian text; changing it finds the same ID.
  fireEvent.change(view.getByRole('textbox',{name:'Поиск по точкам'}),{target:{value:'Подстанция'}});
  const russianRow = document.getElementById('loc-substation')!;
  assert.equal(within(russianRow).getAllByRole('button',{name:'Был'})[0].getAttribute('aria-pressed'),'true');
  assert.match(view.getByRole('tooltip').textContent!, /Был/);
  fireEvent.change(view.getByRole('combobox',{name:'Язык'}),{target:{value:'en'}});
  fireEvent.change(view.getByRole('textbox',{name:'Search locations'}),{target:{value:''}});
  fireEvent.change(view.getByRole('textbox',{name:'Location name'}),{target:{value:'Мой ящик'}});
  fireEvent.change(view.getByRole('textbox',{name:'Description'}),{target:{value:'Личная заметка'}});
  fireEvent.click(view.getByRole('button',{name:'+ add'}));
  assert.ok(view.getByText('Мой ящик'));
  fireEvent.change(view.getByRole('combobox',{name:'Language'}),{target:{value:'ru'}});
  assert.ok(view.getByText('Мой ящик'));
  assert.ok(view.getByText('Личная заметка'));
  cleanup();
 } finally { await rm(out,{force:true}); dom.window.close(); }
});
