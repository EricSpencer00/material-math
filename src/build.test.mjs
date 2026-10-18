import {test} from 'node:test';
import assert from 'node:assert/strict';
import {material,orbit,torusPath} from './build.mjs';
test('seeded materials reproduce and differ across seeds',()=>{for(const name of ['basalt','terracotta','limestone','copper']){assert.equal(material(name,4),material(name,4));assert.notEqual(material(name,4),material(name,5));}});
test('exports are portable and contain no embedded raster or remote dependencies',()=>{for(const svg of [material(),orbit()]){assert.match(svg,/viewBox="0 0 1600 1200"/);assert.doesNotMatch(svg,/<image|<script|href=|NaN|Infinity/);}});
test('static export has no animation and mathematical paths close',()=>{assert.doesNotMatch(orbit(17,false),/<animate/);assert.match(orbit(),/<animateTransform/);assert.ok(torusPath(.4).endsWith(' Z'));});
