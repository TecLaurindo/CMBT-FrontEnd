function alternarAba(aba) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    if (aba === 'estoque') {
        document.getElementById('aba-estoque').classList.add('active');
        document.getElementById('btn-tab-estoque').classList.add('active');
        carregarEstoque();
    } else if (aba === 'mensalidades') {
        document.getElementById('aba-mensalidades').classList.add('active');
        document.getElementById('btn-tab-mensalidades').classList.add('active');
    }
}

// Inicializa a aba padrão no carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    carregarEstoque();
});
