const Role = require("./role");

class FiglioDelLupo extends Role{
    constructor(){
        super("Figlio del lupo", "Sei un piccolo cucciolo indifeso, giochi con i contadini, ma non appena i lupi di uccidono farai parte del loro branco", "contadini", 0);
    }

    act(friends){
        console.log("Sono un piccolo cucciolo tenero, piacere");
    }

    canAct(){
        //TODO!!
        return true;
    }
}

module.exports = FiglioDelLupo;