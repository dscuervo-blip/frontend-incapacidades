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
