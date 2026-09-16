games[7]=function(){
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center"><b>Objectif :</b> transfère toute la colonne de pistons vers la tour de droite.</p>'+
    '<div class="tower-rules"><span>◆ Un seul piston à la fois</span><span>◆ Jamais un grand sur un petit</span><span>◆ Minimum : 15 coups</span></div>'+
    '<div class="tower-meta"><span id="towerMoves">Coups : 0</span><span>Tour de départ → tour d’arrivée</span></div>'+
    '<div id="towerBoard" class="tower-board" role="group" aria-label="Tour des pistons"></div>'+
    '<div class="status" id="st">Colonne verrouillée • Clique sur une tour pour choisir son piston supérieur.</div>'+
    '<div class="row"><button class="btn" id="reset" type="button">↻ Replacer les pistons</button></div>';
  gameMount.appendChild(box);

  const board=box.querySelector('#towerBoard');
  const movesLabel=box.querySelector('#towerMoves');
  const st=box.querySelector('#st');
  const start=[[4,3,2,1],[],[]];
  const pegs=start.map(function(peg){return peg.slice();});
  let selected=-1;
  let moves=0;
  let finished=false;
  let message='Colonne verrouillée • Clique sur une tour pour choisir son piston supérieur.';
  let messageClass='status';

  function isSolved(){
    return pegs[0].length===0&&pegs[1].length===0&&pegs[2].join(',')==='4,3,2,1';
  }

  function draw(){
    board.innerHTML='';
    pegs.forEach(function(peg,pegIndex){
      const tower=document.createElement('button');
      tower.type='button';
      tower.className='tower-peg'+(selected===pegIndex?' selected':'');
      tower.setAttribute('aria-label','Tour '+(pegIndex+1)+(peg.length?' avec '+peg.length+' piston'+(peg.length>1?'s':''):' vide'));
      tower.innerHTML='<span class="tower-peg-label">TOUR '+(pegIndex+1)+'</span>'+
        '<span class="tower-stack">'+peg.map(function(size,index){
          return '<span class="tower-disc size-'+size+'" style="bottom:'+(index*28+31)+'px"><b>'+size+'</b></span>';
        }).join('')+'</span>';
      tower.addEventListener('click',function(){handleTower(pegIndex);});
      board.appendChild(tower);
    });
    movesLabel.textContent='Coups : '+moves;
    st.textContent=message;
    st.className=messageClass;
  }

  function handleTower(target){
    if(finished)return;
    if(selected===-1){
      if(!pegs[target].length){
        message='Cette tour est vide • Choisis une tour qui contient un piston.';
        messageClass='status bad';
      }else{
        selected=target;
        const disk=pegs[target][pegs[target].length-1];
        message='Piston '+disk+' sélectionné • Clique sur la tour où tu veux le poser.';
        messageClass='status';
      }
      draw();
      return;
    }

    if(target===selected){
      selected=-1;
      message='Sélection annulée • Choisis une tour de départ.';
      messageClass='status';
      draw();
      return;
    }

    const source=pegs[selected];
    const destination=pegs[target];
    const disk=source[source.length-1];
    const top=destination[destination.length-1];
    if(top&&top<disk){
      message='Blocage hydraulique • Un grand piston ne peut pas être posé sur un plus petit.';
      messageClass='status bad';
      draw();
      return;
    }

    destination.push(source.pop());
    moves++;
    selected=-1;
    if(isSolved()){
      finished=true;
      message='🛠️ Tour des pistons terminée en '+moves+' coup'+(moves>1?'s':'')+' !';
      messageClass='status ok';
      draw();
      complete(7,st,message);
    }else{
      message='Déplacement enregistré • Continue à reconstruire la colonne.';
      messageClass='status';
      draw();
    }
  }

  box.querySelector('#reset').addEventListener('click',function(){
    if(finished)return;
    pegs[0].splice(0,pegs[0].length,4,3,2,1);
    pegs[1].length=0;
    pegs[2].length=0;
    selected=-1;
    moves=0;
    message='Colonne verrouillée • Clique sur une tour pour choisir son piston supérieur.';
    messageClass='status';
    draw();
  });

  draw();
};
