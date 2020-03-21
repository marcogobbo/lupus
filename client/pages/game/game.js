const sock = io();
var myUser;
var myRole;
var players;
var deadPlayers = [];

var time = 'giorno';

var canVote = true;

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

function switchDay() {
    if (time == 'giorno') {
        time = 'notte';
        giornoToNotte();
        _('log_board').hidden = true;
    }
    else {
        time = 'giorno';
        notteToGiorno();
        _('log_board').hidden = false;
    }
};

function giornoToNotte() {
    // Faccio transizione giorno -> notte cambiando posizione sole e luna
    document.getElementById("sun").style = "top: 120px;";
    document.getElementById("moon").style = "top: 35px";

    // Cambio sfondo
    document.getElementById("sky").style = "background: #2C3E50;"
    // Avvio suono lupo
    // moon.play();      
}
function notteToGiorno() {
    // Faccio transizione notte -> giorno cambiando posizione luna e sole
    document.getElementById("moon").style = "top: 120px;";
    document.getElementById("sun").style = "top: 30px;";

    // Cambio sfondo
    document.getElementById("sky").style = "background: #B2EBF2;";

    // Avvio suono
    // sun.play();
}

var votoConfirmed = false;
var lastClicked = '';
function clickOther(userClicked) {
    if (canVote)
        if (!votoConfirmed)
            if (lastClicked != userClicked) {
                if (lastClicked) {
                    document.getElementsByName(lastClicked)[0].removeAttribute('id');
                }
                sock.emit('logDay', myUser, userClicked)
                lastClicked = userClicked;
                document.getElementsByName(userClicked)[0].setAttribute('id', 'selected');
            }
}

sock.on('voting_time', () => {
    writeLog('VOTAZIONI APERTE');
})

sock.on('ballot_time', (players) => {
    writeLog('BALLOTTAGGIO ' + players);
})

sock.on('control_selection', (val, chiPossoVotare) => {
    // console.log('control.selection');
    canVote = val;
    if (canVote) {
        var elements = document.getElementsByClassName('character');



        // chipossovotare   [0,0,1,1,1,0,1]
        // dead             [1,0,0,0,0,0,0]

        for (let i = 0; i < elements.length; i++) {
            // console.log(elements[i]);
            if (!chiPossoVotare[i])
                if (!deadPlayers[i]) {
                    elements[i].classList.add('disabled');
                    elements[i].setAttribute('onclick', 'null')
                    //! RIABILITARE TUTTI ALLA FINE DEL BALLOT
                }
        }
    }

})

sock.on('writeLog', (voteObj, voteArr) => {
    writeLog(voteObj.whoVoted + ' selected ' + voteObj.selected);
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

const writeLog = (text) => {
    //<ul> element
    const parent = document.querySelector('#log_table');

    //<li> element
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.innerHTML = text;
    tr.appendChild(td);
    parent.appendChild(tr);
};

function confermaVoto() {
    if (lastClicked != '') {
        sock.emit('confermaVoto', myUser);

        votoConfirmed = true;
        document.getElementById("selected").setAttribute('id', 'confirmed');
        document.querySelector('#box input[type="button"]').style.display = "none";
    }
}