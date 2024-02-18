class JugadorVO {
    constructor(correo, nombreUsuario, contrasenya) {
        this.correo = correo;
        this.nombreUsuario = nombreUsuario;
        this.contrasenya = contrasenya;
    }

    getCorreo() {
        return this.correo;
    }

    setCorreo(correo) {
        this.correo = correo;
    }

    getNombreUsuario() {
        return this.nombreUsuario;
    }

    setNombreUsuario(nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    getContrasenya() {
        return this.contrasenya;
    }

    setContrasenya(contrasenya) {
        this.contrasenya = contrasenya;
    }
}

module.exports = JugadorVO;