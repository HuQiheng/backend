class CompoundVO {
    constructor(Players_email, Games_accessKey) {
        this.Players_email = Players_email;
        this.Games_accessKey = Games_accessKey;
    }

    getPlayers_email() {
        return this.Players_email;
    }

    setPlayers_email(Players_email) {
        this.Players_email = Players_email;
    }

    getGames_accessKey() {
        return this.Games_accessKey;
    }

    setGames_accessKey(Games_accessKey) {
        this.Games_accessKey = Games_accessKey;
    }
}

module.exports = CompoundVO;
