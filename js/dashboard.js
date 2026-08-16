// Function principal para buscar e atualizar o resumo no DOM
async function carregarDashboard() {
    try {
        const resumo = await apiRequest('/dashboard/resumo');
        console.log('Dados do Dashboard recebidos:', resumo);

        if (!resumo) return;

        // Mapeia os elementos do HTML
        const elAtletas = document.getElementById('stat-atletas');
        const elEventos = document.getElementById('stat-eventos');
        const elEstoque = document.getElementById('stat-estoque');
        const elPago = document.getElementById('stat-pago');
        const elPendente = document.getElementById('stat-pendente');

        // Atualiza contadores de quantidade
        if (elAtletas) elAtletas.innerText = resumo.totalAtletasAtivos ?? 0;
        if (elEventos) elEventos.innerText = resumo.totalEventosProximos ?? 0;
        if (elEstoque) elEstoque.innerText = resumo.totalItensEstoque ?? 0;

        // Formata os valores monetários em R$ (BRL)
        const formatoMoeda = (valor) => {
            return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        if (elPago) elPago.innerText = formatoMoeda(resumo.valorMensalidadesPagas);
        if (elPendente) elPendente.innerText = formatoMoeda(resumo.valorMensalidadesPendentes);

    } catch (error) {
        console.error('Erro ao carregar resumo do dashboard:', error);
    }
}

// Executa automaticamente assim que a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    carregarDashboard();
});