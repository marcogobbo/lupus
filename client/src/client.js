sock = io();

//HEREEEE
window.onload = () => {
    var session_id;
    // Get saved data from sessionStorage
    let data = window.sessionStorage.getItem('sessionId');
    console.log(data)
    sock.emit('start-session', {  sessionId: data });
}

sock.on("set-session-acknowledgement", function(data) {
    window.sessionStorage.setItem('sessionId', data.sessionId);
  
});

function _(el) {
    return document.getElementById(el);
}


goToLobby = () => {

    user = _('username').value;
    if (user) {
        //controllo se username è già presente
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('loadend', (res) => {
            // console.log(res.target)
            if (!res.target.response.includes(user)) {
                // se non c'è, inserisco e cambio pagina
                window.sessionStorage.setItem('user', user);
                console.log('SEND lobby: ', user)
                sock.emit('lobby', user);
                window.location.href = 'pages/lobby/lobby.html';
            }
            else {
                // se c'è già, avviso e faccio cambiare
                alert('Nome già selezionato!');
                _('username').focus();
                _('username').select();
            }

        });
        xhr.open('GET', '/users');
        xhr.send();

    }

}


const writeEvent = (text) => {
    //<ul> element
    const parent = document.querySelector('#events');

    //<li> element
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
};


const onFormSubmited = (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    //crea un messaggio con label 'message'
    sock.emit('message', text);
}

//quando arriva un messaggio in socket con label 'message'
sock.on('message', (text) => {
    writeEvent(text);
});

sock.on('test', (user) => {
    console.log('TESTTT!', user);
})

document
    .querySelector('#chat-form')
    .addEventListener('submit', onFormSubmited);

document.querySelector('#combo').addEventListener('change', (event) => {
    const chat = document.querySelector('#rps-wrapper');
    console.log(chat)
    if (event.target.value == "lupo")
        chat.style.display = 'block';
    else
        chat.style.display = 'none';
});