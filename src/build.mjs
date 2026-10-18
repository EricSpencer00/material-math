import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {material,orbit} from './engine.mjs';
export {random,material,orbit,torusPath} from './engine.mjs';
export async function build(dir){await mkdir(dir,{recursive:true});for(const kind of ['basalt','terracotta','limestone','copper']) await writeFile(resolve(dir,`${kind}.svg`),material(kind));await writeFile(resolve(dir,'torus.svg'),orbit());await writeFile(resolve(dir,'torus-static.svg'),orbit(17,false));}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){await build(fileURLToPath(new URL('../assets/',import.meta.url)));console.log('Built six self-contained SVGs.');}
