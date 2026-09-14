function makeRouteGame(opts){
  const {id,size,route,kind,leftIcon,rightIcon,leftLabel,rightLabel}=opts;
  const routeSet=new Set(route.map(p=>p.join(',')));
  const sol=new Map();
  route.forEach((p,i)=>{
    const dirs=[];
    dirs.push(i===0?'W':dirBetween(p,route[i-1]));
    dirs.push(i===route.length-1?'E':dirBetween(p,route[i+1]));
    sol.set(p.join(','),shapeFor(dirs[0],dirs[1]));
  });
  const state=new Map();
  for(const [k,v] of sol){const off=1+Math.floor(Math.random()*3);state.set(k,{type:v.type,rot:(v.rot+off)%4,solution:v.rot});}
  const box=document.createElement('div');box.className='gamebox';
  box.innerHTML=`<div class="rot-wrap">
    <div class="rot-side"><div class="rot-orb">${leftIcon}</div>${leftLabel}</div>
    <div class="rot-grid g${size}" id="rg"></div>
    <div class="rot-side"><div class="rot-orb">${rightIcon}</div>${rightLabel}</div>
  </div><div class="status" id="st">Circuit interrompu.</div>
  <div class="row"><button class="btn" id="resh" type="button">🔀 Remélanger</button><button class="btn" id="solv" type="button">👁 Solution</button></div>`;
  gameMount.appendChild(box);
  const grid=box.querySelector('#rg'),st=box.querySelector('#st');
  function powered(){
    const p=[];let cur=route[0],incoming='W';
    for(let i=0;i<route.length;i++){
      const key=cur.join(','),cell=state.get(key),con=connectors(cell.type,cell.rot);
      if(!con.includes(incoming))break;p.push(key);
      if(i===route.length-1)return {p,reached:con.includes('E')};
      const out=dirBetween(cur,route[i+1]);if(!con.includes(out))break;
      incoming=opp[out];cur=route[i+1];
    }return {p,reached:false};
  }
  function draw(){
    grid.innerHTML='';
    for(let r=0;r<size;r++)for(let c=0;c<size;c++){
      const key=`${r},${c}`;const el=document.createElement(routeSet.has(key)?'button':'div');
      el.className='rot-cell '+(routeSet.has(key)?'path':'blank');el.dataset.key=key;
      if(routeSet.has(key)){
        const cell=state.get(key);el.type='button';el.innerHTML=lineSvg(cell.type,kind);el.style.transform=`rotate(${cell.rot*90}deg)`;
        el.addEventListener('click',()=>{cell.rot=(cell.rot+1)%4;el.style.transform=`rotate(${cell.rot*90}deg)`;check();});
      }grid.appendChild(el);
    }check();
  }
  function check(){
    const res=powered();grid.querySelectorAll('.rot-cell').forEach(el=>el.classList.toggle('powered',res.p.includes(el.dataset.key)));
    if(res.reached) complete(id,st,id===1?'⚡ Énergie rétablie !':'💨 Vapeur acheminée vers la turbine !');
    else {st.textContent='Circuit interrompu.';st.className='status';}
  }
  box.querySelector('#resh').addEventListener('click',()=>{for(const [k,v] of sol){const cell=state.get(k),off=1+Math.floor(Math.random()*3);cell.rot=(v.rot+off)%4;}draw();});
  box.querySelector('#solv').addEventListener('click',()=>{for(const [k,v] of sol)state.get(k).rot=v.rot;draw();});
  draw();
}
