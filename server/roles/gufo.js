const Role = require("./role");

class Gufo extends Role {
    constructor() {
        super("Gufo", "Sei un contadino, il tuo compito è gufare, mandi direttamente al ballottaggio i giocatori.", "contadini", 0);
    }

    act(user, players, roles, sameRole) {
        this.players = players;
        this.roles = roles;
        this.connection = user.connection;
        this.username = user.username;

        var selezionabili = [];
        players.forEach((pl) => {
            // if (roles[pl].isAlive() && pl != this.username) {
            if (roles[pl].isAlive()) {
                selezionabili.push(pl);
            }
        });
        var array = [];
        players.forEach((pl, i) => {
            array[i] = selezionabili.includes(pl);
        });

        io.to(this.connection).emit("control_selection", true, 'night', array);
    }

    onResponse(username) {
        _nightActions.addAction(this.getName(), username);

        io.to(this.connection).emit("gufo_response", username);
    }

    canAct() {
        //TODO!!
        return true;
    }
}

module.exports = Gufo;