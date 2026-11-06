// Tela de cadastro.
// Validação apenas no front-end: nenhum dado de usuário é enviado ou salvo.

const form = document.getElementById('registerForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !email || !password) {
    alert('Preencha todos os campos!');
    return;
  }

  window.location.href = '/notes';
});
