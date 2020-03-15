const Role = require("./role");

class Farmer extends Role{
    constructor(){
        super("Contadino", "Tu non fai niente", "contadini", 0, "day");
    }

    act(){
        console.log("Acting Like a FARMER. Yeah!");
    }
}

module.exports = Farmer;