import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {CELL,STATES} from '../v5/animation.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const sha=p=>createHash('sha256').update(readFileSync(resolve(root,p))).digest('hex');
const config=JSON.parse(read('v5/release.json'));
const release=JSON.parse(read('downloads/release.json'));
assert.equal(config.version,release.version);
assert.equal(release.spriteVersionNumber,2);
assert.equal(sha(`downloads/${release.archive}`),release.sha256,'Archive hash');
for(const file of ['pet.json','spritesheet.webp']){
 assert.equal(sha(`v5/assets/${file}`),release.files[`teddy/${file}`].sha256,`${file} hash`);
}
assert.deepEqual(CELL,{width:192,height:208,columns:8,rows:11});
assert.deepEqual(STATES.map(s=>s.durations.length),[6,8,8,4,5,8,6,6,6]);
const pet=JSON.parse(read('v5/assets/pet.json'));
assert.equal(pet.displayName,config.displayName);assert.equal(pet.spriteVersionNumber,2);
assert.equal(pet.spritesheetPath,'spritesheet.webp');
for (const page of ['v5/index.html','index.html']) {
const html=read(page);
assert.ok(html.includes("connect-src 'none'"));
assert.ok(!/\son[a-z]+=/i.test(html),'No inline handlers');
assert.ok(!/<script(?![^>]*\bsrc=)/i.test(html),'No inline scripts');
for(const [,ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 if(ref.startsWith('#')||/^[a-z]+:/i.test(ref))continue;
 assert.ok(existsSync(resolve(root,dirname(page),ref.split(/[?#]/)[0])),`Missing local reference in ${page}: ${ref}`);
}
assert.ok(read('RELEASE-V5.md').includes(release.sha256),'Release notes bind exact archive');
assert.ok(html.includes(release.sha256),'Install message binds exact archive');
}
assert.ok(read('README.md').includes(release.sha256),'README binds exact candidate');
console.log(`Teddy ${release.version}: package/asset hashes, release metadata, frame contract, and local page references pass.`);
