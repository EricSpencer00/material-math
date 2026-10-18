export const kinds=['basalt','terracotta','limestone','copper','torus'];
export function selection(params){const kind=params.get('kind');const raw=params.get('seed');const seed=Number(raw);return kinds.includes(kind)&&raw!==null&&/^\d+$/.test(raw)&&Number.isSafeInteger(seed)&&seed>=0&&seed<=0xffffffff?{kind,seed}:null;}
export function embedURL(base,kind,seed){const url=new URL('embed.html',base);url.search=new URLSearchParams({kind,seed:String(seed)});return url.href;}
