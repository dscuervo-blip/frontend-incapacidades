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

    // Cierra la sesión local y vuelve al login mostrando un aviso.
    expirar(mensaje) {
        this.limpiar();
        sessionStorage.setItem('aviso_login', mensaje);
        window.location.href = RAIZ + 'index.html';
    },

    // Devuelve (y borra) el aviso pendiente para mostrar en el login.
    tomarAviso() {
        const aviso = sessionStorage.getItem('aviso_login');
        sessionStorage.removeItem('aviso_login');
        return aviso;
    },

    // Protege una página: si no hay sesión, redirige al login.
    requerir() {
        if (!this.token() || !this.usuario()) {
            window.location.replace(RAIZ + 'index.html');
            return false;
        }
        return true;
    },
};
