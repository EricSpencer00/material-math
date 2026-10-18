import {material,orbit} from './engine.mjs';
import {selection} from './selection.mjs';
const {kind,seed}=selection(new URLSearchParams(location.search))??{kind:'basalt',seed:17};
const svg=kind==='torus'?orbit(seed,!matchMedia('(prefers-reduced-motion: reduce)').matches):material(kind,seed);
const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
const img=document.getElementById('art');img.src=url;img.alt=`Procedural ${kind}, seed ${seed}`;
addEventListener('pagehide',()=>URL.revokeObjectURL(url),{once:true});
