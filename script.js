// ELEMENTOS
const bilheteContainer = document.getElementById("bilheteContainer");
const generateBtn = document.getElementById("generateBtn");
const qtdInput = document.getElementById("qtd");
const minOddInput = document.getElementById("minOdd");
const maxOddInput = document.getElementById("maxOdd");
const minPercentInput = document.getElementById("minPercent");
const estatBtn = document.getElementById("estatBtn");
const estatModal = document.getElementById("estatModal");
const closeEstat = document.getElementById("closeEstat");
const estatContent = document.getElementById("estatContent");

// FILTROS
function getSelectedChips(className){
  return Array.from(document.getElementsByClassName("chip")).filter(c=>c.classList.contains("active")).map(c=>c.textContent);
}

// DADOS
let palpites = []; // Será carregado do JSON
let resultados = []; // Será carregado do JSON

// CARREGAR JSON
async function loadData(){
  try {
    const res1 = await fetch("palpites.json");
    palpites = await res1.json();

    const res2 = await fetch("resultados.json");
    resultados = await res2.json();

    updateStatistics();
  } catch(e){
    console.error("Erro ao carregar JSON", e);
  }
}

// GERAR BILHETE
function gerarBilhete(){
  bilheteContainer.innerHTML="";
  let qtd = Number(qtdInput.value);
  let minOdd = Number(minOddInput.value);
  let maxOdd = Number(maxOddInput.value);
  let minPerc = Number(minPercentInput.value);

  const selectedSports = getSelectedChips("chip");
  const selectedMarkets = getSelectedChips("chip");

  let filtered = palpites.filter(p=>{
    let ok = p.odd>=minOdd && p.odd<=maxOdd && p.percent>=minPerc;
    if(selectedSports.length && !selectedSports.includes(p.esporte)) ok=false;
    if(selectedMarkets.length && !selectedMarkets.includes(p.mercado)) ok=false;
    return ok;
  });

  if(filtered.length<qtd) qtd=filtered.length;

  let bilhete=[];
  let oddTotal=1;
  let greenTotal=0;

  for(let i=0;i<qtd;i++){
    let idx=Math.floor(Math.random()*filtered.length);
    let p=filtered.splice(idx,1)[0];
    bilhete.push(p);
    oddTotal*=p.odd;
    greenTotal+=p.percent;
  }

  let card=document.createElement("div");
  card.className="card show";
  let content=`<h3>🎫 Bilhete Gerado (${qtd} jogos)</h3>`;
  bilhete.forEach((p,i)=>{
    content+=`<div>⚽ ${p.jogo} — ${p.mercado} | Odd: ${p.odd} | % Chance: ${p.percent}%</div>`;
  });
  content+=`<div class="stats-line">💰 Odd Total: ${oddTotal.toFixed(2)} | 📊 Média %: ${(greenTotal/qtd).toFixed(1)}%</div>`;
  card.innerHTML=content;
  bilheteContainer.appendChild(card);
  card.scrollIntoView({behavior:"smooth",block:"center"});
}

// ATUALIZAR ESTATÍSTICAS
function updateStatistics(){
  let totalJogos = palpites.length;
  let totalGreen = resultados.filter(r=>r.result==="green").length;
  let totalRed = resultados.filter(r=>r.result==="red").length;
  let oddSum = palpites.reduce((s,p)=>s+p.odd,0);
  let avgOdd = (oddSum/totalJogos).toFixed(2);

  estatContent.innerHTML=`
    <table class="stats">
      <tr><th>Total Jogos Pendentes</th><td>${totalJogos}</td></tr>
      <tr><th>Total Green</th><td>${totalGreen}</td></tr>
      <tr><th>Total Red</th><td>${totalRed}</td></tr>
      <tr><th>Odd Média</th><td>${avgOdd}</td></tr>
    </table>
  `;
}

// EVENTOS
generateBtn.onclick=gerarBilhete;
estatBtn.onclick=()=>estatModal.style.display="block";
closeEstat.onclick=()=>estatModal.style.display="none";
window.onclick=function(e){if(e.target===estatModal)estatModal.style.display="none";}

// INICIALIZAÇÃO
loadData();
