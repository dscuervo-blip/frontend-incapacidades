// Página de inicio de sesión.
document.addEventListener('DOMContentLoaded', () => {
    // Si ya hay sesión, ir directo al panel.
    if (Sesion.token()) {
        window.location.href = 'pages/dashboard.html';
        return;
    }

    const form = document.getElementById('form-login');
    const inputUsuario = document.getElementById('usuario');
    const inputContrasena = document.getElementById('contrasena');
    const boton = document.getElementById('btn-ingresar');

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        ocultarMensaje();

        // Validación en el cliente
        const usuario = inputUsuario.value.trim();
        const contrasena = inputContrasena.value;
        marcarCampo(inputUsuario, usuario ? '' : 'Ingresa tu usuario o correo.');
        marcarCampo(inputContrasena, contrasena ? '' : 'Ingresa tu contraseña.');
        if (!usuario || !contrasena) return;

        boton.disabled = true;
        boton.textContent = 'Ingresando...';

        try {
            const respuesta = await apiRequest('auth', '/login', {
                method: 'POST',
                body: { usuario, contrasena },
            });

            Sesion.guardar(respuesta.data.token, respuesta.data.usuario);
            mostrarMensaje('exito', respuesta.mensaje);
            window.location.href = 'pages/dashboard.html';
        } catch (error) {
            mostrarMensaje('error', error.message);
            inputContrasena.value = '';
            inputContrasena.focus();
        } finally {
            boton.disabled = false;
            boton.textContent = 'Ingresar';
        }
    });
});
