//this class need to be completed and improved with the functions of the server.
const Role = require('./roles/role');
const Wolf = require('./roles/wolf');
const Farmer = require('./roles/farmer');

class LupusGame{
    constructor(players,connections,settings){
        // this._players=[];
        // for(var i=0;i<players.length;i++){
        //     this._players[i]=players[i];
        // }
        this._players=players;
        this._connections=connections;
        this._roles=[];
        this._computeRoles(settings);
    }

    _computeRoles(settings){
        console.log(settings);
        console.log(this._players);
        var i=0;
        for(var j=0;j<settings["lupi"];j++){
            this._roles[this._players[i]]= new Wolf();
            i++;
        }
        for(var j=0;j<settings["contadini"];j++){
            this._roles[this._players[i]]= new Farmer();
            i++;
        }

        console.log(this._roles);
        //this._roles.forEach(role=>{console.log("")});
        this._testActInTiming("day");
        this._testActInTiming("night");
    }

    _testActInTiming(curTiming){
        console.log("Whose playing during '"+curTiming+"'?");
        this._players.forEach(player =>{
            if(this._roles[player].checkTiming(curTiming)){
                console.log("["+player+"]");
                this._roles[player].act();
            }
        });
    }

    runTest(){
        /*
        Temporary method used to check the dynamic-binding of roles
        */
       console.log("running the test...");
    }

    deletePlayer(){
        /*
        This method is used to delete a player due to a disconnection
        */
    }

    updateSocketID(username){
        /*
        This method is used to recall the socketID update
        */
    }
}
module.exports = LupusGame;