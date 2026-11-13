import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React from 'react';
import OmegaGuide from '../src/components/OmegaGuide';
import FishingGuide from '../src/components/FishingGuide';
import { OMEGA_ILLUSTRATIONS } from '../src/data/achievementIllustrations';
import { englishOmegaIllustration } from '../src/data/en/omegaIllustrations';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.com/' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element });
const { render, fireEvent, cleanup, within } = await import('@testing-library/react');

test('Omega guide translates text and images without changing checklist IDs or links to locations', () => {
  let changed = '';
  const props = { target: true, navigationId: 1, marks: { 'omega:blueprint': true }, onStep: (id: string) => { changed = id; } };
  const view = render(React.createElement(OmegaGuide, { ...props, language: 'ru' }));
  assert.ok(view.getByText(/14 пластикового, 7 металлического/));
  assert.ok((view.getByRole('checkbox', { name: 'Руководство-чертёж найдено' }) as HTMLInputElement).checked);
  view.rerender(React.createElement(OmegaGuide, { ...props, language: 'en' }));
  const guide = within(view.getByRole('region', { name: 'Kerfur-Omega guide' }));
  assert.ok(guide.getByText(/14 plastic, 7 metal/));
  assert.ok((guide.getByRole('checkbox', { name: 'Manual blueprint found' }) as HTMLInputElement).checked);
  fireEvent.click(guide.getByRole('checkbox', { name: 'Manual blueprint found' }));
  assert.equal(changed, 'omega:blueprint');
  assert.equal(guide.getByRole('link', { name: /Romeo on the map/ }).getAttribute('href'), '#/journal?loc=dish-r');
  assert.match(guide.getByAltText('Joint box dig locations near Romeo').closest('li')!.textContent!, /Ball Joints:/);
  for (const link of guide.getAllByRole('link', { name: 'English wiki ↗' })) {
    assert.match(link.getAttribute('href')!, /^https:\/\/voicesofthevoid\.wiki\.gg\/wiki\//);
  }
  cleanup();
});

test('every Omega guide illustration has an English caption', () => {
  for (const section of Object.values(OMEGA_ILLUSTRATIONS)) {
    for (const images of Object.values(section)) {
      for (const image of images) {
        const translated = englishOmegaIllustration(image);
        assert.ok(translated, `missing caption for ${image.file}`);
        assert.doesNotMatch(translated.caption, /[А-Яа-яЁё]/);
        assert.equal(translated.file, image.file);
      }
    }
  }
});

test('fishing guide language changes keep the same saved checklist keys', () => {
  let changed = '';
  const props = { marks: { 'fishing:treasure': true }, onStep: (id: string) => { changed = id; } };
  const view = render(React.createElement(FishingGuide, { ...props, language: 'ru' }));
  const details = view.getByText(/Удочка: гайд и шаги/).closest('details')!;
  details.open = true;
  fireEvent(details, new dom.window.Event('toggle'));
  assert.ok((view.getByRole('checkbox', { name: 'Клад выкопан' }) as HTMLInputElement).checked);
  view.rerender(React.createElement(FishingGuide, { ...props, language: 'en' }));
  assert.ok((view.getByRole('checkbox', { name: 'Treasure dug up' }) as HTMLInputElement).checked);
  fireEvent.click(view.getByRole('checkbox', { name: 'Treasure dug up' }));
  assert.equal(changed, 'fishing:treasure');
  assert.equal(view.getByRole('link', { name: 'Fishing rod on the English wiki ↗' }).getAttribute('href'), 'https://voicesofthevoid.wiki.gg/wiki/Fishing_Rod');
  cleanup();
});
