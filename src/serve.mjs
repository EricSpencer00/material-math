import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.mjs':'text/javascript'};
createServer(async(req,res)=>{try{let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(path===root)path=resolve(root,'index.html');if(!path.startsWith(root+sep)){res.writeHead(403);return res.end();}const data=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(4317,'127.0.0.1',()=>console.log('Material / Math: http://localhost:4317'));
