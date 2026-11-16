# frontend-incapacidades

Frontend del Sistema Web de Gestión de Incapacidades Médicas, hecho con HTML5, CSS3 y JavaScript Vanilla. Consume por `fetch` las APIs REST de los microservicios del backend.

## Estructura

```
index.html      Inicio de sesión
css/            Estilos
js/config.js    URLs de los microservicios
js/api.js       Función apiRequest() para consumir las APIs
js/sesion.js    Manejo del token de sesión (sessionStorage)
js/ui.js        Mensajes y validación visual de formularios
js/login.js     Página de inicio de sesión
js/dashboard.js Panel principal
pages/          Módulos de la aplicación
```

## Ejecución

1. Levanta los 4 microservicios del backend (puertos 8001 a 8004, en 127.0.0.1).
2. Abre `index.html` en el navegador o sírvelo con `php -S 127.0.0.1:5500`.
