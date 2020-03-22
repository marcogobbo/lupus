const Role = require("./role");

class Veggente extends Role{
    constructor(){
        super("Veggente", "Tu non fai niente, per ora", "contadini", 0);
    }

    act(connection, players, roles, sameRole){
        this.players=players;
        this.roles=roles;

        console.log("Acting Like a VEGGENTE(in inglese). Yeah!");
        var selezionabili=[];
        players.forEach((pl) => {
            if (roles[pl].isAlive()) {
                selezionabili.push(pl);
            }
        });
        var array = [];
        players.forEach((pl, i) => {
            array[i] = selezionabili.includes(pl);
        });

        io.to(connection).emit("act", true, 'night', array);
    }

    onResponse(username){
        //_nightActions.addAction(this.getName, username);
        var r_color=this.roles[username].getColor();
        io.to(connection).emit("veggente_response", r_color);
    }

    canAct(){
        //TODO!!
        // if(_nightActions.getNightCount()==1)
        //     return false;
        // return true;
        return true;
    }
}

module.exports = Veggente;