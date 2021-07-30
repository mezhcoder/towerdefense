let data;
let gameGrid = [];
let canvasPosition;
socket.on('init', function (dataPlayer) {
    document.querySelector("body").innerHTML = '<canvas id="canvas"></canvas>';
    data = new Data(dataPlayer.firstPlayerName.name, dataPlayer.secondPlayerName.name, dataPlayer.team);
    canvasPosition = data.dataHtml.canvas.getBoundingClientRect();
    createGrid();
    loadListeners();
    loadHandlers(socket);
});

function loadListeners() {
    data.dataHtml.canvas.addEventListener('mousemove', function(e){
        mouse.x = e.x - canvasPosition.left;
        mouse.y = e.y - canvasPosition.top;
    });
    data.dataHtml.canvas.addEventListener('mouseleave', function(){
        mouse.y = undefined;
        mouse.y = undefined;
    });
    data.dataHtml.canvas.addEventListener('click', function() {
        const gridPositionX = mouse.x  - (mouse.x % data.dataHtml.cellSize) + data.dataHtml.cellGap;
        const gridPositionY = mouse.y - (mouse.y % data.dataHtml.cellSize) + data.dataHtml.cellGap;
        if (gridPositionY < data.dataHtml.cellSize) return;
        // let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        let team = data.team;
        socket.emit('EntitySpawnEvent', {
            gridPositionX: gridPositionX,
            gridPositionY: gridPositionY,
            team: team,
            health: 100,
            width: data.dataHtml.cellSize - data.dataHtml.cellGap * 2,
            height: data.dataHtml.cellSize - data.dataHtml.cellGap * 2
        });
    });
}
function loadHandlers(socket) {
    socket.on('AnimateEvent', function (serverData) {
        animate(serverData);
    });

    socket.on('GameEndEvent', function (team) {
        alert("Победила команда: " + team);
        data = undefined;
        gameGrid = [];
        canvasPosition = undefined;
        window.location.reload();
    });
}

class Data {
    constructor(firstPlayerName, secondPlayerName, team) {
        this.firstPlayerName = firstPlayerName;
        this.secondPlayerName = secondPlayerName;
        this.team = team;
        this.dataHtml = new DataHtml();
    }
}
class DataHtml {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 100;
        this.canvas.width = 900;
        this.canvas.height = 600;
        this.cellGap = 3;
        this.controlsBar = {
            width: canvas.width,
            height: this.cellSize,
        }
    }
}
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = data.dataHtml.cellSize;
        this.height =  data.dataHtml.cellSize;
    }
    draw(){
        if (mouse.x && mouse.y && collision(this, mouse)) {
            data.dataHtml.ctx.strokeStyle = 'black';
            data.dataHtml.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
class Entity {
    constructor(x,y,health,team){
        this.x = x;
        this.y = y;
        this.width = data.dataHtml.cellSize - data.dataHtml.cellGap * 2;
        this.height = data.dataHtml.cellSize - data.dataHtml.cellGap * 2;
        this.health = health;
        this.team = team;
    }
    draw() {
        data.dataHtml.ctx.fillStyle = this.team;
        data.dataHtml.ctx.fillRect(this.x, this.y, this.width, this.height);
        data.dataHtml.ctx.fillStyle = 'black';
        data.dataHtml.ctx.font = '30px Orbitron';
        data.dataHtml.ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
    }
}

let mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}
function handleGameStatus(data, serverData) {
    let statusFirstPlayer = (serverData.setStatus.firstPlayer) ? "yes" : "reloading";
    let statusSecondPlayer = (serverData.setStatus.secondPlayer) ? "yes" : "reloading";


    let ctx = data.dataHtml.ctx;
    ctx.beginPath();
    ctx.fillStyle = 'lightblue';
    ctx.font = '22.5px Orbitron';
    ctx.fillText(data.firstPlayerName, 20, 30);
    ctx.fillText('Set: ' + statusFirstPlayer, 20, 85);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.font = '22.5px Orbitron';
    ctx.fillText(data.secondPlayerName, 20*40, 30);
    ctx.fillText('Set: ' + statusSecondPlayer, 20*37.4, 85);
    ctx.closePath();
}
function handleGameGrid() {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}
function createGrid() {
    for (let y = data.dataHtml.cellSize; y < canvas.height; y += data.dataHtml.cellSize){
        for (let x = 0; x < canvas.width; x += data.dataHtml.cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}

function handleEnemies(serverData) {
    for (const dataEntities of serverData.entities) {
        let entity = new Entity(dataEntities.gridPositionX, dataEntities.gridPositionY, dataEntities.health, dataEntities.team )
        entity.draw();
    }
}

function animate(serverData) {
    const dataHtml = data.dataHtml;
    let ctx = dataHtml.ctx;
    let controlsBar = dataHtml.controlsBar;

    ctx.clearRect(0, 0, dataHtml.canvas.width, dataHtml.canvas.height);
    ctx.fillStyle = 'gray';
    ctx.fillRect(0,0, controlsBar.width, controlsBar.height);

    handleGameStatus(data, serverData);
    handleGameGrid();
    handleEnemies(serverData);
}

function collision(first, second){
    if (!(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y)) {
        return true;
    }
}
window.addEventListener('resize', function(){
    canvasPosition = data.dataHtml.canvas.getBoundingClientRect();
})