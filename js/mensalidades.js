async function buscarMensalidadesPorAtleta() {
    const atletaId = document.getElementById('input-atleta-id').value;
    const tbody = document.getElementById('tabela-mensalidades-body');

    if (!atletaId) {
        alert('Informe o ID do atleta para buscar!');
        return;
    }

    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';

    try {
        const mensalidades = await apiRequest(`/mensalidades/atleta/${atletaId}`);
        tbody.innerHTML = '';

        if (!mensalidades || mensalidades.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma mensalidade encontrada para este atleta.</td></tr>';
            return;
        }

        mensalidades.forEach(m => {
            const tr = document.createElement('tr');
            
            // Garante a comparação em maiúsculo
            const statusUpper = m.status ? m.status.toUpperCase() : 'PENDENTE';
            const isPago = statusUpper === 'PAGO';

            const statusBadge = isPago 
                ? '<span class="badge badge-paid">PAGO</span>' 
                : '<span class="badge badge-pending">PENDENTE</span>';

            const botaoAcao = !isPago
                ? `<button class="btn-success" onclick="darBaixaMensalidade(${m.id})">Baixa Manual</button>`
                : '-';

            tr.innerHTML = `
                <td>#${m.id}</td>
                <td>${m.mesReferencia || '-'}</td>
                <td>R$ ${m.valor ? m.valor.toFixed(2) : '0.00'}</td>
                <td>${statusBadge}</td>
                <td>${m.dataPagamento || '-'}</td>
                <td>${botaoAcao}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao buscar mensalidades do atleta.</td></tr>';
    }
}

async function gerarMensalidade(event) {
    event.preventDefault();

    const atletaId = parseInt(document.getElementById('mensalidade-atleta-id').value);

    const novaMensalidade = {
        atleta: { id: atletaId },
        mesReferencia: document.getElementById('mensalidade-mes-ref').value,
        valor: parseFloat(document.getElementById('mensalidade-valor').value),
        status: "PENDENTE"
    };

    try {
        await apiRequest('/mensalidades', 'POST', novaMensalidade);
        alert('Mensalidade gerada com sucesso!');
        document.getElementById('form-gerar-mensalidade').reset();
        
        document.getElementById('input-atleta-id').value = atletaId;
        buscarMensalidadesPorAtleta();
    } catch (error) {
        // Trato no config.js
    }
}

async function darBaixaMensalidade(id) {
    if (!confirm('Confirmar o recebimento desta mensalidade?')) return;

    try {
        await apiRequest(`/mensalidades/${id}/pagar`, 'PUT');
        alert('Pagamento registrado com sucesso!');
        buscarMensalidadesPorAtleta();
    } catch (error) {
        // Trato no config.js
    }
}
