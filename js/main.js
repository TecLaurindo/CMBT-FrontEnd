function alternarAba(nomeAba) {
    const conteudos = document.querySelectorAll('.tab-content');
    conteudos.forEach(c => c.classList.remove('active'));

    const botoes = document.querySelectorAll('.tab-btn');
    botoes.forEach(b => b.classList.remove('active'));

    const secaoAlvo = document.getElementById(`aba-${nomeAba}`);
    const botaoAlvo = document.getElementById(`btn-tab-${nomeAba}`);

    if (secaoAlvo) secaoAlvo.classList.add('active');
    if (botaoAlvo) botaoAlvo.classList.add('active');

    if (nomeAba === 'atletas') carregarAtletas();
    if (nomeAba === 'calendario') carregarEventos();
    if (nomeAba === 'estoque') carregarEstoque();
}
