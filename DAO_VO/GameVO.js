class GameVO {
    constructor(accessKey, ranking, date) {
        this.accessKey = accessKey;
        this.ranking = ranking;
        this.date = date;
    }

    getAccessKey() {
        return this.accessKey;
    }

    setAccessKey(accessKey) {
        this.accessKey = accessKey;
    }

    getRanking() {
        return this.ranking;
    }

    setRanking(ranking) {
        this.ranking = ranking;
    }

    getDate() {
        return this.date;
    }

    setDate(date) {
        this.date = date;
    }
}

module.exports = GameVO;