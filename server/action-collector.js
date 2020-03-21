class ActionCollector {
    constructor(){
        this._actions=[];
    }

    addAction(roleName, selection){
        this._actions.push({'role':roleName, 'selected':selection});
    }

    getActions(){
        return this._actions;
    }
}

module.exports = ActionCollector;