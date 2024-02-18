class PartidaVO {
    constructor(claveAcceso, ranking, fecha) {
        this.claveAcceso = claveAcceso;
        this.ranking = ranking;
        this.fecha = fecha;
    }

    getClaveAcceso() {
        return this.claveAcceso;
    }

    setClaveAcceso(claveAcceso) {
        this.claveAcceso = claveAcceso;
    }

    getRanking() {
        return this.ranking;
    }

    setRanking(ranking) {
        this.ranking = ranking;
    }

    getFecha() {
        return this.fecha;
    }

    setFecha(fecha) {
        this.fecha = fecha;
    }
}

module.exports = PartidaVO;