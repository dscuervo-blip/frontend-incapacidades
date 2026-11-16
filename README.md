# frontend-incapacidades

Frontend del Sistema Web de Gestión de Incapacidades Médicas, hecho con HTML5, CSS3 y JavaScript Vanilla. Consume por `fetch` las APIs REST de los microservicios del backend.

## Estructura

```
index.html      Página de inicio
css/            Estilos
js/config.js    URLs de los microservicios
js/api.js       Función apiRequest() para consumir las APIs
js/app.js       Lógica de la página de inicio
pages/          Módulos de la aplicación
```

## Ejecución

1. Levanta los 4 microservicios del backend (puertos 8001 a 8004).
2. Abre `index.html` en el navegador o sírvelo con `php -S localhost:5500`.
