/*ABSTRACT class: it is a temporary version. */
class Role{
    constructor(name, description, squad, color){
        if (this.constructor === Role) {
            throw new Error('Cannot instanciate directly the class Role');
        }
        this._name=name;
        this._description=description;
        this._squad=squad;
        this._color=color;
        this._alive=true;
    }

    act(user, friends){
        //method to be overloaded 
        console(this._name+"'s action");
        console(nightActions, friends);
    }

    onResponse(username){
        console(username);
    }

    canAct(){
    }

    getName(){
        return this._name;
    }
    
    getDescription(){
        return this._description;
    }
    
    getSquad(){
        return this._squad;
    }

    getColor(){
        return this._color;
    }
    
    setSquad(squad){
        this._squad=squad;
    }

    setColor(color){
        this._color=color;
    }

    isAlive(){
        return this._alive;
    }
    
    kill(){
        this._alive=false;
    }
}

module.exports = Role;