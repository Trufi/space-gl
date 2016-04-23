import {vec2} from 'gl-matrix';

let idCounter = 1;

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

        this.onlyInterpolate = true;
    }

    step(now, dt) {
        if (this.mass === 0) { return; }

        this.velocity[0] += this.force[0] / this.mass * dt;
        this.velocity[1] += this.force[1] / this.mass * dt;

        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;

        this.angularVelocity += this.angularForce / this.mass * dt;
        this.angle += this.angularVelocity * dt;

        this.force[0] = 0;
        this.force[1] = 0;
        this.angularForce = 0;
    }

    interpolate(now, dt, stateA, stateB) {
        // если нет данных, то ничего не делаем
        if (!stateA || !stateB) { return; }

        
    }

    setState(state) {
        if (state.position !== undefined) {
            this.position[0] = state.position[0];
            this.position[1] = state.position[1];
        }

        if (state.velocity !== undefined) {
            this.velocity[0] = state.velocity[0];
            this.velocity[1] = state.velocity[1];
        }

        if (state.angle !== undefined) {
            this.angle = state.angle;
        }

        if (state.angularVelocity !== undefined) {
            this.angularVelocity = state.angularVelocity;
        }

        if (state.force !== undefined) {
            this.force[0] = state.force[0];
            this.force[1] = state.force[1];
        }

        if (state.mass !== undefined) {
            this.mass = state.mass;
        }
    }

    getState() {
        return {
            position: [this.position[0], this.position[1]],
            velocity: [this.velocity[0], this.velocity[1]],
            angle: this.angle,
            angularVelocity: this.angularVelocity,
            force: [this.force[0], this.force[1]],
            angularForce: this.angularForce
        };
    }

    getAllState() {
        return {
            position: [this.position[0], this.position[1]],
            velocity: [this.velocity[0], this.velocity[1]],
            angle: this.angle,
            angularVelocity: this.angularVelocity,
            force: [this.force[0], this.force[1]],
            angularForce: this.angularForce,
            mass: this.mass
        };
    }
}
