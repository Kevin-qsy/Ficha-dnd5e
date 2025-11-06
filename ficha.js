// ====== FICHA.JS — navegação básica entre telas ======

(function () {
  const telaHome  = document.getElementById('home');        // sua seção da Home
  const telaFicha = document.getElementById('tela-ficha');  // seção da Ficha
  const btnVoltar = document.getElementById('btn-voltar-home');

  // Helpers
  function mostrar(el){ el.classList.add('ativa'); el.style.display = 'block'; }
  function ocultar(el){ el.classList.remove('ativa'); el.style.display = 'none'; }

  function irParaFicha(index = null){
    // guarda qual ficha foi aberta (opcional, para usar depois)
    if (index !== null) sessionStorage.setItem('fichaAtualIndex', String(index));
    ocultar(telaHome);
    mostrar(telaFicha);
  }

  function irParaHome(){
    ocultar(telaFicha);
    mostrar(telaHome);
  }

  // Expor no escopo global para o home.js poder chamar
  window.irParaFicha = irParaFicha;
  window.irParaHome  = irParaHome;

  // Botão "← Home" dentro da Ficha
  if (btnVoltar) btnVoltar.addEventListener('click', irParaHome);

  // Integração rápida com o rascunho do home.js:
  // Se a função carregarFicha existir, substituímos por uma versão que navega.
  if (typeof window.carregarFicha === 'function') {
    const oldCarregar = window.carregarFicha;
    window.carregarFicha = function(index){
      // opcional: manter o comportamento antigo (ex.: modal)
      // oldCarregar(index); // comente se não quiser o modal antigo
      irParaFicha(index);
    };
  }

  // Também permite entrar na Ficha ao clicar no botão "+ Criar ficha", se quiser:
  const btnNova = document.getElementById('btn-nova');
  if (btnNova){
    btnNova.addEventListener('click', () => {
      // deixa o home.js criar a ficha normalmente e já navega
      // (se não quiser navegar aqui, remova esta linha)
      irParaFicha();
    });
  }

  // Começa com Home visível e Ficha oculta
  mostrar(telaHome);
  ocultar(telaFicha);
})();
