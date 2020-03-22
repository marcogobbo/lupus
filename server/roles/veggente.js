const Role = require("./role");

class Veggente extends Role {
    constructor() {
        super("Veggente", "Tu non fai niente, per ora", "contadini", 0);
    }

    act(connection, players, roles, sameRole) {
        this.players = players;
        this.roles = roles;
        this.connection=connection;

        var selezionabili = [];
        players.forEach((pl) => {
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
        //_nightActions.addAction(this.getName, username);
        var r_color = this.roles[username].getColor();
        console.log(r_color)
        io.to(this.connection).emit("veggente_response", r_color);
    }

    canAct() {
        //TODO!!
        // if(_nightActions.getNightCount()==1)
        //     return false;
        // return true;
        return true;
    }
}

module.exports = Veggente;