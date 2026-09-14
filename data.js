
const modules=[
  {id:1,title:"Circuit d'énergie",icon:"⚡",desc:"Tourne les plaques pour relier le générateur au cœur de la machine."},
  {id:2,title:"Train d'engrenages",icon:"⚙️",desc:"Règle les quatre engrenages pour transmettre correctement le mouvement."},
  {id:3,title:"Réseau de vapeur",icon:"💨",desc:"Réoriente les tuyaux pour conduire la vapeur jusqu'à la turbine."},
  {id:4,title:"Tableau lumineux",icon:"💡",desc:"Chaque pression inverse une lampe et ses voisines. Allume tout le tableau."},
  {id:5,title:"Convoyeur coulissant",icon:"▦",desc:"Remets les huit plaques du convoyeur dans l'ordre."},
  {id:6,title:"Chambre magnétique",icon:"🧲",desc:"Guide la sphère d'énergie à travers le labyrinthe magnétique."},
  {id:7,title:"Horloge centrale",icon:"🕒",desc:"Trouve les trois heures grâce aux équations gravées sur la machine."},
  {id:8,title:"Cœur du réacteur",icon:"🔷",desc:"Stabilise les trois jauges couplées du réacteur."},
  {id:9,title:"Terminal principal",icon:"🖥️",desc:"Mémorise les séquences du terminal pour lancer l'activation finale."}
];
const solved=new Set();
const hub=document.getElementById('hub');
const stage=document.getElementById('stage');
const stageTitle=document.getElementById('stageTitle');
const stageDesc=document.getElementById('stageDesc');
const gameMount=document.getElementById('gameMount');
const globalText=document.getElementById('globalText');
const globalFill=document.getElementById('globalFill');
const finalMachine=document.getElementById('finalMachine');
const games={};
