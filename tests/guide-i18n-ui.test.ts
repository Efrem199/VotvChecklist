import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import React from 'react';

test('translated achievement steps keep their marks when switching language', async () => {
 const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://example.com/#/achievements?item=sandbox'});
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,Element:dom.window.Element,localStorage:dom.window.localStorage});
 dom.window.scrollTo=()=>{};
 const out='.guide-i18n-test-bundle.mjs';
 try {
  await build({entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.jpg':'dataurl'},outfile:out,logLevel:'silent'});
  const {default:App}=await import(pathToFileURL(process.cwd()+'/'+out).href);
  const {render,fireEvent,cleanup}=await import('@testing-library/react');
  const view=render(React.createElement(App));
  const guide=view.getByText('How to obtain · step-by-step guide').closest('details')!;
  guide.open=true; fireEvent(guide,new dom.window.Event('toggle'));
  assert.ok(view.getByText(/continue until in-game day 31/));
  fireEvent.click(view.getByRole('checkbox',{name:'Step 1 completed'}));
  fireEvent.change(view.getByRole('combobox',{name:'Language'}),{target:{value:'ru'}});
  assert.ok(view.getByText(/продолжайте до 31-го игрового дня/));
  assert.ok((view.getByRole('checkbox',{name:'Шаг 1 выполнен'}) as HTMLInputElement).checked);
  cleanup();
 } finally {await rm(out,{force:true});dom.window.close();}
});

test('detailed guides keep per-location illustrations and step marks across languages', async () => {
 const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://example.com/#/achievements?item=easter'});
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,Element:dom.window.Element,localStorage:dom.window.localStorage});
 dom.window.scrollTo=()=>{};
 const out='.guide-detail-i18n-test-bundle.mjs';
 try {
  await build({entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.jpg':'dataurl'},outfile:out,logLevel:'silent'});
  const {default:App}=await import(pathToFileURL(process.cwd()+'/'+out).href);
  const {render,fireEvent,cleanup,within}=await import('@testing-library/react');
  const view=render(React.createElement(App));
  const guide=view.getByText('How to obtain · step-by-step guide').closest('details')!;
  guide.open=true; fireEvent(guide,new dom.window.Event('toggle'));
  assert.ok(view.getByText('All 12 Easter eggs'));
  const first=view.getByText(/#1 X:104.4 Y:444.4/).closest('li')!;
  assert.ok(within(first).getByRole('img',{name:'Egg 1: location'}));
  assert.ok(within(first).getByRole('link',{name:/Egg 1: location · wiki file/}).getAttribute('href')?.includes('Item_EasterEgg1_Location.png'));
  fireEvent.click(view.getByRole('checkbox',{name:'Step 1 completed'}));
  fireEvent.change(view.getByRole('combobox',{name:'Language'}),{target:{value:'ru'}});
  assert.ok((view.getByRole('checkbox',{name:'Шаг 1 выполнен'}) as HTMLInputElement).checked);
  assert.ok(view.getByText('Все 12 пасхальных яиц'));
  assert.ok(view.getByRole('img',{name:'Яйцо 1: место находки'}));
  assert.match(view.getByRole('link',{name:/Яйца: координаты и изображения \(англ., источник\)/}).getAttribute('href')!, /Easter_Eggs/);
  cleanup();
 } finally {await rm(out,{force:true});dom.window.close();}
});
