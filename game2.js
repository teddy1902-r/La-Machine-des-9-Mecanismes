games[2]=function(){
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Chaque roue porte de 1 à 8 dents. Les inscriptions indiquent : <b>A + C = 3</b> • <b>B = A + 3</b> • <b>D = C + 7</b> • <b>E = A + 1</b>. Trouve la combinaison exacte.</p>'+
    '<div class="gears" id="gears"></div><div class="status" id="st">Règle les cinq engrenages.</div>'+
    '<div class="row"><button class="btn" id="reset" type="button">↻ Recommencer</button></div>';
  gameMount.appendChild(box);
  const gears=box.querySelector('#gears');
  const st=box.querySelector('#st');
  const target=[2,5,1,8,3];
  const initial=[1,8,8,1,8];
  const labels=['A','B','C','D','E'];
  let values=initial.slice();
  let moves=0;
  let finished=false;
  function change(index,delta){
    if(finished)return;
    values[index]=(values[index]-1+delta+8)%8+1;
    moves++;
    draw();
    check();
  }
  function draw(){
    gears.innerHTML='';
    values.forEach(function(value,index){
      const wrap=document.createElement('div');
      wrap.className='gear-slot';
      wrap.innerHTML='<b class="gear-label">'+labels[index]+'</b><div class="gear">'+value+'</div>'+
        '<div class="row gear-actions"><button class="btn minus" type="button">−</button><button class="btn plus" type="button">+</button></div>';
      wrap.querySelector('.minus').addEventListener('click',function(){change(index,-1);});
      wrap.querySelector('.plus').addEventListener('click',function(){change(index,1);});
      gears.appendChild(wrap);
      if(index<4){
        const arrow=document.createElement('div');
        arrow.className='gear-arrow';
        arrow.textContent='↔';
        gears.appendChild(arrow);
      }
    });
    st.textContent='Total actuel : '+values.reduce(function(a,b){return a+b;},0)+' dents • Coups : '+moves;
  }
  function check(){
    if(values.every(function(value,index){return value===target[index];})){
      if(!finished){
        finished=true;
        complete(2,st,'⚙️ Train d’engrenages synchronisé !');
      }
    }else if(!finished){
      st.className='status';
    }
  }
  box.querySelector('#reset').addEventListener('click',function(){
    if(finished)return;
    values=initial.slice();
    moves=0;
    draw();
    check();
  });
  draw();
  check();
};
