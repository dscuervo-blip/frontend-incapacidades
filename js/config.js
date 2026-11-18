// URLs base de cada microservicio.
// Se usa 127.0.0.1 en lugar de localhost para evitar la demora de IPv6 en Windows.
const API = {
    auth:          'http://127.0.0.1:8001',
    empleados:     'http://127.0.0.1:8002',
    incapacidades: 'http://127.0.0.1:8003',
    seguimiento:   'http://127.0.0.1:8004',
};

// Nombres visibles de los roles
const ROLES = {
    administrador:  'Administrador',
    gestion_humana: 'Gestión Humana',
    empleado:       'Empleado',
};

// Ruta relativa a la raíz del frontend (las páginas internas están en /pages).
const RAIZ = window.location.pathname.includes('/pages/') ? '../' : '';

// Módulos del menú principal. "roles" vacío = visible para cualquier usuario autenticado.
const MODULOS = [
    { id: 'inicio',        titulo: 'Inicio',        icono: '⌂', pagina: 'pages/dashboard.html',     roles: [] },
    { id: 'empleados',     titulo: 'Empleados',     icono: '👥', pagina: 'pages/empleados.html',     roles: ['administrador', 'gestion_humana'] },
    { id: 'incapacidades', titulo: 'Incapacidades', icono: '🩺', pagina: 'pages/incapacidades.html', roles: ['administrador', 'gestion_humana'] },
    { id: 'seguimiento',   titulo: 'Seguimiento',   icono: '📋', pagina: 'pages/seguimiento.html',   roles: ['administrador', 'gestion_humana'] },
];
