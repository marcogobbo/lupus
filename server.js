const LupusGame = require('./server/lupus-game');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var path = require('path');


const clientPath = __dirname + '/client';
const app = express();

// serve di tutte cartelle e sottocartelle di /client/
app.use(express.static(path.join(clientPath)));

const server = http.createServer(app);

global.io = socketio(server);

var userConnected = [];
var connections = [];
var settings;

//game object;
var LG;
var playing = false;

io.on('connection', (sock) => {
    console.log('Someone connected: ' + sock.id);

    // sock.on('message', (text) => {
    //     io.emit('message', text);
    // });

    sock.on('updateSocketId', (username) => {
        console.log('update of ' + username + ': [old:' + connections[username] + ' -> new:' + sock.id + ']');
        connections[username] = sock.id;
        if (playing)
            LG.updateSocketID(connections);
    });

    sock.on('lobby', (username) => {
        userConnected.push(username);
        console.log('RECEIVED LOBBY:', username);
        io.emit('usersInLobby', userConnected);
        connections[username] = sock.id;

        // if(userConnected.length==2){
        //     console.log('Invia solo al primo utente: ' + connections[userConnected[0]]);
        //     io.to(`${connections[userConnected[0]]}`).emit('test', 'I just met you');
        //     runGameTest();
        // }
    });

    //evento chiamato quando viene abbanonata la partita dalla pagina LOBBY
    //! NON FUNZIONA LATO CLIENT
    sock.on('userClose', (username, ) => {
        console.log("ABBANDONATO DA ", username)
        userConnected.splice(userConnected.indexOf.call(username), 1);
        io.emit('usersInLobby', userConnected);
    });

    // ricevo allo start del game
    // poi parte il gioco (rederit su page game)
    sock.on('clientSettings', (imp) => {
        settings = imp;
        LG = new LupusGame(userConnected, connections, imp);
        playing = true;
    });

    sock.on('logDay', (userVoting, userVoted) => {
        LG.onPlayerSelected(userVoting, userVoted);
    })
    sock.on('confermaVoto', () => {
        LG.onVoteConfirmed();
    })
});

server.on('error', (err) => {
    console.log('server error: ', err);
})
server.listen(process.env.PORT || 8080, () => {
    console.log('Lupus Server started', process.env.PORT || 8080);
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

const runGameTest = () => {
    console.log("Testing the game from server...")
    var players = ["Fil", "Ceck", "Mark", "Guglie"];
    var settings = [];
    settings["lupi"] = 2;
    settings["contadini"] = 2;
    var game = new LupusGame(players, [], settings);
    game.runTest();
};

app.get('/users', (req, res) => {
    res.send(userConnected);
});