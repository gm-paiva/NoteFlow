// Alternância de tema claro/escuro (compartilhada por todas as páginas).
// A preferência fica salva no localStorage.

const STORAGE_KEY = 'nf_theme';
const TOGGLE_LABEL = {
  light: '🌙 Tema escuro',
  dark: '☀️ Tema claro',
};

function readSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light'; // localStorage indisponível (ex.: modo privado restrito)
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // sem persistência: o tema continua valendo até recarregar a página
  }
}

function applyTheme(theme) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);

  const button = document.getElementById('themeToggle');
  if (button) button.textContent = TOGGLE_LABEL[theme];
}

function toggleTheme() {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
}

applyTheme(readSavedTheme());
document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
