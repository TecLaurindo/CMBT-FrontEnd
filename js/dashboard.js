async function carregarDashboard() {
    try {
        const resumo = await apiRequest('/dashboard/resumo');
        console.log('Dados do Dashboard recebidos:', resumo);

        if (!resumo) return;

        // Atualiza contadores
        const elAtletas = document.getElementById('stat-atletas');
        const elEventos = document.getElementById('stat-eventos');
        const elEstoque = document.getElementById('stat-estoque');
        const elPago = document.getElementById('stat-pago');
        const elPendente = document.getElementById('stat-pendente');

        if (elAtletas) elAtletas.innerText = resumo.totalAtletasAtivos ?? 0;
        if (elEventos) elEventos.innerText = resumo.totalEventosProximos ?? 0;
        if (elEstoque) elEstoque.innerText = resumo.totalItensEstoque ?? 0;

        const formatoMoeda = (valor) => {
            return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        if (elPago) elPago.innerText = formatoMoeda(resumo.valorMensalidadesPagas);
        if (elPendente) elPendente.innerText = formatoMoeda(resumo.valorMensalidadesPendentes);

    } catch (error) {
        console.error('Erro ao carregar resumo do dashboard:', error);
    }
}

// Garante que carrega ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(carregarDashboard, 500);
});