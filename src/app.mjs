import {material,orbit} from './engine.mjs';
import {kinds,selection,embedURL} from './selection.mjs';
const $=id=>document.getElementById(id);
let blobURL,chosen,busy=false;
const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
async function generate(preset){
 if(busy)return;busy=true;
 $('embed-panel').hidden=true;$('actions').hidden=true;$('art').hidden=true;
 document.body.dataset.state='generating';$('status').textContent='Generating material';
 await nextFrame();await nextFrame();
 try{
 const values=crypto.getRandomValues(new Uint32Array(2));
 chosen=preset??{kind:kinds[values[0]%kinds.length],seed:values[1]};
 const svg=chosen.kind==='torus'?orbit(chosen.seed,!matchMedia('(prefers-reduced-motion: reduce)').matches):material(chosen.kind,chosen.seed);
 const oldURL=blobURL;blobURL=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 $('art').src=blobURL;await $('art').decode();if(oldURL)URL.revokeObjectURL(oldURL);
 $('art').alt=`Procedural ${chosen.kind}, seed ${chosen.seed}`;$('art').hidden=false;
 $('download').href=blobURL;$('download').download=`material-math-${chosen.kind}-${chosen.seed}.svg`;
 const url=new URL(location.href);url.search=new URLSearchParams(chosen);history.replaceState(null,'',url);
 document.body.dataset.state='art';await nextFrame();await nextFrame();
 await new Promise(resolve=>setTimeout(resolve,1000));
 $('actions').hidden=false;document.body.dataset.state='ready';$('status').textContent='Material ready';$('download').focus({preventScroll:true});
 }catch(error){document.body.dataset.state='idle';$('status').textContent='Could not generate material. Try again.';console.error(error);}
 finally{busy=false;}
}
$('randomize').onclick=()=>generate();$('again').onclick=()=>generate();
$('embed').onclick=()=>{
 $('embed-code').value=`<iframe src="${embedURL(location.href,chosen.kind,chosen.seed)}" title="Material math" style="border:0;width:100%;aspect-ratio:4/3" loading="lazy"></iframe>`;
 $('embed-panel').hidden=false;$('embed-code').focus();$('embed-code').select();
};
$('close').onclick=()=>{$('embed-panel').hidden=true;$('embed').focus();};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('embed-code').value);$('copy').textContent='Copied';setTimeout(()=>$('copy').textContent='Copy',1500);}catch{$('embed-code').focus();$('embed-code').select();$('status').textContent='Select and copy the embed code.';}};
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!busy){$('embed-panel').hidden=true;$('actions').hidden=true;$('art').hidden=true;document.body.dataset.state='idle';$('randomize').focus();}});
const preset=selection(new URLSearchParams(location.search));if(preset)generate(preset);
