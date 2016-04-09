import {vec2} from 'gl-matrix';

let idCounter = 0;

export default class Body {
    constructor() {
        this.id = idCounter++;
        this.position = vec2.create();
        this.velocity = vec2.create();
        this.angle = 0;
        this.angularVelocity = 0;
        this.force = vec2.create();
        this.angularForce = 0;
        this.mass = 0;
    }

    step(dt) {
        if (this.mass === 0) { return; }

        const ds = dt / 1000;

        this.velocity[0] += this.force[0] / this.mass * ds;
        this.velocity[1] += this.force[1] / this.mass * ds;

        this.position[0] += this.velocity[0] * ds;
        this.position[1] += this.velocity[1] * ds;

        this.angularVelocity += this.angularForce / this.mass * ds;
        this.angle += this.angularVelocity * ds;
    }
}
