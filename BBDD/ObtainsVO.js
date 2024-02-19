class ObtainsVO {
    constructor(obtained, Achievements_title, Players_email) {
        this.obtained = obtained;
        this.Achievements_title = Achievements_title;
        this.Players_email = Players_email;
    }

    getObtained() {
        return this.obtained;
    }

    setObtained(obtained) {
        this.obtained = obtained;
    }

    getAchievements_title() {
        return this.Achievements_title;
    }

    setAchievements_title(Achievements_title) {
        this.Achievements_title = Achievements_title;
    }

    getPlayers_email() {
        return this.Players_email;
    }

    setPlayers_email(Players_email) {
        this.Players_email = Players_email;
    }
}

module.exports = ObtainsVO;
