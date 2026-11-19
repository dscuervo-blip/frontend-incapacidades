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

// Crea un elemento con clase y texto (el texto siempre se asigna con textContent).
function crearElemento(etiqueta, clase = '', texto = '') {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== '' && texto !== null && texto !== undefined) elemento.textContent = texto;
    return elemento;
}

// Insignia de estado con color (activo, inactivo, registrada, aprobada, etc.).
function crearInsignia(estado, etiqueta) {
    return crearElemento('span', `insignia insignia--${estado}`, etiqueta || estado);
}

// Fila de la tabla que ocupa todas las columnas (cargando, vacío, error).
function filaMensaje(tbody, columnas, texto, clase = '') {
    const fila = document.createElement('tr');
    const celda = crearElemento('td', `tabla__vacio ${clase}`.trim(), texto);
    celda.colSpan = columnas;
    fila.appendChild(celda);
    tbody.replaceChildren(fila);
}

// "2024-01-15" -> "15/01/2024" sin conversión de zona horaria.
function formatearFecha(fechaIso) {
    if (!fechaIso) return '';
    const [anio, mes, dia] = fechaIso.slice(0, 10).split('-');
    return `${dia}/${mes}/${anio}`;
}

// Ejecuta la función cuando el usuario deja de escribir.
function retrasar(funcion, espera = 350) {
    let temporizador;
    return (...args) => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => funcion(...args), espera);
    };
}

// Cierra un <dialog> con los botones marcados con data-cerrar o al hacer clic fuera.
function prepararDialogo(dialogo) {
    dialogo.querySelectorAll('[data-cerrar]').forEach((boton) => {
        boton.addEventListener('click', () => dialogo.close());
    });
    dialogo.addEventListener('click', (evento) => {
        if (evento.target === dialogo) dialogo.close();
    });
}
