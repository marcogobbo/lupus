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
    }

    act(){
        //method to be overloaded 
        console(this._name+" is doing his action");
    }

    vote(){
        //this method is used during the day to select pepole
        console(this._name+" is voting");
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
}

module.exports = Role;