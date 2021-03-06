const Role = require("./role");

class RoseMary extends Role {
    constructor() {
        super("Rose Mary", "Il tuo compito è quello di aiutare i lupi salvandoli dal voto!", "lupi", 1);
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

        io.to(this.connection).emit("mariarosa_response", username);
    }

    canAct() {
        //TODO!!
        return true;
    }

    onTimeout(){
        var i = Math.floor(Math.random() * this.selezionabili.length);
        this.onResponse(this.selezionabili[i]);
    }
}

module.exports = RoseMary;