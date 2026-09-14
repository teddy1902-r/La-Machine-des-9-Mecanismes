const D=['N','E','S','W'];
const opp={N:'S',E:'W',S:'N',W:'E'};
function dirBetween(a,b){const dr=b[0]-a[0],dc=b[1]-a[1];if(dr===-1)return'N';if(dr===1)return'S';if(dc===1)return'E';return'W'}
function shapeFor(d1,d2){
  const s=new Set([d1,d2]);
  if((s.has('N')&&s.has('S'))||(s.has('E')&&s.has('W'))) return {type:'straight',rot:s.has('E')?1:0};
  const key=[...s].sort().join(',');
  const pairs={'E,N':0,'E,S':1,'S,W':2,'N,W':3};
  return {type:'corner',rot:pairs[key]};
}
function connectors(type,rot){
  const base=type==='straight'?['N','S']:['N','E'];
  return base.map(d=>D[(D.indexOf(d)+rot)%4]);
}
function lineSvg(type,kind){
  const segs=type==='straight'?[[50,0,50,50],[50,50,50,100]]:[[50,50,50,0],[50,50,100,50]];
  const b=kind==='pipe'?'pipe-base':'wire-base',c=kind==='pipe'?'pipe-core':'wire-core';
  return `<svg viewBox="0 0 100 100">${segs.map(s=>`<line class="${b}" x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}"/>`).join('')}${segs.map(s=>`<line class="${c}" x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}"/>`).join('')}</svg>`;
}
