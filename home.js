// ====== HOME.JS — básico com ordenação e modais bonitos ======

document.addEventListener("DOMContentLoaded", initHome);

function initHome() {
  renderFichas();
  document.querySelector("#btn-nova").addEventListener("click", criarFicha);
  document.querySelector("#btn-importar").addEventListener("click", importarFicha);
}

// ----- Dados -----
function getFichas() {
  return JSON.parse(localStorage.getItem("fichas") || "[]");
}
function salvarFichas(lista) {
  localStorage.setItem("fichas", JSON.stringify(lista));
}

// ----- Renderização -----
function renderFichas() {
  const listaEl = document.querySelector("#lista-fichas");
  let fichas = getFichas();
  listaEl.innerHTML = "";

  if (fichas.length === 0) {
    listaEl.innerHTML = `<p style="color:#999;text-align:center;">Nenhuma ficha salva ainda.</p>`;
    return;
  }

  // ======= Ordenação: favoritos primeiro =======
  fichas.sort((a, b) => {
    if (b.favorito !== a.favorito) return b.favorito - a.favorito;
    return a.nome.localeCompare(b.nome);
  });

  fichas.forEach((ficha, i) => {
    const li = document.createElement("li");
    li.className = "pill-card";
    li.dataset.index = i;
    li.innerHTML = `
      <figure class="pill-avatar">
        <img src="${ficha.avatar || 'img/avatar-placeholder.png'}" alt="Retrato de ${ficha.nome}" />
      </figure>

      <div class="pill-main" role="button" tabindex="0">
        <span class="pill-title">${ficha.nome}</span>
        <span class="pill-meta">${ficha.classe || ''} ${ficha.nivel || ''} · ${ficha.raca || ''}</span>
      </div>

      <div class="pill-actions">
        <button class="btn-icon btn-favorito" aria-pressed="${ficha.favorito}" title="Favoritar">★</button>
        <button class="btn-icon btn-exportar" title="Exportar">⬇</button>
        <button class="btn-icon btn-excluir" title="Excluir">✕</button>
      </div>
    `;
    listaEl.appendChild(li);

    li.querySelector(".pill-main").addEventListener("click", () => carregarFicha(i));
    li.querySelector(".btn-excluir").addEventListener("click", () => excluirFicha(i));
    li.querySelector(".btn-favorito").addEventListener("click", () => favoritarFicha(i));
    li.querySelector(".btn-exportar").addEventListener("click", () => exportarFicha(i));
  });
}

// ----- Ações -----
function criarFicha() {
  const fichas = getFichas();
  const nova = {
    nome: "Nova Ficha",
    classe: "Classe",
    nivel: 1,
    raca: "Raça",
    avatar: "img/avatar-placeholder.png",
    favorito: false,
    criadoEm: new Date().toISOString(),
  };
  fichas.push(nova);
  salvarFichas(fichas);
  renderFichas();
}

function excluirFicha(index) {
  const fichas = getFichas();
  const nome = fichas[index].nome;
  mostrarModal({
    titulo: "Excluir Ficha",
    mensagem: `Deseja realmente excluir <strong>${nome}</strong>?`,
    confirmarTexto: "Excluir",
    cancelarTexto: "Cancelar",
    onConfirm: () => {
      fichas.splice(index, 1);
      salvarFichas(fichas);
      renderFichas();
    }
  });
}

function favoritarFicha(index) {
  const fichas = getFichas();
  fichas[index].favorito = !fichas[index].favorito;
  salvarFichas(fichas);
  renderFichas();
}

function exportarFicha(index) {
  const ficha = getFichas()[index];
  const blob = new Blob([JSON.stringify(ficha, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${ficha.nome.replace(/\s+/g, "_")}.json`;
  a.click();
}

function importarFicha() {
  const input = document.querySelector("#arquivo-import");
  input.click();
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const novaFicha = JSON.parse(e.target.result);
        const fichas = getFichas();
        fichas.push(novaFicha);
        salvarFichas(fichas);
        renderFichas();
      } catch (err) {
        mostrarModal({ titulo: "Erro", mensagem: "Arquivo inválido!" });
      }
    };
    reader.readAsText(file);
  };
}

function carregarFicha(index) {
  const ficha = getFichas()[index];
  mostrarModal({
    titulo: "Abrir Ficha",
    mensagem: `Abrir ficha <strong>${ficha.nome}</strong>?`,
    confirmarTexto: "Abrir",
    cancelarTexto: "Cancelar",
    onConfirm: () => alert(`(Futuro) Transição para a ficha de ${ficha.nome}`)
  });
}

// ===== MODAL BONITO =====
function mostrarModal({ titulo = "", mensagem = "", confirmarTexto = "OK", cancelarTexto, onConfirm }) {
  // cria elementos
  const fundo = document.createElement("div");
  fundo.className = "modal-fundo";

  const caixa = document.createElement("div");
  caixa.className = "modal-caixa";
  caixa.innerHTML = `
    <h3 class="modal-titulo">${titulo}</h3>
    <p class="modal-msg">${mensagem}</p>
    <div class="modal-botoes">
      ${cancelarTexto ? `<button class="btn btn-ghost modal-cancelar">${cancelarTexto}</button>` : ""}
      <button class="btn btn-primary modal-confirmar">${confirmarTexto}</button>
    </div>
  `;
  fundo.appendChild(caixa);
  document.body.appendChild(fundo);

  // animação
  setTimeout(() => fundo.classList.add("visivel"), 10);

  // eventos
  const confirmar = caixa.querySelector(".modal-confirmar");
  const cancelar = caixa.querySelector(".modal-cancelar");

  confirmar.addEventListener("click", () => {
    fecharModal(fundo);
    if (onConfirm) onConfirm();
  });
  if (cancelar) cancelar.addEventListener("click", () => fecharModal(fundo));

  fundo.addEventListener("click", (e) => {
    if (e.target === fundo) fecharModal(fundo);
  });
}

function fecharModal(el) {
  el.classList.remove("visivel");
  setTimeout(() => el.remove(), 200);
}
