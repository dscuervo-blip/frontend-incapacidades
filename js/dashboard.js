// Panel principal: requiere sesión iniciada.
document.addEventListener('DOMContentLoaded', () => {
    const usuario = Sesion.usuario();

    if (!Sesion.token() || !usuario) {
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('usuario-nombre').textContent = usuario.nombre;
    document.getElementById('usuario-rol').textContent = ROLES[usuario.rol] || usuario.rol;
    document.getElementById('saludo').textContent = `Bienvenido, ${usuario.nombre}`;

    const botonSalir = document.getElementById('btn-salir');

    botonSalir.addEventListener('click', async () => {
        botonSalir.disabled = true;
        try {
            await apiRequest('auth', '/logout', { method: 'POST' });
        } catch (error) {
            // Si el token ya no era válido, igual se cierra la sesión local.
            console.warn(error.message);
        } finally {
            Sesion.limpiar();
            window.location.href = '../index.html';
        }
    });
});
