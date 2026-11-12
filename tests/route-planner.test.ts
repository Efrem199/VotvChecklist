import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BUILTIN_LOCATIONS } from '../src/data/locations';
import { routeDistance, routeSupplies } from '../src/lib/routePlanner';

test('длина маршрута считается по координатам, а не по сдвигам маркеров', () => {
 const points = ['dish-b','dish-c','hideout'].map(id => BUILTIN_LOCATIONS.find(l => l.id === id)!);
 const expected = 100 + Math.hypot(points[2].x! - points[1].x!, points[2].y! - points[1].y!);
 assert.equal(routeDistance(points), expected);
 assert.equal(routeDistance([]), 0);
 assert.ok(routeSupplies(points).some(x => x.includes('крюк')));
 assert.ok(routeSupplies([BUILTIN_LOCATIONS.find(l => l.id === 'tr2')!]).some(x => x.includes('радиации')));
});
