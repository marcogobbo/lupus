const Role = require("./role");

class Wolf extends Role{
    constructor(){
        super("Lupo", "Tu sei il cattivo. Uccidi chi vuoi nella notte", "lupi", 1, "night");
    }

    act(){
        console.log("Acting Like a WOLF. Yeah!");
    }
}

module.exports = Wolf;