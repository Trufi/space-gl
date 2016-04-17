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

    sendMessage(message) {
        this._ws.send(message);
    }

    _onMessage(ev) {
        if (!ev.data.type) { return; }

        this.emit(ev.data.type, ev.data);
    }
}
