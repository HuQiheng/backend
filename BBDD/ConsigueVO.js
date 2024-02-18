class ConsigueVO {
    constructor(obtenido, tituloLogro, correoJugador) {
        this.obtenido = obtenido;
        this.tituloLogro = tituloLogro;
        this.correoJugador = correoJugador;
    }

    getObtenido() {
        return this.obtenido;
    }

    setObtenido(obtenido) {
        this.obtenido = obtenido;
    }

    getTituloLogro() {
        return this.tituloLogro;
    }

    setTituloLogro(tituloLogro) {
        this.tituloLogro = tituloLogro;
    }

    getCorreoJugador() {
        return this.correoJugador;
    }

    setCorreoJugador(correoJugador) {
        this.correoJugador = correoJugador;
    }
}

module.exports = ConsigueVO;