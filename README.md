# frontend-incapacidades

Frontend del Sistema Web de Gestión de Incapacidades Médicas, hecho con HTML5, CSS3 y JavaScript Vanilla. Consume por `fetch` las APIs REST de los microservicios del backend.

## Estructura

```
index.html      Inicio de sesión
css/            Estilos
js/config.js    URLs de los microservicios
js/api.js       Función apiRequest() para consumir las APIs
js/sesion.js    Manejo del token de sesión (sessionStorage) y protección de páginas
js/ui.js        Mensajes y validación visual de formularios
js/layout.js    Barra superior, menú de módulos y cierre de sesión
js/login.js     Página de inicio de sesión
js/dashboard.js Panel principal y estado de los servicios
js/pagina.js    Inicialización de páginas sin lógica propia
pages/          Módulos de la aplicación (inicio, empleados, incapacidades, seguimiento)
```

## Sesión

- El token se guarda en `sessionStorage` y se envía en cada petición como `Authorization: Bearer <token>`.
- Las páginas internas redirigen al login si no hay sesión.
- Si un servicio responde 401 (token inválido o sesión cerrada), se limpia la sesión y se vuelve al login con un aviso.

## Ejecución

1. Levanta los 4 microservicios del backend (puertos 8001 a 8004, en 127.0.0.1).
2. Abre `index.html` en el navegador o sírvelo con `php -S 127.0.0.1:5500`.
