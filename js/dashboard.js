// Panel principal.
const DESCRIPCIONES = {
    empleados:     'Registra, edita y consulta la información de los empleados.',
    incapacidades: 'Registra incapacidades médicas y controla su estado.',
    seguimiento:   'Consulta el historial y registra el seguimiento administrativo.',
};

const SERVICIOS = [
    { id: 'auth',          nombre: 'Autenticación' },
    { id: 'empleados',     nombre: 'Empleados' },
    { id: 'incapacidades', nombre: 'Incapacidades' },
    { id: 'seguimiento',   nombre: 'Seguimiento' },
];

document.addEventListener('DOMContentLoaded', () => {
    const usuario = Layout.iniciar('inicio');
    if (!usuario) return;

    document.getElementById('saludo').textContent = `Bienvenido, ${usuario.nombre}`;

    pintarAccesos(usuario);
    revisarServicios();
});

function pintarAccesos(usuario) {
    const contenedor = document.getElementById('accesos');

    MODULOS
        .filter((m) => m.id !== 'inicio')
        .filter((m) => !m.roles.length || m.roles.includes(usuario.rol))
        .forEach((m) => {
            const tarjeta = document.createElement('a');
            tarjeta.href = RAIZ + m.pagina;
            tarjeta.className = 'tarjeta tarjeta--enlace';

            const icono = document.createElement('span');
            icono.className = 'tarjeta__icono';
            icono.setAttribute('aria-hidden', 'true');
            icono.textContent = m.icono;

            const titulo = document.createElement('h2');
            titulo.textContent = m.titulo;

            const texto = document.createElement('p');
            texto.textContent = DESCRIPCIONES[m.id] || '';

            tarjeta.append(icono, titulo, texto);
            contenedor.appendChild(tarjeta);
        });
}

// Consulta GET /sesion en cada microservicio para comprobar que está activo y acepta el token.
function revisarServicios() {
    const lista = document.getElementById('estado-servicios');

    SERVICIOS.forEach(async (servicio) => {
        const item = document.createElement('li');
        item.className = 'estado-servicios__item';
        item.innerHTML = '<span class="punto punto--pendiente" aria-hidden="true"></span><span class="estado-servicios__nombre"></span><span class="estado-servicios__texto">Comprobando...</span>';
        item.querySelector('.estado-servicios__nombre').textContent = servicio.nombre;
        lista.appendChild(item);

        const punto = item.querySelector('.punto');
        const texto = item.querySelector('.estado-servicios__texto');

        try {
            await apiRequest(servicio.id, '/sesion');
            punto.className = 'punto punto--ok';
            texto.textContent = 'Conectado';
        } catch (error) {
            punto.className = 'punto punto--error';
            texto.textContent = error.status ? error.message : 'Sin conexión';
        }
    });
}
