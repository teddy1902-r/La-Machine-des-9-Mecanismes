games[4]=function(){
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Une pression inverse la lampe touchée ainsi que ses voisines haut, bas, gauche et droite. Objectif : <b>allumer les 25 lampes</b>.</p>'+
    '<div id="lights" class="lights g5"></div><div class="status" id="st">Le tableau est instable.</div>'+
    '<div class="row"><button class="btn" id="reset" type="button">↻ Nouvelle configuration</button></div>';
  gameMount.appendChild(box);
  const lights=box.querySelector('#lights');
  const st=box.querySelector('#st');
  const size=5;
  const pattern=[0,2,4,6,8,12,16,18,20,24];
  let state=[];
  let moves=0;
  let finished=false;
  function toggleAt(index){
    const r=Math.floor(index/size);
    const c=index%size;
    [[0,0],[-1,0],[1,0],[0,-1],[0,1]].forEach(function(pair){
      const nr=r+pair[0],nc=c+pair[1];
      if(nr>=0&&nr<size&&nc>=0&&nc<size){
        const j=nr*size+nc;
        state[j]=state[j]?0:1;
      }
    });
  }
  function reset(){
    state=Array(size*size).fill(1);
    pattern.forEach(function(index){toggleAt(index);});
    moves=0;
    finished=false;
    draw();
  }
  function draw(){
    lights.innerHTML='';
    state.forEach(function(value,index){
      const b=document.createElement('button');
      b.type='button';
      b.className='light'+(value?' on':'');
      b.setAttribute('aria-label','Lampe '+(index+1));
      b.addEventListener('click',function(){
        if(finished)return;
        toggleAt(index);
        moves++;
        draw();
      });
      lights.appendChild(b);
    });
    if(state.every(Boolean)){
      if(!finished){
        finished=true;
        complete(4,st,'💡 Tableau lumineux stabilisé en '+moves+' coups !');
      }
    }else if(!finished){
      st.textContent='Tableau instable • Coups : '+moves;
      st.className='status';
    }
  }
  box.querySelector('#reset').addEventListener('click',reset);
  reset();
};
