// Consume las APIs REST con fetch.
// Devuelve el JSON de la respuesta o lanza un Error con el mensaje del backend.
async function apiRequest(servicio, ruta, { method = 'GET', body = null } = {}) {
    const headers = { 'Accept': 'application/json' };
    const token = Sesion.token();

    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body !== null) headers['Content-Type'] = 'application/json';

    let respuesta;
    try {
        respuesta = await fetch(API[servicio] + ruta, {
            method,
            headers,
            body: body !== null ? JSON.stringify(body) : null,
        });
    } catch {
        throw new Error(`No se pudo conectar con el servicio de ${servicio}. Verifica que esté en ejecución.`);
    }

    let datos = null;
    try {
        datos = await respuesta.json();
    } catch {
        // La respuesta no es JSON
    }

    if (!respuesta.ok || !datos || datos.ok === false) {
        const error = new Error(datos?.mensaje || `Error ${respuesta.status} al consultar ${servicio}.`);
        error.status = respuesta.status;
        error.datos = datos;
        throw error;
    }

    return datos;
}
