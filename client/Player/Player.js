import EventEmitter from 'events';
import Keyboard from './Keyboard';
import Debug from './Debug';

export default class Player extends EventEmitter {
    constructor() {
        super();

        this._keyboard = new Keyboard(this);
        this._debug = new Debug(this);

        this._onUpdate = this._onUpdate.bind(this);
    }

    setShip(ship) {
        this._ship = ship;
    }

    addGame(game) {
        this._game = game;
        this._game.on('update', this._onUpdate);
        this.emit('addGame');
    }

    _onUpdate() {
        const pressedKeys = this._keyboard.getPressedKeys();

        for (let key in pressedKeys) {
            if (pressedKeys[key] === false) { continue; }

            key = Number(key);

            if (key === Keyboard.FORWARD) {
                this._ship.useAction('thrust');
            } else if (key === Keyboard.BACK) {
                this._ship.useAction('reverse');
            } else if (key === Keyboard.LEFT) {
                this._ship.useAction('left');
            } else if (key === Keyboard.RIGHT) {
                this._ship.useAction('right');
            } else if (key === Keyboard.STRAFE_LEFT) {
                this._ship.useAction('strafeLeft');
            } else if (key === Keyboard.STRAFE_RIGHT) {
                this._ship.useAction('strafeRight');
            }
        }
    }
}
