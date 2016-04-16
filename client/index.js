 import Ship from './Ship';
 import Asteroid from './Asteroid';
 import Game from './Game';
 import Player from './Player/Player';
 import * as sockets from './sockets';

 const game = new Game();

 const ship = new Ship();
 const asteroid = new Asteroid();
 asteroid.setPosition(10, 0);

 const player = new Player();
 player.setShip(ship);

 game.addBody(ship);
 game.addBody(asteroid);

 game.addPlayer(player);
