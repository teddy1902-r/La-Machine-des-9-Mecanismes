games[2]=function(){
  const box=document.createElement('div');box.className='gamebox';
  box.innerHTML=`<p class="small" style="text-align:center">Les quatre roues doivent former une progression parfaite. Les dents gravées indiquent que chaque roue possède <b>une dent de plus que la précédente</b> et que le total doit être <b>18</b>.</p>
  <div class="gears" id="gears"></div><div class="status" id="st">Règle les engrenages.</div>
  <div class="row"><button class="btn" id="reset" type="button">↻ Réinitialiser</button></div>`;
  gameMount.appendChild(box);
  const values=[2,2,2,2],gears=box.querySelector('#gears'),st=box.querySelector('#st');
  function draw(){
    gears.innerHTML='';
    values.forEach((v,i)=>{
      const wrap=document.createElement('div');wrap.className='gear-slot';
      wrap.innerHTML=`<div class="gear">${v}</div><button class="btn" type="button">+ dent</button>`;
      wrap.querySelector('button').addEventListener('click',()=>{values[i]=values[i]>=6?2:values[i]+1;draw();check();});
      gears.appendChild(wrap);
      if(i<3){const a=document.createElement('div');a.className='gear-arrow';a.textContent='↔';gears.appendChild(a);}
    });
  }
  function check(){
    const ok=values[0]===3&&values[1]===4&&values[2]===5&&values[3]===6;
    if(ok)complete(2,st,'⚙️ Train d’engrenages synchronisé !');
    else{st.textContent=`Total actuel : ${values.reduce((a,b)=>a+b,0)} dents`;st.className='status';}
  }
  box.querySelector('#reset').addEventListener('click',()=>{values.splice(0,4,2,2,2,2);draw();check();});
  draw();check();
};
