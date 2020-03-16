//this class need to be completed and improved with the functions of the server.
const Role = require('./roles/role');
const Lupo = require('./roles/lupo');
const Contadino = require('./roles/contadino');
const Veggente = require('./roles/veggente');
const GuardiaDelCorpo = require('./roles/guardiaDelCorpo');

class LupusGame {
    constructor(players, connections, settings) {
        this._players = players;
        this._connections = connections;
        this._roles = [];
        this._computeRoles(settings);
        
        this._sendRoles();
    }

    _sendRoles(){
        this._players.forEach(pl=>{
            io.to(`${this._connections[pl]}`).emit('role', {
                name: this._roles[pl].getName(),
                description: this._roles[pl].getDescription(),
                color: this._roles[pl].getColor()
             });
        });
    }

    _computeRoles(settings) {
        console.log(settings);
        console.log(this._players);

        // non so se è il modo giusto per farlo, ma mi è venuto in mente di farlo così
        // creo array per assegnare ruoli
        var rolesArr = [];
        for (var i = 0; i < settings.lupi; i++)
            rolesArr.push(new Lupo());
        for (var i = 0; i < settings.contadini; i++)
            rolesArr.push(new Contadino());
        for (var i = 0; i < settings.veggente; i++)
            rolesArr.push(new Veggente());
        for (var i = 0; i < settings.gdc; i++)
            rolesArr.push(new GuardiaDelCorpo());
        //! aggiugere ruoli

        this._players.forEach(pl => {
            // get indice del ruolo
            var i = Math.floor(Math.random() * rolesArr.length);
            this._roles[pl] = rolesArr[i];  //array di Roles()
            rolesArr.splice(i, 1);
        });
        this._testAct();
    }

    _testAct() {
        console.log("Test acting:");
        this._players.forEach(player => {
            console.log("[" + player + "]");
                this._roles[player].act();
        });
    }

    runTest() {
        /*
        Temporary method used to check the dynamic-binding of roles
        */
        console.log("running the test...");
    }

    deletePlayer() {
        /*
        This method is used to delete a player due to a disconnection
        */
    }

    updateSocketID(connections) {
        /*
        This method is used to recall the socketID update
        */
       this._connections=connections;
    }
}
module.exports = LupusGame;