function scrambledRotation(type,solution){
  const wanted=connectors(type,solution).slice().sort().join('');
  const candidates=[];
  for(let rot=0;rot<4;rot++){
    if(connectors(type,rot).slice().sort().join('')!==wanted)candidates.push(rot);
  }
  return candidates[Math.floor(Math.random()*candidates.length)];
}
function randomDecoy(){
  const type=Math.random()<.58?'corner':'straight';
  return {type:type,rot:Math.floor(Math.random()*4),solution:null};
}
function makeRouteGame(opts){
  const {id,size,route,kind,leftIcon,rightIcon,leftLabel,rightLabel,fillDecoys=false}=opts;
  const routeSet=new Set(route.map(function(p){return p.join(',');}));
  const sol=new Map();
  route.forEach(function(p,i){
    const dirs=[];
    dirs.push(i===0?'W':dirBetween(p,route[i-1]));
    dirs.push(i===route.length-1?'E':dirBetween(p,route[i+1]));
    sol.set(p.join(','),shapeFor(dirs[0],dirs[1]));
  });
  const state=new Map();
  for(const [k,v] of sol){
    state.set(k,{type:v.type,rot:scrambledRotation(v.type,v.rot),solution:v.rot});
  }
  if(fillDecoys){
    for(let r=0;r<size;r++)for(let c=0;c<size;c++){
      const key=r+','+c;
      if(!state.has(key))state.set(key,randomDecoy());
    }
  }
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<div class="rot-wrap">'+
    '<div class="rot-side"><div class="rot-orb">'+leftIcon+'</div>'+leftLabel+'</div>'+
    '<div class="rot-grid g'+size+'" id="rg"></div>'+
    '<div class="rot-side"><div class="rot-orb">'+rightIcon+'</div>'+rightLabel+'</div>'+
    '</div><div class="status" id="st">Circuit interrompu.</div>'+
    '<div class="row"><button class="btn" id="resh" type="button">🔀 Remélanger</button></div>';
  gameMount.appendChild(box);
  const grid=box.querySelector('#rg');
  const st=box.querySelector('#st');
  let finished=false;
  function powered(){
    const p=[];
    let cur=route[0],incoming='W';
    for(let i=0;i<route.length;i++){
      const key=cur.join(',');
      const cell=state.get(key);
      const con=connectors(cell.type,cell.rot);
      if(!con.includes(incoming))break;
      p.push(key);
      if(i===route.length-1)return {p:p,reached:con.includes('E')};
      const out=dirBetween(cur,route[i+1]);
      if(!con.includes(out))break;
      incoming=opp[out];
      cur=route[i+1];
    }
    return {p:p,reached:false};
  }
  function check(){
    const res=powered();
    grid.querySelectorAll('.rot-cell').forEach(function(el){
      el.classList.toggle('powered',res.p.indexOf(el.dataset.key)!==-1);
    });
    if(res.reached){
      if(!finished){
        finished=true;
        complete(id,st,kind==='wire'?'⚡ Énergie rétablie !':'💨 Vapeur acheminée vers la turbine !');
      }
    }else if(!finished){
      st.textContent='Circuit interrompu.';
      st.className='status';
    }
  }
  function draw(){
    grid.innerHTML='';
    for(let r=0;r<size;r++)for(let c=0;c<size;c++){
      const key=r+','+c;
      const isPath=routeSet.has(key);
      const isDecoy=fillDecoys&&!isPath;
      const interactive=isPath||isDecoy;
      const el=document.createElement(interactive?'button':'div');
      el.className='rot-cell '+(isPath?'path':isDecoy?'decoy':'blank');
      el.dataset.key=key;
      if(interactive){
        const cell=state.get(key);
        el.type='button';
        el.setAttribute('aria-label','Plaque du circuit '+(r+1)+', '+(c+1));
        el.innerHTML=lineSvg(cell.type,kind);
        el.style.transform='rotate('+(cell.rot*90)+'deg)';
        el.addEventListener('click',function(){
          if(finished)return;
          cell.rot=(cell.rot+1)%4;
          el.style.transform='rotate('+(cell.rot*90)+'deg)';
          check();
        });
      }
      grid.appendChild(el);
    }
    check();
  }
  box.querySelector('#resh').addEventListener('click',function(){
    if(finished)return;
    for(const [k,v] of sol){
      const cell=state.get(k);
      cell.rot=scrambledRotation(v.type,v.rot);
    }
    if(fillDecoys){
      for(const [k,cell] of state){
        if(!routeSet.has(k)){
          const next=randomDecoy();
          cell.type=next.type;
          cell.rot=next.rot;
        }
      }
    }
    draw();
  });
  draw();
}
