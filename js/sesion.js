// Manejo de la sesión en el navegador (sessionStorage).
const Sesion = {
    CLAVE: 'sesion_incapacidades',

    guardar(token, usuario) {
        sessionStorage.setItem(this.CLAVE, JSON.stringify({ token, usuario }));
    },

    obtener() {
        try {
            return JSON.parse(sessionStorage.getItem(this.CLAVE));
        } catch {
            return null;
        }
    },

    token() {
        const sesion = this.obtener();
        return sesion ? sesion.token : null;
    },

    usuario() {
        const sesion = this.obtener();
        return sesion ? sesion.usuario : null;
    },

    limpiar() {
        sessionStorage.removeItem(this.CLAVE);
    },
};
