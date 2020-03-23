const Role = require("./role");

class Veggente extends Role {
    constructor() {
        super("Veggente", "Tu non fai niente, per ora", "contadini", 0);
    }

    act(user, players, roles, sameRole) {
        this.players = players;
        this.roles = roles;
        this.connection=user.connection;
        this.username=user.username;

        var selezionabili = [];
        players.forEach((pl) => {
            if (roles[pl].isAlive()&&pl!=this.username) {
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