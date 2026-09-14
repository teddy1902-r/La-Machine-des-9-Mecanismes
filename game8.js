games[8]=function(){
  const box=document.createElement('div');box.className='gamebox';
  box.innerHTML=`<p class="small" style="text-align:center">Chaque commande agit sur <b>deux jauges à la fois</b>. Stabilise le cœur sur la signature <b>0 — 3 — 4</b>.</p><div id="core" class="core-controls"></div><div class="status" id="st">Cœur instable.</div><div class="row"><button class="btn" id="a" type="button">Impulsion A</button><button class="btn" id="b" type="button">Impulsion B</button><button class="btn" id="c" type="button">Impulsion C</button><button class="btn" id="reset" type="button">↻ Zéro</button></div>`;
  gameMount.appendChild(box);
  const core=box.querySelector('#core'),st=box.querySelector('#st');let v=[0,0,0];
  function pulse(w){if(w===0){v[0]=(v[0]+1)%5;v[1]=(v[1]+1)%5}if(w===1){v[1]=(v[1]+1)%5;v[2]=(v[2]+1)%5}if(w===2){v[2]=(v[2]+1)%5;v[0]=(v[0]+1)%5}draw();}
  function draw(){core.innerHTML='';v.forEach((x,i)=>{const g=document.createElement('div');g.className='gauge';g.innerHTML=`<b>Jauge ${String.fromCharCode(65+i)}</b><div class="gauge-val">${x}</div><div class="gauge-bar">${Array.from({length:5},(_,j)=>`<span class="gauge-dot ${j<x?'on':''}"></span>`).join('')}</div>`;core.appendChild(g);});if(v[0]===0&&v[1]===3&&v[2]===4)complete(8,st,'🔷 Cœur du réacteur stabilisé !');}
  box.querySelector('#a').addEventListener('click',()=>pulse(0));box.querySelector('#b').addEventListener('click',()=>pulse(1));box.querySelector('#c').addEventListener('click',()=>pulse(2));box.querySelector('#reset').addEventListener('click',()=>{v=[0,0,0];draw();});draw();
};
