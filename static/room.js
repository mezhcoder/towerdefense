const socket = io();

const button = document.querySelector('button');
const input = document.querySelector('input');

button.addEventListener('click', event => {
    socket.emit('ready', {name: input.value});
});

socket.on('PlayersDataEvent', function (data) {
    if (data.firstPlayerName) {
        document.getElementById("statusPlayer1").textContent = data.firstPlayerName.name + " готов";
    }
    if (data.secondPlayerName) {
        document.getElementById("statusPlayer2").textContent = data.secondPlayerName.name + " готов";
    }
});