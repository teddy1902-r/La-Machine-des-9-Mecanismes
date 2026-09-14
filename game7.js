games[7]=function(){
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center"><b>Indices gravés :</b> A + B = 10 • B = A + 4 • C − A = 8 • D + B = 16</p>'+
    '<div id="clocks" class="clocks"></div><div class="status" id="st">Les aiguilles ne sont pas synchronisées.</div>'+
    '<div class="row"><button class="btn" id="reset" type="button">↻ Remettre à 12</button></div>';
  gameMount.appendChild(box);
  const clocks=box.querySelector('#clocks');
  const st=box.querySelector('#st');
  const target=[3,7,11,9];
  let vals=[12,12,12,12];
  let finished=false;
  function draw(){
    clocks.innerHTML='';
    vals.forEach(function(value,index){
      const card=document.createElement('div');
      card.className='clock-card';
      const deg=(value%12)*30;
      card.innerHTML='<b>'+String.fromCharCode(65+index)+'</b><div class="dial"><div class="hand" style="transform:rotate('+deg+'deg)"></div></div>'+
        '<div class="clock-num">'+value+' h</div><div class="row"><button class="btn minus" type="button">−</button><button class="btn plus" type="button">+</button></div>';
      card.querySelector('.minus').addEventListener('click',function(){
        if(finished)return;
        vals[index]=vals[index]===1?12:vals[index]-1;
        draw();
      });
      card.querySelector('.plus').addEventListener('click',function(){
        if(finished)return;
        vals[index]=vals[index]===12?1:vals[index]+1;
        draw();
      });
      clocks.appendChild(card);
    });
    if(vals.every(function(value,index){return value===target[index];})){
      if(!finished){
        finished=true;
        complete(7,st,'🕒 Horloges synchronisées : 3 h — 7 h — 11 h — 9 h !');
      }
    }else if(!finished){
      st.textContent='Les aiguilles ne sont pas synchronisées.';
      st.className='status';
    }
  }
  box.querySelector('#reset').addEventListener('click',function(){
    if(finished)return;
    vals=[12,12,12,12];
    draw();
  });
  draw();
};
