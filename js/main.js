function alternarAba(nomeAba) {
    // Esconde todas as seções
    const conteudos = document.querySelectorAll('.tab-content');
    conteudos.forEach(c => c.classList.remove('active'));

    // Desativa todos os botões da nav
    const botoes = document.querySelectorAll('.tab-btn');
    botoes.forEach(b => b.classList.remove('active'));

    // Ativa a aba e o botão selecionado
    const secaoAlvo = document.getElementById(`aba-${nomeAba}`);
    const botaoAlvo = document.getElementById(`btn-tab-${nomeAba}`);

    if (secaoAlvo) secaoAlvo.classList.add('active');
    if (botaoAlvo) botaoAlvo.classList.add('active');

    // Carrega os dados específicos ao trocar de aba
    if (nomeAba === 'atletas') carregarAtletas();
    if (nomeAba === 'estoque') carregarEstoque();
}
