class AmigoVO {
    constructor(correoJugador1, correoJugador2) {
        this.correoJugador1 = correoJugador1;
        this.correoJugador2 = correoJugador2;
    }

    getCorreoJugador1() {
        return this.correoJugador1;
    }

    setCorreoJugador1(correoJugador1) {
        this.correoJugador1 = correoJugador1;
    }

    getCorreoJugador2() {
        return this.correoJugador2;
    }

    setCorreoJugador2(correoJugador2) {
        this.correoJugador2 = correoJugador2;
    }
}

module.exports = AmigoVO;