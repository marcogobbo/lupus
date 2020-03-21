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

const ActionCollector = require ('./action-collector');

class LupusGame {
    constructor(players, connections, settings) {
        /**
         * Players and socket attributes
         */
        this._players = players;
        this._connections = connections;
        this._roles = [];

        /**
         * Game time attributes
         */
        this._time = '';
        this._dayTime = '';
        this._turnCount = 0;//night count
        this._nightActions= new ActionCollector();
        
        /**
         * Vote structure
         */
        this._vote = [];
        this._whoCanVote = [];
        this._hasConfirmed = [];
        this._ballotVote = [];

        /**
         * Parameters used to wait until all players have been loaded inn the game page.
         */
        this._started=false;
        this._updateCount=0;

        //set up the game
        this._computeRoles(settings);
        this._sendRoles();
    }

    _start(){
        //not correct now since we are testing the day behaviour
        this._time = 'day';
        this._sendTimeUpdate();
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
    }

    _sendTimeUpdate(){
        io.emit('game_time',this._time);
    }

    _enableVotingTime() {
        /**
         * This method is used to send the control to enable the selection of players
         */
        console.log("## Enable voting ##");
        this._resetVote();
        io.emit("voting_time","");
        this._dayTime = 'vote';
        this._players.forEach((pl)=>{
            if(this._roles[pl].isAlive()){
                this._whoCanVote.push(pl);
            }
        });

        for(let i=0;i<this._whoCanVote.length;i++){
            this._hasConfirmed[i]=false;
            //selectable: all but not me
            var temp=[];
            this._whoCanVote.forEach((pl,i)=>{
                if(this._whoCanVote[i]!=pl){
                    temp.push(i);
                }
            });

            var array=[];
            this._players.forEach((pl,i)=>{
                array[i]=this._whoCanVote.includes(pl);
            });

            this._handlePlayerSelection(true,this._whoCanVote[i],array);
        }
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
        if(!this._started){
            this._updateCount++;
            if(this._updateCount==this._players.length)
            this._start();
        }
    }

    onPlayerSelected(player, selectedPlayer) {
        /**
         * this method is used to propagate the selection of a player: if "day"=> vote, otherwise => "player role effect"
         */
        if (this._time == "day") {
            console.log("## Brodcast the vote ##");
            var array;
            this._vote[this._players.indexOf(player)] = selectedPlayer;      //! array da inviare NON accetta indice string ma SOLO num
            io.emit("writeLog", {
                whoVoted: player,
                selected: selectedPlayer
            }, this.calculateVoti(this._vote));
            console.log(this._vote)
        }
    }

    onVoteConfirmed(user) {
        io.emit('voteConfirmed', this.calculateVoti(this._vote));
        this._whoCanVote.forEach((pl,i)=>{
            if(pl==user){
                this._hasConfirmed[i]=true;
            }
        });

        //console.log(this._hasConfirmed,this._whoCanVote);
        if(this._time=='day'){
            if(this._dayTime=='vote'){
                if(this._checkEndVote(this._hasConfirmed,this._whoCanVote))
                {
                    console.log("## Vote ended ##");
                    this._players.forEach(pl=>{
                        this._handlePlayerSelection(false,pl,null);
                    });
                    this._handleBallot();
                    //ballot!
                }
            }
            else if( this._dayTime='ballot'){
                console.log("## BALLOT VOTE RECEIVED ##");
                if(this._checkEndVote(this._hasConfirmed,this._whoCanVote))
                {
                    console.log("## Ballot ended ##");
                    //todo
                    //handle the dead of the player

                    var arr=this._mostVotedPlayers(this._vote);
                    if(arr.length>1){
                        console.log("FUCK BALLOTTAGGIO. PAREGGIO");
                    }else if(arr.length==1){
                        this._killPlayer(arr[0]);
                    }
                    //go on with the game.
                    console.log(this._vote);
                }
            }
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

    _resetVote(){
        this._vote = [];
        this._whoCanVote = [];
        this._hasConfirmed = [];
    }

    _handleBallot(){
        this._dayTime='ballot';
        console.log("## BALLOT TIME ##");
        //what players?
        //1) compute the due max values max1,max2; 2) check how many players has been voted max1 times; 3) if <2 send also all of max2 
        var leaderboard = [];
        for(let i=0;i<this._players.length;i++){
            leaderboard[i]=0;
        }
        this._vote.forEach(selected => {
            leaderboard[this._players.indexOf(selected)]++;
        });
        this._resetVote();

        console.log("Leaderboard: "+leaderboard);
        var max1=-1;
        var max2=-1;
        var indexes=[];
        for(let i=0;i<leaderboard.length;i++){
            if(leaderboard[i]>max1){
                indexes=[];
                indexes.push(i);
                max2=max1;
                max1=leaderboard[i];
            }else if(leaderboard[i]==max1){
                indexes.push(i);
            }
            if(leaderboard[i]>max2&&leaderboard[i]!=max1){
                max2=leaderboard[i];
            }
        }
        if(indexes.length<2){
            for(let i=0;i<leaderboard.length;i++){
                if(leaderboard[i]==max2){
                    indexes.push(i);
                }
            }
        }
        console.log("Max number of votes: "+max1+", "+ max2+"\nPlayers indexes: "+indexes);

        //send open ballot
        io.emit("ballot_time", indexes);
        //tempo per discolparsi?
        
        this._players.forEach((pl,i)=>{
            if(this._roles[pl].isAlive()&&!indexes.includes(i)){
                this._whoCanVote.push(pl);
            }
        });
        //after computed
        for(let i=0;i<this._whoCanVote.length;i++){
            this._hasConfirmed[i]=false;
            //selectable: all but not me
            var temp=[];
            for(let j =0; j<this._players.length;j++){
                temp=indexes.includes(j);
            }
            this._handlePlayerSelection(true,this._whoCanVote[i],temp);
        }
    }

    _checkEndVote(array, target) {
        /**
         * This method checks if the vote array is full.
         */
        var cond = true;
        for(let i=0;i<array.length;i++){
            if(array[i]!=true){
                cond = false;
            }
        }
        //console.log(target);
        return cond&&array.length==target.length;
    }

    _mostVotedPlayers(array) {
        /**
         * This method returns the most voted player
         */
        console.log("[DEBUG] Vote: " + array);
        var leaderboard = [];
        for(let i=0;i<this._players.length;i++){
            leaderboard[i]=0;
        }
        array.forEach(selected => {
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

    _handlePlayerSelection(status, player, selectable){
        if(!status) io.to(`${this._connections[player]}`).emit("control_selection", status);
        else{
            io.to(`${this._connections[player]}`).emit("control_selection", status, selectable);
        }
    }

    _killPlayer(index) {
        /**
         * This method is used to kill a player
         */
        console.log("[DEBUG] Killed: " + index);
        this._roles[this._players[i]].kill();
        io.emit("dead_player", index,this._players[i]);
    }

    runTestGame() {
        this._time = "day";
        _enableVotingTime();
    }
}
module.exports = LupusGame;