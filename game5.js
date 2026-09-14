games[5]=function(){
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Déplace les plaques voisines de la case vide pour remettre les nombres de 1 à 8 dans l’ordre.</p>'+
    '<div id="p8" class="puzzle8"></div><div id="st" class="status">Convoyeur désordonné.</div>'+
    '<div class="row"><button class="btn" id="mix" type="button">🔀 Nouvelle configuration</button></div>';
  gameMount.appendChild(box);
  const grid=box.querySelector('#p8');
  const st=box.querySelector('#st');
  const goal=[1,2,3,4,5,6,7,8,0];
  let a=[];
  let moves=0;
  let lastBlank=-1;
  let finished=false;
  function near(i,j){
    return Math.abs(Math.floor(i/3)-Math.floor(j/3))+Math.abs(i%3-j%3)===1;
  }
  function neighbors(blank){
    const r=Math.floor(blank/3),c=blank%3,result=[];
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(function(pair){
      const nr=r+pair[0],nc=c+pair[1];
      if(nr>=0&&nr<3&&nc>=0&&nc<3)result.push(nr*3+nc);
    });
    return result;
  }
  function mix(){
    a=goal.slice();
    lastBlank=-1;
    for(let turn=0;turn<90;turn++){
      const blank=a.indexOf(0);
      const options=neighbors(blank).filter(function(index){return index!==lastBlank;});
      const chosen=options[Math.floor(Math.random()*options.length)];
      [a[blank],a[chosen]]=[a[chosen],a[blank]];
      lastBlank=blank;
    }
    if(a.join(',')===goal.join(',')){
      const blank=a.indexOf(0);
      const chosen=neighbors(blank)[0];
      [a[blank],a[chosen]]=[a[chosen],a[blank]];
    }
    moves=0;
    finished=false;
    draw();
  }
  function draw(){
    grid.innerHTML='';
    a.forEach(function(value,index){
      const b=document.createElement('button');
      b.type='button';
      b.className='tile8'+(value===0?' blank':'');
      b.textContent=value||'';
      b.setAttribute('aria-label',value===0?'Case vide':'Plaque '+value);
      b.addEventListener('click',function(){
        if(finished)return;
        const blank=a.indexOf(0);
        if(near(index,blank)){
          [a[index],a[blank]]=[a[blank],a[index]];
          moves++;
          lastBlank=-1;
          draw();
        }
      });
      grid.appendChild(b);
    });
    if(a.every(function(value,index){return value===goal[index];})){
      if(!finished){
        finished=true;
        complete(5,st,'▦ Convoyeur remis en ordre en '+moves+' coups !');
      }
    }else if(!finished){
      st.textContent='Convoyeur désordonné • Coups : '+moves;
      st.className='status';
    }
  }
  box.querySelector('#mix').addEventListener('click',function(){if(!finished)mix();});
  mix();
};
