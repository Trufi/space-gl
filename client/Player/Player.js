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

    setBody(body) {
        this._body = body;
    }

    addGame(game) {
        this._game = game;
        this._game.on('update', this._onUpdate);
        this.emit('addGame');
    }

    _onUpdate() {
        const pressedKeys = this._keyboard.getPressedKeys();

        for (let key in pressedKeys) {
            key = Number(key);

            if (key === Keyboard.FORWARD) {
                this._body.thrust();
            } else if (key === Keyboard.BACK) {
                this._body.reverse();
            } else if (key === Keyboard.LEFT) {
                this._body.left();
            } else if (key === Keyboard.RIGHT) {
                this._body.right();
            }
        }
    }
}
