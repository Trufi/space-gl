export default class World{
    constructor() {
        this._bodies = {};
    }

    step(dt) {
        for (const id in this._bodies) {
            this._bodies[id].step(dt);
        }
    }

    addBody(body) {
        this._bodies[body.id] = body;
    }

    removeBody(body) {
        delete this._bodies[body.id];
    }
}
