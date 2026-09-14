games[4]=function(){
  const box=document.createElement('div');box.className='gamebox';
  box.innerHTML=`<p class="small" style="text-align:center">Une pression inverse la lampe touchée ainsi que ses voisines haut, bas, gauche et droite. Objectif : <b>tout allumer</b>.</p>
  <div id="lights" class="lights"></div><div class="status" id="st">Le tableau est instable.</div>
  <div class="row"><button class="btn" id="reset" type="button">↻ Nouvelle configuration</button></div>`;
  gameMount.appendChild(box);
  const lights=box.querySelector('#lights'),st=box.querySelector('#st');let state=[];
  const pattern=[0,5,10,15,3,12];
  function toggleAt(idx,s=state){
    const r=Math.floor(idx/4),c=idx%4;
    [[0,0],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>{const nr=r+dr,nc=c+dc;if(nr>=0&&nr<4&&nc>=0&&nc<4){const j=nr*4+nc;s[j]=s[j]?0:1;}});
  }
  function reset(){state=Array(16).fill(1);pattern.forEach(i=>toggleAt(i));draw();}
  function draw(){
    lights.innerHTML='';
    state.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='light'+(v?' on':'');b.setAttribute('aria-label','Lampe '+(i+1));b.addEventListener('click',()=>{toggleAt(i);draw();});lights.appendChild(b);});
    if(state.every(Boolean))complete(4,st,'💡 Tableau lumineux stabilisé !');else{st.textContent='Le tableau est instable.';st.className='status';}
  }
  box.querySelector('#reset').addEventListener('click',reset);reset();
};
