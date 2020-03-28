const Role = require("./role");

class Contadino extends Role{
    constructor(){
        super("Contadino", "Tu non fai niente", "contadini", 0);
    }

    act(user, players, roles, sameRole){
        // io.to(user.connection).emit("farmer_night");
    }
    
    canAct(){
        return false;
    }
}

module.exports = Contadino;