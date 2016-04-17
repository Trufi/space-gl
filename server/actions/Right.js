import Action from './Action';

export default class Left extends Action {
    constructor(ship) {
        super();

        this.ship = ship;
    }

    _do() {
        this.ship.body.angularForce = this.ship.rotateForce;
    }
}
