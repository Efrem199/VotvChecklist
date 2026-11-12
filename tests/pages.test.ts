import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = readFileSync('index.html', 'utf8');
const built = readFileSync('docs/index.html', 'utf8');
const redirect = root.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(redirect, 'скрипт перенаправления должен присутствовать');
function target(html: string, url: string) {
  let redirected: string | undefined;
  const parsed = new URL(url);
  const location = { hostname: parsed.hostname, href: parsed.href, search: parsed.search, hash: parsed.hash, replace: (value: string) => { redirected = value; } };
  const document = { querySelector: () => html.includes('<script type="module" src="/src/main.tsx"></script>') ? {} : null };
  runInNewContext(redirect!, { location, document, URL });
  return redirected;
}
test('страница исходников на GitHub Pages перенаправляет на сборку', () => {
  assert.equal(target(root, 'https://efrem199.github.io/VotvChecklist/'), 'https://efrem199.github.io/VotvChecklist/docs/');
  assert.equal(target(root, 'https://efrem199.github.io/VotvChecklist/index.html'), 'https://efrem199.github.io/VotvChecklist/docs/');
  assert.equal(target(root, 'https://efrem199.github.io/VotvChecklist/?test=1#/fun'), 'https://efrem199.github.io/VotvChecklist/docs/?test=1#/fun');
});
test('сборка не перенаправляет повторно, локальная разработка не затронута', () => {
  assert.equal(target(built, 'https://efrem199.github.io/VotvChecklist/docs/'), undefined);
  assert.equal(target(built, 'https://efrem199.github.io/VotvChecklist/'), undefined);
  assert.equal(target(root, 'http://localhost:5173/'), undefined);
  assert.ok(!built.includes('<script type="module" src="/src/main.tsx"></script>'));
});
test('иконка доступна и в исходной странице, и в автономной сборке Pages', () => {
  for (const html of [root, built]) {
    const icon = html.match(/<link rel="icon" type="image\/svg\+xml" href="data:image\/svg\+xml;base64,([^"]+)"/);
    assert.ok(icon, 'встроенная SVG-иконка должна присутствовать');
    assert.match(Buffer.from(icon[1], 'base64').toString(), /<svg[^>]+viewBox="0 0 64 64"/);
  }
});
