// Lista de esportes e mercados
const sports = ["Futebol", "Basquete", "Vôlei", "Tênis"];
const markets = [
  "Dupla Chance Casa",
  "Dupla Chance Fora",
  "Casa ou Empate",
  "+1.5 gols",
  "+2.5 gols",
  "+0.5 gol 1T",
  "Vitória Casa",
  "Vitória Fora",
  "Ambas Marcam",
  "+0.5 gol Casa",
  "-1.5 HT"
];

// Função para criar os chips
function createChips(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach(item => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = item;
    
    // Alterna seleção ao clicar
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
    });
    
    container.appendChild(chip);
  });
}

// Popula os chips no HTML
createChips("sportsWrap", sports);
createChips("marketsWrap", markets);

// Toggle para mostrar/esconder os filtros
const filtersToggle = document.getElementById("filtersToggle");
const filtersPanel = document.getElementById("filtersPanel");

filtersToggle.addEventListener("click", () => {
  if (filtersPanel.style.display === "flex") {
    filtersPanel.style.display = "none";
  } else {
    filtersPanel.style.display = "flex";
  }
});