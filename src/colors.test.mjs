import {test} from 'node:test';import assert from 'node:assert/strict';import {recolor} from './colors.mjs';import {selection,embedURL} from './selection.mjs';
const colors=['#102030','#8090a0','#e0e8f0'];
test('custom palette preserves shading and rejects unsafe colors',()=>{const raw='<svg fill="#000000" stroke="#ffffff"><path fill="rgb(128,128,128)"/></svg>';const out=recolor(raw,colors);assert.match(out,/#102030/);assert.match(out,/#e0e8f0/);assert.notEqual(out,raw);assert.equal(recolor(raw,['bad']),raw);});
test('palette survives a share and embed round trip',()=>{const url=embedURL('https://ericspencer.us/material-math/','jade',42,colors);assert.deepEqual(selection(new URL(url).searchParams),{kind:'jade',seed:42,colors});});
