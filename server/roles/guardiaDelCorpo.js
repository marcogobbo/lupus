const Role = require("./role");

class GuardiaDelCorpo extends Role{
    constructor(){
        super("Guardia Del Corpo", "Tu non fai niente, per ora", "contadini", 0, "night");
    }

    act(){
        console.log("Acting Like a BODYGUARD. Yeah!");
    }
}

module.exports = GuardiaDelCorpo;