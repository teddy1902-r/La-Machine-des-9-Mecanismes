games[6]=function(){
  const solution=[
    [1,1,0,1,0,0],
    [0,0,1,1,0,1],
    [0,1,0,0,1,1],
    [1,0,0,1,1,0],
    [0,1,1,0,0,1],
    [1,0,1,0,1,0]
  ];
  const clues=[
    [1,1,null,1,null,0],
    [null,null,1,1,null,1],
    [null,1,null,null,null,null],
    [null,null,null,1,null,null],
    [null,null,null,null,0,null],
    [null,0,null,null,1,null]
  ];
  const size=6;
  const current=clues.map(function(row){return row.slice();});
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Stabilise la chambre magnétique en plaçant les polarités <b>N</b> (Nord) et <b>S</b> (Sud).</p>'+ 
    '<div class="magnetic-rules"><span>◆ 3 N et 3 S par ligne et par colonne</span><span>◆ Jamais 3 polarités identiques à la suite</span><span>◆ Aucune ligne ni colonne identique</span></div>'+ 
    '<div id="magneticGrid" class="magnetic-grid" role="grid" aria-label="Grille des polarités magnétiques"></div>'+ 
    '<div class="magnetic-legend"><span class="magnetic-key north">N</span> Nord <span class="magnetic-key south">S</span> Sud <span class="magnetic-key locked">🔒</span> Indice verrouillé</div>'+ 
    '<div class="status" id="st">Chambre magnétique instable.</div>'+ 
    '<div class="row"><button class="btn" id="reset" type="button">↻ Effacer les réponses</button></div>';
  gameMount.appendChild(box);

  const grid=box.querySelector('#magneticGrid');
  const st=box.querySelector('#st');
  let moves=0;
  let finished=false;

  function markLine(values,positions,bad){
    const north=values.filter(function(value){return value===1;}).length;
    const south=values.filter(function(value){return value===0;}).length;
    if(north>3||south>3){
      positions.forEach(function(position,index){if(values[index]!==null)bad.add(position);});
    }
    for(let i=0;i<=size-3;i++){
      if(values[i]!==null&&values[i]===values[i+1]&&values[i]===values[i+2]){
        bad.add(positions[i]);
        bad.add(positions[i+1]);
        bad.add(positions[i+2]);
      }
    }
  }

  function findViolations(){
    const bad=new Set();
    for(let r=0;r<size;r++){
      const positions=current[r].map(function(_,c){return r+','+c;});
      markLine(current[r],positions,bad);
    }
    for(let c=0;c<size;c++){
      const values=current.map(function(row){return row[c];});
      const positions=values.map(function(_,r){return r+','+c;});
      markLine(values,positions,bad);
    }
    const completeRows=new Map();
    const completeColumns=new Map();
    for(let r=0;r<size;r++){
      if(current[r].every(function(value){return value!==null;})){
        const key=current[r].join('');
        if(completeRows.has(key)){
          [r,completeRows.get(key)].forEach(function(row){for(let c=0;c<size;c++)bad.add(row+','+c);});
        }else completeRows.set(key,r);
      }
    }
    for(let c=0;c<size;c++){
      const values=current.map(function(row){return row[c];});
      if(values.every(function(value){return value!==null;})){
        const key=values.join('');
        if(completeColumns.has(key)){
          [c,completeColumns.get(key)].forEach(function(column){for(let r=0;r<size;r++)bad.add(r+','+column);});
        }else completeColumns.set(key,c);
      }
    }
    return bad;
  }

  function isSolved(){
    return current.every(function(row,r){
      return row.every(function(value,c){return value!==null&&value===solution[r][c];});
    });
  }

  function render(){
    const violations=findViolations();
    grid.innerHTML='';
    for(let r=0;r<size;r++)for(let c=0;c<size;c++){
      const key=r+','+c;
      const fixed=clues[r][c]!==null;
      const value=current[r][c];
      const cell=document.createElement('button');
      cell.type='button';
      cell.className='magnetic-cell'+(fixed?' clue':'')+(value===1?' north':value===0?' south':' unknown')+(violations.has(key)?' invalid':'');
      cell.setAttribute('role','gridcell');
      cell.setAttribute('aria-label','Polarité ligne '+(r+1)+', colonne '+(c+1)+(fixed?' verrouillée':''));
      cell.setAttribute('aria-pressed',value===null?'false':'true');
      cell.innerHTML='<span class="magnetic-symbol">'+(value===1?'N':value===0?'S':'?')+'</span>'+(fixed?'<small>🔒</small>':'');
      if(!fixed){
        cell.addEventListener('click',function(){
          if(finished)return;
          const order=[null,1,0];
          const index=order.indexOf(current[r][c]);
          current[r][c]=order[(index+1)%order.length];
          moves++;
          render();
        });
      }else{
        cell.disabled=true;
      }
      grid.appendChild(cell);
    }

    if(isSolved()){
      if(!finished){
        finished=true;
        grid.classList.add('solved');
        complete(6,st,'🧲 Polarités magnétiques stabilisées en '+moves+' manipulations !');
      }
    }else if(!finished){
      if(violations.size){
        st.textContent='Contradiction détectée dans la chambre • Corrige les cases rouges.';
        st.className='status bad';
      }else{
        st.textContent='Chambre magnétique instable • Cases renseignées : '+current.flat().filter(function(value){return value!==null;}).length+' / 36';
        st.className='status';
      }
    }
  }

  box.querySelector('#reset').addEventListener('click',function(){
    if(finished)return;
    for(let r=0;r<size;r++)for(let c=0;c<size;c++){
      if(clues[r][c]===null)current[r][c]=null;
    }
    moves=0;
    render();
  });

  render();
};
