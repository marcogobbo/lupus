class ActionCollector {
    constructor() {
        this._actions = [];
        this._previous = [];
        // this._nightCount=-1;
        this._nightCount = -1;
    }

    newNight() {
        while (this._previous.length != 0)
            this._previous.pop();
        while (this._actions.length != 0)
            this._previous.push(this._actions.pop());
        this._nightCount++;
    }

    addAction(roleName, selection) {
        this._actions.push({ 'role': roleName, 'selected': selection });
    }

    removeAction(roleName) {
        var newer = [];
        for (var i = 0; i < this._actions.length; i++) {
            if (this._actions[i].role != roleName)
                newer.push(this._actions[i].selected);
        }
        this._actions = newer;
    }

    getActions() {
        return this._actions;
    }

    getPrevious() {
        return this._previous;
    }

    getActionsByRoleName(roleName) {
        var temp = [];
        for (var i = 0; i < this._actions.length; i++) {
            if (this._actions[i].role == roleName)
                temp.push(this._actions[i].selected);
        }
        return temp;
    }

    getPreviousByRoleName(roleName) {
        var temp = [];
        for (var i = 0; i < this._previous.length; i++) {
            if (this._previous[i].role == roleName)
                temp.push(this._previous[i].selected);
        }
        return temp;
    }

    getNightCount() {
        return this._nightCount;
    }
}

module.exports = ActionCollector;