 import Ship from './Ship';
 import Game from './Game';
 import Player from './Player/Player';

 const game = new Game();

 const ship = new Ship();

 const player = new Player();
 player.setShip(ship);

 game.addBody(ship);

 game.addPlayer(player);
