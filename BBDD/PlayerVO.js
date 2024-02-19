class PlayerVO {
    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = username;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }
}

module.exports = PlayerVO;
