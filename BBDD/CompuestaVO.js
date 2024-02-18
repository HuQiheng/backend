class CompuestaVO {
    constructor(correoJugador, claveAccesoPartida) {
        this.correoJugador = correoJugador;
        this.claveAccesoPartida = claveAccesoPartida;
    }

    getCorreoJugador() {
        return this.correoJugador;
    }

    setCorreoJugador(correoJugador) {
        this.correoJugador = correoJugador;
    }

    getClaveAccesoPartida() {
        return this.claveAccesoPartida;
    }

    setClaveAccesoPartida(claveAccesoPartida) {
        this.claveAccesoPartida = claveAccesoPartida;
    }
}


module.exports = CompuestaVO;