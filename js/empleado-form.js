// Formulario dinámico para crear y editar empleados.
const FormularioEmpleado = {
    empleadoId: null,
    alGuardar: null,

    iniciar(alGuardar) {
        this.alGuardar = alGuardar;
        this.dialogo = document.getElementById('dialogo-formulario');
        this.form = document.getElementById('form-empleado');
        this.boton = document.getElementById('btn-guardar');

        prepararDialogo(this.dialogo);

        // La fecha de ingreso no puede ser futura.
        this.form.fecha_ingreso.max = hoyIso();

        this.form.addEventListener('submit', (evento) => {
            evento.preventDefault();
            this.guardar();
        });

        // Quita el error de un campo cuando el usuario lo corrige.
        this.form.addEventListener('input', (evento) => {
            if (evento.target.closest('.campo--invalido')) marcarCampo(evento.target, '');
        });
    },

    // Sin empleado: modo crear. Con empleado: modo editar con los datos cargados.
    abrir(empleado = null) {
        this.empleadoId = empleado ? empleado.id : null;
        this.form.reset();
        this.limpiarErrores();
        document.getElementById('formulario-mensaje').hidden = true;

        document.getElementById('formulario-titulo').textContent = empleado
            ? `Editar a ${empleado.nombres} ${empleado.apellidos}`
            : 'Nuevo empleado';
        document.getElementById('campo-estado').hidden = !empleado;

        if (empleado) {
            ['nombres', 'apellidos', 'documento', 'correo', 'telefono', 'cargo', 'area', 'fecha_ingreso', 'estado']
                .forEach((campo) => { this.form[campo].value = empleado[campo] ?? ''; });
        }

        this.dialogo.showModal();
        this.form.nombres.focus();
    },

    leerDatos() {
        const datos = Object.fromEntries(new FormData(this.form).entries());
        Object.keys(datos).forEach((clave) => { datos[clave] = String(datos[clave]).trim(); });
        if (!this.empleadoId) delete datos.estado;
        return datos;
    },

    // Validación en el cliente (el backend vuelve a validar todo).
    validar(datos) {
        const errores = {};
        const obligatorios = {
            nombres: 'Ingresa los nombres.',
            apellidos: 'Ingresa los apellidos.',
            documento: 'Ingresa el documento.',
            correo: 'Ingresa el correo.',
            telefono: 'Ingresa el teléfono.',
            fecha_ingreso: 'Selecciona la fecha de ingreso.',
            cargo: 'Ingresa el cargo.',
            area: 'Ingresa el área.',
        };

        Object.entries(obligatorios).forEach(([campo, mensaje]) => {
            if (!datos[campo]) errores[campo] = mensaje;
        });

        if (datos.documento && !/^\d{5,30}$/.test(datos.documento)) {
            errores.documento = 'Solo números, mínimo 5 dígitos.';
        }
        if (datos.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
            errores.correo = 'El correo no tiene un formato válido.';
        }
        if (datos.telefono && !/^\+?[\d\s-]{7,20}$/.test(datos.telefono)) {
            errores.telefono = 'Entre 7 y 20 dígitos.';
        }
        if (datos.fecha_ingreso && datos.fecha_ingreso > hoyIso()) {
            errores.fecha_ingreso = 'La fecha de ingreso no puede ser futura.';
        }

        return errores;
    },

    mostrarErrores(errores) {
        this.limpiarErrores();
        Object.entries(errores).forEach(([campo, mensaje]) => {
            if (this.form[campo]) marcarCampo(this.form[campo], mensaje);
        });
        const primero = Object.keys(errores).find((campo) => this.form[campo]);
        if (primero) this.form[primero].focus();
    },

    limpiarErrores() {
        this.form.querySelectorAll('.campo').forEach((campo) => {
            campo.classList.remove('campo--invalido');
            campo.querySelector('.campo__error').textContent = '';
        });
    },

    async guardar() {
        const datos = this.leerDatos();
        const caja = document.getElementById('formulario-mensaje');
        caja.hidden = true;

        const errores = this.validar(datos);
        if (Object.keys(errores).length) {
            this.mostrarErrores(errores);
            return;
        }

        this.boton.disabled = true;
        this.boton.textContent = 'Guardando...';

        try {
            const respuesta = this.empleadoId
                ? await apiRequest('empleados', `/empleados/${this.empleadoId}`, { method: 'PUT', body: datos })
                : await apiRequest('empleados', '/empleados', { method: 'POST', body: datos });

            this.dialogo.close();
            mostrarMensaje('exito', respuesta.mensaje);
            if (this.alGuardar) this.alGuardar(respuesta.data);
        } catch (error) {
            // Errores por campo devueltos por el backend (por ejemplo, documento duplicado).
            if (error.datos?.data?.errores) this.mostrarErrores(error.datos.data.errores);
            caja.textContent = error.message;
            caja.className = 'mensaje mensaje--error';
            caja.hidden = false;
        } finally {
            this.boton.disabled = false;
            this.boton.textContent = 'Guardar';
        }
    },
};

// Fecha de hoy en formato AAAA-MM-DD según la hora local.
function hoyIso() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}
