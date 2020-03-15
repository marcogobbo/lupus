const Role = require("./role");

class Veggente extends Role{
    constructor(){
        super("Veggente", "Tu non fai niente, per ora", "contadini", 0, "night");
    }

    act(){
        console.log("Acting Like a VEGGENTE(in inglese). Yeah!");
    }
}

module.exports = Veggente;