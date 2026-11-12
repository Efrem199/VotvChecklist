import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React from 'react';
import { BUILTIN_LOCATIONS, DEFAULT_TASKS } from '../src/data/locations';
import { defaultState } from '../src/lib/state';
import LocationRow from '../src/components/LocationRow';
import ArrayMap from '../src/components/ArrayMap';

const dom = new JSDOM('<!doctype html><html><body></body></html>',{url:'https://example.com/'});
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element });
const { render, fireEvent, cleanup } = await import('@testing-library/react');

test('карточка загружает изображение только после открытия и позволяет отмечать ритуал', () => {
 const loc = BUILTIN_LOCATIONS.find(l=>l.id==='argemia-white')!;
 let step = '';
 const view = render(React.createElement('ul',null,React.createElement(LocationRow,{loc,tasks:DEFAULT_TASKS.secrets,ls:{done:{},note:''},progress:{done:0,total:2,complete:false,started:false},selected:false,flash:false,onToggle:()=>{},onNote:()=>{},onSelect:()=>{},onHover:()=>{},ritualSteps:{},onRitualStep:(key:string)=>{step=key}})));
 assert.equal(view.queryByRole('img'),null);
 fireEvent.click(view.getByRole('button',{name:`Подробности: ${loc.name}`}));
 assert.match(view.getByRole('img').getAttribute('src')!,/WhiteArgemia_Guide/);
 fireEvent.click(view.getAllByRole('checkbox')[0]); assert.equal(step,'argemia-white:0');
 fireEvent.error(view.getByRole('img')); assert.ok(view.getByText(/Не удалось загрузить изображение/));
 cleanup();
});
test('группа маркеров раскрывается и точку можно выбрать', () => {
 const locations=BUILTIN_LOCATIONS.filter(l=>['burger-server','burger-toilet'].includes(l.id));
 let selected='';
 const view=render(React.createElement(ArrayMap,{state:defaultState(),locations,mode:'overall',onModeChange:()=>{},selectedId:null,hoverId:null,onSelect:(id:string)=>{selected=id},onHover:()=>{}}));
 fireEvent.click(view.getByRole('button',{name:'Группа: 2 точек'}));
 fireEvent.click(view.getByRole('button',{name:/Сэндвич 01/}));
 assert.equal(selected,'burger-server');
 fireEvent.click(view.getByRole('button',{name:'Приблизить карту'}));
 assert.match(view.getByLabelText('Схема массива Dunkeltaler Forest').getAttribute('viewBox')!,/1000/);
 cleanup();
});

test('карточка показывает разногласие источников и не выдумывает версию', () => {
 const loc=BUILTIN_LOCATIONS.find(l=>l.id==='burger-buried')!;
 const view=render(React.createElement('ul',null,React.createElement(LocationRow,{loc,tasks:DEFAULT_TASKS.secrets,ls:{done:{},note:''},progress:{done:0,total:2,complete:false,started:false},selected:false,flash:false,onToggle:()=>{},onNote:()=>{},onSelect:()=>{},onHover:()=>{},ritualSteps:{},onRitualStep:()=>{}})));
 fireEvent.click(view.getByRole('button',{name:`Подробности: ${loc.name}`}));
 assert.ok(view.getByText(/Данные различаются/));
 assert.ok(view.getByText(/Версия игры: не установлена/));
 assert.ok(view.getByText(/Y:-584.7/));
 assert.ok(view.getByRole('link',{name:/Раскопки/}).getAttribute('href')?.includes('oldid=24727'));
 cleanup();
});

test('заметка не дублируется при открытии карточки и сохраняет текст', () => {
 const loc=BUILTIN_LOCATIONS.find(l=>l.id==='dish-b')!;
 function Row() {
  const [note,setNote]=React.useState('');
  return React.createElement('ul',null,React.createElement(LocationRow,{loc,tasks:DEFAULT_TASKS.dishes,ls:{done:{},note},progress:{done:0,total:3,complete:false,started:false},selected:false,flash:false,onToggle:()=>{},onNote:setNote,onSelect:()=>{},onHover:()=>{},ritualSteps:{},onRitualStep:()=>{}}));
 }
 const view=render(React.createElement(Row));
 const noteButton=view.getByRole('button',{name:`Заметка: ${loc.name}`});
 const details=view.getByRole('button',{name:`Подробности: ${loc.name}`});
 fireEvent.click(noteButton);
 let input=view.getByRole('textbox',{name:'Заметка'}) as HTMLTextAreaElement;
 fireEvent.change(input,{target:{value:'Мой текст'}});
 fireEvent.click(details);
 assert.equal(view.getAllByRole('textbox',{name:'Заметка'}).length,1);
 input=view.getByRole('textbox',{name:'Заметка'}) as HTMLTextAreaElement;
 assert.equal(input.value,'Мой текст');
 fireEvent.click(noteButton);
 assert.equal(document.activeElement,input);
 assert.equal(view.getAllByRole('textbox',{name:'Заметка'}).length,1);
 fireEvent.click(details);
 assert.equal((view.getByRole('textbox',{name:'Заметка'}) as HTMLTextAreaElement).value,'Мой текст');
 fireEvent.click(noteButton);
 assert.equal(view.queryByRole('textbox',{name:'Заметка'}),null);
 fireEvent.click(details);
 assert.equal((view.getByRole('textbox',{name:'Заметка'}) as HTMLTextAreaElement).value,'Мой текст');
 fireEvent.click(noteButton);
 assert.equal(view.getAllByRole('textbox',{name:'Заметка'}).length,1);
 cleanup();
});

test('карточка одинаково раскрывается и сворачивается по заголовку и кнопке подробностей', () => {
 const loc=BUILTIN_LOCATIONS.find(l=>l.id==='dish-b')!;
 let selections=0, toggles=0;
 function Row() {
  const [selected,setSelected]=React.useState(false);
  return React.createElement('ul',null,React.createElement(LocationRow,{loc,tasks:DEFAULT_TASKS.dishes,ls:{done:{},note:''},progress:{done:0,total:3,complete:false,started:false},selected,flash:false,onToggle:()=>{toggles++},onNote:()=>{},onSelect:()=>{selections++;setSelected(true)},onHover:()=>{},ritualSteps:{},onRitualStep:()=>{}}));
 }
 const view=render(React.createElement(Row));
 const heading=view.getByRole('button',{name:`Карточка: ${loc.name}`});
 const details=view.getByRole('button',{name:`Подробности: ${loc.name}`});
 assert.equal(heading.getAttribute('aria-expanded'),'false');
 fireEvent.click(heading);
 assert.equal(selections,1);
 assert.equal(heading.getAttribute('aria-expanded'),'true');
 assert.match(details.textContent!,/свернуть/);
 fireEvent.click(heading);
 assert.equal(heading.getAttribute('aria-expanded'),'false');
 assert.equal(selections,1);
 fireEvent.click(details);
 assert.equal(heading.getAttribute('aria-expanded'),'true');
 fireEvent.click(heading);
 assert.equal(heading.getAttribute('aria-expanded'),'false');
 fireEvent.click(heading);
 fireEvent.click(details);
 assert.equal(heading.getAttribute('aria-expanded'),'false');
 fireEvent.click(view.getByRole('button',{name:/Был/}));
 assert.equal(toggles,1);
 assert.equal(heading.getAttribute('aria-expanded'),'false');
 cleanup();
});

test('выбор точки на карте раскрывает соответствующую карточку', () => {
 const loc=BUILTIN_LOCATIONS.find(l=>l.id==='dish-b')!;
 const props={loc,tasks:DEFAULT_TASKS.dishes,ls:{done:{},note:''},progress:{done:0,total:3,complete:false,started:false},selected:false,flash:false,onToggle:()=>{},onNote:()=>{},onSelect:()=>{},onHover:()=>{},ritualSteps:{},onRitualStep:()=>{}};
 const view=render(React.createElement(LocationRow,props));
 const heading=view.getByRole('button',{name:`Карточка: ${loc.name}`});
 view.rerender(React.createElement(LocationRow,{...props,selected:true}));
 assert.equal(heading.getAttribute('aria-expanded'),'true');
 fireEvent.click(heading);
 assert.equal(heading.getAttribute('aria-expanded'),'false');
 view.rerender(React.createElement(LocationRow,{...props,selected:true,selectionSerial:1}));
 assert.equal(heading.getAttribute('aria-expanded'),'true');
 fireEvent.click(heading);
 assert.equal(heading.getAttribute('aria-expanded'),'false');
 cleanup();
});
