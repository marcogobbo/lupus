const Role = require("./role");

class Contadino extends Role{
    constructor(){
        super("Contadino", "Tu non fai niente", "contadini", 0);
    }

    act(){
        console.log("Acting Like a FARMER. Yeah!");
    }
}

module.exports = Contadino;