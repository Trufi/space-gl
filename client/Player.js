import EventEmitter from 'events';

export default class Player extends EventEmitter {
    constructor({game, state}) {
        super();

        this._game = game;

        this.setState(state);
    }

    setShip(ship) {
        this._ship = ship;
    }

    getShip() {
        return this._ship;
    }

    setState(state) {
        if (state.id !== undefined) {
            this.id = state.id;
        }

        if (state.name !== undefined) {
            this.name = state.name;
        }

        if (state.shipId !== undefined) {
            this._ship = this._game.getBody(state.shipId);
        }
    }
}
