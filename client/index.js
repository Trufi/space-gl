 import Body from './Body';
 import Game from './Game';
 import Player from './Player/Player';

 const game = new Game();

 const body = new Body();
 // body.body.velocity[1] = 5 / 1000;
 // body.body.angularVelocity = 1 / 1000;
 body.body.mass = 10;
 body.body.angle = Math.PI / 5;

 const player = new Player();
 player.setBody(body);

 game.addBody(body);

 game.addPlayer(player);
