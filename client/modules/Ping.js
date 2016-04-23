import Stats from 'stats.js';

import time from '../utils/time';

export default class Ping {
    constructor(game) {
        this._stats = new Stats();

        this._pingCounter = this._stats.get('ping');
        this._pingCounter.sampleLimit = 10;

        this._deltaCounter = this._stats.get('delta');
        this._deltaCounter.sampleLimit = 10;

        this._game = game;
        this._socket = game._socket;

        this._game.on('update', this._onUpdate.bind(this));
        this._socket.on('pong', this._onPong.bind(this));

        this._lastTimePing = 0;

        this._pingInterval = 1000;
    }

    getPing() {
        return this._pingCounter.getMean();
    }

    getDelta() {
        return this._deltaCounter.getMean();
    }

    _onUpdate({now}) {
        if (now - this._lastTimePing < this._pingInterval) { return; }

        this._socket.send({type: 'ping'});

        this._lastTimePing = now;
    }

    _onPong(data) {
        const serverTime = data.time;
        const now = time();
        const dt = this._lastTimePing + (now - this._lastTimePing) / 2 - serverTime;

        this._stats.add('ping', (now - serverTime - dt) / 2);
        this._stats.add('delta', dt);
    }
}
