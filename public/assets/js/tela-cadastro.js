const form = document.getElementById('registerForm');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(username === '' || email === '' || password === '') {
        alert('Preencha todos os campos!');
        return;
    }

    window.location.href = '../pages/homepage.html';
});
