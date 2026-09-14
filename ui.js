const gameModal=document.getElementById('gameModal');
const modalBackdrop=document.querySelector('[data-close-game]');
const modalCloseButton=document.getElementById('backHub');

function stopActiveGame(){
  try{activeCleanup();}catch(error){}
  activeCleanup=function(){};
}

function closeGameModal(){
  stopActiveGame();
  stage.classList.remove('active');
  if(gameModal){
    gameModal.classList.remove('active');
    gameModal.setAttribute('aria-hidden','true');
  }
  document.body.classList.remove('game-open');
  gameMount.innerHTML='';
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
    station.setAttribute('aria-pressed',active?'true':'false');
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
  machineFeed.textContent=count?('LIAISONS ACTIVES : '+activeNames.join('  ·  ')):'INITIALISATION DU NOYAU CENTRAL · EN ATTENTE DES PREMIÈRES VICTOIRES';
  const statusLed=document.querySelector('.status-led');
  if(statusLed)statusLed.classList.toggle('online',count>0);
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
  const m=modules.find(function(x){return x.id===id;});
  if(!m)return;
  if(solved.has(id)){
    solved.delete(id);
    renderHub();
  }
  stageTitle.textContent=m.icon+' MÉCANISME '+id+' — '+m.title.toUpperCase();
  stageDesc.textContent=m.desc;
  gameMount.innerHTML='';
  stage.classList.add('active');
  if(gameModal){
    gameModal.classList.add('active');
    gameModal.setAttribute('aria-hidden','false');
  }
  document.body.classList.add('game-open');
  const f=games[id];
  if(f)f();
  if(modalCloseButton)modalCloseButton.focus();
}

function activateStation(station){
  const id=Number(station.dataset.station);
  if(id)openModule(id);
}

if(modalCloseButton)modalCloseButton.addEventListener('click',closeGameModal);
if(modalBackdrop)modalBackdrop.addEventListener('click',closeGameModal);

document.addEventListener('click',function(event){
  const target=event.target instanceof Element?event.target:null;
  if(!target)return;
  const station=target.closest('.machine-station');
  if(station){
    event.preventDefault();
    activateStation(station);
  }
});

document.addEventListener('keydown',function(event){
  const target=event.target instanceof Element?event.target:null;
  if(event.key==='Escape'&&gameModal&&gameModal.classList.contains('active')){
    event.preventDefault();
    closeGameModal();
    return;
  }
  if(!target)return;
  const station=target.closest('.machine-station');
  if(station&&(event.key==='Enter'||event.key===' ')){
    event.preventDefault();
    activateStation(station);
  }
});

document.getElementById('resetAll').addEventListener('click',function(){
  closeGameModal();
  solved.clear();
  renderHub();
});
