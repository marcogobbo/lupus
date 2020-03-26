const Role = require("./role");

class Medium extends Role {
    constructor() {
        super("Medium", "Conoscerai il ruolo di chi è venuto a mancare durante il ballottaggio", "contadini", 0);
    }

    act(user, players, roles, sameRole, lastDeadPlayer) {

        this.players = players;
        this.roles = roles;
        this.connection = user.connection;
        this.username = user.username;

        if (lastDeadPlayer != null) {
            console.log('index dead', lastDeadPlayer.player)
            if (lastDeadPlayer.time == 'day') {
                var r_color = this.roles[this.players[lastDeadPlayer.player]].getColor();
                //console.log(r_color)
                io.to(this.connection).emit("medium_response", this.players[lastDeadPlayer.player], r_color);
            }
        }
    }

    canAct() {
        if (_nightActions.getNightCount() == 0)
            return false;
        return true;
    }
}

module.exports = Medium;