// Estructura común de las páginas internas: barra superior, menú lateral y cierre de sesión.
// Uso en cada página: const usuario = Layout.iniciar('empleados');
const Layout = {
    iniciar(moduloActivo) {
        if (!Sesion.requerir()) return null;

        const usuario = Sesion.usuario();
        const modulo = MODULOS.find((m) => m.id === moduloActivo);

        // Si el rol no tiene acceso al módulo, se envía al inicio.
        if (modulo && modulo.roles.length && !modulo.roles.includes(usuario.rol)) {
            window.location.replace(RAIZ + 'pages/dashboard.html');
            return null;
        }

        this.pintarBarra(usuario);
        this.pintarMenu(usuario, moduloActivo);
        this.validarSesion();

        return usuario;
    },

    pintarBarra(usuario) {
        const barra = document.getElementById('app-barra');
        barra.className = 'barra';
        barra.innerHTML = `
            <button type="button" class="barra__menu" id="btn-menu" aria-label="Abrir menú" aria-expanded="false">☰</button>
            <span class="marca">Corporate Solutions</span>
            <div class="barra__usuario">
                <span class="barra__nombre"></span>
                <span class="etiqueta"></span>
                <button type="button" id="btn-salir" class="boton boton--secundario">Cerrar sesión</button>
            </div>`;

        // textContent evita inyectar HTML con datos del usuario.
        barra.querySelector('.barra__nombre').textContent = usuario.nombre;
        barra.querySelector('.etiqueta').textContent = ROLES[usuario.rol] || usuario.rol;

        document.getElementById('btn-salir').addEventListener('click', (e) => this.cerrarSesion(e.currentTarget));
        document.getElementById('btn-menu').addEventListener('click', (e) => {
            const abierto = document.body.classList.toggle('menu-abierto');
            e.currentTarget.setAttribute('aria-expanded', String(abierto));
        });
    },

    pintarMenu(usuario, moduloActivo) {
        const menu = document.getElementById('app-menu');
        menu.className = 'menu';
        menu.setAttribute('aria-label', 'Módulos');

        const lista = document.createElement('ul');
        MODULOS
            .filter((m) => !m.roles.length || m.roles.includes(usuario.rol))
            .forEach((m) => {
                const item = document.createElement('li');
                const enlace = document.createElement('a');
                enlace.href = RAIZ + m.pagina;
                enlace.className = 'menu__enlace' + (m.id === moduloActivo ? ' menu__enlace--activo' : '');
                if (m.id === moduloActivo) enlace.setAttribute('aria-current', 'page');
                enlace.innerHTML = `<span class="menu__icono" aria-hidden="true">${m.icono}</span>`;
                enlace.append(m.titulo);
                item.appendChild(enlace);
                lista.appendChild(item);
            });

        menu.replaceChildren(lista);
    },

    // Confirma con ms-auth que el token sigue activo (si no, api.js redirige al login).
    async validarSesion() {
        try {
            await apiRequest('auth', '/sesion');
        } catch (error) {
            if (error.status !== 401) console.warn('No se pudo validar la sesión:', error.message);
        }
    },

    async cerrarSesion(boton) {
        boton.disabled = true;
        try {
            await apiRequest('auth', '/logout', { method: 'POST', redirigirSi401: false });
        } catch (error) {
            // Si el token ya no era válido, igual se cierra la sesión local.
            console.warn(error.message);
        } finally {
            Sesion.limpiar();
            window.location.href = RAIZ + 'index.html';
        }
    },
};
