const Role = require("./role");

class MagaCirce extends Role{
    constructor(){
        super("Maga Circe", "Sei una maga, usa i tuoi poteri e fai grugnire una persona al giorno!", "contadini", 0);
    }

    act(friends){
        console.log("Oink Oink! Eheheheh");
    }

    canAct(){
        //TODO!!
        return true;
    }
}

module.exports = MagaCirce;