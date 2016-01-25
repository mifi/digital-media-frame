var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'));

io.on('connection', function(socket){
    console.log('socket connection');

    socket.on('getData', function() {
        io.sockets.emit('getData');
    });
    socket.on('data', function(data) {
        io.sockets.emit('data', data);
    });
    socket.on('playPlaylist', function(playlist) {
        io.sockets.emit('playPlaylist', playlist);
    });
    socket.on('nextVideo', function() {
        io.sockets.emit('nextVideo');
    });
    socket.on('nextPlaylist', function() {
        io.sockets.emit('nextPlaylist');
    });
    socket.on('reload', function() {
        io.sockets.emit('reload');
    });
});

http.listen(8080, function(){
    console.log('listening');
});
