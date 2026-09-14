games[6]=function(){
  const box=document.createElement('div');box.className='gamebox';
  box.innerHTML=`<p class="small" style="text-align:center">Les quatre électroaimants déplacent la sphère d’une case. Évite les blocs et atteins la case dorée.</p>
  <div class="magnet-layout"><button class="mag-btn north" data-d="-1,0" type="button">▲</button><button class="mag-btn west" data-d="0,-1" type="button">◀</button><div id="mg" class="mag-grid"></div><button class="mag-btn east" data-d="0,1" type="button">▶</button><button class="mag-btn south" data-d="1,0" type="button">▼</button></div>
  <div class="status" id="st">Sphère non alignée.</div><div class="row"><button class="btn" id="reset" type="button">↻ Replacer la sphère</button></div>`;
  gameMount.appendChild(box);
  const mg=box.querySelector('#mg'),st=box.querySelector('#st');
  const walls=new Set(['3,0','3,1','3,3','2,3','1,1','1,2','1,3']);
  const target=[0,4];let ball=[4,0];
  function draw(){
    mg.innerHTML='';
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){const d=document.createElement('div');d.className='mag-cell';const k=`${r},${c}`;if(walls.has(k))d.classList.add('wall');if(r===0&&c===4){d.classList.add('target');d.textContent='★';}if(r===ball[0]&&c===ball[1]){d.classList.add('ball');d.textContent='●';}mg.appendChild(d);}
    if(ball[0]===target[0]&&ball[1]===target[1])complete(6,st,'🧲 Sphère magnétique verrouillée sur le noyau !');
  }
  box.querySelectorAll('.mag-btn').forEach(b=>b.addEventListener('click',()=>{const [dr,dc]=b.dataset.d.split(',').map(Number),nr=ball[0]+dr,nc=ball[1]+dc;if(nr>=0&&nr<5&&nc>=0&&nc<5&&!walls.has(`${nr},${nc}`)){ball=[nr,nc];draw();}}));
  box.querySelector('#reset').addEventListener('click',()=>{ball=[4,0];draw();});draw();
};
