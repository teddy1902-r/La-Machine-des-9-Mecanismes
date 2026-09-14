games[6]=function(){
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Les électroaimants déplacent la sphère d’une case. Évite les blocs et suis le corridor jusqu’à la case dorée.</p>'+
    '<div class="magnet-layout"><button class="mag-btn north" data-d="-1,0" type="button" aria-label="Monter">▲</button>'+
    '<button class="mag-btn west" data-d="0,-1" type="button" aria-label="Aller à gauche">◀</button>'+
    '<div id="mg" class="mag-grid g7"></div>'+
    '<button class="mag-btn east" data-d="0,1" type="button" aria-label="Aller à droite">▶</button>'+
    '<button class="mag-btn south" data-d="1,0" type="button" aria-label="Descendre">▼</button></div>'+
    '<div class="status" id="st">Sphère non alignée.</div>'+
    '<div class="row"><button class="btn" id="reset" type="button">↻ Replacer la sphère</button></div>';
  gameMount.appendChild(box);
  const mg=box.querySelector('#mg');
  const st=box.querySelector('#st');
  const size=7;
  const walls=new Set([
    '0,0','0,1','0,5',
    '1,0','1,1','1,3','1,5',
    '2,3',
    '3,1','3,2','3,3','3,4',
    '4,1','4,2','4,3','4,4',
    '5,1','5,2','5,3','5,4','5,5','5,6',
    '6,1','6,2','6,3','6,4','6,5','6,6'
  ]);
  const target=[0,6];
  const start=[6,0];
  let ball=start.slice();
  let moves=0;
  let finished=false;
  function draw(){
    mg.innerHTML='';
    for(let r=0;r<size;r++)for(let c=0;c<size;c++){
      const d=document.createElement('div');
      const key=r+','+c;
      d.className='mag-cell';
      d.setAttribute('aria-label',walls.has(key)?'Bloc magnétique':'Case '+(r+1)+', '+(c+1));
      if(walls.has(key)){
        d.classList.add('wall');
        d.textContent='◆';
      }
      if(r===target[0]&&c===target[1]){
        d.classList.add('target');
        d.textContent='★';
      }
      if(r===ball[0]&&c===ball[1]){
        d.classList.add('ball');
        d.textContent='●';
      }
      mg.appendChild(d);
    }
    if(ball[0]===target[0]&&ball[1]===target[1]){
      if(!finished){
        finished=true;
        complete(6,st,'🧲 Sphère magnétique verrouillée en '+moves+' impulsions !');
      }
    }else if(!finished){
      st.textContent='Sphère non alignée • Impulsions : '+moves;
      st.className='status';
    }
  }
  box.querySelectorAll('.mag-btn').forEach(function(button){
    button.addEventListener('click',function(){
      if(finished)return;
      const parts=button.dataset.d.split(',').map(Number);
      const nr=ball[0]+parts[0],nc=ball[1]+parts[1];
      if(nr>=0&&nr<size&&nc>=0&&nc<size&&!walls.has(nr+','+nc)){
        ball=[nr,nc];
        moves++;
        draw();
      }else{
        st.textContent='Impulsion bloquée par un obstacle • Impulsions : '+moves;
        st.className='status bad';
      }
    });
  });
  box.querySelector('#reset').addEventListener('click',function(){
    if(finished)return;
    ball=start.slice();
    moves=0;
    draw();
  });
  draw();
};
