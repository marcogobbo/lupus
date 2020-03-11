const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const clientPath = __dirname + '/../client';
const app = express();

// app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (sock) => {
    console.log('someone connected');
    sock.emit('message', 'Hi, you are conencted');

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