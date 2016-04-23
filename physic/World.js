export default class World{
    constructor() {
        this._bodies = {};

        this.interpolateThreshold = 300;
        this._states = [];

        this._interpolateStateA = null;
        this._interpolateStateB = null;
    }

    step(now, dt) {
        if (this._interpolateStateB.time < now) {
            this._searchTwoStates(now);
        }

        const canInterpolate = this._interpolateStateA && this._interpolateStateB;

        for (const id in this._bodies) {
            const body = this._bodies[id];

            if (body.onlyInterpolate) {
                if (canInterpolate) {
                    body.interpolate(now, dt,
                        this._interpolateStateA.bodies[id],
                        this._interpolateStateB.bodies[id]
                    );
                }
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

    _searchTwoStates(now) {
        const states = this._states;
        let stateA, stateB;

        for (let i = states.length; i > -1; i--) {
            const state = states[i];

            // если разница между текущим временем и временем стейта меньше порога, то скипаем
            if (now - state.time < this.interpolateThreshold) { continue; }

            // если текущие время меньше времени стейта, то это правая точка интерполяции
            if (now < state.time) {
                stateB = state;
            }

            // если текущие время больше времени стейта, то это левая точка интерполяции
            if (state.time < now) {
                stateA = state;
            }

            // если найдены левая и правая точка, то заканчиваем
            if (stateA && stateB) {
                this._interpolateStateA = stateA;
                this._interpolateStateB = stateB;

                // удаляем стейты, которые уже никому не нужны
                this._states.splice(0, i);

                return;
            }
        }
    }
}
