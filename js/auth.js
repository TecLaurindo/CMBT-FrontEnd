document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
});

function verificarSessao() {
    const token = localStorage.getItem('caimbe_token');
    const modalLogin = document.getElementById('modal-login');
    const navPrincipal = document.getElementById('nav-principal');
    const conteudoPrincipal = document.getElementById('conteudo-principal');

    if (token) {
        modalLogin.style.display = 'none';
        navPrincipal.style.display = 'flex';
        conteudoPrincipal.style.display = 'block';

        if (typeof carregarDashboard === 'function') {
            carregarDashboard();
        }
    } else {
        modalLogin.style.display = 'flex';
        navPrincipal.style.display = 'none';
        conteudoPrincipal.style.display = 'none';
    }
}

async function realizarLogin(event) {
    event.preventDefault();

    const dados = {
        email: document.getElementById('login-email').value,
        senha: document.getElementById('login-senha').value
    };

    try {
        const resposta = await apiRequest('/auth/login', 'POST', dados);
        if (resposta && resposta.token) {
            localStorage.setItem('caimbe_token', resposta.token);
            localStorage.setItem('caimbe_usuario', resposta.nome);
            localStorage.setItem('caimbe_perfil', resposta.perfil);

            verificarSessao();
            carregarAtletas();
        }
    } catch (error) {
        alert('Falha no login: verifique seu e-mail e senha.');
    }
}

function realizarLogout() {
    localStorage.removeItem('caimbe_token');
    localStorage.removeItem('caimbe_usuario');
    localStorage.removeItem('caimbe_perfil');
    window.location.reload();
}
