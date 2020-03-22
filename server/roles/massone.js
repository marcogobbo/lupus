const Role = require("./role");

class Massone extends Role{
    constructor(){
        super("Massone", "Tra massoni vi riconoscete, è una garanzia in più!", "contadini", 0);
    }

    act(friends){
        console.log("Masso massone");
    }

    canAct(){
        //TODO!!
        return false;
    }
}

module.exports = Massone;