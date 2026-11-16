// Verifica que cada microservicio responda en su ruta GET /
document.addEventListener('DOMContentLoaded', async () => {
    const lista = document.getElementById('estado-servicios');

    for (const [nombre, url] of Object.entries(API)) {
        const li = document.createElement('li');
        li.textContent = `${nombre}: comprobando...`;
        lista.appendChild(li);

        try {
            const data = await apiRequest(url);
            const bd = data.base_datos.conectada ? 'BD conectada' : 'BD sin conexión';
            li.textContent = `${nombre}: ${data.estado} (${bd})`;
            li.className = data.base_datos.conectada ? 'ok' : 'error';
        } catch {
            li.textContent = `${nombre}: no responde (${url})`;
            li.className = 'error';
        }
    }
});
