async function carregarDashboard() {
    try {
        const resumo = await apiRequest('/dashboard/resumo');
        if (!resumo) return;

        document.getElementById('stat-atletas').innerText = resumo.totalAtletasAtivos;
        document.getElementById('stat-eventos').innerText = resumo.totalEventosProximos;
        document.getElementById('stat-estoque').innerText = resumo.totalItensEstoque;

        const formatoMoeda = (valor) => {
            return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        document.getElementById('stat-pago').innerText = formatoMoeda(resumo.valorMensalidadesPagas);
        document.getElementById('stat-pendente').innerText = formatoMoeda(resumo.valorMensalidadesPendentes);
    } catch (error) {
        console.error('Erro ao carregar resumo do dashboard:', error);
    }
    // Executa o carregamento assim que o script for lido
document.addEventListener('DOMContentLoaded', carregarDashboard);
}