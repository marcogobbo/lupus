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

        this._dayTime = 'vote';
        this._votablePlayers = [];
        this._hasConfirmed = [];
        this._ballotVote = [];

        //this._deadPlayers = [];
        this._enableVotingTime();
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
        /**
         * to be completed
         */
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
            //get indice del ruolo
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
        this._dayTime = 'vote';
        this._votablePlayers=[];
        this._hasConfirmed=[];
        this._players.forEach((pl)=>{
            if(this._roles[pl].isAlive()){
                this._votablePlayers.push(pl);
            }
        });
        for(let i=0;i<this._votablePlayers.length;i++){
            this._hasConfirmed[i]=false;
        }

        this._selectionControl(1,this._votablePlayers);
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
            //this._vote[player] = selectedPlayer;
            io.emit("writeLog", {
                whoVoted: player,
                selected: selectedPlayer
            }, this.calculateVoti(this._vote));
            console.log(this._vote)

            //? this._checkEndVote();
        }
    }

    //!così ogni volta che un giocatore cambia voto viene inviato agli altri (da confermare)
    onVoteConfirmed(user) {
        io.emit('voteConfirmed', this.calculateVoti(this._vote));
        console.log(user);
        this._votablePlayers.forEach((pl,i)=>{
            console.log(pl,user);
            if(pl==user){
                this._hasConfirmed[i]=true;
            }
        });

        //all player now... deads?
        console.log(this._hasConfirmed,this._votablePlayers);
        if(this._checkEndVote(this._hasConfirmed,this._votablePlayers))
        {
            console.log("## Vote ended ##");
            this._dayTime='ballot';
            this._selectionControl(0,this._players);
            this._handleBallot();
            //ballot!
            //handle the dead of the player
            //this._killPlayer(this._mostVotedPlayers());
            //go on with the game.
        }
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

    _handleBallot(){
        //what players?

        //after computed
        this._vote=[];
    }

    _checkEndVote(array, target) {
        /**
         * This method checks if the vote array is full.
         */
        var cond = true;
        for(let i=0;i<array.length;i++){
            if(array[i]!=true){
                cond = false;
                console.log(cond);
            }
        }
        //console.log(target);
        return cond&&array.length==target.length;
    }

    _mostVotedPlayers() {
        /**
         * This method returns the most voted player
         */
        console.log("[DEBUG] Vote: " + this._vote);
        var leaderboard = [];
        for(let i=0;i<this._players.length;i++){
            leaderboard[i]=0;
        }
        this._vote.forEach(selected => {
            leaderboard[this._players.indexOf(selected)]++;
        });
        var max=-1;
        var indexes=[];
        for(let i=0;i<leaderboard.length;i++){
            if(leaderboard[i]>max){
                indexes=[];
                indexes.push(i);
                max=leaderboard[i];
            }else if(leaderboard[i]==max){
                indexes.push(i);
            }
        }
        //leaderboard.sort((a, b) => a - b);
        console.log("[DEBUG] Leaderboard: " + leaderboard);
        return indexes;
    }

    _selectionControl(i,whoCanPlay){
        /**
         * 0 = disabled
         */
        whoCanPlay.forEach(pl=>{
            io.to(`${this._connections[pl]}`).emit("control_selection", i!=0);
        })
    }

    _killPlayer(indexes) {
        /**
         * This method is used to kill a player
         */
        console.log("[DEBUG] Killed: " + indexes);
    }

    runTestGame() {
        this._time = "day";
        _enableVotingTime();
    }
}
module.exports = LupusGame;