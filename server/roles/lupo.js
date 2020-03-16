const Role = require("./role");

class Lupo extends Role{
    constructor(){
        super("Lupo", "Tu sei il cattivo. Uccidi chi vuoi nella notte", "lupi", 1);
    }

    act(){
        console.log("Acting Like a WOLF. Yeah!");
    }
}

module.exports = Lupo;