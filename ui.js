function stopActiveGame(){
  try{activeCleanup();}catch(error){}
  activeCleanup=function(){};
}
function renderMachine(){
  if(!machineScene)return;
  const count=solved.size;
  machineScene.dataset.level=String(count);
  machineScene.style.setProperty('--power',(count/9*100)+'%');
  machineScene.classList.toggle('complete',count===9);
  machineScene.querySelectorAll('[data-activate]').forEach(function(part){
    const threshold=Number(part.dataset.activate)||1;
    part.classList.toggle('active',count>=threshold);
  });
  machineScene.querySelectorAll('.machine-station').forEach(function(station){
    const id=Number(station.dataset.station);
    const active=solved.has(id);
    station.classList.toggle('active',active);
    const state=station.querySelector('.station-state');
    if(state)state.textContent=active?'EN LIGNE':'HORS LIGNE';
  });
  machineScene.querySelectorAll('.machine-pipe').forEach(function(pipe){
    pipe.classList.toggle('active',solved.has(Number(pipe.dataset.pipe)));
  });
  machineScene.querySelectorAll('.machine-gear').forEach(function(gear){
    gear.classList.toggle('active',Number(gear.dataset.gear)<=count);
  });
  machineScene.querySelectorAll('.machine-steam').forEach(function(steam,index){
    steam.classList.toggle('active',count>=2+index*2);
  });
  machineCore.classList.toggle('active',count>0);
  machineCoreLabel.textContent=count===9?'CORE COMPLET':count?'CORE EN CHARGE':'CORE HORS TENSION';
  machinePowerText.textContent=count+'/9 NŒUDS EN LIGNE';
  machinePowerTextConsole.textContent=count===0?'SYSTÈME EN VEILLE':count===9?'SYSTÈME NOMINAL':'DISTRIBUTION EN COURS';
  machinePowerFill.style.width=(count/9*100)+'%';
  const activeNames=modules.filter(function(module){return solved.has(module.id);}).map(function(module){
    return String(module.id).padStart(2,'0')+' '+module.title.toUpperCase();
  });
  machineFeed.textContent=count?('LIAISONS ACTIVES : '+activeNames.join('  ·  ')): 'INITIALISATION DU NOYAU CENTRAL · EN ATTENTE DES PREMIÈRES VICTOIRES';
  document.querySelector('.status-led').classList.toggle('online',count>0);
}
function renderHub(){
  hub.innerHTML='';
  modules.forEach(function(m){
    const card=document.createElement('div');
    card.className='module-card'+(solved.has(m.id)?' done':'');
    card.innerHTML=(solved.has(m.id)?'<span class="badge">RÉPARÉ ✓</span>':'')+
      '<h3>'+m.icon+' '+m.id+'. '+m.title+'</h3><p>'+m.desc+'</p>';
    const b=document.createElement('button');
    b.type='button';
    b.textContent=solved.has(m.id)?'Rejouer':'Tester';
    b.addEventListener('click',function(){openModule(m.id);});
    card.appendChild(b);
    hub.appendChild(card);
  });
  globalText.textContent=solved.size+' / 9';
  globalFill.style.width=(solved.size/9*100)+'%';
  finalMachine.classList.toggle('show',solved.size===9);
  renderMachine();
}
function complete(id,statusEl,msg){
  const newlySolved=!solved.has(id);
  solved.add(id);
  statusEl.textContent=msg||'✅ MÉCANISME RÉACTIVÉ';
  statusEl.className='status ok';
  if(newlySolved)renderHub();
}
function openModule(id){
  stopActiveGame();
  if(solved.has(id)){
    solved.delete(id);
    renderHub();
  }
  const m=modules.find(function(x){return x.id===id;});
  stageTitle.textContent=m.icon+' MÉCANISME '+id+' — '+m.title.toUpperCase();
  stageDesc.textContent=m.desc;
  stage.classList.add('active');
  gameMount.innerHTML='';
  stage.scrollIntoView({behavior:'smooth',block:'start'});
  const f=games[id];
  if(f)f();
}
document.getElementById('backHub').addEventListener('click',function(){
  stopActiveGame();
  stage.classList.remove('active');
  gameMount.innerHTML='';
  window.scrollTo({top:0,behavior:'smooth'});
});
document.getElementById('resetAll').addEventListener('click',function(){
  stopActiveGame();
  solved.clear();
  stage.classList.remove('active');
  gameMount.innerHTML='';
  renderHub();
});
