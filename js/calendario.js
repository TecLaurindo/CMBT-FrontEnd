document.addEventListener('DOMContentLoaded', () => {
    carregarEventos();
});

async function carregarEventos() {
    const tbody = document.getElementById('tabela-eventos-body');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">Carregando agenda...</td></tr>';

    try {
        const eventos = await apiRequest('/eventos');
        tbody.innerHTML = '';

        if (!eventos || eventos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum treino ou jogo agendado.</td></tr>';
            return;
        }

        eventos.forEach(ev => {
            const tr = document.createElement('tr');
            
            // Formatar data para exibição brasileira
            const dataFormatada = ev.dataHoraInicio 
                ? new Date(ev.dataHoraInicio).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                : '-';

            const badgeClass = ev.tipo === 'JOGO' ? 'badge-pending' : 'badge-paid';

            tr.innerHTML = `
                <td><strong>#${ev.id}</strong></td>
                <td><span class="badge ${badgeClass}">${ev.tipo}</span></td>
                <td>${ev.titulo}</td>
                <td>${dataFormatada}</td>
                <td>${ev.local}</td>
                <td>${ev.categoria}</td>
                <td>
                    <button class="btn-danger" onclick="deletarEvento(${ev.id})">Cancelar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Erro ao carregar a agenda.</td></tr>';
    }
}

async function cadastrarEvento(event) {
    event.preventDefault();

    const novoEvento = {
        titulo: document.getElementById('evento-titulo').value,
        tipo: document.getElementById('evento-tipo').value,
        dataHoraInicio: document.getElementById('evento-inicio').value,
        local: document.getElementById('evento-local').value,
        categoria: document.getElementById('evento-categoria').value
    };

    try {
        await apiRequest('/eventos', 'POST', novoEvento);
        alert('Evento agendado com sucesso!');
        document.getElementById('form-cadastrar-evento').reset();
        carregarEventos();
    } catch (error) {
        // Trato no config.js
    }
}

async function deletarEvento(id) {
    if (!confirm('Deseja realmente cancelar e remover este evento da agenda?')) return;

    try {
        await apiRequest(`/eventos/${id}`, 'DELETE');
        alert('Evento removido!');
        carregarEventos();
    } catch (error) {
        // Trato no config.js
    }
}
