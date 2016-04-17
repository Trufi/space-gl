import express from 'express';
import path from 'path';
import ws from 'ws';

import Game from './Game';
import Player from './Player';
import Ship from './Ship';
import Asteroid from './Asteroid';

const game = new Game();
const asteroid = new Asteroid();
asteroid.setPosition(10, 0);
game.addBody(asteroid);

const app = express();
const port = process.env.PORT || process.env.port || 8870;

const server = app.listen(port, () => console.log(`server listen on ${port} port`));

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../assets')));

// error handlers
app.use((error, req, res, next) => {
    res.send(error);
});

const wsServer = new ws.Server({server: server});
wsServer.on('connection', ws => {
    const player = new Player(ws);
    const ship = new Ship();
    player.setShip(ship);
    game.addPlayer(player);
});
