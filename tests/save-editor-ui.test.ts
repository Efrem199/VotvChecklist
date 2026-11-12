import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import React from 'react';
const i=(n:number)=>{const b=Buffer.alloc(4);b.writeInt32LE(n);return b};
const s=(v:string)=>Buffer.concat([i(Buffer.byteLength(v)+1),Buffer.from(v),Buffer.from([0])]);
const p=(n:string,t:string,b:Buffer,x=Buffer.alloc(0))=>Buffer.concat([s(n),s(t),i(b.length),i(0),x,Buffer.from([0]),b]);
function example() {return Buffer.concat([Buffer.from('GVAS'),i(2),i(522),Buffer.from([4,0,27,0,0,0,0,0,0,0]),s('++UE4+Release-4.27'),i(3),i(0),s('/Game/main/saveSlot.saveSlot_C'),p('Version','StrProperty',s('0.9.0')),p('Points','IntProperty',i(123)),p('advancementsNames','ArrayProperty',Buffer.concat([i(1),s('burger')]),s('NameProperty')),p('advancementsCompleted','ArrayProperty',Buffer.concat([i(1),Buffer.from([0])]),s('BoolProperty')),s('None'),i(0)]);}
test('редактор загружает локальный файл, проверяет значения и требует подтверждения',async()=>{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.com/#/save-editor'});
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,Element:dom.window.Element,localStorage:dom.window.localStorage,requestAnimationFrame:(fn:()=>void)=>setTimeout(fn,0)});
 dom.window.scrollTo=()=>{}; const out='.save-editor-test-bundle.mjs';
 try {
  await build({entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.jpg':'dataurl'},outfile:out,logLevel:'silent'});
  const {default:App}=await import(pathToFileURL(process.cwd()+'/'+out).href);
  const {render,fireEvent,cleanup,waitFor}=await import('@testing-library/react');
  const view=render(React.createElement(App));
  assert.ok(view.getByText('РЕДАКТОР СОХРАНЕНИЙ'));
  const input=view.getByLabelText('Выбрать сохранение'); const bytes=example();
  fireEvent.change(input,{target:{files:[{name:'s_test.sav',size:bytes.length,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)}]}});
  await waitFor(()=>assert.ok(view.getByText(/s_test.sav · прохождение/)));
  const points=view.getByLabelText('Очки') as HTMLInputElement;
  assert.equal(points.value,'123'); const download=view.getByRole('button',{name:'Скачать изменённый файл'}) as HTMLButtonElement;
  assert.equal(download.disabled,true); fireEvent.change(points,{target:{value:'456'}}); assert.equal(download.disabled,true);
  fireEvent.click(view.getByLabelText('Я сохранил резервную копию и закрыл игру')); assert.equal(download.disabled,false);
  fireEvent.change(points,{target:{value:'-1'}}); assert.equal(download.disabled,true); assert.ok(view.getByRole('alert').textContent?.includes('Points'));
  fireEvent.change(points,{target:{value:'456'}});
  const flag=view.getByLabelText(/burger/) as HTMLInputElement; assert.equal(flag.disabled,true);
  fireEvent.click(view.getByLabelText('Понимаю риск и хочу изменить флаги')); assert.equal(flag.disabled,false); fireEvent.click(flag);
  fireEvent.click(view.getByLabelText('Понимаю риск и хочу изменить флаги')); assert.equal(download.disabled,true);
  fireEvent.click(view.getByRole('button',{name:'Сбросить изменения'})); assert.equal(points.value,'123'); assert.equal(download.disabled,true);
  cleanup();
 } finally {await rm(out,{force:true});dom.window.close();}
});
