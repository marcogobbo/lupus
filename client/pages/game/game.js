const sock = io();
var myUser;
var myRole;
var players;

var time = 'giorno';

window.onload = () => {

    myUser = sessionStorage.getItem('user');
    myRole = JSON.parse(sessionStorage.getItem('role'));
    players = JSON.parse(sessionStorage.getItem('players'));
    _setPlayers();
    _setRole();

    //send the update!
    sock.emit("updateSocketId", myUser);
}

const _setRole = () => {
    document.getElementById("user_role_card").innerHTML += "<span>" + myRole.name + "</span>";

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

        const userimg = document.createElement('div');
        userimg.className = 'user_img';

        const img = document.createElement('img');
        img.src = '../../assets/images/avatar.jpg';

        const un = document.createElement('div');
        un.className = 'user_name';

        un.innerHTML = element;

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
    document.getElementById("sun").style = "top: 18%;";
    document.getElementById("moon").style = "top: -2%;";

    // Cambio sfondo
    document.getElementById("sky").style = "background: #2C3E50;"
    // Avvio suono lupo
    // moon.play();      
}
function notteToGiorno() {
    // Faccio transizione notte -> giorno cambiando posizione luna e sole
    document.getElementById("moon").style = "top: 17%;";
    document.getElementById("sun").style = "top: 1%;";

    // Cambio sfondo
    document.getElementById("sky").style = "background: #B2EBF2;";

    // Avvio suono
    // sun.play();
}

var votoConfirmed = false;
var lastClicked = '';
function clickOther(userClicked) {
    if (!votoConfirmed)
        if (lastClicked != userClicked) {
            sock.emit('logDay', myUser, userClicked)
            lastClicked = userClicked;
        }
}

sock.on('writeLog', (voteArr,voteObj) => {
    writeLog(voteObj.whoVoted + ' selected ' + voteObj.selected);
    console.log(voteArr)
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
    votoConfirmed = true;
}