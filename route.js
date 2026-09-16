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
  box.innerHTML='<p class="small" style="text-align:center"><b>Objectif :</b> fais pivoter les plaques pour relier le générateur au cœur. Ignore les fausses pistes.</p>'+
    '<div class="rot-wrap">'+
    '<div class="rot-side"><div class="rot-orb">'+leftIcon+'</div>'+leftLabel+'</div>'+
    '<div class="rot-grid g'+size+'" id="rg"></div>'+
    '<div class="rot-side"><div class="rot-orb">'+rightIcon+'</div>'+rightLabel+'</div>'+
    '</div><div class="status" id="st">Circuit interrompu.</div>'+
    '<div class="row"><button class="btn" id="resh" type="button">🔀 Remélanger</button></div>';
  gameMount.appendChild(box);
  const grid=box.querySelector('#rg');
  const st=box.querySelector('#st');
  let finished=false;

  // Explore the actual connected network instead of following only the
  // hidden solution route. This makes every valid route to the core count.
  function powered(){
    const start=route[0];
    const target=route[route.length-1];
    const startKey=start.join(',');
    const targetKey=target.join(',');
    const delta={N:[-1,0],E:[0,1],S:[1,0],W:[0,-1]};
    const p=[];
    const first=state.get(startKey);

    if(!first || !connectors(first.type,first.rot).includes('W')){
      return {p:p,reached:false};
    }

    const queue=[start];
    const visited=new Set([startKey]);
    let reached=false;

    while(queue.length){
      const current=queue.shift();
      const key=current.join(',');
      const cell=state.get(key);
      if(!cell)continue;

      const con=connectors(cell.type,cell.rot);
      p.push(key);
      if(key===targetKey && con.includes('E'))reached=true;

      for(const direction of con){
        const step=delta[direction];
        const nr=current[0]+step[0];
        const nc=current[1]+step[1];
        if(nr<0||nr>=size||nc<0||nc>=size)continue;

        const nextKey=nr+','+nc;
        if(visited.has(nextKey))continue;

        const next=state.get(nextKey);
        if(!next)continue;
        if(!connectors(next.type,next.rot).includes(opp[direction]))continue;

        visited.add(nextKey);
        queue.push([nr,nc]);
      }
    }

    return {p:p,reached:reached};
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
