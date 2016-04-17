import Stats from 'stats.js';

import time from '../utils/time';

export default class Ping {
    constructor(game) {
        this._stats = new Stats();
        this._game = game;
        this._socket = game._socket;

        this._game.on('update', this._onUpdate.bind(this));
        this._socket.on('pong', this._onPong.bind(this));

        this._lastTimePing = 0;

        this._pingInterval = 1000;
    }

    getPing() {
        return this._stats.get('ping').getMean();
    }

    getDelta() {
        return this._stats.get('delta').getMean();
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
