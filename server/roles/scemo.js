const Role = require("./role");

class Scemo extends Role{
    constructor(){
        super("Scemo", "Sei lo scemo del villaggio, se muori al ballottaggio hai vinto!", "scemo", 0);
    }

    act(friends){
        console.log("Scemo chi legge");
    }

    canAct(){
        //TODO!!
        return false;
    }
}

module.exports = Scemo;