// Dependencies.
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

let gameOver = false;
function getRandomInt(max) { return Math.floor(Math.random() * max); }

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
    console.log('Starting server on port 5000');
})

class Player {
    constructor() {
        this.ready = false;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get ready() {
        return this._ready;
    }

    set ready(ready) {
        this._ready = ready;
    }

    get socket() {
        return this._socket;
    }

    set socket(socket) {
        this._socket = socket;
    }

    get team() {
        return this._team;
    }

    set team(team) {
        this._team = team;
    }
}
const players = {
    firstPlayer: new Player(),
    secondPlayer: new Player()
}

let timersData = setInterval(() => {
    let data = {
        firstPlayerName: players.firstPlayer.name,
        secondPlayerName: players.secondPlayer.name
    }
    if (players.firstPlayer.socket) {
        players.firstPlayer.socket.emit('PlayersDataEvent', data);
    }
    if (players.secondPlayer.socket) {
        players.secondPlayer.socket.emit('PlayersDataEvent', data);
    }

}, 100);
function startGame() {
    let dataFirstPlayer = {
        firstPlayerName: players.firstPlayer.name,
        secondPlayerName: players.secondPlayer.name,
        team: "blue"
    }
    players.firstPlayer.team = "blue";

    let dataSecondPlayer = {
        firstPlayerName: players.firstPlayer.name,
        secondPlayerName: players.secondPlayer.name,
        team: "red"
    }
    players.secondPlayer.team = "red";

    players.firstPlayer.socket.emit('init', dataFirstPlayer);
    players.secondPlayer.socket.emit('init', dataSecondPlayer);
    clearInterval(timersData);
}

let entities = [];
let setStatus = {
    firstPlayer: true,
    secondPlayer: true
}

function listingEvents(socket) {
    socket.on('EntitySpawnEvent', function (entity) {
        if (entity.team === players.firstPlayer.team) {
            if (!setStatus.firstPlayer)
                return
        }
        if (entity.team === players.secondPlayer.team) {
            if (!setStatus.secondPlayer)
                return
        }

        entities.push(entity);
        if (players.firstPlayer.socket.id === socket.id) {
            setStatus.firstPlayer = false;
            setTimeout(() => {
                setStatus.firstPlayer = true;
            }, 5500);
        }
        if (players.secondPlayer.socket.id === socket.id) {
            setStatus.secondPlayer = false;
            setTimeout(() => {
                setStatus.secondPlayer = true;
            }, 5500);
        }
    });
}

function endGame(winnerTeam) {
    gameOver = true;
    players.firstPlayer.socket.emit("GameEndEvent", winnerTeam);
    players.secondPlayer.socket.emit("GameEndEvent", winnerTeam);
    players.firstPlayer = new Player();
    players.secondPlayer = new Player();
}

function updatePositionsEntities() {
    for (let entity of entities) {
        if (!entity) continue;
        if (entity.gridPositionX < 0 || entity.gridPositionX > 805) {
            endGame(entity.team);
            return;
        }
        if (isIntoOtherEntity(entity))
            continue;

        if (entity.team === "red") {
            entity.gridPositionX -= Math.random() * 0.05;
        } else {
            entity.gridPositionX += Math.random() * 0.05;
        }

    }

    function isIntoOtherEntity(entity) {
        for (let otherEntity of entities) {
            if (!otherEntity) continue;
            if (entity.team !== otherEntity.team) {
                if (collision(entity, otherEntity)) {
                    fight(entity, otherEntity);
                    return true;
                }
            }
        }
        return false;
    }
    function fight(entity1, entity2) {
        let damageEntity1 = getRandomInt(2);
        let damageEntity2 = getRandomInt(2);

        if (damageEntity1 > damageEntity2) {
            entity2.health -= damageEntity1;
        } else {
            entity1.health -= damageEntity2;
        }

        if (entity1.health <= 0) {
            delete entities[entities.indexOf(entity1)];
            entities = entities.filter(item => item);
        }

        if (entity2.health <= 0) {
            delete entities[entities.indexOf(entity2)];
            entities = entities.filter(item => item);
        }
    }
    function collision(first, second){
        if (!(first.gridPositionX > second.gridPositionX + second.width ||
            first.gridPositionX + first.width < second.gridPositionX ||
            first.gridPositionY > second.gridPositionY + second.height ||
            first.gridPositionY + first.height < second.gridPositionY)) {
            return true;
        }
    }
}

function animateServer(socket1, socket2) {
    if (gameOver) return;
    updatePositionsEntities();
    socket1.emit('AnimateEvent', {entities: entities, setStatus: setStatus});
    socket2.emit('AnimateEvent', {entities: entities, setStatus: setStatus});
}


io.on('connection', function (socket) {
    socket.on('ready', function (name) {
       if (!players.firstPlayer.ready) {
           players.firstPlayer.ready = true;
           players.firstPlayer.name = name;
           players.firstPlayer.socket = socket;

           socket.on("disconnect", () => {
               players.firstPlayer = new Player();
           });
       } else {
           players.secondPlayer.ready = true;
           players.secondPlayer.name = name;
           players.secondPlayer.socket = socket;
           socket.on("disconnect", () => {
               players.secondPlayer = new Player();
           });
       }
       if (players.firstPlayer.ready && players.secondPlayer.ready) {
           startGame();

           setInterval(() => {
               if (!gameOver)
                   animateServer(players.firstPlayer.socket, players.secondPlayer.socket);
               else
                   clearInterval(this);
           }, 1);

           listingEvents(players.firstPlayer.socket);
           listingEvents(players.secondPlayer.socket);
       }
    });
});
