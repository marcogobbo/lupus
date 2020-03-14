const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var path = require('path');


const clientPath = __dirname + '/../client';
const app = express();

// serve di tutte cartelle e sottocartelle di /client/
app.use(express.static(path.join(clientPath)));

const server = http.createServer(app);

const io = socketio(server);

var userConnected = [];

io.on('connection', (sock) => {
    console.log('someone connected');
    
    sock.emit('message', 'Hi, you are connected');

    sock.on('message', (text) => {
        io.emit('message', text);
    })

    sock.on('lobby', (username) => {
        userConnected.push(username);
        console.log('RECEIVED LOBBY:', username);
        io.emit('usersInLobby', userConnected);
    })
});

server.on('error', (err) => {
    alert('server error: ', err);
})
server.listen(8080, () => {
    console.log('Lupus Server started');
});



// ROUTING
// app.get('/lobby', (req, res) => {
//     //aggiungere controllo nome vuoto
//     res.redirect('/pages/lobby/lobby.html')
// })

// app.get('/game', (req, res) => {
//     //aggiungere controllo nome vuoto
//     res.redirect('pages/game/game.html')
// })

app.get('/users', (req, res) => {
    res.send(userConnected);
});