function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  if (body.classList.contains('light')) {
    body.classList.replace('light', 'dark');
    btn.textContent = '☀️ Tema claro';
    localStorage.setItem('nf_theme', 'dark');
  } else {
    body.classList.replace('dark', 'light');
    btn.textContent = '🌙 Tema escuro';
    localStorage.setItem('nf_theme', 'light');
  }
}

window.addEventListener('load', () => {
  const saved = localStorage.getItem('nf_theme') || 'light';
  document.body.className = saved;
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '☀️ Tema claro' : '🌙 Tema escuro';
});
