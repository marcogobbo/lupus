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
var imagesIndexes = [];
var connections = [];
var settings;

//game object;
var LG;
var playing = false;


 const admin = {
     'luca': 'LUCACECK',
     'filippo': 'PIPPO',
     'roberto': 'ROBY',
     'marco': 'M'
 }

io.on('connection', (sock) => {
    console.log('Someone connected: ' + sock.id);

    // sock.on('message', (text) => {
    //     io.emit('message', text);
    // });




    sock.on('updateSocketId', (username) => {
        //console.log('update of ' + username + ': [old:' + connections[username] + ' -> new:' + sock.id + ']');
        connections[username] = sock.id;
        if (playing)
            LG.updateSocketID(username, connections);
    });

    sock.on('lobby', (username, imageIndex) => {
        //console.log(imageIndex)

        switch (username) {
            case 'ADMIN_L':
                username = admin.luca;
                imageIndex = -1;
                break;

            case 'ADMIN_F':
                username = admin.filippo;
                imageIndex = -1;
                break;

            case 'ADMIN_R':
                username = admin.roberto;
                imageIndex = -1;
                break;

            case 'ADMIN_M':
                username = admin.marco;
                imageIndex = -1;
                break;
        }

        userConnected.push(username);
        imagesIndexes.push(imageIndex);
        //console.log(imagesIndexes)
        console.log('RECEIVED LOBBY:', username);
        io.emit('usersInLobby', userConnected, imagesIndexes);
        connections[username] = sock.id;

        // if(userConnected.length==2){
        //     console.log('Invia solo al primo utente: ' + connections[userConnected[0]]);
        //     io.to(`${connections[userConnected[0]]}`).emit('test', 'I just met you');
        //     runGameTest();
        // }
    });

    //evento chiamato quando viene abbanonata la partita dalla pagina LOBBY
    sock.on('leaving_msg', (username, ) => {
        console.log(username+" leave the game...");
    });

    // ricevo allo start del game
    // poi parte il gioco (rederit su page game)
    sock.on('clientSettings', (imp) => {
        settings = imp;
        var today = new Date();
        var datetime = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + "-" + today.getHours() + today.getMinutes() + today.getSeconds();
        var logFilename = "log/" + datetime + "_" + userConnected[0] + ".txt";
        LG = new LupusGame(userConnected, connections, imp, logFilename);
        playing = true;
    });

    sock.on('logDay', (userVoting, userVoted) => {
        LG.onPlayerSelected(userVoting, userVoted);
    })
    sock.on('confermaVoto', (userVoting, userVoted) => {
        LG.onDayResponse(userVoting, userVoted);
    })
    sock.on("role_selection", (userVoting, userVoted) => {
        LG.onNightResponse(userVoting, userVoted);
    })
    sock.on("friends_chat_out", (username, message) => {
        LG.onChatMessage(username, message);
    })
});

server.on('error', (err) => {
    console.log('server error: ', err);
})
server.listen(process.env.PORT || 8080, () => {
    console.log('Lupus Server started', process.env.PORT || 8080);
});

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

app.get('/images', (req, res) => {
    res.send(imagesIndexes);
});