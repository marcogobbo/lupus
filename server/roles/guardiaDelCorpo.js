const Role = require("./role");

class GuardiaDelCorpo extends Role{
    constructor(){
        super("Guardia Del Corpo", "Tu non fai niente, per ora", "contadini", 0);
    }

    act(friends){
        console.log("Acting Like a BODYGUARD. Yeah!");
    }

    canAct(){
        //TODO!!
        return true;
    }
}

module.exports = GuardiaDelCorpo;