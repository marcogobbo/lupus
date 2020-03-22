const Role = require("./role");

class Gufo extends Role{
    constructor(){
        super("Gufo", "Sei un contadino, il tuo compito è gufare, mandi direttamente al ballottaggio i giocatori.", "contadini", 0);
    }

    act(friends){
        console.log("Mi piace gufare!");
    }

    canAct(){
        //TODO!!
        return true;
    }
}

module.exports = Gufo;