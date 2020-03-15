//this class need to be completed and improved with the functions of the server.
const Role = require('./roles/role');
const Lupo = require('./roles/lupo');
const Contadino = require('./roles/contadino');
const Veggente = require('./roles/veggente');
const GuardiaDelCorpo = require('./roles/guardiaDelCorpo');

class LupusGame {
    constructor(players, connections, settings) {
        // this._players=[];
        // for(var i=0;i<players.length;i++){
        //     this._players[i]=players[i];
        // }
        this._players = players;
        this._connections = connections;
        this._roles = [];
        this._computeRoles(settings);
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
            //console.log(i,this._roles);

            rolesArr.splice(i, 1);
        });
        // this._roles.splice(0, 1);
        //console.log("finale",this._roles);
        this._testActInTiming("day");
        this._testActInTiming("night");
    }

    _testActInTiming(curTiming) {
        console.log("Whose playing during '" + curTiming + "'?");
        this._players.forEach(player => {
            if (this._roles[player].checkTiming(curTiming)) {
                console.log("[" + player + "]");
                this._roles[player].act();
            }
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

    updateSocketID(username) {
        /*
        This method is used to recall the socketID update
        */
    }
}
module.exports = LupusGame;