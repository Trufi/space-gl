export default class World{
    constructor() {
        this._bodies = {};

        this.interpolateThreshold = 300;
        this._states = [];

        this._interpolateState = null;
        this.needInterpolation = false;
    }

    step(now, dt) {
        if (this.needInterpolation &&
            (!this._interpolateState || this._interpolateState.time < now)
        ) {
            this._searchInterpolationState(now);
        }

        for (const id in this._bodies) {
            const body = this._bodies[id];

            if (body.onlyInterpolate) {
                if (!this._interpolateState) { continue; }

                const interpolateBody = this._interpolateState.bodies[id];

                if (!interpolateBody) { continue; }

                body.interpolate(now, dt, {
                    state: interpolateBody.body,
                    time: this._interpolateState.time + this.interpolateThreshold
                });
            } else {
                body.step(now, dt);
            }
        }
    }

    addBody(body) {
        this._bodies[body.id] = body;
    }

    removeBody(body) {
        delete this._bodies[body.id];
    }

    addState(state) {
        this._states.push(state);

        // данные могли прийти не в том порядке
        this._states.sort(this._statesSortFunction);
    }

    _statesSortFunction(a, b) {
        return b.time < a.time;
    }

    _searchInterpolationState(now) {
        const states = this._states;
        let finded = false;
        let i;

        for (i = states.length - 1; i > -1; i--) {
            const state = states[i];

            // если разница между текущим временем и временем стейта меньше порога, то скипаем
            if (state.time > now - this.interpolateThreshold) { continue; }

            if (state.time < now - this.interpolateThreshold) {
                finded = true;
                break;
            }
        }

        if (!finded) {
            return;
        }

        const state = states[i + 1];

        if (!states[i + 1]) { return; }

        this._interpolateState = state;

        // удаляем стейты, которые уже никому не нужны
        this._states.splice(0, i);
    }
}
