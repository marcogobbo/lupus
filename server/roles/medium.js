const Role = require("./role");

class Medium extends Role{
    constructor(){
        super("Medium", "Conoscerai il ruolo di chi è venuto a mancare durante il ballottaggio", "contadini", 0);
    }

    act(friends){
        console.log("Vedo, travedo, MA non prevedo, chiedi al Veggente");
    }

    canAct(){
        //TODO!!
        return false;
    }
}

module.exports = Medium;