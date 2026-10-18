import {validColors} from './colors.mjs';
export const kinds=['basalt','terracotta','limestone','copper','torus','sandstone','slate','jade','travertine','bronze','silver'];
export function selection(params){const kind=params.get('kind');const raw=params.get('seed');const seed=Number(raw);return kinds.includes(kind)&&raw!==null&&/^\d+$/.test(raw)&&Number.isSafeInteger(seed)&&seed>=0&&seed<=0xffffffff?{kind,seed,...(validColors(params.get('colors')?.split(','))?{colors:params.get('colors').split(',')}:{})}:null;}
export function embedURL(base,kind,seed,colors){const url=new URL('embed.html',base);url.search=new URLSearchParams({kind,seed:String(seed),...(validColors(colors)?{colors:colors.join(',')}:{})});return url.href;}
