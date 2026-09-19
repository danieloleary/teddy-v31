import {CELL,STATES,frameAt,lookAt,lookCell} from './animation.mjs';
import {mountCompanion} from './companion.mjs';

const canvas=document.querySelector('#pet');
const ctx=canvas.getContext('2d');
const stage=document.querySelector('#stage');
const status=document.querySelector('#preview-status');
const pause=document.querySelector('#pause');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches, state=STATES[0], gaze=null, elapsed=0, previous=null, request=null, ready=false;
const atlas=new Image();
function draw(){
 if(!ready)return;
 const cell=gaze===null?{row:state.row,column:frameAt(state,elapsed)}:lookCell(gaze);
 ctx.clearRect(0,0,CELL.width,CELL.height);
 ctx.drawImage(atlas,cell.column*CELL.width,cell.row*CELL.height,CELL.width,CELL.height,0,0,CELL.width,CELL.height);
 canvas.dataset.row=cell.row;canvas.dataset.column=cell.column;
}
function tick(now){
 request=null;
 if(paused||document.hidden||!ready){previous=null;return;}
 if(previous!==null)elapsed+=now-previous;
 previous=now;draw();request=requestAnimationFrame(tick);
}
function sync(){
 if(request!==null)cancelAnimationFrame(request);
 request=null;previous=null;
 pause.textContent=paused?'Play animation':'Pause animation';
 pause.setAttribute('aria-pressed',String(paused));
 pause.disabled=!ready;
 document.querySelectorAll('#directions button').forEach(b=>b.disabled=paused||!ready);
 document.querySelectorAll('[data-state]').forEach(b=>b.disabled=!ready);
 draw();if(!paused&&!document.hidden&&ready)request=requestAnimationFrame(tick);
}
for(const s of STATES){
 const button=document.createElement('button');button.type='button';button.textContent=s.label;
 button.dataset.state=s.id;button.setAttribute('aria-pressed',String(s===state));
 button.addEventListener('click',()=>{
  state=s;gaze=null;elapsed=0;
  document.querySelectorAll('[data-state]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  status.textContent=s.label;draw();
 });document.querySelector('#moods').append(button);
}
pause.addEventListener('click',()=>{paused=!paused;if(!paused)gaze=null;sync();});
document.querySelector('#size').addEventListener('change',e=>stage.classList.toggle('enlarged',e.target.checked));
document.querySelector('#dark').addEventListener('change',e=>stage.classList.toggle('night',e.target.checked));
document.querySelector('#attention').addEventListener('change',()=>{gaze=null;draw();});
stage.addEventListener('pointermove',e=>{
 if(paused||!document.querySelector('#attention').checked)return;
 const r=canvas.getBoundingClientRect();gaze=lookAt(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2);draw();
});
stage.addEventListener('pointerleave',()=>{if(paused)return;gaze=null;draw();});
const directions=[['↖',14,'Up left'],['↑',0,'Up'],['↗',2,'Up right'],['←',12,'Left'],['·',null,'Neutral'],['→',4,'Right'],['↙',10,'Down left'],['↓',8,'Down'],['↘',6,'Down right']];
for(const [label,index,name] of directions){
 const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',`Look ${name.toLowerCase()}`);
 b.addEventListener('click',()=>{if(paused)return;gaze=index;status.textContent=`Looking ${name.toLowerCase()}`;draw();});
 document.querySelector('#directions').append(b);
}
stage.addEventListener('keydown',e=>{
 const keys={ArrowUp:0,ArrowRight:4,ArrowDown:8,ArrowLeft:12,Escape:null};
 if(!(e.key in keys)||paused)return;e.preventDefault();gaze=keys[e.key];draw();
});
document.addEventListener('visibilitychange',sync);
reduced.addEventListener('change',e=>{paused=e.matches;gaze=null;if(paused)elapsed=0;sync();});
atlas.addEventListener('load',()=>{
 if(atlas.naturalWidth!==1536||atlas.naturalHeight!==2288){fail();return;}
 mountCompanion(atlas);ready=true;canvas.hidden=false;document.querySelector('#fallback').hidden=true;sync();
});
function fail(){ready=false;canvas.hidden=true;document.querySelector('#fallback').hidden=false;status.textContent='The animated preview could not load. Teddy’s still portrait is shown.';sync();}
atlas.addEventListener('error',fail);
atlas.src=new URL('assets/spritesheet.webp',import.meta.url).href;
sync();
const copy=document.querySelector('#copy');
copy.addEventListener('click',async()=>{
 const value=document.querySelector('#install-prompt').textContent;
 try{await navigator.clipboard.writeText(value);document.querySelector('#copy-status').textContent='Copied. Paste it into Codex after downloading Teddy.';}
 catch{document.querySelector('#copy-status').textContent='Select and copy the instructions below.';document.querySelector('#install-prompt').focus();}
});

const video=document.querySelector('#demo-video');
video.addEventListener('play',()=>{paused=true;sync();});
video.addEventListener('error',()=>{document.querySelector('#video-error').hidden=false;},true);
