// Utilidades de interfaz compartidas.
function mostrarMensaje(tipo, texto) {
    const caja = document.getElementById('mensaje');
    if (!caja) return;
    caja.textContent = texto;
    caja.className = `mensaje mensaje--${tipo}`;
    caja.hidden = false;
}

function ocultarMensaje() {
    const caja = document.getElementById('mensaje');
    if (caja) caja.hidden = true;
}

function marcarCampo(input, mensajeError) {
    const campo = input.closest('.campo');
    campo.classList.toggle('campo--invalido', Boolean(mensajeError));
    campo.querySelector('.campo__error').textContent = mensajeError || '';
}
