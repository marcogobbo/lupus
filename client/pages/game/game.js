const sock = io();
var myUser;
var myRole;
var legend;
var players;
var deadPlayers = [];
var imagesIndexes = [];
// var time = 'night';
var time;

var canVote = false;
var last_giulietta = undefined;

window.onunload = () => {
    sock.emit('leaving_msg', myUser);
}

window.onbeforeunload = () => {
    return "Se lasci la pagina abbandoni la partita e non puoi più giocarci. Sei sicuro?";
}

window.onload = () => {
    var xhr2 = new XMLHttpRequest();
    xhr2.addEventListener('loadend', (e) => {
        // console.log(e.target)
        imagesIndexes = JSON.parse(e.target.response);
        myUser = sessionStorage.getItem('user');
        myRole = JSON.parse(sessionStorage.getItem('role'));
        players = JSON.parse(sessionStorage.getItem('players'));
        legend = JSON.parse(sessionStorage.getItem('legend'));
        _setLegend();
        _setPlayers();
        _setRole();
        _setDeadPlayers();
        //send the update!
        sock.emit("updateSocketId", myUser);
    });

    xhr2.open('GET', '/images');
    xhr2.send();

}

const _setDeadPlayers = () => {
    players.forEach(() => {
        deadPlayers.push(false);
    });
}

const _setLegend = () => {
    var table = document.querySelector("#table-legend table");
    for (let i = 0; i < legend.length; i++) {

        var image = (legend[i].name != 'Contadino' ? legend[i].name : 'contadino8') + ".png";
        var name = legend[i].name + " (x" + legend[i].quantity + ")";
        var color = legend[i].color == 0 ? "BIANCA" : "NERA";
        var description = legend[i].description;
        var txt = `
        <tr>
            <td>
                <div id="user_role">
                    <div id="user_role_img">
                        <img src="../../assets/images/`+ image +
            `">
                                </div>
                                <div id="user_details">
                                    <p id="user_role_card"><b>PERSONAGGIO: </b>
                                        <span>`+ name +
            `</span>
                                    </p>
                                    <p id="user_role_faction"><b>CARTA: </b><span>
                                    `+ color +
            `</span>
                                    </p>
                                    <p id="user_role_desc"><b>DESCRIZIONE: </b><span>`+ description +
            `</span>
                                    </p>
                                </div>
                            </div>
                        </td>
        </tr>
      `;
        table.innerHTML += txt;
    }
}

const _setRole = () => {
    document.getElementById("profile").innerHTML = '<span class="' + ((myRole.color) ? "nera" : "bianca") + '">' + myRole.name + "</span>";
    //document.getElementById("user_role_faction").innerHTML += "<span>" + ((myRole.color) ? "Nera" : "Bianca") + "</span>";
    //document.getElementById("user_role_desc").innerHTML += "<span>" + myRole.description + "</span>";
    console.log(myRole)
    if (myRole.name != 'Contadino') {
        document.getElementById('me').children[1].children[0].src = '../../assets/images/' + myRole.name + '.png';
        //  document.getElementById('user_role_img').children[0].src = '../../assets/images/' + myRole.name + '.png';
    } else
        document.getElementById('user_role_img').children[0].src = '../../assets/images/contadino' + imagesIndexes[players.indexOf(myUser)] + '.png';
}

const _setPlayers = () => {
    const parent = document.querySelector('#list_users_fill');

    players.forEach((element, i) => {
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
        if (imagesIndexes[i] == -1) {
            switch (element) {
                case 'LUCACECK':
                    img.src = '../../assets/images/admin_l.png';
                    break;

                case 'PIPPO':
                    img.src = '../../assets/images/admin_f.png';
                    break;

                case 'ROBY':
                    img.src = '../../assets/images/admin_r.png';
                    break;

                case 'M':
                    img.src = '../../assets/images/admin_m.png';
                    break;
            }
        }
        else
            img.src = '../../assets/images/contadino' + imagesIndexes[i] + '.png';

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

sock.on('dead_player', (i, chiEMorto, dayTime) => {
    //morte viene dopo il cambio giorno
    if (dayTime == 'night')
        if (chiEMorto != null)
            writeLog('\u00C8 MORTO ' + chiEMorto + ' &#128534;', 'info');
        else
            writeLog('NON \u00C8 MORTO NESSUNO &#129300', 'info')
    else //dayTime == 'day'
        if (chiEMorto != null)
            writeLog(chiEMorto + ' \u00C8 STATO LINCIATO &#128561;', 'info');
        else
            writeLog('NON \u00C8 MORTO NESSUNO &#129300', 'info')
    console.log(chiEMorto);

    deadPlayers[i] = true;

    var elements = document.getElementsByClassName('character');

    elements[i].id = null;
    elements[i].classList.remove('ballottaggio');
    elements[i].classList.add('death');
    elements[i].setAttribute('onclick', 'null')

    if (amIDead()) {
        //se sono morto, disabilito tutti
        for (let j = 0; j < elements.length; j++) {
            if (!deadPlayers[j])    //!solo quelli non morti
                elements[j].classList = 'character disabled';
            elements[j].setAttribute('onclick', null);
        }
    }
})

sock.on('ballot_time', (playersBallot) => {

    var str = '';
    for (let x = 0; x < playersBallot.length - 1; x++) {
        str += players[playersBallot[x]] + ', ';
    }
    str += players[playersBallot[playersBallot.length - 1]];

    writeLog('Vanno al ballottaggio: <b>' + str + '</b>', 'info');
    // console.log('ballot_time');
    // console.log('players:', players);

    var elements = document.getElementsByClassName('character');
    playersBallot.forEach(i => {
        // console.log(elements[i])
        elements[i].classList.remove('disabled');
        elements[i].classList.add('ballottaggio');
    });

})

sock.on('control_selection', (val, stato, chiPossoVotare) => {

    _('conferma_voto').hidden = false;
    _('romeo_btn').hidden = true;

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

        if (myRole.name == 'Romeo') {
            _('romeo_btn').hidden = false;
            // _('romeo_btn').style.display = "inline";
        }
        else {
            _('romeo_btn').hidden = true;
            // _('romeo_btn').style.display = "none";
        }
        // document.querySelector('#box input[type="button"]').style.display = "inline";

        votoConfirmed = false;
        lastClicked = '';

        for (let i = 0; i < elements.length; i++) {
            // console.log(elements[i]);
            if (!chiPossoVotare[i] && !deadPlayers[i]) {
                if (elements[i].id != 'me') {
                    elements[i].classList.add('disabled');
                }
                elements[i].setAttribute('onclick', 'null')
            }


            // console.log(elements[i].classList);
            //! RIABILITARE TUTTI ALLA FINE DEL BALLOT
        }


    } else {
        _('conferma_voto').hidden = true;
        // document.querySelector('#box input[type="button"]').style.display = "none";

        // vuol dire che sono al ballottaggio
        for (let i = 0; i < elements.length; i++) {
            if (!deadPlayers[i])
                if (elements[i].id != 'me') {
                    elements[i].classList.add('disabled');
                    elements[i].setAttribute('onclick', 'null')
                    // console.log(elements[i].classList);
                    //! RIABILITARE TUTTI ALLRE TUTTI ALLA FINE DEL BALLOT
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
    console.log('arrivato WRITELOG onPlayerSelected')
    if (time == 'day') {
        //writeLog('<b>' + voteObj.whoVoted + '</b>' + ' ha votato ' + '<b>' + voteObj.selected + '</b>');

        //update badges
        players.forEach((pl, i) => {
            let em = document.getElementsByName(pl)[0].children[0];
            // console.log(em)
            em.hidden = voteArr[i] > 0 ? false : true;
            em.innerHTML = voteArr[i];
        })
    }
})

sock.on('voteConfirmed', (voteObj, voteArr) => {
    if (time == 'day') {
        writeLog('<b>' + voteObj.whoVoted + '</b>' + ' ha votato ' + '<b>' + voteObj.selected + '</b>');

        //update badges
        // players.forEach((pl, i) => {
        //     let em = document.getElementsByName(pl)[0].children[0];
        //     // console.log(em)
        //     em.hidden = voteArr[i] > 0 ? false : true;
        //     em.innerHTML = voteArr[i];
        // })
    }
})

const writeLog = (text, controlMsg) => {
    //<ul> element
    const parent = document.querySelector('#log_table');

    //<li> element
    const tr = document.createElement('tr');
    tr.className = controlMsg;

    const td = document.createElement('td');
    // console.log("Ci sono");
    td.innerHTML = text;
    tr.appendChild(td);
    parent.appendChild(tr);
    // console.log("Ci sono ancora");
    var logs = document.getElementsByClassName('logs');
    for (let i = 0; i < logs.length; i++)
        logs[i].scrollTop = logs[i].scrollHeight;
};

sock.on('friends_chat', txt => {
    const chat = document.getElementsByClassName('logs chat')[0];
    // console.log('friends_chat')
    const parent = document.querySelector('#chat_table');

    //<li> element
    const tr = document.createElement('tr');

    const td = document.createElement('td');

    td.innerHTML = txt;
    tr.appendChild(td);
    parent.appendChild(tr);
    chat.scrollTop = chat.scrollHeight;
    console.log(chat)

})

function confermaVoto() {
    if (time == 'day') {
        if (canVote)
            if (lastClicked != '') {
                sock.emit('confermaVoto', myUser, lastClicked);

                votoConfirmed = true;
                document.getElementById("selected").setAttribute('id', 'confirmed');

                // document.querySelector('#box input[type="button"]').style.display = "none";
                _('conferma_voto').hidden = true;
                _('romeo_btn').hidden = true;
            }
    } else {
        //NOTTE
        if (canVote) {
            if (lastClicked != '') {
                sock.emit('role_selection', myUser, lastClicked);

                votoConfirmed = true;
                document.getElementById("selected").setAttribute('id', 'confirmed');

                // document.querySelector('#box input[type="button"]').style.display = "none";
                _('conferma_voto').hidden = true;
                _('romeo_btn').hidden = true;
            }
        }
    }
}

function confermaNessuno() {
    res = confirm("Selezionando 'Nessuno', questa notte non sceglierai la tua Giulietta. Continuare?")
    if (res) {
        sock.emit('role_selection', myUser, null);
        // _('romeo_btn').style.display = "none";
        // document.querySelector('#box input[type="button"]').style.display = "none";
        _('conferma_voto').hidden = true;
        _('romeo_btn').hidden = true;
    }
}

sock.on('game_time', (text) => {
    console.log('game_time');
    console.log('time:', time)
    console.log('text:', text)

    switchDay(text);

    resetCharacters();

    _('chat_board').hidden = true;
});

function amIDead() {
    console.log(deadPlayers)
    if (deadPlayers[players.indexOf(myUser)])
        return true;
    else
        return false;
}


function resetCharacters() {
    var elements = document.getElementsByClassName('character');

    var ems = document.getElementsByClassName('voted');
    for (let i = 0; i < ems.length; i++) {
        ems[i].hidden = true;
        ems[i].innerHTML = '';
    }

    canVote = false;

    if (amIDead()) {
        //se sono morto, disabilito tutti
        for (let j = 0; j < elements.length; j++) {
            if (!deadPlayers[j])    //!solo quelli non morti
                elements[j].classList = 'character disabled';
            elements[j].setAttribute('onclick', null);
        }
    } else {
        //se NON sono morto, riabilito tutti, rimuovo classi, abilito click
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove('disabled', 'ballottaggio');
            elements[i].classList.remove('cartaNera', 'cartaBianca');

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
}

function switchDay(dayTime) {
    if (time != dayTime) {
        if (dayTime == 'night') {
            vaiANotte();
            writeLog('Buonanotte. &#128564;', 'response');
            if (myRole.name == "Romeo" && last_giulietta != undefined) {
                document.getElementsByClassName('character')[last_giulietta.index].children[1].children[0].src = last_giulietta.pic;
                last_giulietta = undefined;
            }
        }
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
    _('romeo_btn').style.display = "none";
    // Avvio suono
    // sun.play();
}

function keyDown(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        sendMessage();
    }

}
function sendMessage() {
    sock.emit('friends_chat_out', myUser, _('msg').value);
    _('msg').value = '';
}


sock.on('found_winner', team => {
    //da cambiare poi con gli alri
    var win;


    writeLog('HANNO VINTO I ' + team.toUpperCase());
    disableAll()
})

function disableAll() {
    var elements = document.getElementsByClassName('character');

    for (let j = 0; j < elements.length; j++) {
        if (!deadPlayers[j])
            elements[j].classList = 'character disabled';
        elements[j].setAttribute('onclick', null);
    }

    var ems = document.getElementsByClassName('voted');
    for (let i = 0; i < ems.length; i++) {
        ems[i].hidden = true;
        ems[i].innerHTML = '';
    }

    _('conferma_voto').hidden = true;
    _('romeo_btn').hidden = true;
}

//! CONTROLLER ROLES //
sock.on('veggente_response', (username, color) => {
    console.log(color);
    writeLog('<b>' + username + '</b>' + ' è una carta <b>' + (color == 0 ? 'BIANCA &#128519;' : 'NERA &#128520;') + '</b>', 'response')

    var charac = document.getElementsByClassName('character')[players.indexOf(username)];
    charac.id = null;
    if (color == 0)
        charac.classList.add('cartaBianca');
    else
        charac.classList.add('cartaNera');
})

sock.on('my_friends', whoLupi => {
    //cambiare le foto con quella dei lupi
    whoLupi.forEach(element => {
        document.getElementsByClassName('character')[element].children[1].children[0].src = '../../assets/images/' + (myRole.name == "Figlio del lupo" ? "Lupo" : myRole.name) + '.png';
    });

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

sock.on('guardia_response', username => {
    console.log('VUOI SALVARE ' + username)
})

sock.on('medium_response', (lastDeadPlayer, color) => {
    writeLog('<b>' + lastDeadPlayer + '</b>' + ' è una carta <b>' + (color == 0 ? 'BIANCA &#128519;' : 'NERA &#128520;') + '</b>', 'response')
})

sock.on('gufo_response', username => {
    console.log('VUOI MANDARE AL BALLOTTAGGIO ' + username)
})

sock.on('romeo_response', (username, idx) => {
    if (username != null)
        writeLog('Per questa notte <b>' + username + '</b> è la tua Giulietta.', 'response');
    else
        writeLog('Hai deciso di NON scegliere la tua Giulietta.', 'response');
    last_giulietta = {
        'index': idx,
        'pic': document.getElementsByClassName('character')[idx].children[1].children[0].src
    }
    document.getElementsByClassName('character')[idx].children[1].children[0].src = '../../assets/images/' + "Giulietta" + '.png';

})

sock.on('draw_repetition', () => {
    writeLog('Decidetevi! Votate di nuovo.', 'response');
})

sock.on('new_wolf', () => {
    writeLog('Questa notte è nato un nuovo Lupo.', 'response');
})

sock.on('figlio_del_lupo', (idx) => {
    writeLog('Questa notte i lupi ti hanno indicato. Ora sei uno di loro.', 'response');
    document.getElementsByClassName('character')[idx].children[1].children[0].src = '../../assets/images/' + "Lupo" + '.png';
})

sock.on('new_friend_wolf', (idx) => {
    document.getElementsByClassName('character')[idx].children[1].children[0].src = '../../assets/images/' + myRole.name + '.png';
});


// sock.on('farmer_night', () => {
//     writeLog('Buonanotte. &#128564;', 'response');
// })

/**
 * INTERVAL UPDATE
 */
sock.on('remaining_time', timeLeft => {
    var min = Math.floor((timeLeft / 1000) / 60);
    var sec = timeLeft / 1000 - min * 60;
    document.getElementById("min").innerHTML = (min < 10 ? "0" : "") + min;
    document.getElementById("sec").innerHTML = (sec < 10 ? "0" : "") + sec;
    //console.log(timeLeft);
});

sock.on('timeout_alert', time => {
    //console.log("time-out - "+time);
    writeLog('<b>TIME-OUT</b> (' + time + ')', time == 'night' ? 'response' : 'info');
});