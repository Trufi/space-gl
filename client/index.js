 import Body from './Body';
 import World from './World';

 const world = new World();

 const body = new Body();
 body.body.velocity[1] = 5 / 1000;
 body.body.angularVelocity = 1 / 1000;
 body.body.mass = 10;

 world.addBody(body);
