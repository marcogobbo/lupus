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
var settings;

io.on('connection', (sock) => {
    console.log('someone connected');

    sock.emit('message', 'Hi, you are connected');

    sock.on('message', (text) => {
        io.emit('message', text);
    });

    sock.on('lobby', (username) => {
        userConnected.push(username);
        // console.log('RECEIVED LOBBY:', username);
        io.emit('usersInLobby', userConnected);
    });

    //evento chiamato quando viene abbanonata la partita dalla pagina LOBBY
    //! NON FUNZIONA LATO CLIENT
    sock.on('userClose', (username) => {
        console.log("ABBANDONATO DA ", username)
        userConnected.splice(userConnected.indexOf.call(username), 1);
        io.emit('usersInLobby', userConnected);
    });

    //* ricevo allo start del game
    // creo ruoli, mando ruoli
    // poi parte il gioco (rederit su page game)
    sock.on('clientSettings', (imp) => {

        settings = imp;

        // non so se è il modo giusto per farlo, ma mi è venuto in mente di farlo così
        // creo array per assegnare ruoli
        var rolesArr = [];
        for (i = 0; i < settings.lupi; i++)
            rolesArr.push('lupo');
        for (i = 0; i < settings.contadini; i++)
            rolesArr.push('contadino');
        for (i = 0; i < settings.veggente; i++)
            rolesArr.push('veggente');
        for (i = 0; i < settings.gdc; i++)
            rolesArr.push('gdc');
        //! aggiugere ruoli

        playersWithRole = [];
        userConnected.forEach(pl => {
            // get indice del ruolo
            var i = Math.floor(Math.random() * rolesArr.length);

            playersWithRole.push({ player: pl, role: rolesArr[i] });
            rolesArr.splice(i, 1);
        });


        //invio ai player il proprio ruolo sulla socket identificata dal proprio username
        //! NON FUNZIONA. forse ho capito male... bisogna informarsi sulla socket.io
        playersWithRole.forEach(el => {
            console.log(el.player);
            io.emit(el.player, el.role);

        });
    });
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