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
                if (lastClicked) {
                    document.getElementsByName(lastClicked)[0].removeAttribute('id');
                }
                sock.emit('logDay', myUser, userClicked)
                lastClicked = userClicked;
                document.getElementsByName(userClicked)[0].setAttribute('id', 'selected');
            }
        }
    }
}

sock.on('voting_time', () => {
    writeLog('VOTAZIONI APERTE', 'info');
})

sock.on('dead_player', (i, chiEMorto) => {
    writeLog('E\' MORTO QUALCUNO', 'info');
    alert(chiEMorto);

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
    // console.log('control_selection');
    // console.log('val:', val);
    // console.log('chipossovotare:', chiPossoVotare);
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

                        // console.log(elements[i].classList);
                        //! RIABILITARE TUTTI ALLA FINE DEL BALLOT
                    }
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
        if (elements[i].id != 'me') {
            elements[i].id = null;
            elements[i].setAttribute('onclick', `clickOther('${players[i]}')`);
        }
        //! RIABILITARE TUTTI ALLA FINE DEL BALLOT
    }
}

sock.on('writeLog', (voteObj, voteArr) => {
    writeLog('<b>' + voteObj.whoVoted + '</b>' + ' ha votato ' + '<b>' + voteObj.selected + '</b>');
    const parent = document.querySelector('#logs');
    parent.scrollTop = parent.scrollHeight;

    //update badges
    players.forEach((pl, i) => {
        let em = document.getElementsByName(pl)[0].children[0];
        // console.log(em)
        em.hidden = voteArr[i] > 0 ? false : true;
        em.innerHTML = voteArr[i];
    })
})

const writeLog = (text, controlMsg) => {
    //<ul> element
    const parent = document.querySelector('#log_table');

    //<li> element
    const tr = document.createElement('tr');
    tr.className = controlMsg;

    const td = document.createElement('td');

    td.innerHTML = text;
    tr.appendChild(td);
    parent.appendChild(tr);
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
    document.getElementById("sun").style = "top: 120px;";
    document.getElementById("moon").style = "top: 35px";

    // Cambio sfondo
    document.getElementById("sky").style = "background: #2C3E50;"
    // Avvio suono lupo
    // moon.play();      
}
function vaiAGiorno() {
    time = 'day';
    // Faccio transizione notte -> giorno cambiando posizione luna e sole
    document.getElementById("moon").style = "top: 120px;";
    document.getElementById("sun").style = "top: 30px;";

    // Cambio sfondo
    document.getElementById("sky").style = "background: #B2EBF2;";

    // Avvio suono
    // sun.play();
}

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