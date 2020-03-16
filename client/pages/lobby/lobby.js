const sock = io();
//const sock = require ('../../src/connection');
var myUser;
var players;

sock.on("set-session-acknowledgement", function (data) {
    window.sessionStorage.setItem('sessionId', data.sessionId);

});

window.onload = () => {

    myUser = sessionStorage.getItem('user');

    //send the update!
    sock.emit("updateSocketId", myUser);

    // _('myUserName').innerHTML = myUser;
    //get giocatori connessi
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('loadend', (e) => {
        console.log(e.target.response);
        addUserInLobby(JSON.parse(e.target.response));

        console.log(players)
        if (players[0] != myUser) {
            _('settings').innerHTML = '';
        }
    });
    xhr.open('GET', '/users');
    xhr.send();


}


//! NON FUNZIONA
window.addEventListener("close", function (event) {
    sock.emit('userClose', myUser);
    // make the close button ineffective
    event.preventDefault();
});

sock.on('usersInLobby', (user) => {
    console.log('usersInLobby', user);
    addUserInLobby(user);
})

sock.on('role', (role) => {
    console.log('Your role', role);
})

sock.on('uno', (role) => {
    alert('sei un ', role.toUpperString())
});

const addUserInLobby = (users) => {

    players = users;

    initNumRoles();

    checkMissingPlayers();


    const parent = document.querySelector('#list_users_fill');
    parent.innerHTML = '';

    users.forEach(element => {
        // <div class="character" id="me">
        //    <div class="user_img"><img src="../../assets/images/avatar.jpg"></div>
        //    <div class="user_name">Marco</div>
        // </div>
        const charac = document.createElement('div');
        charac.className = 'character';
        if (element == myUser)
            charac.id = 'me';

        const userimg = document.createElement('div');
        userimg.className = 'user_img';

        const img = document.createElement('img');
        img.src = '../../assets/images/avatar.jpg';

        const un = document.createElement('div');
        un.className = 'user_name'; un.innerHTML = element;


        charac.appendChild(userimg);
        userimg.appendChild(img);
        charac.appendChild(un);

        parent.appendChild(charac);

        // console.log(parent);
    });

    // const parent2 = document.querySelector('#events');
    // parent2.innerHTML = '';
    // //<li> element
    // users.forEach(element => {
    //     const el = document.createElement('li');
    //     el.innerHTML = element;
    //     parent2.appendChild(el);
    // });

};

function checkMissingPlayers() {
    missingPlayersN = 8 - players.length;
    if (players.length < 8) {
        _('missingPlayers').innerHTML = 'SERVONO ALTRI <b>' + missingPlayersN + '</b> GIOCATORI PER GIOCARE!!!';
        // _('giochiamoBTN').disabled = true;
    }
    else {
        _('missingPlayers').innerHTML = '';
        // _('giochiamoBTN').disabled = false;
    }
}

function initNumRoles() {
    if (players.length >= 8 && players.length < 14) {
        settings.lupi = 2;
    }
    else if (players.length >= 14) {
        settings.lupi = 3;
    }

    _('nLupi').value = settings.lupi;
    _('nGdc').value = settings.gdc;
    _('nVeggente').value = settings.veggente;

    updateContadini();
}


var settings = {
    'lupi': 0,
    'contadini': 0,
    'gdc': 0,
    'veggente': 1,
};

function decrease(el) {
    //non so come farlo quindi lo faccio così... so che è una mera
    switch (el) {
        case 'gdc':
            if (_('nGdc').value > 0)
                _('nGdc').value--;
            updateContadini();
            break;
        case 'veggente':
            if (_('nVeggente').value > 0)
                _('nVeggente').value--;
            updateContadini();
            break;
    }
}

function increase(el) {
    //non so come farlo quindi lo faccio così... so che è una mera
    switch (el) {
        case 'gdc':

            if (_('nGdc').value < 1)
                _('nGdc').value++;
            settings.gdc=_('nGdc').value;
            updateContadini();
            break;
        case 'veggente':

            if (_('nVeggente').value < 1)
                _('nVeggente').value++;
            settings.veggente=_('nVeggente').value;
            updateContadini();
            break;
    }
}

function _(el) {
    return document.getElementById(el);
}

function updateContadini() {
    var nCont = players.length - _('nLupi').value - _('nGdc').value - _('nVeggente').value;
    _('nContadini').value = nCont;
    settings.contadini = nCont;
}


function goPlay() {
    sock.emit('clientSettings', settings);
    // window.location.href='pages/game/game.html';
}