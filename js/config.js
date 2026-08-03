const API_BASE_URL = 'http://localhost:8080/api';

async function apiRequest(endpoint, method = 'GET', body = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Erro HTTP status: ${response.status}`);
        }

        // Caso a resposta tenha conteúdo, converte para JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        
        return null;
    } catch (error) {
        console.error('Falha na API:', error);
        alert(`Atenção: ${error.message}`);
        throw error;
    }
}
