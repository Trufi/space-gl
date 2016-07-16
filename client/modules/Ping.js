import Stats from 'stats.js';

import time from '../utils/time';

export default class Ping {
    constructor(socket) {
        this._stats = new Stats();

        this._pingCounter = this._stats.get('ping');
        this._pingCounter.sampleLimit = 10;

        this._deltaCounter = this._stats.get('delta');
        this._deltaCounter.sampleLimit = 10;

        this._socket = socket;

        this._interval = setInterval(this._onUpdate.bind(this), 1000);
        this._socket.on('pong', this._onPong.bind(this));

        this._lastTimePing = -Infinity;
    }

    getPing() {
        return this._pingCounter.getMean();
    }

    getDelta() {
        return this._deltaCounter.getMean();
    }

    isDeltaStable() {
        const counter = this._deltaCounter;
        return counter.getLength() > 0 && counter.getDeviation() < 10;
    }

    _onUpdate() {
        this._socket.send({type: 'ping'});

        this._lastTimePing = time();
    }

    _onPong(data) {
        const serverTime = data.time;
        const now = time();
        const dt = this._lastTimePing + (now - this._lastTimePing) / 2 - serverTime;

        this._stats.add('ping', (now - serverTime - dt) / 2);
        this._stats.add('delta', dt);
    }
}
