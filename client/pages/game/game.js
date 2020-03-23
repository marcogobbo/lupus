/**
 * si può votare se stessi e il morto
 * reset badge su time day
 * reset colori (ballottaggio, selected) in time day
 * click sui morti
 * voto su se stessi al ballottaggio/votazioni
 * voto dei morti e se stessi al ballottaggio
 * vincita: se c'è un vincente controllare il criceto
 */

const sock = io();
var myUser;
var myRole;
var players;
var deadPlayers = [];

// var time = 'night';
var time;

var canVote = false;

window.onload = () => {

    myUser = sessionStorage.getItem('user');
    myRole = JSON.parse(sessionStorage.getItem('role'));
    players = JSON.parse(sessionStorage.getItem('players'));
    _setPlayers();
    _setRole();
    _setDeadPlayers();
    //send the update!
    sock.emit("updateSocketId", myUser);
}

const _setDeadPlayers = () => {
    players.forEach(() => {
        deadPlayers.push(false);
    });
}


const _setRole = () => {
    document.getElementById("user_role_card").innerHTML += "<span>" + myRole.name + "</span>";
    document.getElementById("user_role_faction").innerHTML += "<span>" + ((myRole.color) ? "Nera" : "Bianca") + "</span>";
    document.getElementById("user_role_desc").innerHTML += "<span>" + myRole.description + "</span>";
}

const _setPlayers = () => {
    const parent = document.querySelector('#list_users_fill');

    players.forEach(element => {
        // <div class="character" id="me">
        //    <div class="user_img"><img src="../../assets/images/avatar.jpg"></div>
        //    <div class="user_name">Marco</div>
        // </div>
        const charac = document.createElement('div');
        charac.className = 'character';
        if (element == myUser)
            charac.id = 'me';
        else
            charac.setAttribute('onclick', `clickOther('${element}')`)
        charac.setAttribute('name', element);

        const em = document.createElement('em');
        em.innerHTML = 0;
        em.className = 'voted';
        em.hidden = true;


        const userimg = document.createElement('div');
        userimg.className = 'user_img';

        const img = document.createElement('img');
        img.src = '../../assets/images/avatar.jpg';

        const un = document.createElement('div');
        un.className = 'user_name';

        un.innerHTML = element;

        charac.appendChild(em);
        charac.appendChild(userimg);
        userimg.appendChild(img);
        charac.appendChild(un);

        parent.appendChild(charac);
    });
};


function _(el) {
    return document.getElementById(el);
}


var votoConfirmed = false;
var lastClicked = '';
function clickOther(userClicked) {
    // GIORNO
    if (canVote) {
        if (!votoConfirmed) {
            if (lastClicked != userClicked) {
                if (userClicked != deadPlayers[players.indexOf(userClicked)]) {
                    if (lastClicked) {
                        if (lastClicked != myUser)
                            document.getElementsByName(lastClicked)[0].removeAttribute('id');
                        else
                            document.getElementsByName(lastClicked)[0].setAttribute('id', 'me');
                    }
                    if (time == 'day')
                        sock.emit('logDay', myUser, userClicked)

                    lastClicked = userClicked;
                    document.getElementsByName(userClicked)[0].setAttribute('id', 'selected');
                }
            }
        }
    }
}

sock.on('voting_time', () => {
    writeLog('VOTAZIONI APERTE', 'info');
})

sock.on('dead_player', (i, chiEMorto) => {
    writeLog('\u00C8 MORTO QUALCUNO', 'info');
    console.log(chiEMorto);

    deadPlayers[i] = true;

    document.getElementsByClassName('character')[i].classList.remove('ballottaggio');
    document.getElementsByClassName('character')[i].classList.add('death');
})

sock.on('ballot_time', (players) => {
    writeLog('Vanno al ballottaggio: <b>' + players + '</b>', 'info');
    // console.log('ballot_time');
    // console.log('players:', players);

    var elements = document.getElementsByClassName('character');
    players.forEach(i => {
        // console.log(elements[i])
        elements[i].classList.remove('disabled');
        elements[i].classList.add('ballottaggio');
    });

})

sock.on('control_selection', (val, stato, chiPossoVotare) => {
    console.log('control_selection');
    // console.log('val:', val);
    console.log('chipossovotare:', chiPossoVotare);
    console.log('dead: ', deadPlayers)
    // console.log('stato:', stato)
    abilitaPlayers();

    // ARRIVA ALL'APERTURA DELLA VOTAZIONE (giorno, ballottaggio, notte)
    canVote = val;
    // if (stato == 'ballot') {
    var elements = document.getElementsByClassName('character');
    if (canVote) {

        document.querySelector('#box input[type="button"]').style.display = "inline";

        votoConfirmed = false;
        lastClicked = '';

        for (let i = 0; i < elements.length; i++) {
            // console.log(elements[i]);
            if (!chiPossoVotare[i])
                if (!deadPlayers[i])
                    if (elements[i].id != 'me') {
                        elements[i].classList.add('disabled');
                        elements[i].setAttribute('onclick', 'null')
                    }

            // console.log(elements[i].classList);
            //! RIABILITARE TUTTI ALLA FINE DEL BALLOT
        }


    } else {        // vuol dire che sono al ballottaggio
        for (let i = 0; i < elements.length; i++) {
            if (!deadPlayers[i])
                if (elements[i].id != 'me') {
                    elements[i].classList.add('disabled');
                    elements[i].setAttribute('onclick', 'null')
                    // console.log(elements[i].classList);
                    //! RIABILITARE TUTTI ALLA FINE DEL BALLOT
                }
        }
    }
    // }
})

function abilitaPlayers() {
    var elements = document.getElementsByClassName('character');

    var ems = document.getElementsByClassName('voted');
    for (let i = 0; i < ems.length; i++) {
        ems[i].hidden = true;
        ems[i].innerHTML = '';
    }

    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('disabled');
        // console.log(elements[i].classList);
        if (!deadPlayers[i]) {
            if (elements[i].id != 'me') {
                elements[i].id = null;
                elements[i].setAttribute('onclick', `clickOther('${players[i]}')`);
            } else {
                if (time == 'night') {
                    elements[i].setAttribute('onclick', `clickOther('${players[i]}')`);
                }
                else    //GIORNO
                    elements[i].setAttribute('onclick', null);
            }
        }
        //! RIABILITARE TUTTI ALLA FINE DEL BALLOT
    }
}

sock.on('writeLog', (voteObj, voteArr) => {
    if (time == 'day') {
        writeLog('<b>' + voteObj.whoVoted + '</b>' + ' ha votato ' + '<b>' + voteObj.selected + '</b>');

        //update badges
        players.forEach((pl, i) => {
            let em = document.getElementsByName(pl)[0].children[0];
            // console.log(em)
            em.hidden = voteArr[i] > 0 ? false : true;
            em.innerHTML = voteArr[i];
        })
    }
})

const writeLog = (text, controlMsg) => {
    //<ul> element
    const parent = document.querySelector('#log_table');

    //<li> element
    const tr = document.createElement('tr');
    tr.className = controlMsg;

    const td = document.createElement('td');
    console.log("Ci sono");
    td.innerHTML = text;
    tr.appendChild(td);
    parent.appendChild(tr);
    console.log("Ci sono ancora");
    // Ti prego fai uno scroll
    var logs = document.getElementsByClassName('logs');
    for (let i = 0; i < logs.length; i++)
        logs[i].scrollTop = logs[i].scrollHeight;

    console.log("Almeno fino a qui arrivo");
};

function confermaVoto() {
    if (time == 'day') {
        if (canVote)
            if (lastClicked != '') {
                sock.emit('confermaVoto', myUser);

                votoConfirmed = true;
                document.getElementById("selected").setAttribute('id', 'confirmed');
                document.querySelector('#box input[type="button"]').style.display = "none";
            }
    } else {
        //NOTTE
        if (canVote) {
            if (lastClicked != '') {
                sock.emit('role_selection', myUser, lastClicked);

                votoConfirmed = true;
                document.getElementById("selected").setAttribute('id', 'confirmed');
                document.querySelector('#box input[type="button"]').style.display = "none";
            }
        }
    }
}

sock.on('game_time', (text) => {
    console.log('game_time');
    console.log('time:', time)
    console.log('text:', text)

    switchDay(text);

    _('chat_board').hidden = true;
});

function switchDay(dayTime) {
    if (time != dayTime) {
        if (dayTime == 'night')
            vaiANotte();
        else
            vaiAGiorno();
    }
}

function vaiANotte() {
    time = 'night';

    // Faccio transizione giorno -> notte cambiando posizione sole e luna
    _("sun").style = "top: 120px;";
    _("moon").style = "top: 35px";

    // Cambio sfondo
    _("sky").style = "background: #2C3E50;"
    document.body.style = "background: #29402b;"

    // Avvio suono lupo
    // moon.play();      
}
function vaiAGiorno() {
    time = 'day';
    // Faccio transizione notte -> giorno cambiando posizione luna e sole
    _("moon").style = "top: 120px;";
    _("sun").style = "top: 30px;";

    // Cambio sfondo
    _("sky").style = "background: #B2EBF2;";
    document.body.style = "background: #7CB342;"
    // Avvio suono
    // sun.play();
}

function keyDown(event) {
    if (event.keyCode == 13)    //pressed enter
        sendMessage();

}
function sendMessage() {
    sock.emit('friends_chat_out', myUser, _('msg').value)
    _('msg').value = '';
}
sock.on('friends_chat', txt => {
    const chat = document.querySelector('.logs');
    chat.scrollTop = chat.scrollHeight;
    // console.log('friends_chat')
    const parent = document.querySelector('#chat_table');

    //<li> element
    const tr = document.createElement('tr');

    const td = document.createElement('td');

    td.innerHTML = txt;
    tr.appendChild(td);
    parent.appendChild(tr);

})


//! CONTROLLER ROLES //
sock.on('veggente_response', color => {
    console.log(color);
    writeLog('<b>' + lastClicked + '</b>' + ' è una carta <b>' + (color == 0 ? 'BIANCA' : 'NERA') + '</b>', 'response')

    var charac = document.getElementsByClassName('character')[players.indexOf(lastClicked)];
    charac.id = null;
    if (color == 0)
        charac.classList.add('cartaBianca');
    else
        charac.classList.add('cartaNera');
})

sock.on('my_friends', whoLupi => {
    //cambiare le foto con quella dei lupi
    if (whoLupi.length > 0) {
        _('chat_board').hidden = false;
    }
})

sock.on('wolf_response', voteArr => {
    console.log(voteArr)

    //update badges
    players.forEach((pl, i) => {
        let em = document.getElementsByName(pl)[0].children[0];
        // console.log(em)
        em.hidden = voteArr[i] > 0 ? false : true;
        em.innerHTML = voteArr[i];
    })
})


