import test from 'node:test';
import assert from 'node:assert/strict';
import {STATES,frameAt,lookAt,lookCell} from '../../v5/animation.mjs';
test('animation respects held frames and wraps at exact loop duration',()=>{
 const s=STATES[0];assert.equal(frameAt(s,279),0);assert.equal(frameAt(s,280),1);
 assert.equal(frameAt(s,1099),5);assert.equal(frameAt(s,1100),0);
});
test('pointer cardinal directions and deadzone follow clockwise host contract',()=>{
 assert.equal(lookAt(0,-100),0);assert.equal(lookAt(100,0),4);
 assert.equal(lookAt(0,100),8);assert.equal(lookAt(-100,0),12);
 assert.equal(lookAt(5,5),null);assert.equal(lookAt(-1,-100),0);
 assert.deepEqual(lookCell(7),{row:9,column:7});assert.deepEqual(lookCell(8),{row:10,column:0});
});
test('all sixteen sectors map to their atlas cells',()=>{
 for(let i=0;i<16;i++){let a=i*22.5*Math.PI/180;
 assert.equal(lookAt(Math.sin(a)*100,-Math.cos(a)*100),i);
 assert.deepEqual(lookCell(i),{row:i<8?9:10,column:i%8});}
});
