const Role = require("./role");

class Massone extends Role{
    constructor(){
        super("Massone", "Tra massoni vi riconoscete, è una garanzia in più!", "contadini", 0);
    }

    act(){
        console.log("Masso massone");
    }
}

module.exports = Massone;