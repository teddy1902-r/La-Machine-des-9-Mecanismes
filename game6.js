games[6]=function(){
  const secret=[4,1,6,2];
  const guesses=[
    [1,2,3,4],
    [4,5,6,1],
    [6,1,2,3],
    [1,2,6,3]
  ];
  const current=[null,null,null,null];
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Déverrouille la serrure du mécanisme 6 en retrouvant le code secret à 4 chiffres.</p>'+
    '<div class="code-lock-explain"><b>Comment jouer ?</b> Clique sur chaque roue pour faire défiler les chiffres de 1 à 6. Les chiffres ne se répètent pas. Les indices indiquent combien de chiffres sont bien placés et combien sont présents mais mal placés.</div>'+
    '<div id="codeDials" class="code-dials" role="group" aria-label="Roue du code secret"></div>'+
    '<div class="row"><button class="btn" id="testCode" type="button">🔓 Tester le code</button></div>'+
    '<div class="code-clues-title">Indices gravés sur la serrure</div>'+
    '<div id="codeClues" class="code-clues" aria-label="Indices du code"></div>'+
    '<div class="code-legend"><span class="code-badge exact">● Bien placé</span><span class="code-badge misplaced">● Présent, mauvaise place</span></div>'+
    '<div class="status" id="st">Serrure verrouillée • Choisis les 4 chiffres.</div>'+
    '<div class="row"><button class="btn" id="reset" type="button">↻ Effacer le code</button></div>';
  gameMount.appendChild(box);

  const dials=box.querySelector('#codeDials');
  const clues=box.querySelector('#codeClues');
  const testButton=box.querySelector('#testCode');
  const st=box.querySelector('#st');
  let attempts=0;
  let finished=false;

  function feedback(code,guess){
    let exact=0;
    const remainingCode=[];
    const remainingGuess=[];
    for(let i=0;i<code.length;i++){
      if(code[i]===guess[i]){
        exact++;
      }else{
        remainingCode.push(code[i]);
        remainingGuess.push(guess[i]);
      }
    }
    let misplaced=0;
    remainingCode.forEach(function(value){
      const index=remainingGuess.indexOf(value);
      if(index!==-1){
        misplaced++;
        remainingGuess.splice(index,1);
      }
    });
    return {exact:exact,misplaced:misplaced};
  }

  function numberSpans(values){
    return values.map(function(value){return '<span class="code-clue-number">'+value+'</span>';}).join('');
  }

  function renderClues(){
    clues.innerHTML=guesses.map(function(guess){
      const result=feedback(secret,guess);
      return '<div class="code-clue">'+
        '<div class="code-guess" aria-label="Proposition '+guess.join(' ')+'">'+numberSpans(guess)+'</div>'+
        '<div class="code-feedback">'+
          '<span class="code-badge exact">'+result.exact+' bien placé'+(result.exact>1?'s':'')+'</span>'+
          '<span class="code-badge misplaced">'+result.misplaced+' présent'+(result.misplaced>1?'s':'')+' ailleurs</span>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  function renderDials(){
    dials.innerHTML='';
    current.forEach(function(value,index){
      const dial=document.createElement('button');
      dial.type='button';
      dial.className='code-wheel '+(value===null?'empty':'filled');
      dial.setAttribute('aria-label','Chiffre '+(index+1)+(value===null?' vide':' '+value));
      dial.innerHTML='<span class="code-wheel-position">'+(index+1)+'</span><span class="code-wheel-value">'+(value===null?'?':value)+'</span><span class="code-wheel-help">cliquer</span>';
      dial.addEventListener('click',function(){
        if(finished)return;
        current[index]=current[index]===null?1:current[index]===6?null:current[index]+1;
        renderDials();
        if(current.every(function(item){return item!==null;})){
          st.textContent='Code prêt • Appuie sur « Tester le code ».';
          st.className='status';
        }else{
          st.textContent='Serrure verrouillée • Choisis les 4 chiffres.';
          st.className='status';
        }
      });
      dials.appendChild(dial);
    });
    testButton.disabled=current.some(function(value){return value===null;})||finished;
  }

  testButton.addEventListener('click',function(){
    if(finished||current.some(function(value){return value===null;}))return;
    attempts++;
    if(current.every(function(value,index){return value===secret[index];})){
      finished=true;
      dials.classList.add('solved');
      st.className='status ok';
      complete(6,st,'🔐 Serrure du mécanisme 6 déverrouillée en '+attempts+' essai'+(attempts>1?'s':'')+' !');
    }else{
      st.textContent='Mauvais code • Relis les indices et ajuste les roues.';
      st.className='status bad';
    }
  });

  box.querySelector('#reset').addEventListener('click',function(){
    if(finished)return;
    current.fill(null);
    attempts=0;
    renderDials();
    st.textContent='Serrure verrouillée • Choisis les 4 chiffres.';
    st.className='status';
  });

  renderClues();
  renderDials();
};
