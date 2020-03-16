const sock = io();
var myUser;
var myRole;
var players;

window.onload = () => {

    myUser = sessionStorage.getItem('user');
    myRole = JSON.parse(sessionStorage.getItem('role'));

    //send the update!
    sock.emit("updateSocketId", myUser);

    // // _('myUserName').innerHTML = myUser;
    // //get giocatori connessi
    // var xhr = new XMLHttpRequest();
    // xhr.addEventListener('loadend', (e) => {
    //     console.log(e.target.response);
    //     addUserInLobby(JSON.parse(e.target.response));
    //     console.log(players)
    //     if (players[0] != myUser) {
    //         _('settings').innerHTML = '';
    //     }
    // });
    // xhr.open('GET', '/users');
    // xhr.send();
}