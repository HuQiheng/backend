class FriendVO {
    constructor(Player_email1, Player_email2) {
        this.Player_email1 = Player_email1;
        this.Player_email2 = Player_email2;
    }

    getPlayer_email1() {
        return this.Player_email1;
    }

    setPlayer_email1(Player_email1) {
        this.Player_email1 = Player_email1;
    }

    getPlayer_email2() {
        return this.Player_email2;
    }

    setPlayer_email2(Player_email2) {
        this.Player_email2 = Player_email2;
    }
}

module.exports = FriendVO;
