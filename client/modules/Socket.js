import EventEmitter from 'events';

export default class Socket extends EventEmitter {
    constructor() {
        super();

        this._ws = new WebSocket('ws://127.0.0.1:8870');
        this._ws.binaryType = 'arraybuffer';

        this._ws.addEventListener('open', () => {
            this._isOpen = true;
        });

        this._ws.addEventListener('message', this._onMessage.bind(this));
    }

    sendMessage(message) {
        if (!this._isOpen) { return; }

        this._ws.send(message);
    }

    _onMessage(ev) {
        this.emit('message', {data: ev.data});
    }
}
