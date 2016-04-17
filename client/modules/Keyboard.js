export default class Keyboard {
    constructor() {
        this._pressedKeys = {};

        this._initEvents();
    }

    getPressedKeys() {
        return this._pressedKeys;
    }

    _initEvents() {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
    }

    _onKeyDown(ev) {
        const key = ev.which;

        this._pressedKeys[Keyboard.keyMap[key]] = true;
    }

    _onKeyUp(ev) {
        const key = ev.which;

        this._pressedKeys[Keyboard.keyMap[key]] = false;
    }
}

Keyboard.FORWARD = 1;
Keyboard.BACK = 2;
Keyboard.LEFT = 3;
Keyboard.RIGHT = 4;
Keyboard.STRAFE_LEFT = 5;
Keyboard.STRAFE_RIGHT = 6;

Keyboard.keyMap = {
    87: Keyboard.FORWARD,
    83: Keyboard.BACK,
    65: Keyboard.LEFT,
    68: Keyboard.RIGHT,
    81: Keyboard.STRAFE_LEFT,
    69: Keyboard.STRAFE_RIGHT
};
