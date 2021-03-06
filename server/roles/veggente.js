const Role = require("./role");

class Veggente extends Role {
    constructor() {
        super("Veggente", "Tu non fai niente, per ora", "contadini", 0);
    }

    act(user, players, roles, sameRole) {
        this.players = players;
        this.roles = roles;
        this.connection = user.connection;
        this.username = user.username;

        this.selezionabili = [];
        players.forEach((pl) => {
            if (roles[pl].isAlive() && pl != this.username) {
                this.selezionabili.push(pl);
            }
        });
        var array = [];
        players.forEach((pl, i) => {
            array[i] = this.selezionabili.includes(pl);
        });

        io.to(this.connection).emit("control_selection", true, 'night', array);
    }

    onResponse(username) {
        _nightActions.addAction(this.getName(), username);
        var r_color = this.roles[username].getColor();
        //console.log(r_color)
        io.to(this.connection).emit("veggente_response", username, r_color);
    }

    canAct() {
        return true;
    }

    onTimeout(){
        var i = Math.floor(Math.random() * this.selezionabili.length);
        this.onResponse(this.selezionabili[i]);
    }
}

module.exports = Veggente;