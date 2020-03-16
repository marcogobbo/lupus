const Role = require("./role");

class Gufo extends Role{
    constructor(){
        super("Gufo", "Sei un contadino, il tuo compito è gufare, mandi direttamente al ballottaggio i giocatori.", "contadini", 0);
    }

    act(){
        console.log("Mi piace gufare!");
    }
}

module.exports = Gufo;