const Role = require("./role");

class FiglioDelLupo extends Role {
    constructor() {
        super("Figlio del lupo", "Sei un piccolo cucciolo indifeso, giochi con i contadini, ma non appena i lupi di uccidono farai parte del loro branco", "contadini", 0);
        this.isWolf = false;
    }

    act(user, players, roles, sameRole, lastDeadPlayer) {
        if (this.isWolf) {
            this.players = players;
            this.roles = roles;
            this.connection = user.connection;
            this.username = user.username;
            this.sameRole = sameRole;
            this.temp = [];
            for (let i = 0; i < players.length; i++) {
                this.temp[i] = 0;
            }

            var others = [];
            sameRole.forEach(val => {
                others.push(val.index);
            });
            io.to(this.connection).emit("my_friends", others);
            console.log(sameRole);

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

            if (_nightActions.getNightCount() != 0)
                io.to(this.connection).emit("control_selection", true, 'night', array);
        }
    }

    onResponse(username) {
        if (this.isWolf) {
            _nightActions.addAction(this.getName(), username);
            this.temp[this.players.indexOf(username)]++;

            this.sameRole.forEach(val => {
                io.to(val.connection).emit("wolf_response", this.temp);
            });
            io.to(this.connection).emit("wolf_response", this.temp);
        }
    }

    onMessage(txt) {
        if (this.isWolf) {
            this.sameRole.forEach(val => {
                io.to(val.connection).emit("friends_chat", txt);
            });
            io.to(this.connection).emit("friends_chat", txt);
        }
    }

    increment(username) {
        if (this.isWolf) {
            this.temp[this.players.indexOf(username)]++;
        }
    }

    canAct() {
        if (_nightActions.getNightCount() == 0 || !this.isWolf)
            return false;
        return true;
    }

    check() {
        var count = 0;
        for (let i = 0; i < this.temp.length; i++) {
            count += this.temp[i];
        }
        console.log("CHECK: " + (this.sameRole.length + 1), count);
        if (this.sameRole.length + 1 != count)
            return true;

        var max = 0;
        var occ = 0;
        for (let i = 0; i < this.temp.length; i++) {
            if (this.temp[i] == max) {
                occ++;
            }
            if (this.temp[i] > max) {
                max = [this.temp[i]];
                occ = 1;
            }
        }
        console.log("CHECK: " + occ);

        return occ < 2;
    }

    repeat() {
        if (this.isWolf) {
            io.to(this.connection).emit("draw_repetition", '');
            io.to(this.connection).emit("control_selection", false, 'night', undefined);
            this.temp = [];
            for (let i = 0; i < this.players.length; i++) {
                this.temp[i] = 0;
            }

            var others = [];
            this.sameRole.forEach(val => {
                others.push(val.index);
            });
            io.to(this.connection).emit("my_friends", others);

            var selezionabili = [];
            this.players.forEach((pl) => {
                if (this.roles[pl].isAlive()) {
                    selezionabili.push(pl);
                }
            });
            var array = [];
            this.players.forEach((pl, i) => {
                array[i] = selezionabili.includes(pl);
            });

            if (_nightActions.getNightCount() != 0)
                io.to(this.connection).emit("control_selection", true, 'night', array);
        }
    }

    onTimeout() {
        if(this.isWolf){
            var i = Math.floor(Math.random() * this.selezionabili.length);
            this.onResponse(this.selezionabili[i]);
        }
    }

    toWolf(){
        this.isWolf=true;
    }

    rebornAsWolf(idx, conn, others){
        io.to(conn).emit("figlio_del_lupo", idx);
        this.setColor(1);
        others.forEach(val => {
            io.to(val.connection).emit("new_friend_wolf", idx);
        });
        console.log("New wolf: ",idx,conn,others);
    }

    alreadyWolf(){
        return this.isWolf;
    }
}

module.exports = FiglioDelLupo;