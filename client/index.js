import Game from './Game';

import Socket from './modules/Socket';

const socket = new Socket();
let game;

socket.on('open', () => {
    socket.on('first', onFirstState);
});

function onFirstState(state) {
    game = new Game({state, socket});
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
