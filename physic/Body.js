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
        this.velocity[0] += this.force[0] / this.mass * dt;
        this.velocity[1] += this.force[1] / this.mass * dt;

        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;

        this.angularVelocity += this.angularForce / this.mass * dt;
        this.angle += this.angularVelocity * dt;
    }
}
