// Módulo de empleados: listado con filtros y detalle.
const COLUMNAS_EMPLEADOS = 7;
const ESTADOS_EMPLEADO = { activo: 'Activo', inactivo: 'Inactivo' };

let consultaActual = 0; // evita pintar respuestas viejas si el usuario filtra rápido

document.addEventListener('DOMContentLoaded', () => {
    if (!Layout.iniciar('empleados')) return;

    const form = document.getElementById('form-filtros');
    const recargar = retrasar(cargarEmpleados);

    form.addEventListener('input', (evento) => {
        if (evento.target.matches('input')) recargar();
    });
    form.addEventListener('change', (evento) => {
        if (evento.target.matches('select')) cargarEmpleados();
    });
    form.addEventListener('reset', () => setTimeout(cargarEmpleados));
    form.addEventListener('submit', (evento) => evento.preventDefault());

    prepararDialogo(document.getElementById('dialogo-detalle'));

    cargarAreas();
    cargarEmpleados();
});

function leerFiltros() {
    const datos = new FormData(document.getElementById('form-filtros'));
    const parametros = new URLSearchParams();

    for (const [clave, valor] of datos.entries()) {
        const texto = String(valor).trim();
        if (texto) parametros.set(clave, texto);
    }

    return parametros;
}

async function cargarAreas() {
    try {
        const respuesta = await apiRequest('empleados', '/empleados/areas');
        const select = document.getElementById('filtro-area');
        respuesta.data.forEach((area) => {
            const opcion = crearElemento('option', '', area);
            opcion.value = area;
            select.appendChild(opcion);
        });
    } catch (error) {
        console.warn('No se pudieron cargar las áreas:', error.message);
    }
}

async function cargarEmpleados() {
    const tbody = document.getElementById('tabla-empleados');
    const total = document.getElementById('total-empleados');
    const numero = ++consultaActual;

    // Validación básica en el cliente: el documento solo admite números.
    const documento = document.getElementById('filtro-documento');
    if (/\D/.test(documento.value.trim())) {
        filaMensaje(tbody, COLUMNAS_EMPLEADOS, 'El documento solo debe contener números.', 'tabla__vacio--error');
        total.textContent = '';
        return;
    }

    filaMensaje(tbody, COLUMNAS_EMPLEADOS, 'Cargando empleados...');
    ocultarMensaje();

    try {
        const parametros = leerFiltros().toString();
        const respuesta = await apiRequest('empleados', '/empleados' + (parametros ? `?${parametros}` : ''));
        if (numero !== consultaActual) return;

        const { empleados } = respuesta.data;
        total.textContent = `${empleados.length} ${empleados.length === 1 ? 'empleado' : 'empleados'}`;

        if (!empleados.length) {
            filaMensaje(tbody, COLUMNAS_EMPLEADOS, respuesta.mensaje);
            return;
        }

        tbody.replaceChildren(...empleados.map(crearFilaEmpleado));
    } catch (error) {
        if (numero !== consultaActual) return;
        total.textContent = '';
        filaMensaje(tbody, COLUMNAS_EMPLEADOS, 'No se pudo cargar el listado.', 'tabla__vacio--error');
        mostrarMensaje('error', error.message);
    }
}

function crearFilaEmpleado(empleado) {
    const fila = document.createElement('tr');

    const celdaNombre = document.createElement('td');
    celdaNombre.append(
        crearElemento('strong', 'tabla__principal', `${empleado.nombres} ${empleado.apellidos}`),
        crearElemento('span', 'tabla__secundario', empleado.correo),
    );

    const celdaEstado = document.createElement('td');
    celdaEstado.appendChild(crearInsignia(empleado.estado, ESTADOS_EMPLEADO[empleado.estado]));

    const celdaAcciones = crearElemento('td', 'tabla__acciones');
    const botonVer = crearElemento('button', 'boton boton--secundario boton--pequeno', 'Ver');
    botonVer.type = 'button';
    botonVer.setAttribute('aria-label', `Ver detalle de ${empleado.nombres} ${empleado.apellidos}`);
    botonVer.addEventListener('click', () => verDetalle(empleado.id));
    celdaAcciones.appendChild(botonVer);

    fila.append(
        celdaNombre,
        crearElemento('td', '', empleado.documento),
        crearElemento('td', '', empleado.cargo),
        crearElemento('td', '', empleado.area),
        crearElemento('td', '', formatearFecha(empleado.fecha_ingreso)),
        celdaEstado,
        celdaAcciones,
    );

    return fila;
}

async function verDetalle(id) {
    const dialogo = document.getElementById('dialogo-detalle');
    const contenido = document.getElementById('detalle-contenido');

    contenido.replaceChildren(crearElemento('p', '', 'Cargando...'));
    dialogo.showModal();

    try {
        const { data: empleado } = await apiRequest('empleados', `/empleados/${id}`);

        const campos = [
            ['Nombres', empleado.nombres],
            ['Apellidos', empleado.apellidos],
            ['Documento', empleado.documento],
            ['Correo', empleado.correo],
            ['Teléfono', empleado.telefono],
            ['Cargo', empleado.cargo],
            ['Área', empleado.area],
            ['Fecha de ingreso', formatearFecha(empleado.fecha_ingreso)],
        ];

        const elementos = campos.flatMap(([titulo, valor]) => [
            crearElemento('dt', '', titulo),
            crearElemento('dd', '', valor),
        ]);

        const estado = document.createElement('dd');
        estado.appendChild(crearInsignia(empleado.estado, ESTADOS_EMPLEADO[empleado.estado]));
        elementos.push(crearElemento('dt', '', 'Estado'), estado);

        contenido.replaceChildren(...elementos);
    } catch (error) {
        contenido.replaceChildren(crearElemento('p', 'mensaje mensaje--error', error.message));
    }
}
