const sock = io();

function _(el) {
    return document.getElementById(el);
}

goToLobby = () => {
    user = _('username').value;
    window.sessionStorage.setItem('user', user);
    console.log('SEND lobby: ',user)
    sock.emit('lobby', user);
    window.location.href = 'pages/lobby/lobby.html';
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