// LUPO RIMANE DA SOLO NON PUO' VOTARE GLI ALTRI
// LUPO SI SUICIDA RIMUOVERE BADGE


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
const Criceto = require('./roles/criceto');

const ActionCollector = require('./action-collector');

class LupusGame {
    constructor(players, connections, settings) {
        /**
         * Players and socket attributes
         */
        this._players = players;
        this._connections = connections;
        this._roles = [];
        this.lastDeadPlayer = null;

        /**
         * Game time attributes
         */
        this._time = '';
        this._dayTime = '';
        global._nightActions = new ActionCollector();

        /**
         * Vote structure
         */
        this._vote = [];
        this._whoCanPlay = [];
        this._hasConfirmed = [];

        /**
         * Parameters used to wait until all players have been loaded inn the game page.
         */
        this._started = false;
        this._updateCount = 0;

        //set up the game
        this._computeRoles(settings);
        this._sendRoles();
    }

    _start() {
        this._time = 'night';
        this._sendTimeUpdate();
        this._enableNightTime();

        //this is not correct since we are doing tests now
        // this._time = 'day';
        // this._sendTimeUpdate();
        // this._enableVotingTime();
    }

    _enableNightTime() {
        _nightActions.newNight();
        this._players.forEach((pl) => {
            if (this._roles[pl].isAlive()) {
                this._whoCanPlay.push(pl);
            }
        });

        console.log('lastDeadPlayer', this.lastDeadPlayer)

        for (let i = 0; i < this._whoCanPlay.length; i++) {
            var friends = this._computeFriends(this._whoCanPlay[i], this._roles[this._whoCanPlay[i]].getName());
            //console.log(this._whoCanPlay[i], friends);
            this._roles[this._whoCanPlay[i]].act({
                'connection': this._connections[this._whoCanPlay[i]],
                'username': this._whoCanPlay[i]
            },
                this._players,
                this._roles,
                friends,
                this.lastDeadPlayer,
            );
            this._hasConfirmed[i] = !this._roles[this._whoCanPlay[i]].canAct();
        }
    }

    _sendRoles() {
        // console.log('RUOLI: ',this._roles)
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
        //console.log(settings);
        //console.log(this._players);

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
        for (var i = 0; i < settings.medium; i++)
            rolesArr.push(new Medium());
        for (var i = 0; i < settings.gufo; i++)
            rolesArr.push(new Gufo());
        for (var i = 0; i < settings.criceto; i++)
            rolesArr.push(new Criceto());
        //! aggiugere ruoli

        console.log(settings, rolesArr);
        this._players.forEach(pl => {
            //get indice del ruolo
            var i = Math.floor(Math.random() * rolesArr.length);
            this._roles[pl] = rolesArr[i];  //array di Roles()
            rolesArr.splice(i, 1);
        });
    }

    _sendTimeUpdate() {
        io.emit('game_time', this._time);
    }

    _enableVotingTime() {
        /**
         * This method is used to send the control to enable the selection of players
         */
        //console.log("## Enable voting ##");
        this._resetVote();
        io.emit("voting_time", "");
        this._dayTime = 'vote';
        this._players.forEach((pl) => {
            if (this._roles[pl].isAlive()) {
                this._whoCanPlay.push(pl);
            }
        });

        for (let i = 0; i < this._whoCanPlay.length; i++) {
            this._hasConfirmed[i] = false;
            //selectable: all but not me
            var temp = [];
            this._whoCanPlay.forEach((pl, i) => {
                if (this._whoCanPlay[i] != pl) {
                    temp.push(i);
                }
            });

            var array = [];
            this._players.forEach((pl, i) => {
                array[i] = this._whoCanPlay.includes(pl);
            });

            this._handlePlayerSelection(true, this._whoCanPlay[i], array);
        }
        this._debug();
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
        if (!this._started) {
            this._updateCount++;
            if (this._updateCount == this._players.length)
                this._start();
        }
    }

    onPlayerSelected(player, selectedPlayer) {
        /**
         * this method is used to propagate the selection of a player: if "day"=> vote, otherwise => "player role effect"
         */
        if (this._time == "day") {
            //console.log("## Brodcast the vote ##");
            //console.log(player + "->" + selectedPlayer);
            this._vote[this._players.indexOf(player)] = selectedPlayer;      //! array da inviare NON accetta indice string ma SOLO num
            io.emit("writeLog", {
                whoVoted: player,
                selected: selectedPlayer
            }, this.calculateVoti(this._vote));
        }
    }

    onChatMessage(username, message) {
        this._whoCanPlay.forEach((pl) => {
            if (pl == username) {
                this._roles[username].onMessage("<b>" + username + "</b>: " + message);
            }
        });
    }

    onNightResponse(userVoting, userVoted) {
        this._whoCanPlay.forEach((pl, i) => {
            if (pl == userVoting) {
                this._hasConfirmed[i] = true;
                if (this._roles[userVoting].getName() == 'Lupo') {
                    this._whoCanPlay.forEach((pl2) => {
                        if (this._roles[pl2].getName() == 'Lupo' && pl2 != userVoting)
                            this._roles[pl2].increment(userVoted);
                    })
                }
                this._roles[userVoting].onResponse(userVoted);
                if (this._roles[userVoting].getName() == 'Lupo') {
                    //console.log("Checking the wolves...")
                    if (!this._roles[userVoting].check()) {
                        //console.log("Fuck Wolves.");
                        _nightActions.removeAction(this._roles[userVoting].getName());
                        this._whoCanPlay.forEach((pl2, i) => {
                            if (this._roles[pl2].getName() == 'Lupo' && pl2 != userVoting) {
                                this._hasConfirmed[i] = false;
                                this._roles[pl2].repeat();
                            }
                        })
                        this._hasConfirmed[i] = false;
                        this._roles[userVoting].repeat();
                    }
                }
            }
        });
        if (this._checkEndVote(this._hasConfirmed, this._whoCanPlay)) {
            //console.log("## NIGHT ENDED ##");
            this._players.forEach(pl => {
                this._handlePlayerSelection(false, pl, null);
            });
            // this._debug();
            //operations using the action collector
            this._time = 'day';
            this._sendTimeUpdate();
            this._computeNightOperations();

            this._resetVote();
            this._enableVotingTime();
        }

    }

    onVoteConfirmed(user) {
        io.emit('voteConfirmed', this.calculateVoti(this._vote));
        this._whoCanPlay.forEach((pl, i) => {
            if (pl == user) {
                this._hasConfirmed[i] = true;
            }
        });

        ////console.log(this._hasConfirmed,this._whoCanPlay);
        if (this._time == 'day') {
            if (this._dayTime == 'vote') {
                if (this._checkEndVote(this._hasConfirmed, this._whoCanPlay)) {
                    //console.log("## Vote ended ##");
                    this._dayTime = 'ballot';
                    this._players.forEach(pl => {
                        this._handlePlayerSelection(false, pl, null);
                    });
                    this._handleBallot();
                    //ballot!
                }
            }
            else if (this._dayTime = 'ballot') {
                //console.log("## BALLOT VOTE RECEIVED ##");
                if (this._checkEndVote(this._hasConfirmed, this._whoCanPlay)) {
                    //console.log("## Ballot ended ##");
                    //todo
                    //handle the dead of the player

                    var arr = this._mostVotedPlayers(this._vote);
                    if (arr.length > 1) {
                        //console.log("FUCK BALLOTTAGGIO. PAREGGIO");
                        //console.log("RIPETERE VOTAZIONE");
                        this._players.forEach(pl => {
                            this._handlePlayerSelection(false, pl, null);
                        });
                        this._handleBallot();
                    } else if (arr.length == 1) {
                        this._killPlayer(arr[0], 'day');

                        //go on with the game.
                        /**
                         * 0. check win, if not
                         * 1. switch to night
                         * 2. check who can play and start his action
                         */

                        /**0. CHECK IF GAME ENDED */
                        var winningTeam = this._computeWinner();
                        if (winningTeam == 'none') {
                            this._resetVote();
                            /**0. switch to night */
                            this._time = 'night';
                            this._dayTime = '';
                            this._sendTimeUpdate();

                            this._enableNightTime();

                            this._debug();
                        } else {
                            //broadcast who won the game
                            //console.log("WINNER: " + winningTeam);
                            //!nella emit deve mandare anche l'array dei vincitori
                            //todo: chi gioca per sè, io proporrei una squadra = 2
                            io.emit('found_winner', winningTeam)
                        }
                    }
                    //console.log(this._vote);
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

    _computeNightOperations() {
        //Lupi
        var wolves = _nightActions.getActionsByRoleName("Lupo");
        //console.log('Wolves night selection:', wolves);
        var max = -1;
        var sel = 'none';

        //! quando rimane un lupo solo viene selezionato il PRIMO morto
        for (let i = 0; i < wolves.length; i++) {
            var count = 0;
            for (let j = 0; j < wolves.length; j++) {
                if (wolves[i] == wolves[j]) {
                    count++;
                }
            }
            if (count > max) {
                sel = wolves[i];
                max = count;
            }
        }
        //console.log('Wolves\' Selection:', sel)
        //get GDC op
        var wolves_sel = sel;
        console.log('guardia del corpo ha votato: ', _nightActions.getActionsByRoleName("Guardia Del Corpo")[0])
        if (_nightActions.getActionsByRoleName("Guardia Del Corpo").length != 0
            && _nightActions.getActionsByRoleName("Guardia Del Corpo")[0] == wolves_sel)
            wolves_sel = 'none';
        if (wolves_sel != 'none') {
            //ROMEO CHECK

            this._killPlayer(this._players.indexOf(wolves_sel), 'night');
        }
        else
            io.emit('dead_player', -1, null, 'night');

        //CRICETO
        var veggente_sel = _nightActions.getActionsByRoleName("Veggente");
        this._players.forEach((pl)=>{
            if(pl==veggente_sel){
                if(this._roles[pl].getName()=='Criceto'&&this._roles[pl].isAlive())
                    this._killPlayer(this._players.indexOf(veggente_sel), 'night');
            }
        });

    }

    _computeFriends(playerName, roleName) {
        var temp = [];
        for (let i = 0; i < this._players.length; i++) {
            if (this._players[i] != playerName && this._roles[this._players[i]].isAlive() && this._roles[this._players[i]].getName() == roleName) {
                temp.push({
                    'name': this._players[i],
                    'index': i,
                    'connection': this._connections[this._players[i]]
                });
            }
        }
        return temp;
    }

    _computeWinner() {
        //return 'none';
        /**
         * TODO
         */
        var black = 0, white = 0, others = 0;
        this._players.forEach((pl) => {
            //get numero carte bianche e nere
            if (this._roles[pl].isAlive()) {
                if (this._roles[pl].getSquad() == 'contadini')
                    white++;
                else if (this._roles[pl].getSquad() == 'lupi')
                    black++;
                else
                    others++;    // qui ci sarà da dividere le squadre "gioco per me stesso"
            }
        });
        if (black == 0 && white > 1)
            return 'contadini'
        else if (black == white)
            return 'lupi';
        else
            //aggiungere casistica di other
            return 'none';
    }
    _resetVote() {
        this._vote = [];
        this._whoCanPlay = [];
        this._hasConfirmed = [];
    }

    _handleBallot() {
        //console.log("## BALLOT TIME ##");
        this._debug();
        //what players?
        //1) compute the due max values max1,max2; 2) check how many players has been voted max1 times; 3) if <2 send also all of max2 
        var leaderboard = [];
        for (let i = 0; i < this._players.length; i++) {
            leaderboard[i] = 0;
        }
        this._vote.forEach(selected => {
            leaderboard[this._players.indexOf(selected)]++;
        });
        this._resetVote();

        //console.log("Leaderboard: " + leaderboard);
        var max1 = -1;
        var max2 = -1;
        var indexes = [];
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] > max1) {
                indexes = [];
                indexes.push(i);
                max2 = max1;
                max1 = leaderboard[i];
            } else if (leaderboard[i] == max1) {
                indexes.push(i);
            }
            if (leaderboard[i] > max2 && leaderboard[i] != max1) {
                max2 = leaderboard[i];
            }
        }

        /**
         * CHECK GUFO
         */
        var gufo_player = _nightActions.getActionsByRoleName("Gufo").length!=0 ? _nightActions.getActionsByRoleName("Gufo")[0]:'none';
        if(gufo_player!='none'){
            this._players.forEach((pl,i)=>{
                if(gufo_player==pl){
                    if(!indexes.includes(i)){
                        indexes.push(i);
                    }
                }
            });
            _nightActions.removeAction("Gufo");
        }

        /**
         * Aggiungi in caso di un solo giocatore.
         */
        if (indexes.length < 2) {
            for (let i = 0; i < leaderboard.length; i++) {
                if (leaderboard[i] == max2) {
                    indexes.push(i);
                }
            }
        }

        //console.log("Max number of votes: " + max1 + ", " + max2 + "\nPlayers indexes: " + indexes);

        //send open ballot
        io.emit("ballot_time", indexes);
        //tempo per discolparsi?

        this._players.forEach((pl, i) => {
            if (this._roles[pl].isAlive() && !indexes.includes(i)) {
                this._whoCanPlay.push(pl);
            }
        });
        //after computed
        for (let i = 0; i < this._whoCanPlay.length; i++) {
            this._hasConfirmed[i] = false;
            //selectable: all but not me
            var temp = [];
            for (let j = 0; j < this._players.length; j++) {
                temp[j] = indexes.includes(j);
            }
            this._handlePlayerSelection(true, this._whoCanPlay[i], temp);
            //console.log("Ballot message to: " + this._whoCanPlay[i]);
        }
    }

    _checkEndVote(array, target) {
        /**
         * This method checks if the vote array is full.
         */
        var cond = true;
        for (let i = 0; i < array.length; i++) {
            if (array[i] != true) {
                cond = false;
            }
        }
        ////console.log(target);
        return cond && array.length == target.length;
    }

    _mostVotedPlayers(array) {
        /**
         * This method returns the most voted player
         */
        ////console.log("[DEBUG] Vote: " + array);
        var leaderboard = [];
        for (let i = 0; i < this._players.length; i++) {
            leaderboard[i] = 0;
        }
        array.forEach(selected => {
            leaderboard[this._players.indexOf(selected)]++;
        });
        var max = -1;
        var indexes = [];
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] > max) {
                indexes = [];
                indexes.push(i);
                max = leaderboard[i];
            } else if (leaderboard[i] == max) {
                indexes.push(i);
            }
        }
        //leaderboard.sort((a, b) => a - b);
        //console.log("[DEBUG] Leaderboard: " + leaderboard);
        return indexes;
    }

    _handlePlayerSelection(status, player, selectable) {
        if (!status) io.to(`${this._connections[player]}`).emit("control_selection", status, this._time == 'night' ? this._time : this._dayTime);
        else {
            io.to(`${this._connections[player]}`).emit("control_selection", status, this._time == 'night' ? this._time : this._dayTime, selectable);
            //console.log(selectable);
        }
    }

    _killPlayer(index, daytime) {
        /**
         * This method is used to kill a player
         */
        //console.log("[DEBUG] Killed: " + index);        

        this.lastDeadPlayer = {
            player: index,
            time: daytime
        }
        this._roles[this._players[index]].kill();
        io.emit("dead_player", index, this._players[index], daytime);
    }

    _debug() {
        console.log("## DEBUG ##");
        //console.log("time: ", this._time);
        if (this._time == 'day')
            console.log("dayTime: ", this._dayTime);
        //console.log("roles: ", this._roles);
        //console.log("vote: ", this._vote);
        //console.log("whoCanPlay: ", this._whoCanPlay);
        //console.log("hasConfirmed: ", this._hasConfirmed);
        if (this._time == 'night')
            console.log("Last nightActions: ", _nightActions.getActions());
    }

    runTestGame() {
        this._time = "day";
        _enableVotingTime();
    }
}
module.exports = LupusGame;