import Game from './Game';

import Socket from './modules/Socket';
import Ping from './modules/Ping';

const socket = new Socket();
let game;
let interval;
let ping;

socket.on('open', () => {
    ping = new Ping(socket);

    interval = setInterval(() => {
        if (ping.isDeltaStable()) {
            socket.send({type: 'ready'});
            socket.once('first', onFirstState);
            clearInterval(interval);
        }
    }, 100);
});

function onFirstState(data) {
    game = new Game({state: data.state, socket, ping});
}

// const ship = new Ship();
// const asteroid = new Asteroid();
// asteroid.setPosition(10, 0);
//
// const player = new Player();
// player.setShip(ship);
//
// game.addBody(ship);
// game.addBody(asteroid);
//
// game.addPlayer(player);
