const sock = io();
var myUser;
var players;

const admin = {
    'luca': 'LUCACECK',
    'filippo': 'PIPPO',
    'roberto': 'ROBY',
    'marco': 'M'
}

window.onload = () => {
    myUser = sessionStorage.getItem('user');
    //send the update!
    sock.emit("updateSocketId", myUser);

    // _('myUserName').innerHTML = myUser;
    //get giocatori connessi
    var xhr2 = new XMLHttpRequest();
    xhr2.addEventListener('loadend', (e) => {
        imagesIndexes = JSON.parse(e.target.response);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('loadend', (e) => {

            console.log(e.target.response);
            addUserInLobby(JSON.parse(e.target.response));

            if (players[0] != myUser) {
                _('settings').innerHTML = '';
            }
        });
        xhr.open('GET', '/users');
        xhr.send();
    });
    xhr2.open('GET', '/images');
    xhr2.send();

    _('minGiorno').value = 3;
    _('minNotte').value = 2;
}

imagesIndexes = [];
sock.on('usersInLobby', (user, _imagesIndexes) => {
    console.log('usersInLobby', user);
    imagesIndexes = _imagesIndexes;
    addUserInLobby(user);
    console.log(imagesIndexes)
})

//When each client received the role, go to the game page
sock.on('role', (role, legend) => {
    console.log('Your role', role);
    console.log('Legend', legend);
    window.sessionStorage.setItem('role', JSON.stringify(role));
    window.sessionStorage.setItem('legend', JSON.stringify(legend));
    window.sessionStorage.setItem('players', JSON.stringify(players));
    window.location.href = '../game/game.html';
})

const addUserInLobby = (users) => {

    players = users;

    if (players[0] == myUser) {
        initNumRoles();
        checkMissingPlayers();
    }

    const parent = document.querySelector('#list_users_fill');
    parent.innerHTML = '';

    players.forEach((element, i) => {
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
        console.log(imagesIndexes[i])

        if (imagesIndexes[i] == -1) {
            switch (element) {
                case 'LUCACECK':
                    // myUser = admin.luca;
                    img.src = '../../assets/images/admin_l.png';
                    break;

                case 'PIPPO':
                    // myUser = admin.filippo;
                    img.src = '../../assets/images/admin_f.png';
                    break;

                case 'ROBY':
                    // myUser = admin.roberto;
                    img.src = '../../assets/images/admin_r.png';
                    break;

                case 'M':
                    // myUser = admin.marco;
                    img.src = '../../assets/images/admin_m.png';
                    break;
            }
        }
        else
            img.src = '../../assets/images/contadino' + imagesIndexes[i] + '.png';

        const un = document.createElement('div');
        un.className = 'user_name'; un.innerHTML = players[i];


        charac.appendChild(userimg);
        userimg.appendChild(img);
        charac.appendChild(un);

        parent.appendChild(charac);

        // console.log(parent);
    });
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
    _('nMedium').value = settings.medium;
    _('nGufo').value = settings.gufo;
    _('nCriceto').value = settings.criceto;
    _('nRoseMary').value = settings.roseMary;
    _('nScemo').value = settings.scemo;
    _('nRomeo').value = settings.scemo;
    _('nFiglioDelLupo').value = settings.scemo;

    updateContadini();
}


var settings = {
    'lupi': 0,
    'contadini': 0,
    'gdc': 0,
    'veggente': 1,
    'medium': 0,
    'gufo': 0,
    'criceto': 0,
    'roseMary': 0,
    'scemo': 0,
    'romeo': 0,
    'figlioDelLupo': 0
};

function decrease(el) {
    //non so come farlo quindi lo faccio così... so che è una mera
    switch (el) {
        case 'gdc':
            if (_('nGdc').value > 0)
                _('nGdc').value--;
            settings.gdc = _('nGdc').value;
            updateContadini();
            break;
        case 'veggente':
            if (_('nVeggente').value > 0)
                _('nVeggente').value--;
            settings.veggente = _('nVeggente').value;
            updateContadini();
            break;
        case 'medium':
            if (_('nMedium').value > 0)
                _('nMedium').value--;
            settings.medium = _('nMedium').value;
            updateContadini();
            break;
        case 'gufo':
            if (_('nGufo').value > 0)
                _('nGufo').value--;
            settings.gufo = _('nGufo').value;
            updateContadini();
            break;
        case 'criceto':
            if (_('nCriceto').value > 0)
                _('nCriceto').value--;
            settings.criceto = _('nCriceto').value;
            updateContadini();
            break;
        case 'roseMary':
            if (_('nRoseMary').value > 0)
                _('nRoseMary').value--;
            settings.roseMary = _('nRoseMary').value;
            updateContadini();
            break;
        case 'scemo':
            if (_('nScemo').value > 0)
                _('nScemo').value--;
            settings.scemo = _('nScemo').value;
            updateContadini();
            break;
        case 'romeo':
            if (_('nRomeo').value > 0)
                _('nRomeo').value--;
            settings.romeo = _('nRomeo').value;
            updateContadini();
            break;
        case 'figlioDelLupo':
            if (_('nFiglioDelLupo').value > 0)
                _('nFiglioDelLupo').value--;
            settings.figlioDelLupo = _('nFiglioDelLupo').value;
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
            settings.gdc = _('nGdc').value;
            updateContadini();
            break;
        case 'veggente':

            if (_('nVeggente').value < 1)
                _('nVeggente').value++;
            settings.veggente = _('nVeggente').value;
            updateContadini();
            break;
        case 'medium':
            if (_('nMedium').value < 1)
                _('nMedium').value++;
            settings.medium = _('nMedium').value;
            updateContadini();
            break;
        case 'gufo':
            if (_('nGufo').value < 1)
                _('nGufo').value++;
            settings.gufo = _('nGufo').value;
            updateContadini();
            break;
        case 'criceto':
            if (_('nCriceto').value < 1)
                _('nCriceto').value++;
            settings.criceto = _('nCriceto').value;
            updateContadini();
            break;
        case 'roseMary':
            if (_('nRoseMary').value < 1)
                _('nRoseMary').value++;
            settings.roseMary = _('nRoseMary').value;
            updateContadini();
            break;
        case 'scemo':
            if (_('nScemo').value < 1)
                _('nScemo').value++;
            settings.scemo = _('nScemo').value;
            updateContadini();
            break;
        case 'romeo':
            if (_('nRomeo').value < 1)
                _('nRomeo').value++;
            settings.romeo = _('nRomeo').value;
            updateContadini();
            break;
        case 'figlioDelLupo':
            if (_('nFiglioDelLupo').value < 1)
                _('nFiglioDelLupo').value++;
            settings.figlioDelLupo = _('nFiglioDelLupo').value;
            updateContadini();
            break;
    }
}

function _(el) {
    return document.getElementById(el);
}

function increaseTimer(el) {
    if (_(el).value < 5)
        _(el).value++;
}

function decreaseTimer(el) {
    if (_(el).value > (el == 'minGiorno' ? 3 : 2))
        _(el).value--;
}

function updateContadini() {
    var nCont = players.length
        - _('nLupi').value
        - _('nGdc').value
        - _('nVeggente').value
        - _('nMedium').value
        - _('nGufo').value
        - _('nCriceto').value
        - _('nRoseMary').value
        - _('nScemo').value
        - _('nRomeo').value
        - _('nFiglioDelLupo').value;

    _('nContadini').value = nCont;
    settings.contadini = nCont;
}

function goPlay() {
    settings.timerDay = _('minGiorno').value;
    settings.timerNight = _('minNotte').value;
    sock.emit('clientSettings', settings);
}