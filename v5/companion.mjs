import {CELL,STATES,frameAt,lookAt,lookCell} from './animation.mjs';

export function mountCompanion(atlas){
 const root=document.querySelector('#companion'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
 const pet=root.querySelector('[data-pet-touch]'),toggle=root.querySelector('[data-pet-pause]'),restore=document.querySelector('#restore-pet');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,hidden=false,raf=null,previous=null,elapsed=0,gaze=null,gazeUntil=0,action=null,actionStart=0,drag=null,moved=false;
 let x=Math.max(8,innerWidth-root.offsetWidth-18),y=0;
 root.hidden=false;x=Math.max(8,innerWidth-root.offsetWidth-18);y=Math.max(8,innerHeight-root.offsetHeight-18);
 const place=()=>{x=Math.max(8,Math.min(x,innerWidth-root.offsetWidth-8));y=Math.max(8,Math.min(y,innerHeight-root.offsetHeight-8));root.style.left=`${x}px`;root.style.top=`${y}px`;};
 function draw(){
  let cell={row:0,column:paused?0:frameAt(STATES[0],elapsed)};
  if(action){const s=STATES.find(s=>s.id===action);cell={row:s.row,column:frameAt(s,elapsed-actionStart)};}
  else if(gaze!==null&&!paused)cell=lookCell(gaze);
  ctx.clearRect(0,0,CELL.width,CELL.height);ctx.drawImage(atlas,cell.column*192,cell.row*208,192,208,0,0,192,208);
  canvas.dataset.row=cell.row;canvas.dataset.column=cell.column;
 }
 function tick(now){raf=null;if(paused||hidden||document.hidden){previous=null;return;}if(previous!==null)elapsed+=now-previous;previous=now;
  if(action&&elapsed-actionStart>1600)action=null;
  if(elapsed>gazeUntil)gaze=null;
  draw();raf=requestAnimationFrame(tick);
 }
 function sync(){if(raf!==null)cancelAnimationFrame(raf);raf=null;previous=null;toggle.textContent=paused?'Play':'Pause';toggle.setAttribute('aria-pressed',String(paused));if(!paused&&!hidden&&!document.hidden)raf=requestAnimationFrame(tick);}
 function greet(){if(paused)return;action='waving';actionStart=elapsed;gaze=null;draw();}
 pet.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:x,startY:y};moved=false;pet.setPointerCapture(e.pointerId);});
 pet.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>6)moved=true;if(moved){x=drag.startX+dx;y=drag.startY+dy;place();}});
 pet.addEventListener('pointerup',e=>{if(drag?.id!==e.pointerId)return;drag=null;});
 pet.addEventListener('pointercancel',()=>{drag=null;moved=true;});
 pet.addEventListener('click',()=>{if(!moved)greet();moved=false;});
 pet.addEventListener('keydown',e=>{const delta={ArrowLeft:[-24,0],ArrowRight:[24,0],ArrowUp:[0,-24],ArrowDown:[0,24]}[e.key];if(delta){e.preventDefault();x+=delta[0];y+=delta[1];place();}});
 document.addEventListener('pointermove',e=>{if(paused||hidden||drag||e.pointerType==='touch')return;const b=canvas.getBoundingClientRect();gaze=lookAt(e.clientX-b.left-b.width/2,e.clientY-b.top-b.height/2);gazeUntil=elapsed+900;});
 document.documentElement.addEventListener('pointerleave',()=>{if(!paused)gaze=null;});
 toggle.addEventListener('click',()=>{paused=!paused;if(!paused){action=null;gaze=null;}sync();});
 root.querySelector('[data-pet-hide]').addEventListener('click',()=>{hidden=true;root.hidden=true;restore.hidden=false;sync();restore.focus();});
 restore.addEventListener('click',()=>{hidden=false;root.hidden=false;restore.hidden=true;place();sync();pet.focus();});
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',e=>{paused=e.matches;action=null;gaze=null;if(paused){elapsed=0;draw();}sync();});
 addEventListener('resize',place);
 document.querySelector('#demo-video').addEventListener('play',()=>{paused=true;sync();});
 place();draw();sync();
}
