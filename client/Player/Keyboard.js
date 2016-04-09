export default class Keyboard {
    constructor(player) {
        this._player = player;
        this._pressedKeys = {};

        this._initEvents();
    }

    getPressedKeys() {
        const result = this._pressedKeys;
        this._pressedKeys = {};
        return result;
    }

    _initEvents() {
        this._onKeypress = this._onKeypress.bind(this);
        window.addEventListener('keypress', this._onKeypress);
    }

    _onKeypress(ev) {
        const key = ev.which;

        if (key === 119) {
            this._pressedKeys[Keyboard.FORWARD] = true;
        } else if (key === 115) {
            this._pressedKeys[Keyboard.BACK] = true;
        } else if (key === 97) {
            this._pressedKeys[Keyboard.LEFT] = true;
        } else if (key === 100) {
            this._pressedKeys[Keyboard.RIGHT] = true;
        }
    }
}

Keyboard.FORWARD = 1;
Keyboard.BACK = 2;
Keyboard.LEFT = 3;
Keyboard.RIGHT = 4;
