//this class need to be completed and improved with the functions of the server.
const Role = require('./roles/role');
const Lupo = require('./roles/lupo');
const Contadino = require('./roles/contadino');
const Veggente = require('./roles/veggente');
const Medium = require('./roles/medium');
const GuardiaDelCorpo = require('./roles/guardiaDelCorpo');
const Gufo = require('./roles/gufo');
const Romeo = require('./roles/romeo');
const RoseMary = require('./roles/roseMary');
const Scemo = require('./roles/scemo');
const Massone = require('./roles/massone');
const MagaCirce = require('./roles/magaCirce');

class LupusGame {
    constructor(players, connections, settings) {
        this._players = players;
        this._connections = connections;
        this._roles = [];
        this._computeRoles(settings);
        this._sendRoles();

        this._time = 'day';
        this._vote = [];
    }

    _sendRoles() {
        this._players.forEach(pl => {
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

    _enableVotingTime() {
        /**
         * This method is used to send the control to enable the selection of players
         */
        console.log("## Enable voting ##");
        this._vote = [];
        io.emit("control_selection", "enabled");
    }

    _testAct() {
        console.log("Test acting:");
        this._players.forEach(player => {
            console.log("[" + player + "]");
            this._roles[player].act();
        });
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
        this._connections = connections;
    }

    onPlayerSelected(player, selectedPlayer) {
        /**
         * this method is used to propagate the selection of a player: if "day"=> vote, otherwise => "player role effect"
         */

        //!
        //?
        //todo
        //* grassetto
        // //asd
        if (this._time == "day") {
            console.log("## Brodcast the vote ##");
            this._vote[this._players.indexOf(player)] = selectedPlayer;      //! array da inviare NON accetta indice string ma SOLO num
            // this._vote[player] = selectedPlayer;
            io.emit("writeLog", {
                whoVoted: player,
                selected: selectedPlayer
            });
            // console.log(this._vote)

            //? this._checkEndVote();
        }
    }

    onVoteConfirmed() {
        io.emit('voteConfirmed', this.calculateVoti(this._vote));
    }

    calculateVoti(array) {
        var result = [];

        this._players.forEach((pl, i) => {
            let occ = 0;
            array.forEach(v => {
                occ += v == pl ? 1 : 0;
            })
            result[i] = occ;
        })

        return result;
    };


    _checkEndVote() {
        /**
         * This method checks if the vote array is full.
         */
        var cond = true;
        this._players.forEach(pl => {
            if (!this._vote.keys().includes(pl))
                cond = false;
        });
        if (cond) {
            console.log("## Vote ended ##");
            //handle the dead of the player
            _killPlayer(_mostVotedPlayer());
            //go on with the game.
        }
    }

    _mostVotedPlayer() {
        /**
         * This method returns the most voted player
         */
        console.log("[DEBUG] Vote: " + this._vote);
        var leaderboard = [];
        this._vote.forEach(selected => {
            if (leaderboard.keys().includes(selected))
                leaderboard[selected]++;
            else
                leaderboard[selected] = 1;
        });
        leaderboard.sort((a, b) => a - b);
        console.log("[DEBUG] Leaderboard: " + this.leaderboard);
        return leaderboard.keys()[0];
    }

    _killPlayer(player) {
        /**
         * This method is used to kill a player
         */
        console.log("[DEBUG] Killed: " + player);
    }

    runTestGame() {
        this._time = "day";
        _enableVotingTime();
    }
}
module.exports = LupusGame;