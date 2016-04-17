import Action from './Action';

export default class Thrust extends Action {
    constructor(ship) {
        super();

        this.ship = ship;
    }

    _do() {
        const body = this.ship.body;
        body.force[0] = this.ship.thrustForce * Math.sin(body.angle);
        body.force[1] = this.ship.thrustForce * Math.cos(body.angle);
    }
}
