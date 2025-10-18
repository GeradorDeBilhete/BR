const jogos = [
    { nome: "Flamengo x Palmeiras", mercado: "+1.5 gols", odd: 1.45, jc: "3/5", jf: "3/5", cd: "3/5" },
    { nome: "Mirassol x São Paulo", mercado: "+1.5 gols", odd: 1.50, jc: "9/10", jf: "3/5", cd: "11/12" },
    { nome: "Getafe x Real Madrid", mercado: "Vitória fora", odd: 1.40, jc: "4E 1V", jf: "4V 1D", cd: "8/10" },
    { nome: "Celta de Vigo x Real Sociedad", mercado: "+0.5 gols casa", odd: 1.22, jc: "5/5", jf: "4/5", cd: "4/5" },
    { nome: "Como x Juventus", mercado: "+1.5 gols", odd: 1.40, jc: "10/10", jf: "4/5", cd: "4/4" },
    { nome: "Milan x Fiorentina", mercado: "Vitória casa", odd: 1.55, jc: "4V 1D", jf: "4E 1V", cd: "2V 2D 1E" }
];

const btnBetano = document.getElementById("abrirBetano");

// Detectar iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
    document.getElementById("iosInstructions").style.display = "block";
}

document.getElementById("gerarBilhete").addEventListener("click", () => {
    const num = Number(document.getElementById("numJogos").value);
    const oddMin = Number(document.getElementById("oddMin").value);
    const oddMax = Number(document.getElementById("oddMax").value);
    const market = document.getElementById("market").value;

    let filtered = jogos.filter(j => j.odd >= oddMin && j.odd <= oddMax);
    if (market !== "todos") filtered = filtered.filter(j => j.mercado === market);

    const bilhete = [];
    while (bilhete.length < num && filtered.length > 0) {
        const idx = Math.floor(Math.random() * filtered.length);
        bilhete.push(filtered.splice(idx, 1)[0]);
    }

    const container = document.getElementById("bilheteContainer");
    container.innerHTML = "";
    bilhete.forEach(j => {
        const div = document.createElement("div");
        div.classList.add("bilhete");
        div.innerHTML = `
            <strong>${j.nome}</strong><br>
            Mercado: ${j.mercado} | Odd: ${j.odd}<br>
            JC: ${j.jc} | JF: ${j.jf} | CD: ${j.cd}
        `;
        container.appendChild(div);
    });

    btnBetano.style.display = "block";
});

btnBetano.addEventListener("click", () => {
    window.open('https://www.betano.com/', '_blank');
});