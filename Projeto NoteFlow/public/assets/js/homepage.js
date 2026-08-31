// ===== ESTADO =====
let notas = JSON.parse(localStorage.getItem('noteflow_notas') || '[]');
let filtroAtual = 'todas';
let notaEditandoId = null;
let corSelecionada = '#ffffff';
let corModalSelecionada = '#ffffff';

// ===== SALVAR NO LOCALSTORAGE =====
function salvarStorage() {
  localStorage.setItem('noteflow_notas', JSON.stringify(notas));
}

// ===== GERAR ID =====
function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ===== FORMATAR DATA =====
function formatarData(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// ===== RENDERIZAR NOTAS =====
function renderizar() {
  const gridFixadas = document.getElementById('gridFixadas');
  const gridNotas = document.getElementById('gridNotas');
  const labelFixadas = document.getElementById('labelFixadas');
  const labelOutras = document.getElementById('labelOutras');
  const emptyState = document.getElementById('emptyState');

  gridFixadas.innerHTML = '';
  gridNotas.innerHTML = '';

  const busca = document.getElementById('searchInput').value.toLowerCase();

  let visiveis = notas.filter(n => {
    const match = !busca || n.titulo.toLowerCase().includes(busca) || n.corpo.toLowerCase().includes(busca);
    if (!match) return false;
    if (filtroAtual === 'fixadas') return n.fixada && !n.arquivada;
    if (filtroAtual === 'arquivadas') return n.arquivada;
    return !n.arquivada;
  });

  const fixadas = visiveis.filter(n => n.fixada && !n.arquivada);
  const outras = visiveis.filter(n => !n.fixada || n.arquivada);

  labelFixadas.style.display = fixadas.length ? 'block' : 'none';

  fixadas.forEach(n => gridFixadas.appendChild(criarCard(n)));
  outras.forEach(n => gridNotas.appendChild(criarCard(n)));

  const vazio = visiveis.length === 0;
  emptyState.style.display = vazio ? 'block' : 'none';
  labelOutras.style.display = (outras.length || (!fixadas.length && !vazio)) ? 'block' : 'none';
}

// ===== CRIAR CARD =====
function criarCard(nota) {
  const card = document.createElement('div');
  card.className = 'note-card';
  card.style.background = nota.cor || 'var(--card)';

  // Título
  if (nota.titulo) {
    const t = document.createElement('div');
    t.className = 'note-title';
    t.textContent = nota.titulo;
    card.appendChild(t);
  }

  // Corpo
  if (nota.corpo) {
    const b = document.createElement('div');
    b.className = 'note-body';
    b.textContent = nota.corpo;
    card.appendChild(b);
  }

  // Badge arquivada
  if (nota.arquivada) {
    const badge = document.createElement('span');
    badge.className = 'badge-arquivada';
    badge.textContent = 'Arquivada';
    card.appendChild(badge);
  }

  // Data
  const d = document.createElement('div');
  d.className = 'note-date';
  d.textContent = formatarData(nota.criada);
  card.appendChild(d);

  // Ações do card
  const actions = document.createElement('div');
  actions.className = 'card-actions';

  // Botão fixar
  const btnFixar = document.createElement('button');
  btnFixar.className = 'card-btn' + (nota.fixada ? ' fixado' : '');
  btnFixar.title = nota.fixada ? 'Desafixar' : 'Fixar';
  btnFixar.textContent = '⊙';
  btnFixar.onclick = (e) => { e.stopPropagation(); toggleFixar(nota.id); };
  actions.appendChild(btnFixar);

  // Botão arquivar
  const btnArq = document.createElement('button');
  btnArq.className = 'card-btn';
  btnArq.title = nota.arquivada ? 'Desarquivar' : 'Arquivar';
  btnArq.textContent = '◷';
  btnArq.onclick = (e) => { e.stopPropagation(); toggleArquivar(nota.id); };
  actions.appendChild(btnArq);

  // Botão excluir
  const btnDel = document.createElement('button');
  btnDel.className = 'card-btn';
  btnDel.title = 'Excluir';
  btnDel.textContent = '✕';
  btnDel.onclick = (e) => { e.stopPropagation(); excluirNota(nota.id); };
  actions.appendChild(btnDel);

  card.appendChild(actions);

  // Click para editar
  card.onclick = () => abrirModal(nota.id);

  return card;
}

// ===== CRIAÇÃO RÁPIDA =====
function expandirCriacao() {
  document.getElementById('quickActions').classList.add('visible');
}

function fecharCriacao() {
  document.getElementById('quickActions').classList.remove('visible');
  document.getElementById('quickTitle').value = '';
  document.getElementById('quickBody').value = '';
  corSelecionada = '#ffffff';
  document.querySelectorAll('#quickColors .dot').forEach(d => d.classList.remove('selected'));
}

function abrirCriacao() {
  expandirCriacao();
  setTimeout(() => document.getElementById('quickTitle').focus(), 50);
}

function selecionarCor(cor, el) {
  corSelecionada = cor;
  document.querySelectorAll('#quickColors .dot').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
}

function salvarNota() {
  const titulo = document.getElementById('quickTitle').value.trim();
  const corpo = document.getElementById('quickBody').value.trim();

  if (!titulo && !corpo) {
    fecharCriacao();
    return;
  }

  const nova = {
    id: gerarId(),
    titulo,
    corpo,
    cor: corSelecionada !== '#ffffff' ? corSelecionada : null,
    fixada: false,
    arquivada: false,
    criada: Date.now(),
    editada: Date.now()
  };

  notas.unshift(nova);
  salvarStorage();
  renderizar();
  fecharCriacao();
}

// ===== MODAL EDIÇÃO =====
function abrirModal(id) {
  const nota = notas.find(n => n.id === id);
  if (!nota) return;

  notaEditandoId = id;
  corModalSelecionada = nota.cor || '#ffffff';

  document.getElementById('modalTitle').value = nota.titulo;
  document.getElementById('modalBody').value = nota.corpo;
  document.getElementById('modalOverlay').classList.add('open');

  // Aplicar cor ao modal
  const modal = document.getElementById('modalNota');
  modal.style.background = nota.cor || 'var(--card)';

  // Atualizar dots
  document.querySelectorAll('#modalColors .dot').forEach(d => {
    d.classList.toggle('selected', d.style.background === nota.cor);
  });

  // Botão fixar
  const btnFixar = document.getElementById('btnFixarModal');
  btnFixar.classList.toggle('ativo', nota.fixada);
  btnFixar.title = nota.fixada ? 'Desafixar' : 'Fixar';
}

function fecharModalFora(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    salvarEdicao();
  }
}

function fecharModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  notaEditandoId = null;
  corModalSelecionada = '#ffffff';
}

function selecionarCorModal(cor, el) {
  corModalSelecionada = cor;
  document.querySelectorAll('#modalColors .dot').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('modalNota').style.background = cor;
}

function salvarEdicao() {
  if (!notaEditandoId) return;
  const idx = notas.findIndex(n => n.id === notaEditandoId);
  if (idx === -1) return;

  notas[idx].titulo = document.getElementById('modalTitle').value.trim();
  notas[idx].corpo = document.getElementById('modalBody').value.trim();
  notas[idx].cor = corModalSelecionada !== '#ffffff' ? corModalSelecionada : null;
  notas[idx].editada = Date.now();

  salvarStorage();
  renderizar();
  fecharModal();
}

function fixarNota() {
  if (!notaEditandoId) return;
  const idx = notas.findIndex(n => n.id === notaEditandoId);
  if (idx === -1) return;
  notas[idx].fixada = !notas[idx].fixada;
  const btnFixar = document.getElementById('btnFixarModal');
  btnFixar.classList.toggle('ativo', notas[idx].fixada);
  salvarStorage();
  renderizar();
}

function arquivarNota() {
  if (!notaEditandoId) return;
  const idx = notas.findIndex(n => n.id === notaEditandoId);
  if (idx === -1) return;
  notas[idx].arquivada = !notas[idx].arquivada;
  salvarStorage();
  renderizar();
  fecharModal();
}

function deletarNota() {
  if (!notaEditandoId) return;
  if (!confirm('Excluir esta nota?')) return;
  notas = notas.filter(n => n.id !== notaEditandoId);
  salvarStorage();
  renderizar();
  fecharModal();
}

// ===== AÇÕES RÁPIDAS DOS CARDS =====
function toggleFixar(id) {
  const idx = notas.findIndex(n => n.id === id);
  if (idx === -1) return;
  notas[idx].fixada = !notas[idx].fixada;
  salvarStorage();
  renderizar();
}

function toggleArquivar(id) {
  const idx = notas.findIndex(n => n.id === id);
  if (idx === -1) return;
  notas[idx].arquivada = !notas[idx].arquivada;
  salvarStorage();
  renderizar();
}

function excluirNota(id) {
  if (!confirm('Excluir esta nota?')) return;
  notas = notas.filter(n => n.id !== id);
  salvarStorage();
  renderizar();
}

// ===== FILTRO =====
function filtrar(tipo) {
  filtroAtual = tipo;
  document.querySelectorAll('.sidebar nav li').forEach(li => li.classList.remove('active'));
  document.getElementById('nav-' + tipo).classList.add('active');
  renderizar();
}

// ===== BUSCA =====
function buscar() {
  renderizar();
}


// ===== MENU MOBILE =====
function toggleMenu() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===== FECHAR CRIAÇÃO AO CLICAR FORA / FECHAR SIDEBAR MOBILE =====
document.addEventListener('click', (e) => {
  // Fechar área de criação rápida
  const qc = document.getElementById('quickCreate');
  const qa = document.getElementById('quickActions');
  const btnNova = document.querySelector('.btn-primary');
  if (!qc.contains(e.target) && !btnNova.contains(e.target) && qa.classList.contains('visible')) {
    salvarNota();
  }

  // Fechar sidebar mobile ao clicar fora
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.querySelector('.menu-btn');
  if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ===== INIT =====
window.addEventListener('load', () => {
  renderizar();
});
