const Role = require("./role");

class Contadino extends Role{
    constructor(){
        super("Contadino", "Tu non fai niente", "contadini", 0);
    }

    act(friends){
        console.log("Acting Like a FARMER. Yeah!");
        //_nightActions.addAction(this.getName(),'PROVAAA CONTADINO');
    }
    
    canAct(){
        return false;
    }
}

module.exports = Contadino;