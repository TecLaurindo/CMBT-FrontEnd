async function buscarMensalidadesPorAtleta() {
    const atletaId = document.getElementById('input-atleta-id').value;
    const tbody = document.getElementById('tabela-mensalidades-body');

    if (!atletaId) {
        alert('Por favor, informe o ID do atleta!');
        return;
    }

    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Buscando...</td></tr>';

    try {
        const mensalidades = await apiRequest(`/mensalidades/atleta/${atletaId}`);
        tbody.innerHTML = '';

        if (!mensalidades || mensalidades.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma mensalidade encontrada para este atleta.</td></tr>';
            return;
        }

        mensalidades.forEach(m => {
            const tr = document.createElement('tr');
            const statusBadge = m.pago 
                ? '<span class="badge badge-paid">PAGO</span>' 
                : '<span class="badge badge-pending">PENDENTE</span>';

            const botaoAcao = m.pago 
                ? '<span>-</span>' 
                : `<button class="btn-success" onclick="confirmarPagamento(${m.id})">Baixa Manual</button>`;

            tr.innerHTML = `
                <td>${m.id}</td>
                <td>${m.mesReferencia}</td>
                <td>R$ ${m.valor ? m.valor.toFixed(2) : '0.00'}</td>
                <td>${statusBadge}</td>
                <td>${m.dataPagamento || 'Pendente'}</td>
                <td>${botaoAcao}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao buscar mensalidades.</td></tr>';
    }
}

async function confirmarPagamento(id) {
    if (!confirm('Deseja confirmar o pagamento manual desta mensalidade?')) return;

    try {
        await apiRequest(`/mensalidades/${id}/pagar`, 'PUT');
        alert('Pagamento registrado com sucesso!');
        buscarMensalidadesPorAtleta();
    } catch (error) {
        // Erro tratado na API
    }
}
