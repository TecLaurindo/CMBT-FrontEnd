document.addEventListener('DOMContentLoaded', () => {
    carregarAtletas();
});

async function carregarAtletas() {
    const tbody = document.getElementById('tabela-atletas-body');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';

    try {
        const atletas = await apiRequest('/atletas');
        tbody.innerHTML = '';

        if (!atletas || atletas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum atleta cadastrado.</td></tr>';
            return;
        }

        atletas.forEach(atleta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${atleta.id}</strong></td>
                <td>${atleta.nome || '-'}</td>
                <td>${atleta.cpf || '-'}</td>
                <td>${atleta.categoria || '-'}</td>
                <td>${atleta.posicao || '-'}</td>
                <td><span class="badge badge-paid">Ativo</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao carregar lista de atletas.</td></tr>';
    }
}

async function cadastrarAtleta(event) {
    event.preventDefault();

    const novoAtleta = {
        nome: document.getElementById('atleta-nome').value,
        cpf: document.getElementById('atleta-cpf').value,
        dataNascimento: document.getElementById('atleta-nascimento').value || null,
        categoria: document.getElementById('atleta-categoria').value,
        posicao: document.getElementById('atleta-posicao').value
    };

    try {
        await apiRequest('/atletas', 'POST', novoAtleta);
        alert('Atleta cadastrado com sucesso!');
        document.getElementById('form-cadastrar-atleta').reset();
        carregarAtletas();
    } catch (error) {
        // Trato no config.js
    }
}
