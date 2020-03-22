const Role = require("./role");

class Romeo extends Role{
    constructor(){
        super("Romeo", "Oh, Romeo Romeo, scegli la tua Giulietta e unitevi insieme fino alla morte", "contadini", 0);
    }

    act(friends){
        console.log("Cerco solo la mia Giulietta, che guardi?");
    }
    
    canAct(){
        //TODO!!
        return true;
    }
}

module.exports = Romeo;