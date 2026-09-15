const modules=[
  {id:1,title:"Circuit d'énergie",icon:"⚡",desc:"Tourne toutes les plaques du circuit 9×9 : certaines sont de fausses pistes. Relie le générateur au cœur."},
  {id:2,title:"Train d'engrenages",icon:"⚙️",desc:"Déduis la bonne combinaison des cinq engrenages grâce aux équations."},
  {id:3,title:"Réseau de vapeur",icon:"💨",desc:"Réoriente les tuyaux du réseau pour conduire la vapeur jusqu’à la turbine."},
  {id:4,title:"Tableau lumineux",icon:"💡",desc:"Chaque pression inverse une lampe et ses voisines. Allume tout le tableau 5×5."},
  {id:5,title:"Convoyeur coulissant",icon:"▦",desc:"Remets les huit plaques mélangées du convoyeur dans l’ordre."},
  {id:6,title:"Chambre magnétique",icon:"🧲",desc:"Guide la sphère à travers un labyrinthe magnétique 7×7."},
  {id:7,title:"Horloge centrale",icon:"🕒",desc:"Résous quatre équations pour synchroniser les horloges."},
  {id:8,title:"Cœur du réacteur",icon:"🔷",desc:"Stabilise les quatre jauges couplées sur la signature demandée."},
  {id:9,title:"Terminal principal",icon:"🖥️",desc:"Mémorise quatre séquences de plus en plus longues."}
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
const machineScene=document.getElementById('machineScene');
const machineCore=document.getElementById('machineCore');
const machineCoreLabel=document.getElementById('machineCoreLabel');
const machinePowerText=document.getElementById('machinePowerText');
const machinePowerTextConsole=document.getElementById('machinePowerTextConsole');
const machinePowerFill=document.getElementById('machinePowerFill');
const machineFeed=document.getElementById('machineFeed');
const games={};
let activeCleanup=function(){};
