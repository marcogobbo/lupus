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

/**
 * Timer Duration [ms]
 */

const timerLength = 20000;
const intervalLength = 1000; //each second send an alert

class LupusGame {
    constructor(players, connections, settings) {
        /**
         * Players and socket attributes
         */
        this._players = players;
        this._connections = connections;
        this._roles = [];
        this.lastDeadPlayer = null;
        this._lastsAtBallot = null;

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
        this._legend = this._computeLegend(settings);
        this._sendRoles();

        /**
         * Timers and Intervals:
         * - Timer:  when the time is over, execute some functions.
         * - Interval: each second send the timeLeft to clients
         */
        this._timeLeft = 0;
        this._interval = undefined;
        this._timer = undefined;
    }

    _start() {
        this._enableNightTime();

        //this is not correct since we are doing tests now
        // this._time = 'day';
        // this._sendTimeUpdate();
        // this._enableVotingTime();
    }

    _enableNightTime() {
        this._time = 'night';
        this._dayTime = '';
        this._sendTimeUpdate();

        _nightActions.newNight();
        this._players.forEach((pl) => {
            if (this._roles[pl].isAlive()) {
                this._whoCanPlay.push(pl);
            }
        });

        //console.log('lastDeadPlayer', this.lastDeadPlayer)

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

        //START TIMER
        this._startTimer();
    }

    _sendRoles() {
        // console.log('RUOLI: ',this._roles)
        this._players.forEach(pl => {
            io.to(`${this._connections[pl]}`).emit('role', {
                name: this._roles[pl].getName(),
                description: this._roles[pl].getDescription(),
                color: this._roles[pl].getColor()
            }, this._legend);
        });
    }

    _computeLegend(settings) {
        var temp = [];
        if (settings.lupi > 0) {
            var player_s = new Lupo();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.lupi,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        if (settings.contadini > 0) {
            var player_s = new Contadino();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.contadini,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        if (settings.veggente > 0) {
            var player_s = new Veggente();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.veggente,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        if (settings.gdc > 0) {
            var player_s = new GuardiaDelCorpo();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.gdc,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        if (settings.medium > 0) {
            var player_s = new Medium();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.medium,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        if (settings.gufo > 0) {
            var player_s = new Gufo();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.gufo,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        if (settings.criceto > 0) {
            var player_s = new Criceto();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.criceto,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        if (settings.roseMary > 0) {
            var player_s = new RoseMary();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.roseMary,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        if (settings.scemo > 0) {
            var player_s = new Scemo();
            temp.push({
                'name': player_s.getName(),
                'quantity': settings.scemo,
                'color': player_s.getColor(),
                'description': player_s.getDescription()
            });
        }
        return temp;
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
        for (var i = 0; i < settings.roseMary; i++)
            rolesArr.push(new RoseMary());
        for (var i = 0; i < settings.scemo; i++)
            rolesArr.push(new Scemo());
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

        //START TIMER
        this._startTimer();
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
            clearTimeout(this._timer);
            this._stopTimer();
            this._handleNightEnd();
        }
    }

    onDayResponse(user, userVoted) {
        io.emit('voteConfirmed', {
            whoVoted: user,
            selected: userVoted
        }, this.calculateVoti(this._vote));
        this._whoCanPlay.forEach((pl, i) => {
            if (pl == user) {
                this._hasConfirmed[i] = true;
            }
        });

        //console.log(this._hasConfirmed,this._whoCanPlay);
        if (this._time == 'day') {
            if (this._dayTime == 'vote') {
                if (this._checkEndVote(this._hasConfirmed, this._whoCanPlay)) {
                    //console.log("## Vote ended ##");
                    clearTimeout(this._timer);
                    this._stopTimer();
                    this._handleVoteEnd();
                }
            }
            else if (this._dayTime = 'ballot') {
                //console.log("## BALLOT VOTE RECEIVED ##");
                if (this._checkEndVote(this._hasConfirmed, this._whoCanPlay)) {
                    //console.log("## Ballot ended ##");
                    clearTimeout(this._timer);
                    this._stopTimer();
                    this._handleBallotEnd();
                }
            }
        }
    }

    _handleNightEnd() {
        this._players.forEach(pl => {
            this._handlePlayerSelection(false, pl, null);
        });
        // this._debug();
        //operations using the action collector
        this._time = 'day';
        this._sendTimeUpdate();
        this._computeNightOperations();

        var winningTeam = this._computeWinner();
        if (winningTeam == 'none') {

            this._resetVote();
            this._enableVotingTime();

        } else {
            //broadcast who won the game
            //console.log("WINNER: " + winningTeam);
            //!nella emit deve mandare anche l'array dei vincitori
            //todo: chi gioca per sè, io proporrei una squadra = 2
            io.emit('found_winner', winningTeam)
        }
    }

    _handleVoteEnd() {
        this._dayTime = 'ballot';
        this._players.forEach(pl => {
            this._handlePlayerSelection(false, pl, null);
        });
        this._handleBallot();
        //ballot!
    }

    _handleBallotEnd() {
        //todo
        //handle the dead of the player
        this._players.forEach(pl => {
            this._handlePlayerSelection(false, pl, null);
        });
        var arr = this._mostVotedPlayers(this._vote);
        if (arr.length > 1) {
            //console.log("FUCK BALLOTTAGGIO. PAREGGIO");
            this._handleBallot();
        } else if (arr.length == 1) {

            var mariarosa_sel = _nightActions.getActionsByRoleName("Rose Mary");

            // console.log('votazioni con mariarosa')
            // console.log(arr[0], mariarosa_sel[0])

            if (arr[0] != this._players.indexOf(mariarosa_sel[0]))
                this._killPlayer(arr[0], 'day');
            else
                io.emit('dead_player', -1, null, 'night');

            //go on with the game.
            /**
             * 0. check win, if not
             * 1. switch to night
             * 2. check who can play and start his action
             */

            /**0. CHECK IF GAME ENDED */
            var winningTeam;

            // console.log(this.lastDeadPlayer);
            // console.log(this._roles)

            //! DA SPOSTARE IN COMPUTE WINNER. NON QUI.
            if (this._roles[this._players[this.lastDeadPlayer.player]].getName() == 'Scemo')
                winningTeam = 'Scemo'
            else
                winningTeam = this._computeWinner();
            if (winningTeam == 'none') {
                this._resetVote();
                /**0. switch to night */
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
        var deadCounter = 0;
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
        // console.log('guardia del corpo ha votato: ', _nightActions.getActionsByRoleName("Guardia Del Corpo")[0])
        if ((_nightActions.getActionsByRoleName("Guardia Del Corpo").length != 0
            && _nightActions.getActionsByRoleName("Guardia Del Corpo")[0] == wolves_sel) || (wolves_sel != 'none' && this._roles[wolves_sel].getName() == "Criceto"))
            wolves_sel = 'none';
        if (wolves_sel != 'none') {
            //ROMEO CHECK
            var romeo_sel = _nightActions.getActionsByRoleName("Romeo").length != 0 ? _nightActions.getActionsByRoleName("Romeo")[0] : 'none';
            if (romeo_sel != 'none') {
            }
            deadCounter++;
            this._killPlayer(this._players.indexOf(wolves_sel), 'night');
        }



        //CRICETO
        var veggente_sel = _nightActions.getActionsByRoleName("Veggente");
        // console.log('veggente votato: ',veggente_sel)
        this._players.forEach((pl) => {
            if (pl == veggente_sel) {
                if (this._roles[pl].getName() == 'Criceto' && this._roles[pl].isAlive()) {
                    this._killPlayer(this._players.indexOf(veggente_sel[0]), 'night');
                    deadCounter++;
                }
            }
        });

        if (deadCounter == 0)
            io.emit('dead_player', -1, null, 'night');


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
        var cricetoAlive = false;

        var black = 0, white = 0, others = 0;

        this._players.forEach((pl) => {
            //get numero carte bianche e nere
            if (this._roles[pl].isAlive()) {
                if (this._roles[pl].getName() == 'Criceto')
                    cricetoAlive = true;
                if (this._roles[pl].getColor() == 0)
                    white++;
                else if (this._roles[pl].getName() == 'Lupo')
                    black++;
                else
                    others++;    // qui ci sarà da dividere le squadre "gioco per me stesso"
            }
        });

        // console.log('neri: ', black)
        // console.log('bianchi: ', white)

        if (black == 0 && white > 1)
            if (!cricetoAlive)
                return 'contadini'
            else
                return 'criceto'
        else if (black == white)
            if (!cricetoAlive)
                return 'lupi'
            else
                return 'criceto'
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
        var ballotLeaderboard = [];
        for (let i = 0; i < this._players.length; i++) {
            ballotLeaderboard[i] = 0;
        }
        this._vote.forEach(selected => {
            ballotLeaderboard[this._players.indexOf(selected)]++;
        });

        //console.log("ballotLeaderboard: " + ballotLeaderboard);
        var max1 = -1;
        var max2 = -1;
        var indexes = [];
        for (let i = 0; i < ballotLeaderboard.length; i++) {
            if (ballotLeaderboard[i] > max1) {
                indexes = [];
                indexes.push(i);
                max2 = max1;
                max1 = ballotLeaderboard[i];
            } else if (ballotLeaderboard[i] == max1) {
                indexes.push(i);
            }
            if (ballotLeaderboard[i] > max2 && ballotLeaderboard[i] != max1) {
                max2 = ballotLeaderboard[i];
            }
        }

        /**
         * CHECK GUFO
         */
        var gufo_player = _nightActions.getActionsByRoleName("Gufo").length != 0 ? _nightActions.getActionsByRoleName("Gufo")[0] : 'none';
        if (gufo_player != 'none') {
            this._players.forEach((pl, i) => {
                if (gufo_player == pl) {
                    if (!indexes.includes(i) && this._roles[gufo_player].isAlive()) {
                        indexes.push(i);
                    }
                }
            });
            _nightActions.removeAction("Gufo");
        }

        /**
         * Aggiungi in caso di un solo giocatore.
         */
        if (indexes.length < 2 && max2>0) {
            for (let i = 0; i < ballotLeaderboard.length; i++) {
                if (ballotLeaderboard[i] == max2) {
                    indexes.push(i);
                }
            }
        }
        this._lastsAtBallot=indexes;

        if(indexes.length>2){
            this._resetVote();
            this._openBallot();
        } else{
            //SOLO UNO VOTATO DA TUTTI ==> MUORE SOLO LUI SENZA BALLOTTAGGIO
            this._handleBallotEnd();
        }
    }

    _openBallot(){
        //send open ballot
        io.emit("ballot_time", this._lastsAtBallot);
        //tempo per discolparsi?

        this._players.forEach((pl, i) => {
            if (this._roles[pl].isAlive() && !this._lastsAtBallot.includes(i)) {
                this._whoCanPlay.push(pl);
            }
        });
        //after computed
        for (let i = 0; i < this._whoCanPlay.length; i++) {
            this._hasConfirmed[i] = false;
            //selectable: all but not me
            var temp = [];
            for (let j = 0; j < this._players.length; j++) {
                temp[j] = this._lastsAtBallot.includes(j);
            }
            this._handlePlayerSelection(true, this._whoCanPlay[i], temp);
            //console.log("Ballot message to: " + this._whoCanPlay[i]);
        }

        this._startTimer();
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
        console.log("Last nightActions: ", _nightActions.getActions());
    }

    _startTimer() {
        /**
         * This method is used to set up the timer and the interval
         */
        console.log("## TIMER STARTED ("+(this._time=='night'?this._time:this._dayTime)+") ##");

        this._timeLeft = timerLength; //treshold(?)
        io.emit("remaining_time", this._timeLeft);
        this._interval = setInterval(() => {
            this._timeLeft -= intervalLength;
            io.emit("remaining_time", this._timeLeft);
        }, intervalLength);

        this._timer = setTimeout(()=>{
            this._stopTimer();
            //to do: handle NIGHT/VOTE/BALLOT TIMEOUT!!
            //console.log("## TIME-OUT ("+(this._time=='night'?this._time:this._dayTime)+") ##");
            io.emit("timeout_alert",this._time=='night'?this._time:this._dayTime);

            /**
             * COMMENTATO PERCHÈ NON COMPLETO: DOBBIAMO DECIDERE COME GESTIRE I VOTI MANCANTI. AD ORA FUNZIONA SOLO L'AVVISO AL CLIENT
             */
            if(this._time=='night'){
                //handle missing night response
                //LOCK ALL THE PLAYERS
                this._players.forEach(pl => {
                    this._handlePlayerSelection(false, pl, null);
                });
                var wolf_check=_nightActions.getActionsByRoleName("Lupo").length>0;
                this._whoCanPlay.forEach((pl, i) => {
                    if(!this._hasConfirmed[i]){
                        if(this._roles[pl].getName() != 'Lupo'||!wolf_check){
                            this._roles[pl].onTimeout();
                            if(this._roles[pl].getName()=='Lupo'){
                                wolf_check=true;
                            }
                        }
                        this._hasConfirmed[i]=true;
                    }
                });

                this._handleNightEnd();
            } else if (this._time=='day'){
                //LOCK ALL THE PLAYERS
                this._players.forEach(pl => {
                    this._handlePlayerSelection(false, pl, null);
                });
                if(this._dayTime=='vote'){
                    //check if someone has confirmed his vote
                    var someone=false;
                    var i=0; var length=this._whoCanPlay.length;
                    
                    while(i<length&&!someone){
                        someone=this._hasConfirmed[i];
                        i++;
                    }

                    if(someone){
                        //Handle missing day vote response
                        var index=this._mostVotedPlayers(this._vote)[0];
                        //console.log(this._players[index],this._whoCanPlay);
                        for(let i=0;i<this._whoCanPlay.length;i++){
                            if(!this._hasConfirmed[i]){
                                //console.log(this._players[i]);
                                this._vote[i]=this._players[index];
                                io.emit('voteConfirmed', {
                                    whoVoted: this._players[i],
                                    selected: this._players[index]
                                }, this.calculateVoti(this._vote));
                                this._hasConfirmed[i]=true;
                            }
                        }
                        this._handleVoteEnd();
                    }else{
                        //repeat
                        this._resetVote();
                        this._enableVotingTime();
                    }
                } else if(this._dayTime=='ballot'){
                    //check if someone has confirmed his vote
                    var someone=false;
                    var i=0; var length=this._whoCanPlay.length;
                    
                    while(i<length&&!someone){
                        someone=this._hasConfirmed[i];
                        i++;
                    }
                    
                    if(someone){
                        //Handle missing day vote response
                        var index=this._mostVotedPlayers(this._vote)[0];
                        //console.log(this._players[index],this._whoCanPlay);
                        for(let i=0;i<this._whoCanPlay.length;i++){
                            if(!this._hasConfirmed[i]){
                                //console.log(this._players[i]);
                                this._vote[i]=this._players[index];
                                io.emit('voteConfirmed', {
                                    whoVoted: this._players[i],
                                    selected: this._players[index]
                                }, this.calculateVoti(this._vote));
                                this._hasConfirmed[i]=true;
                            }
                        }
                        this._handleBallotEnd();
                    } else {
                        this._players.forEach(pl => {
                            this._handlePlayerSelection(false, pl, null);
                        });
                        this._resetVote();
                        this._openBallot();
                    }
                }
            }

        },timerLength)
    }

    _stopTimer() {
        clearInterval(this._interval);
        this._timeLeft = 0;
        io.emit("remaining_time", this._timeLeft);
    }
}
module.exports = LupusGame;