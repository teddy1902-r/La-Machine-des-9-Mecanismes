games[3]=function(){
  const solution=[
    [0,0,1,1,0],
    [1,1,1,1,1],
    [1,1,1,1,0],
    [0,0,0,1,1],
    [1,1,1,0,0]
  ];
  const size=5;
  const current=solution.map(function(row){return row.map(function(){return false;});});
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Active les soupapes pour reconstituer le motif de vapeur. Les nombres indiquent les groupes de soupapes ouvertes dans chaque ligne et chaque colonne.</p>'+
    '<div class="steam-picross-layout">'+
      '<div class="steam-picross-corner" aria-hidden="true">♨️</div>'+
      '<div id="steamColClues" class="steam-clues steam-col-clues" aria-label="Indices des colonnes"></div>'+
      '<div id="steamRowClues" class="steam-clues steam-row-clues" aria-label="Indices des lignes"></div>'+
      '<div id="steamBoard" class="steam-board" role="grid" aria-label="Matrice des soupapes"></div>'+ 
    '</div>'+ 
    '<div class="steam-legend"><span class="steam-legend-swatch"></span> Soupape ouverte</div>'+ 
    '<div class="status" id="st">Matrice de vapeur incomplète.</div>'+ 
    '<div class="row"><button class="btn" id="reset" type="button">↻ Réinitialiser</button></div>';
  gameMount.appendChild(box);

  const board=box.querySelector('#steamBoard');
  const rowClues=box.querySelector('#steamRowClues');
  const colClues=box.querySelector('#steamColClues');
  const st=box.querySelector('#st');
  let finished=false;

  function getClues(line){
    const clues=[];
    let run=0;
    line.forEach(function(value){
      if(value){
        run++;
      }else if(run){
        clues.push(run);
        run=0;
      }
    });
    if(run)clues.push(run);
    return clues;
  }

  function renderClues(){
    rowClues.innerHTML=solution.map(function(row){
      return '<div>'+getClues(row).map(function(value){return '<span>'+value+'</span>';}).join('')+'</div>';
    }).join('');
    colClues.innerHTML=solution[0].map(function(_,column){
      const values=solution.map(function(row){return row[column];});
      return '<div>'+getClues(values).map(function(value){return '<span>'+value+'</span>';}).join('')+'</div>';
    }).join('');
  }

  function isSolved(){
    return current.every(function(row,r){
      return row.every(function(value,c){return value===Boolean(solution[r][c]);});
    });
  }

  function render(){
    board.innerHTML='';
    current.forEach(function(row,r){
      row.forEach(function(open,c){
        const cell=document.createElement('button');
        cell.type='button';
        cell.className='steam-cell'+(open?' active':'');
        cell.setAttribute('role','gridcell');
        cell.setAttribute('aria-label','Soupape ligne '+(r+1)+', colonne '+(c+1));
        cell.setAttribute('aria-pressed',open?'true':'false');
        cell.innerHTML=open?'<span aria-hidden="true">✦</span>':'';
        cell.addEventListener('click',function(){
          if(finished)return;
          current[r][c]=!current[r][c];
          render();
        });
        board.appendChild(cell);
      });
    });

    if(isSolved()){
      if(!finished){
        finished=true;
        board.classList.add('solved');
        complete(3,st,'💨 Motif de vapeur reconstitué !');
      }
    }else if(!finished){
      st.textContent='Matrice de vapeur incomplète.';
      st.className='status';
    }
  }

  box.querySelector('#reset').addEventListener('click',function(){
    if(finished)return;
    current.forEach(function(row){row.fill(false);});
    render();
  });

  renderClues();
  render();
};
