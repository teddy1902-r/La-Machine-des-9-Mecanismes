games[8]=function(){
  const box=document.createElement('div');
  box.className='gamebox';
  box.innerHTML='<p class="small" style="text-align:center">Chaque impulsion agit sur deux jauges. Les valeurs vont de 0 à 5. Stabilise le cœur sur la signature <b>3 — 5 — 4 — 2</b>.</p>'+
    '<div id="core" class="core-controls"></div><div class="status" id="st">Cœur instable.</div>'+
    '<div class="row"><button class="btn" id="a" type="button">Impulsion A</button><button class="btn" id="b" type="button">Impulsion B</button>'+
    '<button class="btn" id="c" type="button">Impulsion C</button><button class="btn" id="d" type="button">Impulsion D</button>'+
    '<button class="btn" id="reset" type="button">↻ Réinitialiser</button></div>';
  gameMount.appendChild(box);
  const core=box.querySelector('#core');
  const st=box.querySelector('#st');
  const labels=['A','B','C','D'];
  const start=[4,1,5,2];
  const target=[3,5,4,2];
  let v=start.slice();
  let moves=0;
  let finished=false;
  function pulse(which){
    if(finished)return;
    if(which===0){v[0]=(v[0]+1)%6;v[1]=(v[1]+1)%6;}
    if(which===1){v[1]=(v[1]+1)%6;v[2]=(v[2]+1)%6;}
    if(which===2){v[2]=(v[2]+1)%6;v[3]=(v[3]+1)%6;}
    if(which===3){v[3]=(v[3]+1)%6;v[0]=(v[0]+1)%6;}
    moves++;
    draw();
  }
  function draw(){
    core.innerHTML='';
    v.forEach(function(value,index){
      const gauge=document.createElement('div');
      gauge.className='gauge';
      gauge.innerHTML='<b>Jauge '+labels[index]+'</b><div class="gauge-val">'+value+'</div><div class="gauge-bar">'+
        Array.from({length:6},function(_,j){return '<span class="gauge-dot '+(j<value?'on':'')+'"></span>';}).join('')+'</div>';
      core.appendChild(gauge);
    });
    if(v.every(function(value,index){return value===target[index];})){
      if(!finished){
        finished=true;
        complete(8,st,'🔷 Cœur du réacteur stabilisé en '+moves+' impulsions !');
      }
    }else if(!finished){
      st.textContent='Cœur instable • Impulsions : '+moves;
      st.className='status';
    }
  }
  box.querySelector('#a').addEventListener('click',function(){pulse(0);});
  box.querySelector('#b').addEventListener('click',function(){pulse(1);});
  box.querySelector('#c').addEventListener('click',function(){pulse(2);});
  box.querySelector('#d').addEventListener('click',function(){pulse(3);});
  box.querySelector('#reset').addEventListener('click',function(){
    if(finished)return;
    v=start.slice();
    moves=0;
    draw();
  });
  draw();
};
