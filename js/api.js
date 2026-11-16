// Utilidad para hacer peticiones a los microservicios con fetch.
async function apiRequest(baseUrl, path = '/', options = {}) {
    const response = await fetch(baseUrl + path, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
}
