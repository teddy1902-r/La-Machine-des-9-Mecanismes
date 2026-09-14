games[9]=function(){
  const box=document.createElement('div');box.className='gamebox';
  box.innerHTML=`<p class="small" style="text-align:center">Observe la séquence, puis reproduis-la. Trois séquences réussies déclenchent l’activation générale.</p><div id="seq" class="sequence">Appuie sur « Démarrer ».</div><div id="symbols" class="symbols"></div><div class="status" id="st">Terminal en attente.</div><div class="row"><button class="btn" id="start" type="button">▶ Démarrer</button></div>`;
  gameMount.appendChild(box);
  const seqEl=box.querySelector('#seq'),symbols=box.querySelector('#symbols'),st=box.querySelector('#st'),start=box.querySelector('#start');
  const syms=['⚡','⚙️','💧','💡','🧲'];let round=0,sequence=[],input=[],accept=false,timer=null;
  syms.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='symbol-btn';b.textContent=s;b.addEventListener('click',()=>press(i));symbols.appendChild(b);});
  function showRound(){accept=false;input=[];sequence=Array.from({length:3+round},()=>Math.floor(Math.random()*syms.length));seqEl.textContent=sequence.map(i=>syms[i]).join('  ');st.textContent=`Séquence ${round+1} / 3 — mémorise`;clearTimeout(timer);timer=setTimeout(()=>{seqEl.textContent='• '.repeat(sequence.length);accept=true;st.textContent='À toi.';},1300+round*250);}
  function press(i){if(!accept)return;input.push(i);if(i!==sequence[input.length-1]){accept=false;st.textContent='❌ Mauvaise séquence. Recommence ce niveau.';st.className='status bad';setTimeout(showRound,700);return;}if(input.length===sequence.length){accept=false;round++;if(round>=3){seqEl.textContent='⚙️ ACTIVATION ⚙️';complete(9,st,'🖥️ Terminal principal validé — activation générale !');}else setTimeout(showRound,500);}}
  start.addEventListener('click',()=>{round=0;showRound();});
};
