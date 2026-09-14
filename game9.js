games[9]=function(){
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Observe la séquence, puis reproduis-la. Quatre séquences réussies déclenchent l’activation générale.</p>'+
    '<div id="seq" class="sequence">Appuie sur « Démarrer ».</div><div id="symbols" class="symbols"></div>'+
    '<div class="status" id="st">Terminal en attente.</div><div class="row"><button class="btn" id="start" type="button">▶ Démarrer</button></div>';
  gameMount.appendChild(box);
  const seqEl=box.querySelector('#seq');
  const symbols=box.querySelector('#symbols');
  const st=box.querySelector('#st');
  const start=box.querySelector('#start');
  const syms=['⚡','⚙️','💧','💡','🧲','🔒'];
  const rounds=4;
  let round=0;
  let sequence=[];
  let input=[];
  let accept=false;
  let finished=false;
  let timer=null;
  let retryTimer=null;
  activeCleanup=function(){
    clearTimeout(timer);
    clearTimeout(retryTimer);
    timer=null;
    retryTimer=null;
    accept=false;
  };
  syms.forEach(function(symbol,index){
    const button=document.createElement('button');
    button.type='button';
    button.className='symbol-btn';
    button.textContent=symbol;
    button.setAttribute('aria-label','Symbole '+(index+1));
    button.addEventListener('click',function(){press(index);});
    symbols.appendChild(button);
  });
  function showRound(){
    if(finished)return;
    clearTimeout(timer);
    clearTimeout(retryTimer);
    input=[];
    accept=false;
    sequence=Array.from({length:4+round},function(){return Math.floor(Math.random()*syms.length);});
    seqEl.textContent=sequence.map(function(index){return syms[index];}).join('  ');
    st.textContent='Séquence '+(round+1)+' / '+rounds+' — mémorise';
    st.className='status';
    timer=setTimeout(function(){
      seqEl.textContent='• '.repeat(sequence.length);
      accept=true;
      st.textContent='À toi.';
    },1250+round*250);
  }
  function press(index){
    if(!accept||finished)return;
    input.push(index);
    if(index!==sequence[input.length-1]){
      accept=false;
      st.textContent='❌ Mauvaise séquence. Cette manche recommence.';
      st.className='status bad';
      retryTimer=setTimeout(function(){
        if(!finished)showRound();
      },700);
      return;
    }
    if(input.length===sequence.length){
      accept=false;
      round++;
      if(round>=rounds){
        finished=true;
        clearTimeout(timer);
        start.disabled=true;
        seqEl.textContent='⚙️ ACTIVATION ⚙️';
        complete(9,st,'🖥️ Terminal principal validé — activation générale !');
      }else{
        retryTimer=setTimeout(showRound,550);
      }
    }
  }
  start.addEventListener('click',function(){
    clearTimeout(timer);
    clearTimeout(retryTimer);
    round=0;
    finished=false;
    start.disabled=false;
    start.textContent='↻ Recommencer';
    showRound();
  });
};
