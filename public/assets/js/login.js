// Tela de login.
// Validação apenas no front-end: ainda não existe autenticação real.

const EYE_OPEN = `
  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
  <circle cx="12" cy="12" r="3"/>`;

const EYE_OFF = `
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>`;

const form = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eye-icon');

toggleButton.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  eyeIcon.innerHTML = show ? EYE_OFF : EYE_OPEN;
  toggleButton.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert('Preencha todos os campos!');
    return;
  }

  window.location.href = '/notes';
});
