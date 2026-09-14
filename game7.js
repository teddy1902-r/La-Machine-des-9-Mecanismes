games[7]=function(){
  const box=document.createElement('div');box.className='gamebox';
  box.innerHTML=`<p class="small" style="text-align:center"><b>Indices gravés :</b> A + B = 10 &nbsp;•&nbsp; C − A = 8 &nbsp;•&nbsp; B = A + 4</p><div id="clocks" class="clocks"></div><div class="status" id="st">Les aiguilles ne sont pas synchronisées.</div><div class="row"><button class="btn" id="reset" type="button">↻ Remettre à 12</button></div>`;
  gameMount.appendChild(box);
  const clocks=box.querySelector('#clocks'),st=box.querySelector('#st');let vals=[12,12,12];
  function draw(){
    clocks.innerHTML='';
    vals.forEach((v,i)=>{const card=document.createElement('div');card.className='clock-card';const deg=(v%12)*30;card.innerHTML=`<b>${String.fromCharCode(65+i)}</b><div class="dial"><div class="hand" style="transform:rotate(${deg}deg)"></div></div><div class="clock-num">${v} h</div><div class="row"><button class="btn minus" type="button">−</button><button class="btn plus" type="button">+</button></div>`;card.querySelector('.minus').addEventListener('click',()=>{vals[i]=vals[i]===1?12:vals[i]-1;draw();});card.querySelector('.plus').addEventListener('click',()=>{vals[i]=vals[i]===12?1:vals[i]+1;draw();});clocks.appendChild(card);});
    if(vals[0]===3&&vals[1]===7&&vals[2]===11)complete(7,st,'🕒 Horloge centrale synchronisée : 3 h — 7 h — 11 h !');
  }
  box.querySelector('#reset').addEventListener('click',()=>{vals=[12,12,12];draw();});draw();
};
