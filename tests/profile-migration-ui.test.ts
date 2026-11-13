import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { defaultState } from '../src/lib/state';
import { PROFILES_KEY } from '../src/lib/profiles';

test('existing default profile is renamed and retains its marks across pages and languages', async () => {
 const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {url:'https://example.com/#/'});
 Object.assign(globalThis, {window:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement, Element:dom.window.Element, localStorage:dom.window.localStorage});
 dom.window.scrollTo = () => {};
 const state=defaultState(); state.progress['dish-b']={done:{visited:true},note:'keep'}; state.plannerSteps['omega:ai']=true;
 dom.window.localStorage.setItem(PROFILES_KEY,JSON.stringify({version:1,activeId:'default',profiles:[{id:'default',name:'Основное прохождение',createdAt:42,state}]}));
 const out='.profile-migration-ui-bundle.mjs';
 try {
  await build({entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.jpg':'dataurl'},outfile:out,logLevel:'silent'});
  const {default:App}=await import(pathToFileURL(process.cwd()+'/'+out).href);
  const {render,fireEvent,cleanup,waitFor,within}=await import('@testing-library/react');
  const view=render(React.createElement(App));
  const select=view.getByRole('combobox',{name:'Select profile'}) as HTMLSelectElement;
  assert.equal(select.selectedOptions[0].textContent,'Default');
  assert.equal(within(document.getElementById('loc-dish-b')!).getByRole('button',{name:'Visited'}).getAttribute('aria-pressed'),'true');
  await waitFor(()=>assert.equal(JSON.parse(dom.window.localStorage.getItem(PROFILES_KEY)!).profiles[0].name,'Default'));
  fireEvent.change(view.getByRole('combobox',{name:'Language'}),{target:{value:'ru'}});
  assert.equal((view.getByRole('combobox',{name:'Выбрать прохождение'}) as HTMLSelectElement).selectedOptions[0].textContent,'Default');
  dom.window.location.hash='#/achievements?item=adv-burger';
  fireEvent(dom.window,new dom.window.Event('hashchange'));
  assert.equal((view.getByRole('combobox',{name:'Профиль для гайдов и advancements'}) as HTMLSelectElement).selectedOptions[0].textContent,'Default');
  assert.equal(JSON.parse(dom.window.localStorage.getItem(PROFILES_KEY)!).profiles[0].state.plannerSteps['omega:ai'],true);
  cleanup();
 } finally {await rm(out,{force:true});dom.window.close();}
});
