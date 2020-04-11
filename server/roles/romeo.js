const Role = require("./role");

class Romeo extends Role {
    constructor() {
        super("Romeo", "Oh, Romeo Romeo, scegli la tua Giulietta e unitevi insieme fino alla morte: se vieni indicato dai Lupi, Giulietta muore con te.", "contadini", 0);
    }

    act(user, players, roles, sameRole) {
        this.players = players;
        this.roles = roles;
        this.connection = user.connection;
        this.username = user.username;

        this.giulietta_selected = false;

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

    canAct() {
        return !this.giulietta_selected;
    }

    onResponse(username) {
        
        _nightActions.addAction(this.getName(), username);
        io.to(this.connection).emit("romeo_response", username, this.players.indexOf(username));

        //quando ho deciso chi è la mia giulietta, non posso più scegliere
        this.giulietta_selected = true;
    }

    onTimeout() {
        var i = Math.floor(Math.random() * this.selezionabili.length);
        this.onResponse(this.selezionabili[i]);
    }
}

module.exports = Romeo;