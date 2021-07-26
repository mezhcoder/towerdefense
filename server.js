// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
    console.log('Starting server on port 5000');
});




sockets = [];
io.on('connection', function (socket) {
    console.log('Подключился игрок' + socket.id);
    sockets.push(socket.id);
});
let widthCell = 100;
let heightCell = 100;



// class Cell {
//     constructor(x, y){
//         this.x = x;
//         this.y = y;
//         this.width = cellSize;
//         this.height = cellSize;
//     }
// }



// var players = {};
// io.on('connection', function(socket) {
//     socket.on('new player', function() {
//         players[socket.id] = {
//             x: 300,
//             y: 300
//         };
//     });
//     socket.on('movement', function(data) {
//         var player = players[socket.id] || {};
//         if (data.left) {
//             player.x -= 5;
//         }
//         if (data.up) {
//             player.y -= 5;
//         }
//         if (data.right) {
//             player.x += 5;
//         }
//         if (data.down) {
//             player.y += 5;
//         }
//     });
// });
//
// setInterval(function() {
//     io.sockets.emit('state', players);
// }, 1000 / 60);