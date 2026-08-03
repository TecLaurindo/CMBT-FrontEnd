async function carregarEstoque() {
    const tbody = document.getElementById('tabela-estoque-body');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';

    try {
        const itens = await apiRequest('/estoque');
        tbody.innerHTML = '';

        if (!itens || itens.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum item cadastrado no estoque.</td></tr>';
            return;
        }

        itens.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.descricao}</td>
                <td>${item.tamanho}</td>
                <td><strong>${item.quantidadeDisponivel}</strong></td>
                <td>R$ ${item.valorUnitario ? item.valorUnitario.toFixed(2) : '0.00'}</td>
                <td>
                    <button class="btn-action" onclick="darBaixaEstoque(${item.id})">Baixa (-1)</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao carregar estoque. Verifique o servidor Back-End.</td></tr>';
    }
}

async function darBaixaEstoque(id) {
    const qtdStr = prompt('Quantidade para dar baixa:', '1');
    if (!qtdStr) return;

    const quantidade = parseInt(qtdStr);
    if (isNaN(quantidade) || quantidade <= 0) {
        alert('Informe uma quantidade válida!');
        return;
    }

    try {
        await apiRequest(`/estoque/${id}/baixa?quantidade=${quantidade}`, 'PUT');
        alert('Baixa realizada com sucesso!');
        carregarEstoque();
    } catch (error) {
        // Erro já exibido pelo config.js
    }
}

async function cadastrarItemEstoque(event) {
    event.preventDefault();

    const novoItem = {
        descricao: document.getElementById('item-descricao').value,
        tamanho: document.getElementById('item-tamanho').value,
        quantidadeDisponivel: parseInt(document.getElementById('item-quantidade').value),
        valorUnitario: parseFloat(document.getElementById('item-valor').value)
    };

    try {
        await apiRequest('/estoque', 'POST', novoItem);
        alert('Item cadastrado com sucesso!');
        document.getElementById('form-cadastrar-item').reset();
        carregarEstoque();
    } catch (error) {
        // Trato no config.js
    }
}
