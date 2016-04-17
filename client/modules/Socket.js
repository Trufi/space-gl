import EventEmitter from 'events';

export default class Socket extends EventEmitter {
    constructor() {
        super();

        this._ws = new WebSocket('ws://127.0.0.1:8870');
        this._ws.binaryType = 'arraybuffer';

        this._ws.addEventListener('open', () => {
            this.emit('open');
        });

        this._ws.addEventListener('message', this._onMessage.bind(this));
    }

    send(message) {
        this._ws.send(JSON.stringify(message));
    }

    _onMessage(ev) {
        const data = JSON.parse(ev.data);

        if (!data.type) { return; }

        this.emit(data.type, data);
    }
}
