import Action from './Action';

export default class StrafeLeft extends Action {
    constructor(ship) {
        super();

        this.ship = ship;
    }

    _do() {
        const body = this.ship.body;
        body.force[0] = -this.ship.rotateForce * Math.sin(body.angle + Math.PI / 2);
        body.force[1] = -this.ship.rotateForce * Math.cos(body.angle + Math.PI / 2);
    }
}
