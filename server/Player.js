import EventEmitter from 'events';

let idCounter = 1;

export default class Player extends EventEmitter {
    constructor(ws) {
        super();

        this.id = idCounter++;
        this.name = this.id;
        this._ws = ws;

        this._connectionOpen = true;

        this._ws.on('message', this._onMessage.bind(this));
        this._ws.on('close', this._onClose.bind(this));
    }

    setShip(ship) {
        this._ship = ship;
    }

    getShip() {
        return this._ship;
    }

    addGame(game) {
        this._game = game;
        this.emit('addGame');
    }

    getState() {
        return {
            id: this.id
        };
    }

    getAllState() {
        return {
            id: this.id,
            name: this.name,
            shipId: this._ship.id
        };
    }

    send(message) {
        this._ws.send(JSON.stringify(message));
    }

    _onMessage(ev) {
        this.emit('message', ev.data);
    }

    _onClose() {
        this._connectionOpen = false;
        this.emit('leave');
    }
}
