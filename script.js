// ================== Carregar palpites ==================
let palpites = [];

fetch('palpites.json')
  .then(res => res.json())
  .then(data => {
    palpites = data;
    criarChips(); // criar chips após carregar palpites
  })
  .catch(err => console.error("Erro ao carregar palpites:", err));

// ================== Criar chips de esportes e mercados ==================
const sportsWrap = document.getElementById("sportsWrap");
const marketsWrap = document.getElementById("marketsWrap");

function criarChips() {
  const sports = [...new Set(palpites.map(p => p.esporte))];
  const markets = [...new Set(palpites.map(p => p.mercado))];

  sportsWrap.innerHTML = '';
  marketsWrap.innerHTML = '';

  sports.forEach(s => {
    let chip = document.createElement("div");
    chip.textContent = s;
    chip.className="chip";
    chip.onclick = () => chip.classList.toggle("active");
    sportsWrap.appendChild(chip);
  });

  markets.forEach(m => {
    let chip = document.createElement("div");
    chip.textContent = m;
    chip.className="chip";
    chip.onclick = () => chip.classList.toggle("active");
    marketsWrap.appendChild(chip);
  });
}

// ================== Gerar Bilhete ==================
const bilheteContainer = document.getElementById("bilheteContainer");
const generateBtn = document.getElementById("generateBtn");

generateBtn.onclick = gerarBilhete;

function gerarBilhete() {
  const selectedSports = Array.from(document.querySelectorAll('#sportsWrap .chip.active')).map(c => c.textContent);
  const selectedMarkets = Array.from(document.querySelectorAll('#marketsWrap .chip.active')).map(c => c.textContent);

  let filtered = palpites.filter(p => 
    (selectedSports.length === 0 || selectedSports.includes(p.esporte)) &&
    (selectedMarkets.length === 0 || selectedMarkets.includes(p.mercado))
  );

  if(filtered.length === 0){
    alert("Nenhum palpite disponível com esses filtros");
    return;
  }

  montarBilhete(filtered);
}

// ================== Montar Bilhete ==================
function montarBilhete(jogos) {
  bilheteContainer.innerHTML = "";
  let oddTotal = 1;
  let greenTotal = 0;

  jogos.forEach((p, idx) => {
    oddTotal *= p.odd;
    greenTotal += p.percent;

    const card = document.createElement("div");
    card.className = "card show";
    card.style.animation = `popIn 0.3s ease forwards`;
    card.innerHTML = `🎯 ${p.jogo} — ${p.mercado} | Odd: ${p.odd.toFixed(2)} | % Green: ${p.percent}%`;
    bilheteContainer.appendChild(card);
  });

  const stats = document.createElement("div");
  stats.className = "stats-line";
  stats.style.textAlign = "center";
  stats.style.marginTop = "12px";
  stats.innerHTML = `💰 Odd Total: ${oddTotal.toFixed(2)} | ✅ % Green Médio: ${(greenTotal/jogos.length).toFixed(1)}%`;
  bilheteContainer.appendChild(stats);

  // Centralizar o bilhete
  bilheteContainer.scrollIntoView({behavior: "smooth", block: "center"});
}

// ================== Animação ==================
const style = document.createElement('style');
style.innerHTML = `
@keyframes popIn {
  0% {transform: scale(0.5); opacity: 0;}
  70% {transform: scale(1.05); opacity: 1;}
  100% {transform: scale(1);}
}`;
document.head.appendChild(style);