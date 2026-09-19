export const CELL = { width: 192, height: 208, columns: 8, rows: 11 };
export const STATES = [
  {id:'idle',label:'Just here',row:0,durations:[280,110,110,140,140,320]},
  {id:'running-right',label:'Off we go →',row:1,durations:[120,120,120,120,120,120,120,220]},
  {id:'running-left',label:'← Coming back',row:2,durations:[120,120,120,120,120,120,120,220]},
  {id:'waving',label:'Hello!',row:3,durations:[140,140,140,280]},
  {id:'jumping',label:'Little leap',row:4,durations:[140,140,140,140,280]},
  {id:'failed',label:'Oh, bother',row:5,durations:[140,140,140,140,140,140,140,240]},
  {id:'waiting',label:'Your turn',row:6,durations:[150,150,150,150,150,260]},
  {id:'running',label:'Working on it',row:7,durations:[120,120,120,120,120,220]},
  {id:'review',label:'One closer look',row:8,durations:[150,150,150,150,150,280]},
];
export function frameAt(state, elapsed) {
  const total=state.durations.reduce((a,b)=>a+b,0);
  let t=((elapsed%total)+total)%total;
  for(let i=0;i<state.durations.length;i++){if(t<state.durations[i])return i;t-=state.durations[i];}
  return 0;
}
export function lookAt(dx,dy,deadzone=16) {
  if(Math.hypot(dx,dy)<deadzone)return null;
  const angle=(Math.atan2(dx,-dy)*180/Math.PI+360)%360;
  return Math.round(angle/22.5)%16;
}
export function lookCell(index){return {row:9+Math.floor(index/8),column:index%8};}
