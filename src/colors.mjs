export function validColors(colors){return Array.isArray(colors)&&colors.length===3&&colors.every(c=>/^#[0-9a-f]{6}$/i.test(c));}
export function recolor(svg,colors){
 if(!validColors(colors))return svg;
 const stops=colors.map(hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)));
 return svg.replace(/#[0-9a-f]{6}\b|rgb\(\d+,\d+,\d+\)/gi,token=>{
 const rgb=token.startsWith('#')?[1,3,5].map(i=>parseInt(token.slice(i,i+2),16)):token.match(/\d+/g).map(Number);
 const light=(.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2])/255;
 const segment=light<.5?0:1,t=light<.5?light*2:(light-.5)*2;
 return '#'+stops[segment].map((value,i)=>Math.round(value+(stops[segment+1][i]-value)*t).toString(16).padStart(2,'0')).join('');
 });
}
