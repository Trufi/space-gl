import {vec2} from 'gl-matrix';
import Interpolation from './Interpolation';

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

        this.onlyInterpolate = false;
        this._lastInterpolateState = null;
        this._interpolation = null;
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

    interpolate(now, dt, interpolateState) {
        // если нет данных, то ничего не делаем
        if (!interpolateState) { return; }

        if (this._lastInterpolateState !== interpolateState) {
            this._createNewInterpolation(now, interpolateState);
            this._lastInterpolateState = interpolateState;
        }

        const newValues = this._interpolation.step(now);

        if (!newValues) {
            console.warn('Interpolation step return null');
            return;
        }

        this.position[0] = newValues[0];
        this.position[1] = newValues[1];
        this.angle = newValues[1];
    }

    _createNewInterpolation(now, interpolateState) {
        const state = interpolateState.state;

        // Интерполируем только положение и угл поворота
        const startArray = [this.position[0], this.position[1], this.angle];
        const endArray = [state.position[0], state.position[1], state.angle];

        this._interpolation = new Interpolation({
            values: startArray,
            time: now
        }, {
            values: endArray,
            time: interpolateState.time
        });
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
