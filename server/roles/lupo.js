const Role = require("./role");

class Lupo extends Role {
    constructor() {
        super("Lupo", "Tu sei il cattivo. Uccidi chi vuoi nella notte", "lupi", 1);
    }

    act(connection, players, roles, sameRole) {
        this.players = players;
        this.roles = roles;
        this.connection = connection;
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

        var selezionabili = [];
        players.forEach((pl) => {
            if (roles[pl].isAlive()) {
                selezionabili.push(pl);
            }
        });
        var array = [];
        players.forEach((pl, i) => {
            array[i] = selezionabili.includes(pl);
        });

        if (_nightActions.getNightCount() != 0)
            io.to(this.connection).emit("control_selection", true, 'night', array);
    }

    onResponse(username) {
        _nightActions.addAction(this.getName(), username);
        this.temp[this.players.indexOf(username)]++;

        this.sameRole.forEach(val => {
            io.to(val.connection).emit("wolf_response", this.temp);
        });
        io.to(this.connection).emit("wolf_response", this.temp);
    }

    onMessage(txt) {
        this.sameRole.forEach(val => {
            io.to(val.connection).emit("friends_chat", txt);
        });
        io.to(this.connection).emit("friends_chat", txt);
    }

    increment(username) {
        this.temp[this.players.indexOf(username)]++;
    }

    canAct() {
        if (_nightActions.getNightCount() == 0)
            return false;
        return true;
    }
}

module.exports = Lupo;