games[5]=function(){
  const box=document.createElement('div'); box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Déplace les plaques voisines de la case vide pour remettre les nombres de 1 à 8 dans l’ordre.</p><div id="p8" class="puzzle8"></div><div id="st" class="status">Convoyeur désordonné.</div>';
  gameMount.appendChild(box);
  const grid=box.querySelector('#p8'),st=box.querySelector('#st');
  let a=[1,2,3,5,0,6,4,7,8];
  function near(i,j){return Math.abs(Math.floor(i/3)-Math.floor(j/3))+Math.abs(i%3-j%3)===1;}
  function draw(){
    grid.innerHTML='';
    a.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='tile8'+(v===0?' blank':'');b.textContent=v||'';b.addEventListener('click',()=>{const z=a.indexOf(0);if(near(i,z)){[a[i],a[z]]=[a[z],a[i]];draw();}});grid.appendChild(b);});
    if(a.join(',')==='1,2,3,4,5,6,7,8,0')complete(5,st,'▦ Convoyeur remis en ordre !');
  }
  draw();
};
