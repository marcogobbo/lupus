const Role = require("./role");

class GuardiaDelCorpo extends Role {
    constructor() {
        super("Guardia Del Corpo", "Tu non fai niente, per ora", "contadini", 0);
    }

    act(user, players, roles, sameRole) {
        this.players = players;
        this.roles = roles;
        this.connection = user.connection;
        this.username = user.username;

        var selezionabili = [];
        players.forEach((pl) => {
            if (roles[pl].isAlive() && pl != this.username) {
                selezionabili.push(pl);
            }
        });
        var array = [];
        players.forEach((pl, i) => {
            array[i] = selezionabili.includes(pl);
        });

        io.to(this.connection).emit("control_selection", true, 'night', array);
    }

    canAct() {
        return true;
    }

    onResponse(username) {
        _nightActions.addAction(this.getName(), username);
        io.to(this.connection).emit("guardia_response", username);
    }
}

module.exports = GuardiaDelCorpo;