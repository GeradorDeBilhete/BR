let palpites = [];
let resultados = [];

// Carregar JSON de palpites pendentes
fetch("palpites.json")
  .then(res => res.json())
  .then(data => palpites = data);

// Carregar resultados passados
fetch("resultados.json")
  .then(res => res.json())
  .then(data => resultados = data);

const bilheteContainer = document.getElementById("bilheteContainer");
const generateBtn = document.getElementById("generateBtn");
const qtdInput = document.getElementById("qtd");
const sportsWrap = document.getElementById("sportsWrap");
const marketsWrap = document.getElementById("marketsWrap");

// Filtros escondidos
const sports = ["Futebol","Basquete","Vôlei","Tênis"];
const markets = ["Dupla Chance Casa","Dupla Chance Fora","Casa ou Empate","+1.5 gols","+2.5 gols","+0.5 gol 1T","Vitória Casa","Vitória Fora","Ambas Marcam","+0.5 gol Casa","-1.5 ht"];

function criarFiltros(){
  sports.forEach(s=>{
    let chip = document.createElement("div");
    chip.className="chip";
    chip.textContent=s;
    chip.onclick = ()=>chip.classList.toggle("active");
    sportsWrap.appendChild(chip);
  });
  markets.forEach(m=>{
    let chip = document.createElement("div");
    chip.className="chip";
    chip.textContent=m;
    chip.onclick = ()=>chip.classList.toggle("active");
    marketsWrap.appendChild(chip);
  });
}
criarFiltros();

// Gerar bilhete
function gerarBilhete(){
  bilheteContainer.innerHTML="";
  let qtd = Number(qtdInput.value);
  let filtrosSports = Array.from(sportsWrap.getElementsByClassName("active")).map(c=>c.textContent);
  let filtrosMarkets = Array.from(marketsWrap.getElementsByClassName("active")).map(c=>c.textContent);

  let filtered = palpites.filter(p=>{
    let fS = filtrosSports.length===0 || filtrosSports.includes(p.esporte);
    let fM = filtrosMarkets.length===0 || filtrosMarkets.includes(p.mercado);
    return fS && fM;
  });

  if(filtered.length<qtd) qtd=filtered.length;

  let bilhete = [];
  let oddTotal=1;
  for(let i=0;i<qtd;i++){
    let idx = Math.floor(Math.random()*filtered.length);
    let p = filtered.splice(idx,1)[0];
    bilhete.push(p);
    oddTotal *= p.odd;
  }

  let card = document.createElement("div");
  card.className="card show";
  let content = `<h3>🎟️ Bilhete Gerado (${qtd} jogos)</h3>`;
  bilhete.forEach(p=>{
    content+=`<div>⚽ ${p.jogo} — ${p.mercado} | Odd: ${p.odd}</div>`;
  });
  content+=`<div class="stats-line">Odd Total: ${oddTotal.toFixed(2)} | % Chance Média: ${(100/oddTotal).toFixed(1)}%</div>`;
  bilheteContainer.appendChild(card);
}

generateBtn.onclick=gerarBilhete;

// Estatísticas
function calcularEstatisticas(){
  let total = resultados.length;
  let green = resultados.filter(r=>r.resultado==="green").length;
  let red = resultados.filter(r=>r.resultado==="red").length;
  let percGreen = ((green/total)*100).toFixed(1);
  return {total, green, red, percGreen};
}