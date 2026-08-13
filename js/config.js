const API_BASE_URL = 'http://localhost:8080/api';

async function apiRequest(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    // Adiciona o Token JWT no cabeçalho se existir
    const token = localStorage.getItem('caimbe_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (response.status === 401 || response.status === 403) {
            if (!endpoint.includes('/auth/login')) {
                realizarLogout();
            }
        }

        if (response.status === 204) {
            return null;
        }

        const json = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error((json && json.message) || `Erro HTTP: ${response.status}`);
        }

        return json;
    } catch (error) {
        console.error('Erro na requisição API:', error);
        throw error;
    }
}
