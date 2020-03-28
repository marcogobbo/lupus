const Role = require("./role");

class Criceto extends Role{
    constructor(){
        super("Criceto", "Sei lo scemo del villaggio, se muori al ballottaggio hai vinto!", "criceto", 0);
    }

    act(user, players, roles, sameRole) {
    }

    canAct(){
        //TODO!!
        return false;
    }
}

module.exports = Criceto;