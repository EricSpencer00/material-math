import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
export function random(seed=17){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const W=1600,H=1200;
const stop=(offset,color,opacity=1)=>`<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>`;
function defs(seed,kind){
 const copper=kind==='copper';
 return `<defs>
 <linearGradient id="stone" x1="0" y1="0" x2="1" y2="1">${(kind==='terracotta'?['#ffb477','#be502f','#762b20','#d46c42']:kind==='limestone'?['#e5d9bd','#b8ab90','#716d63','#d4c6a9']:['#807568','#383b3c','#1d2528','#64594e']).map((c,i)=>stop(i/3,c)).join('')}</linearGradient>
 <linearGradient id="metal">${['#161f24','#544136','#bd7544','#ffe2ac','#9f5b37','#343c40','#151d23'].map((c,i)=>stop([0,.19,.27,.31,.39,.58,1][i],c)).join('')}</linearGradient>
 <linearGradient id="edge" x1="0" y1="0" x2="0.8" y2="1">${stop(0,'#ffe4ba',.8)}${stop(.32,'#b68866',.34)}${stop(.7,'#171b20',.7)}${stop(1,'#0d151c',.95)}</linearGradient>
 <radialGradient id="falloff" cx=".25" cy=".15" r="1">${stop(0,'#e9d2b0',0)}${stop(.5,'#10151c',.04)}${stop(1,'#080e16',.78)}</radialGradient>
 <filter id="relief" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
 <feTurbulence type="fractalNoise" baseFrequency="${copper?'.006 .65':'.52'}" numOctaves="3" seed="${seed}" result="noise"/>
 <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0" result="height"/>
 <feDiffuseLighting in="height" surfaceScale="${copper?.35:.8}" diffuseConstant=".85" lighting-color="#efdfc5" result="light"><feDistantLight azimuth="225" elevation="42"/></feDiffuseLighting>
 <feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="1.35" k2="0" k3="0" k4="0" result="lit"/>
 <feSpecularLighting in="height" surfaceScale="1.4" specularConstant=".12" specularExponent="14" lighting-color="#ffd5a2" result="shine"><feDistantLight azimuth="225" elevation="45"/></feSpecularLighting>
 <feComposite in="lit" in2="shine" operator="arithmetic" k1="0" k2="1" k3=".35" k4="0" result="finished"/><feComposite in="finished" in2="SourceAlpha" operator="in"/>
 </filter>
 <filter id="geology" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".005 .012" numOctaves="3" seed="${seed}" result="warp"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter>
 <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-8" dy="14" stdDeviation="9" flood-color="#080c12" flood-opacity=".65"/></filter>
 </defs>`;
}
function wrap(name,body,seed,kind,animated=false){return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc"><title id="title">${name}</title><desc id="desc">Procedural ${kind} with seeded multiscale texture and directional relief lighting. ${animated?'Animated mathematical geometry.':'Static material study.'}</desc><style>@media(prefers-reduced-motion:reduce){.motion{display:none}}</style>${defs(seed,kind)}${body}</svg>`;}
export function material(kind='basalt',seed=17){
 const rng=random(seed);let shapes='';
 if(kind==='copper'){
 shapes='<rect width="1600" height="1200" fill="url(#metal)"/>';
 for(let i=0;i<1900;i++){let y=rng()*1200;shapes+=`<path d="M ${rng()*100} ${y.toFixed(2)} h ${1400+rng()*200}" stroke="${rng()>.5?'#f4d5ad':'#121e26'}" stroke-width="${.12+rng()*.65}" opacity="${.015+rng()*.065}"/>`;}
 }else{
 shapes='<rect width="1600" height="1200" fill="url(#stone)"/>';
 // Nested offset ellipses are geological terraces, with actual bevel and occlusion.
 for(let i=0;i<23;i++){
 let rx=1640-i*43,ry=1200-i*31,cy=-210-i*4;
 shapes+=`<ellipse cx="1320" cy="${cy+9}" rx="${rx}" ry="${ry}" fill="url(#stone)" stroke="#10191c" stroke-opacity=".5" stroke-width="14" filter="url(#shadow)"/><ellipse cx="1320" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#stone)" stroke="url(#edge)" stroke-width="5"/>`;
 }
 for(let i=0;i<190;i++){
 let x=rng()*1600,y=rng()*1200;
 shapes+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} q ${rng()*90-45} ${rng()*10} ${rng()*230+20} ${rng()*25-12}" fill="none" stroke="${i%3?'#e7d0aa':'#171e23'}" opacity="${.02+rng()*.07}" stroke-width="${.3+rng()*.9}"/>`;
 }
 shapes=`<g filter="url(#geology)">${shapes}</g>`;
 }
 return wrap(kind,`<g filter="url(#relief)">${shapes}</g><rect width="1600" height="1200" fill="url(#falloff)"/>`,seed,kind);
}
// Orthographic projection of a torus; curves are sampled into editable SVG paths.
export function torusPath(v,phase=0){
 let points=[];for(let j=0;j<=300;j++){
 const u=j/300*Math.PI*2, r=360+105*Math.cos(v+phase), x=r*Math.cos(u),y=r*Math.sin(u),z=105*Math.sin(v+phase);
 const a=.92, b=-.35, yy=y*Math.cos(a)-z*Math.sin(a),zz=y*Math.sin(a)+z*Math.cos(a);
 points.push([800+x*Math.cos(b)+zz*Math.sin(b),600+yy]);
 }return points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')+' Z';
}
export function orbit(seed=17,animated=true){
 const rotate=(x,y,z)=>{const a=.92,b=-.35,yy=y*Math.cos(a)-z*Math.sin(a),zz=y*Math.sin(a)+z*Math.cos(a);return [x*Math.cos(b)+zz*Math.sin(b),yy,-x*Math.sin(b)+zz*Math.cos(b)];};
 const point=(u,v)=>rotate((360+105*Math.cos(v))*Math.cos(u),(360+105*Math.cos(v))*Math.sin(u),105*Math.sin(v));
 const tiles=[];const U=144,V=64;
 for(let j=0;j<U;j++)for(let i=0;i<V;i++){
 const u=j/U*Math.PI*2,v=i/V*Math.PI*2,du=Math.PI*2/U,dv=Math.PI*2/V;
 const pts=[point(u,v),point(u+du,v),point(u+du,v+dv),point(u,v+dv)];
 const n=rotate(Math.cos(v+dv/2)*Math.cos(u+du/2),Math.cos(v+dv/2)*Math.sin(u+du/2),Math.sin(v+dv/2));
 const dot=Math.max(0,n[0]*-.45+n[1]*-.65+n[2]*.61);
 const spec=Math.pow(Math.max(0,n[0]*-.25+n[1]*-.35+n[2]*.903),35);
 const brushing=1-.07*Math.sin(i*2.3);
 const channel=(base,range)=>Math.min(255,Math.round((base+range*dot+spec*85)*brushing));
 const color=`rgb(${channel(34,177)},${channel(26,123)},${channel(24,77)})`;
 tiles.push({z:pts.reduce((a,p)=>a+p[2],0)/4,svg:`<path d="${pts.map((p,k)=>`${k?'L':'M'}${(800+p[0]).toFixed(2)} ${(600+p[1]).toFixed(2)}`).join(' ')}Z" fill="${color}" stroke="${color}" stroke-width=".6"/>`});
 }
 const curves=tiles.sort((a,b)=>a.z-b.z).map(t=>t.svg).join('');
 const move=animated?'<animateTransform attributeName="transform" type="rotate" values="-12 800 600;12 800 600;-12 800 600" dur="24s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/>':'';
 return wrap('Copper torus',`<rect width="1600" height="1200" fill="#182127"/><ellipse cx="810" cy="938" rx="390" ry="30" fill="#0b1117" opacity=".5" filter="url(#shadow)"/><g filter="url(#relief)"><g>${move}${curves}</g></g><rect width="1600" height="1200" fill="url(#falloff)"/>`,seed,'copper',animated);
}
export async function build(dir){await mkdir(dir,{recursive:true});for(const kind of ['basalt','terracotta','limestone','copper']) await writeFile(resolve(dir,`${kind}.svg`),material(kind));await writeFile(resolve(dir,'torus.svg'),orbit());await writeFile(resolve(dir,'torus-static.svg'),orbit(17,false));}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){await build(fileURLToPath(new URL('../assets/',import.meta.url)));console.log('Built six self-contained SVGs.');}
