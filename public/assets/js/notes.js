// Tela de notas.
// Os dados ficam no localStorage do navegador (não há back-end ainda).

const STORAGE_KEY = 'noteflow_notas';
const COR_PADRAO = '#ffffff';

// ===== ESTADO =====
let notas = carregarNotas();
let filtroAtual = 'todas';
let notaEditandoId = null;
let corSelecionada = COR_PADRAO;
let corModalSelecionada = COR_PADRAO;

// ===== ELEMENTOS =====
const $ = (id) => document.getElementById(id);

const el = {
  sidebar: $('sidebar'),
  menuBtn: $('menuBtn'),
  btnNovaNota: $('btnNovaNota'),
  searchInput: $('searchInput'),

  quickCreate: $('quickCreate'),
  quickActions: $('quickActions'),
  quickTitle: $('quickTitle'),
  quickBody: $('quickBody'),
  quickColors: $('quickColors'),
  btnFecharCriacao: $('btnFecharCriacao'),
  btnSalvarNota: $('btnSalvarNota'),

  gridFixadas: $('gridFixadas'),
  gridNotas: $('gridNotas'),
  labelFixadas: $('labelFixadas'),
  labelOutras: $('labelOutras'),
  emptyState: $('emptyState'),

  modalOverlay: $('modalOverlay'),
  modalNota: $('modalNota'),
  modalTitle: $('modalTitle'),
  modalBody: $('modalBody'),
  modalColors: $('modalColors'),
  btnFixarModal: $('btnFixarModal'),
  btnArquivarModal: $('btnArquivarModal'),
  btnDeletarModal: $('btnDeletarModal'),
  btnSalvarEdicao: $('btnSalvarEdicao'),
};

// ===== PERSISTÊNCIA =====
function carregarNotas() {
  try {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(dados) ? dados : [];
  } catch {
    return []; // dado corrompido ou localStorage indisponível
  }
}

function salvarStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notas));
  } catch {
    // sem persistência: as notas continuam na memória até recarregar a página
  }
}

// ===== UTILITÁRIOS =====
function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatarData(ts) {
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function buscarNota(id) {
  return notas.find((n) => n.id === id);
}

// ===== RENDERIZAÇÃO =====
function renderizar() {
  el.gridFixadas.innerHTML = '';
  el.gridNotas.innerHTML = '';

  const busca = el.searchInput.value.toLowerCase();

  const visiveis = notas.filter((n) => {
    const match =
      !busca || n.titulo.toLowerCase().includes(busca) || n.corpo.toLowerCase().includes(busca);
    if (!match) return false;
    if (filtroAtual === 'fixadas') return n.fixada && !n.arquivada;
    if (filtroAtual === 'arquivadas') return n.arquivada;
    return !n.arquivada;
  });

  const fixadas = visiveis.filter((n) => n.fixada && !n.arquivada);
  const outras = visiveis.filter((n) => !n.fixada || n.arquivada);

  el.labelFixadas.style.display = fixadas.length ? 'block' : 'none';

  fixadas.forEach((n) => el.gridFixadas.appendChild(criarCard(n)));
  outras.forEach((n) => el.gridNotas.appendChild(criarCard(n)));

  const vazio = visiveis.length === 0;
  el.emptyState.style.display = vazio ? 'block' : 'none';
  el.labelOutras.style.display = outras.length || (!fixadas.length && !vazio) ? 'block' : 'none';
}

function criarBotaoCard({ texto, titulo, classe = '', onClick }) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `card-btn ${classe}`.trim();
  btn.title = titulo;
  btn.setAttribute('aria-label', titulo);
  btn.textContent = texto;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  return btn;
}

function criarCard(nota) {
  const card = document.createElement('div');
  card.className = 'note-card';
  card.style.background = nota.cor || 'var(--card)';

  if (nota.titulo) {
    const t = document.createElement('div');
    t.className = 'note-title';
    t.textContent = nota.titulo;
    card.appendChild(t);
  }

  if (nota.corpo) {
    const b = document.createElement('div');
    b.className = 'note-body';
    b.textContent = nota.corpo;
    card.appendChild(b);
  }

  if (nota.arquivada) {
    const badge = document.createElement('span');
    badge.className = 'badge-arquivada';
    badge.textContent = 'Arquivada';
    card.appendChild(badge);
  }

  const data = document.createElement('div');
  data.className = 'note-date';
  data.textContent = formatarData(nota.criada);
  card.appendChild(data);

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  actions.appendChild(
    criarBotaoCard({
      texto: '⊙',
      titulo: nota.fixada ? 'Desafixar' : 'Fixar',
      classe: nota.fixada ? 'fixado' : '',
      onClick: () => toggleFixar(nota.id),
    }),
  );
  actions.appendChild(
    criarBotaoCard({
      texto: '◷',
      titulo: nota.arquivada ? 'Desarquivar' : 'Arquivar',
      onClick: () => toggleArquivar(nota.id),
    }),
  );
  actions.appendChild(
    criarBotaoCard({ texto: '✕', titulo: 'Excluir', onClick: () => excluirNota(nota.id) }),
  );
  card.appendChild(actions);

  card.addEventListener('click', () => abrirModal(nota.id));

  return card;
}

// ===== AÇÕES SOBRE NOTAS =====
function toggleFixar(id) {
  const nota = buscarNota(id);
  if (!nota) return;
  nota.fixada = !nota.fixada;
  salvarStorage();
  renderizar();
}

function toggleArquivar(id) {
  const nota = buscarNota(id);
  if (!nota) return;
  nota.arquivada = !nota.arquivada;
  salvarStorage();
  renderizar();
}

// Retorna true se a nota foi de fato excluída.
function excluirNota(id) {
  if (!confirm('Excluir esta nota?')) return false;
  notas = notas.filter((n) => n.id !== id);
  salvarStorage();
  renderizar();
  return true;
}

// ===== SELETOR DE COR =====
function marcarCor(container, cor) {
  container.querySelectorAll('.dot').forEach((d) => {
    d.classList.toggle('selected', d.dataset.color === cor);
  });
}

// ===== CRIAÇÃO RÁPIDA =====
function expandirCriacao() {
  el.quickActions.classList.add('visible');
}

function fecharCriacao() {
  el.quickActions.classList.remove('visible');
  el.quickTitle.value = '';
  el.quickBody.value = '';
  corSelecionada = COR_PADRAO;
  marcarCor(el.quickColors, null);
}

function abrirCriacao() {
  expandirCriacao();
  setTimeout(() => el.quickTitle.focus(), 50);
}

function salvarNota() {
  const titulo = el.quickTitle.value.trim();
  const corpo = el.quickBody.value.trim();

  if (!titulo && !corpo) {
    fecharCriacao();
    return;
  }

  notas.unshift({
    id: gerarId(),
    titulo,
    corpo,
    cor: corSelecionada !== COR_PADRAO ? corSelecionada : null,
    fixada: false,
    arquivada: false,
    criada: Date.now(),
    editada: Date.now(),
  });

  salvarStorage();
  renderizar();
  fecharCriacao();
}

// ===== MODAL DE EDIÇÃO =====
function atualizarBotaoFixarModal(nota) {
  el.btnFixarModal.classList.toggle('ativo', nota.fixada);
  el.btnFixarModal.title = nota.fixada ? 'Desafixar' : 'Fixar';
  el.btnFixarModal.setAttribute('aria-label', el.btnFixarModal.title);
}

function abrirModal(id) {
  const nota = buscarNota(id);
  if (!nota) return;

  notaEditandoId = id;
  corModalSelecionada = nota.cor || COR_PADRAO;

  el.modalTitle.value = nota.titulo;
  el.modalBody.value = nota.corpo;
  el.modalNota.style.background = nota.cor || 'var(--card)';
  marcarCor(el.modalColors, corModalSelecionada);
  atualizarBotaoFixarModal(nota);

  el.modalOverlay.classList.add('open');
}

function fecharModal() {
  el.modalOverlay.classList.remove('open');
  notaEditandoId = null;
  corModalSelecionada = COR_PADRAO;
}

function salvarEdicao() {
  const nota = buscarNota(notaEditandoId);
  if (!nota) return;

  nota.titulo = el.modalTitle.value.trim();
  nota.corpo = el.modalBody.value.trim();
  nota.cor = corModalSelecionada !== COR_PADRAO ? corModalSelecionada : null;
  nota.editada = Date.now();

  salvarStorage();
  renderizar();
  fecharModal();
}

function fixarNotaDoModal() {
  const nota = buscarNota(notaEditandoId);
  if (!nota) return;
  toggleFixar(nota.id);
  atualizarBotaoFixarModal(nota);
}

function arquivarNotaDoModal() {
  if (!buscarNota(notaEditandoId)) return;
  toggleArquivar(notaEditandoId);
  fecharModal();
}

function excluirNotaDoModal() {
  if (!buscarNota(notaEditandoId)) return;
  if (excluirNota(notaEditandoId)) fecharModal();
}

// ===== FILTRO =====
function filtrar(tipo) {
  filtroAtual = tipo;
  document.querySelectorAll('.sidebar nav li').forEach((li) => li.classList.remove('active'));
  $(`nav-${tipo}`).classList.add('active');
  renderizar();
}

// ===== MENU MOBILE =====
function toggleMenu() {
  el.sidebar.classList.toggle('open');
}

// ===== EVENTOS =====
function registrarEventos() {
  // Sidebar e topbar
  el.btnNovaNota.addEventListener('click', abrirCriacao);
  el.menuBtn.addEventListener('click', toggleMenu);
  el.searchInput.addEventListener('input', renderizar);
  document.querySelectorAll('.sidebar nav li[data-filter]').forEach((li) => {
    li.addEventListener('click', () => filtrar(li.dataset.filter));
  });

  // Criação rápida
  el.quickTitle.addEventListener('focus', expandirCriacao);
  el.btnFecharCriacao.addEventListener('click', fecharCriacao);
  el.btnSalvarNota.addEventListener('click', salvarNota);
  el.quickColors.addEventListener('click', (e) => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    corSelecionada = dot.dataset.color;
    marcarCor(el.quickColors, corSelecionada);
  });

  // Modal de edição
  el.modalOverlay.addEventListener('click', (e) => {
    if (e.target === el.modalOverlay) salvarEdicao();
  });
  el.modalColors.addEventListener('click', (e) => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    corModalSelecionada = dot.dataset.color;
    marcarCor(el.modalColors, corModalSelecionada);
    el.modalNota.style.background = corModalSelecionada;
  });
  el.btnFixarModal.addEventListener('click', fixarNotaDoModal);
  el.btnArquivarModal.addEventListener('click', arquivarNotaDoModal);
  el.btnDeletarModal.addEventListener('click', excluirNotaDoModal);
  el.btnSalvarEdicao.addEventListener('click', salvarEdicao);

  // Clique fora: salva a criação rápida e fecha a sidebar no mobile
  document.addEventListener('click', (e) => {
    const criacaoAberta = el.quickActions.classList.contains('visible');
    if (criacaoAberta && !el.quickCreate.contains(e.target) && !el.btnNovaNota.contains(e.target)) {
      salvarNota();
    }

    const sidebarAberta = el.sidebar.classList.contains('open');
    if (sidebarAberta && !el.sidebar.contains(e.target) && !el.menuBtn.contains(e.target)) {
      el.sidebar.classList.remove('open');
    }
  });
}

// ===== INICIALIZAÇÃO =====
registrarEventos();
renderizar();
