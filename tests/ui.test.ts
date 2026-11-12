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
