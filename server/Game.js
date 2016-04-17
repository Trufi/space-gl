import EventEmitter from 'events';
import P from '../physic';
import time from './utils/time';
import config from './config';

export default class Game extends EventEmitter {
    constructor() {
        super();

        this._world = new P.World();

        this._bodies = {};
        this._players = {};

        this._loop = this._loop.bind(this);

        this._lastTimeUpdate = time();
        this._lastTimeSend = 0;

        this._loop();
    }

    addBody(body) {
        this._world.addBody(body.body);
        this._bodies[body.id] = body;
    }

    removeBody(body) {
        this._world.removeBody(body.body);
        delete this._bodies[body.id];
    }

    addPlayer(player) {
        this._players[player.id] = player;
        player.addGame(this);
        this.addBody(player.getShip());

        player.send({
            type: 'first',
            state: this._getAllState(player)
        });

        player.on('leave', () => {
            this.removePlayer(player);
        });

        player.on('update', data => {
            data.actions.forEach(name => {
                player.useAction(name);
            });
        });
    }

    removePlayer(player) {
        this.removeBody(player.getShip());
        delete this._players[player.id];
    }

    _loop() {
        setTimeout(this._loop, config.gameTimeout);

        const now = time();
        const dt = now - this._lastTimeUpdate;

        for (const id in this._bodies) {
            this._bodies[id].updateActions(now);
        }

        this._world.step(dt);

        this._sendState(now);

        this._lastTimeUpdate = now;
    }

    _sendState(now) {
        if (now - this._lastTimeSend < config.sendingInterval) { return; }

        this._lastTimeSend = now;

        const message = {
            type: 'update',
            state: this._getState(now)
        };

        for (const id in this._players) {
            this._players[id].send(message);
        }
    }

    _getState(now) {
        const bodies = [];
        const players = [];

        for (const id in this._bodies) {
            bodies.push(this._bodies[id].getState());
        }

        for (const id in this._players) {
            players.push(this._players[id].getState());
        }

        return {
            now: now,
            bodies: bodies,
            players: players
        };
    }

    _getAllState(player) {
        const bodies = [];
        const players = [];

        for (const id in this._bodies) {
            bodies.push(this._bodies[id].getAllState());
        }

        for (const id in this._players) {
            players.push(this._players[id].getAllState());
        }

        return {
            playerId: player.id,
            now: time(),
            bodies: bodies,
            players: players
        };
    }
}
