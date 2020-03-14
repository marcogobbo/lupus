const sock = io();
var myUser;

window.onload = () => {
    //get giocatori connessi
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('loadend', (e) => {
        console.log(e.target.response);
        addUserInLobby(JSON.parse(e.target.response));
    });
    xhr.open('GET', '/users');
    xhr.send();

    myUser = sessionStorage.getItem('user');
    _('myUserName').innerHTML = myUser;
}


sock.on('usersInLobby', (user) => {
    console.log('usersInLobby', user);
    addUserInLobby(user);
})

const addUserInLobby = (users) => {
    //<ul> element
    const parent = document.querySelector('#events');
    parent.innerHTML = '';
    //<li> element
    users.forEach(element => {
        const el = document.createElement('li');
        el.innerHTML = element;
        parent.appendChild(el);
    });

};


var settings = {
    'lupi': 0,
    'contadini': 0,
    'gdc': 0,
    'veggente': 0,
};

function decrease(el) {
    //non so come farlo quindi lo faccio così... so che è una mera
    switch (el) {
        case 'lupi':
            if (_('nLupi').value > 0)
                _('nLupi').value--;
            break;
        case 'contadini':
            if (_('nContadini').value > 0)
                _('nContadini').value--;
            break;
        case 'gdc':
            if (_('nGdc').value > 0)
                _('nGdc').value--;
            break;
        case 'veggente':
            if (_('nVeggent').value > 0)
                _('nVeggent').value--;
            break;
    }
}

function increase(el) {
    //non so come farlo quindi lo faccio così... so che è una mera
    switch (el) {
        case 'lupi':
            _('nLupi').value++;
            break;
        case 'contadini':
            _('nContadini').value++;
            break;
        case 'gdc':
            _('nGdc').value++;
            break;
        case 'veggente':
            _('nVeggent').value++;
            break;
    }
}

function _(el) {
    return document.getElementById(el);
}