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

io.on('connection', (sock) => {
    console.log('someone connected');
    sock.emit('message', 'Hi, you are connected');

    sock.on('message', (text) => {
        io.emit('message', text);
    })
});

server.on('error', (err) => {
    alert('server error: ', err);
})
server.listen(8080, () => {
    console.log('Lupus Server started');
});





// ROUTING
app.get('/lobby', (req, res) => {

    //aggiungere controllo nome vuoto

    res.redirect('/pages/lobby/lobby.html')
})

app.get('/game', (req, res) => {

    //aggiungere controllo nome vuoto

    res.redirect('pages/game/game.html')
})