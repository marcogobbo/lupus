const sock = io();

window.onload = () => {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('loadend', (e) => {
        console.log(e.target.response);

        addUserInLobby(JSON.parse(e.target.response));
    });

    xhr.open('GET', '/users');
    xhr.send();

}


sock.on('usersInLobby', (user) => {
    console.log('usersInLobby', user);
    addUserInLobby(user);
})

const addUserInLobby = (users) => {
    //<ul> element
    const parent = document.querySelector('#events');
    parent.innerHTML = '';
    //<li> element
    users.forEach(element => {
        const el = document.createElement('li');
        el.innerHTML = element;
        parent.appendChild(el);
    });

};