// EXECUTA AUTOMATICAMENTE ASSIM QUE A PÁGINA CARREGA
document.addEventListener('DOMContentLoaded', () => {
    const elMes = document.getElementById('filtro-mes');
    const elAno = document.getElementById('filtro-ano');

    if (elMes && elAno) {
        // Define o mês e ano atuais no select/input
        const dataAtual = new Date();
        elMes.value = dataAtual.getMonth() + 1; // getMonth é 0-11
        elAno.value = dataAtual.getFullYear();

        // Carrega as mensalidades do mês atual imediatamente
        filtrarMensalidades();
    }
});

// 1. FILTRAR MENSALIDADES POR MÊS E ANO (Padrão ao abrir a tela)
async function filtrarMensalidades() {
    const mes = document.getElementById('filtro-mes')?.value;
    const ano = document.getElementById('filtro-ano')?.value;
    const tbody = document.getElementById('tabela-mensalidades-body') || document.getElementById('tabela-mensalidades');

    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';

    try {
        const mensalidades = await apiRequest(`/mensalidades/filtrar?mes=${mes}&ano=${ano}`);
        renderizarTabelaMensalidades(mensalidades, tbody);
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao buscar mensalidades do período.</td></tr>';
    }
}

// 2. BUSCAR APENAS PENDÊNCIAS
async function carregarMensalidadesPendentes() {
    const tbody = document.getElementById('tabela-mensalidades-body') || document.getElementById('tabela-mensalidades');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';

    try {
        const mensalidades = await apiRequest('/mensalidades/pendentes');
        renderizarTabelaMensalidades(mensalidades, tbody);
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao buscar mensalidades pendentes.</td></tr>';
    }
}

// 3. BUSCA ESPECÍFICA POR ATLETA (Caso use a busca manual por ID)
async function buscarMensalidadesPorAtleta() {
    const atletaId = document.getElementById('input-atleta-id')?.value;
    const tbody = document.getElementById('tabela-mensalidades-body') || document.getElementById('tabela-mensalidades');

    if (!atletaId) {
        alert('Informe o ID do atleta para buscar!');
        return;
    }

    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';

    try {
        const mensalidades = await apiRequest(`/mensalidades/atleta/${atletaId}`);
        renderizarTabelaMensalidades(mensalidades, tbody);
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao buscar mensalidades do atleta.</td></tr>';
    }
}

// 4. FUNÇÃO AUXILIAR PARA RENDERIZAR AS LINHAS DA TABELA
function renderizarTabelaMensalidades(mensalidades, tbody) {
    tbody.innerHTML = '';

    if (!mensalidades || mensalidades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma mensalidade encontrada.</td></tr>';
        return;
    }

    mensalidades.forEach(m => {
        const tr = document.createElement('tr');
        
        // Trata o nome do Atleta vinculado
        const nomeAtleta = m.atleta ? m.atleta.nome : 'Atleta não informado';

        // Garante a comparação do status
        const statusUpper = m.status ? String(m.status).toUpperCase() : (m.pago ? 'PAGO' : 'PENDENTE');
        const isPago = statusUpper === 'PAGO' || m.pago === true;

        const statusBadge = isPago 
            ? '<span class="badge badge-paid" style="color: #22c55e;">PAGO</span>' 
            : '<span class="badge badge-pending" style="color: #ef4444;">PENDENTE</span>';

        const botaoAcao = !isPago
            ? `<button class="btn-filtro" onclick="darBaixaMensalidade(${m.id})">Baixa Manual</button>`
            : '-';

        const valorFormatado = Number(m.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        tr.innerHTML = `
            <td><strong>${nomeAtleta}</strong></td>
            <td>${m.dataVencimento || m.mesReferencia || '-'}</td>
            <td>${valorFormatado}</td>
            <td>${statusBadge}</td>
            <td>${m.dataPagamento || '-'}</td>
            <td>${botaoAcao}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 5. REGISTRAR PAGAMENTO E ATUALIZAR TABELA + DASHBOARD
async function darBaixaMensalidade(id) {
    if (!confirm('Confirmar o recebimento desta mensalidade?')) return;

    try {
        await apiRequest(`/mensalidades/${id}/pagar`, 'PUT');
        alert('Pagamento registrado com sucesso!');

        // Recarrega a tabela atual
        filtrarMensalidades();

        // 🔄 ATUALIZA O DASHBOARD AUTOMATICAMENTE SE A FUNÇÃO EXISTIR
        if (typeof carregarDashboard === 'function') {
            carregarDashboard();
        }
    } catch (error) {
        console.error('Erro ao dar baixa na mensalidade:', error);
    }
}

// 6. GERAR NOVA MENSALIDADE
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
        
        filtrarMensalidades();

        // Atualiza a dashboard caso altere o saldo pendente
        if (typeof carregarDashboard === 'function') {
            carregarDashboard();
        }
    } catch (error) {
        console.error('Erro ao gerar mensalidade:', error);
    }
}