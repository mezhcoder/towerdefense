let socket = io();

// let canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let cellSize = 25;

let maxCellInRow = canvas.width / cellSize;
let maxCellInColumn = canvas.height / cellSize;

//
// width: 1000px;
// height: 600px;
// for (let y = cellSize; y < canvas.height; y += cellSize){
//     for (let x = 0; x < canvas.width; x += cellSize) {
//         ctx.beginPath();
//         ctx.strokeStyle = "black";
//         ctx.strokeRect(x, y, 100, 100);
//     }
// }

// ctx.beginPath();
// ctx.strokeStyle = "black";
// ctx.strokeRect(0, 0, 10, 10);
// ctx.strokeRect(10*1, 0, 10, 10);
// ctx.strokeRect(10*1, 10, 10, 10);



// console.log(canvas.clientWidth);
//
for (let i = 0; i < maxCellInRow; i++) {
    for (let j = 0; j < maxCellInColumn; j++) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.strokeRect(i*cellSize, j*cellSize, cellSize, cellSize);
    }
}



console.log(maxCellInRow);
console.log(maxCellInColumn);



// var movement = {
//     up: false,
//     down: false,
//     left: false,
//     right: false
// }
//
// document.addEventListener('keydown', function(event) {
//     switch (event.keyCode) {
//         case 65: // A
//             movement.left = true;
//             break;
//         case 87: // W
//             movement.up = true;
//             break;
//         case 68: // D
//             movement.right = true;
//             break;
//         case 83: // S
//             movement.down = true;
//             break;
//     }
// });
// document.addEventListener('keyup', function(event) {
//     switch (event.keyCode) {
//         case 65: // A
//             movement.left = false;
//             break;
//         case 87: // W
//             movement.up = false;
//             break;
//         case 68: // D
//             movement.right = false;
//             break;
//         case 83: // S
//             movement.down = false;
//             break;
//     }
// });
//
// socket.emit('new player');
// setInterval(function() {
//     socket.emit('movement', movement);
// }, 1000 / 60);
//
// var canvas = document.getElementById('canvas');
// canvas.width = 800;
// canvas.height = 600;
// var context = canvas.getContext('2d');
//
// socket.on('state', function(players) {
//     console.log(players);
//     context.clearRect(0, 0, 800, 600);
//     context.fillStyle = 'green';
//     for (var id in players) {
//         var player = players[id];
//         context.beginPath();
//         context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
//         context.fill();
//     }
// });