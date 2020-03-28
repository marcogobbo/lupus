const Role = require("./role");

class Massone extends Role{
    constructor(){
        super("Massone", "Tra massoni vi riconoscete, è una garanzia in più!", "contadini", 0);
    }

    act(user, players, roles, sameRole, lastDeadPlayer) {
        this.players = players;
        this.roles = roles;
        this.connection=user.connection;
        this.username=user.username;
        this.sameRole = sameRole;

        var others = [];
        sameRole.forEach(val => {
            others.push(val.index);
        });
        io.to(this.connection).emit("my_friends", others);
    }

    canAct(){
        return false;
    }
}

module.exports = Massone;