const Role = require("./role");

class MagaCirce extends Role{
    constructor(){
        super("Maga Circe", "Sei una maga, usa i tuoi poteri e fai grugnire una persona al giorno!", "contadini", 0);
    }

    act(connection, players, roles, sameRole){
        this.players = players;
        this.roles = roles;
        this.connection=connection;

        this.selezionabili = [];
        players.forEach((pl) => {
            if (roles[pl].isAlive()) {
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
        _nightActions.addAction(this.getName, username);
        io.to(this.connection).emit("magacirce_response", username);
    }

    canAct(){
        return true;
    }
    onTimeout(){
        var i = Math.floor(Math.random() * this.selezionabili.length);
        this.onResponse(this.selezionabili[i]);
    }
}

module.exports = MagaCirce;