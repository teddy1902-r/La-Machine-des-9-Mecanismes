function stopActiveGame(){
  try{activeCleanup();}catch(error){}
  activeCleanup=function(){};
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
