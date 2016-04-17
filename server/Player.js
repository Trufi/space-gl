import EventEmitter from 'events';
import time from './utils/time';

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

    useAction(name) {
        this._ship.useAction(name);
    }

    send(message) {
        this._ws.send(JSON.stringify(message), this._errorHanlder);
    }

    _onMessage(ev) {
        const data = JSON.parse(ev);

        if (data.type === 'ping') {
            this.send({type: 'pong', time: time()});
        } else if (data.type) {
            this.emit(data.type, data);
        }
    }

    _onClose() {
        this._connectionOpen = false;
        this.emit('leave');
    }

    _errorHanlder(error) {
        if (error) {
            console.error(error);
        }
    }
}
