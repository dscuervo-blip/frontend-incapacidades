// Inicializa una página interna que todavía no tiene lógica propia.
// El módulo activo se toma del atributo data-modulo del <body>.
document.addEventListener('DOMContentLoaded', () => {
    Layout.iniciar(document.body.dataset.modulo);
});
