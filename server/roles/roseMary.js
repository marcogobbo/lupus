const Role = require("./role");

class RoseMary extends Role{
    constructor(){
        super("Rose Mary", "Il tuo compito è quello di aiutare i lupi salvandoli dal voto!", "lupi", 1);
    }

    act(){
        console.log("Sono un rosmarino");
    }
}

module.exports = RoseMary;