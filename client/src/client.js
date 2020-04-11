sock = io();

function _(el) {
    return document.getElementById(el);
}

const admin = {
    'luca': 'LUCACECK',
    'filippo': 'PIPPO',
    'roberto': 'ROBY',
    'marco': 'M'
}

goToLobby = () => {
    // console.log(slideIndex)  

    user = _('username').value.toUpperCase();
    console.log('selected username', user)
    if (user) {
        //controllo se username è già presente
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('loadend', (res) => {
            console.log(res.target.response)

            switch (user) {
                case 'ADMIN_L':
                    user = admin.luca;
                    slideIndex = -1;
                    break;

                case 'ADMIN_F':
                    user = admin.filippo;
                    slideIndex = -1;
                    break;

                case 'ADMIN_R':
                    user = admin.roberto;
                    slideIndex = -1;
                    break;

                case 'ADMIN_M':
                    user = admin.marco;
                    slideIndex = -1;
                    break;
            }

            if (!JSON.parse(res.target.response).includes(user)) {

                // se non c'è, inserisco e cambio pagina
                console.log(user,slideIndex);
                window.sessionStorage.setItem('user', user);
                // console.log('SEND lobby: ', user)
                sock.emit('lobby', user, slideIndex);

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


/*
const writeEvent = (text) => {
    //<ul> element
    const parent = document.querySelector('#events');

    //<li> element
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
};
*/


const onFormSubmited = (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    //crea un messaggio con label 'message'
    sock.emit('message', text);
}

//quando arriva un messaggio in socket con label 'message'
/*

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
*/
