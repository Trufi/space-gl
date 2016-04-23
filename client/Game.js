import EventEmitter from 'events';
import dgl from '2gl';
import P from '../physic';
import {bodyType} from '../physic/enums';
import time from './utils/time';
import Ship from './Ship';
import Asteroid from './Asteroid';
import Keyboard from './modules/Keyboard';
import Ping from './modules/Ping';
import Debug from './modules/Debug';
import Player from './Player';
import config from './config';

export default class Game extends EventEmitter {
    constructor({state, socket}) {
        super();

        this._socket = socket;
        this._keyboard = new Keyboard();
        this._ping = new Ping(this);
        this._debug = new Debug(this);

        this._world = new P.World();

        this._renderer = new dgl.Renderer({
            canvas: 'canvas',
            clearColor: [0, 0, 0, 1]
        });

        this._scene = new dgl.Scene();

        this._camera = new dgl.PerspectiveCamera(45, 0, 1, 100000);
        this._camera.position[2] = 50;

        this._updateSize();
        window.addEventListener('resize', this._updateSize.bind(this));

        this._bodies = {};
        this._players = {};

        this._mainPlayer = null;

        this._initState(state);

        this._loop = this._loop.bind(this);

        this._lastTimeUpdate = time();
        this._lastTimeSend = 0;

        this._socket.on('update', this._onSocketUpdate.bind(this));
        this._statesFromServer = [];
        this._mainPlayerBodyStates = [];

        this._loop();
    }

    addBody(body) {
        this._world.addBody(body.body);
        this._scene.add(body.mesh);
        this._bodies[body.id] = body;
    }

    removeBody(body) {
        this._world.removeBody(body.body);
        this._scene.remove(body.mesh);
        delete this._bodies[body.id];
    }

    getBody(id) {
        return this._bodies[id];
    }

    addPlayer(player) {
        this._players[player.id] = player;
    }

    removePlayer(player) {
        delete this._players[player.id];
    }

    getPlayer(id) {
        return this._players[id];
    }

    _initState(state) {
        state.bodies.forEach(bodyState => {
            let body;

            if (bodyState.type === bodyType.SHIP) {
                body = new Ship({state: bodyState});
            } else if (bodyState.type === bodyType.ASTEROID) {
                body = new Asteroid({state: bodyState});
            } else {
                return;
            }

            this.addBody(body);
        });

        state.players.forEach(playerState => {
            const player = new Player({
                game: this,
                state: playerState
            });
            this.addPlayer(player);
        });

        this._mainPlayer = this.getPlayer(state.playerId);
    }

    _updateState() {
        for (let i = 0; i < this._statesFromServer.length; i++) {
            this._setState(this._statesFromServer[i]);
        }

        if (this._mainPlayer) {
            
        }

        this._statesFromServer = [];
    }

    _setState(state) {
        let mainPlayerShip;

        if (this._mainPlayer) {
            mainPlayerShip = this._mainPlayer.getShip();
        }

        state.bodies.forEach(bodyState => {
            const body = this._bodies[bodyState.id];

            if (body) {
                if (body !== mainPlayerShip) {
                    body.setState(bodyState);
                }
            } else {
                console.warn('Unknown body ' + bodyState.id);
            }
        });

        state.players.forEach(playerState => {
            if (this._players[playerState.id]) {
                this._players[playerState.id].setState(playerState);
            } else {
                console.warn('Unknown player ' + playerState.id);
            }
        });
    }

    _updateSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this._renderer.setSize(width, height);
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
    }

    _onSocketUpdate(data) {
        data.state.now += this._ping.getDelta();
        this._statesFromServer.push(data.state);
    }

    _loop() {
        this.emit('frameStart');

        requestAnimationFrame(this._loop);

        const now = time();
        const dt = now - this._lastTimeUpdate;

        this._updateState();

        this._updateKeyboard();

        for (const id in this._bodies) {
            this._bodies[id].updateActions(now);
        }

        this._world.step(dt);

        for (const id in this._bodies) {
            this._bodies[id].update(dt);
        }

        this._updateCamera();

        this.emit('update', {now: now, dt: dt});

        this._renderer.render(this._scene, this._camera);

        this._sendActions(now);

        this._saveMainPlayerState(now);

        this._lastTimeUpdate = now;

        this.emit('frameEnd');
    }

    _updateCamera() {
        if (this._mainPlayer && this._mainPlayer._ship) {
            const position = this._mainPlayer._ship.body.position;

            this._camera.position[0] = position[0];
            this._camera.position[1] = position[1];
            this._camera.updateLocalMatrix();
        }
    }

    _saveMainPlayerState(now) {
        if (this._mainPlayer) {
            this._mainPlayerBodyStates.push({
                time: now,
                state: this._mainPlayer.getShip().getState()
            });
        }
    }

    _updateKeyboard() {
        const pressedKeys = this._keyboard.getPressedKeys();
        const ship = this._mainPlayer.getShip();

        for (let key in pressedKeys) {
            if (pressedKeys[key] === false) { continue; }

            key = Number(key);

            if (key === Keyboard.FORWARD) {
                ship.useAction('thrust');
            } else if (key === Keyboard.BACK) {
                ship.useAction('reverse');
            } else if (key === Keyboard.LEFT) {
                ship.useAction('left');
            } else if (key === Keyboard.RIGHT) {
                ship.useAction('right');
            } else if (key === Keyboard.STRAFE_LEFT) {
                ship.useAction('strafeLeft');
            } else if (key === Keyboard.STRAFE_RIGHT) {
                ship.useAction('strafeRight');
            }
        }
    }

    _sendActions(now) {
        if (now - this._lastTimeSend < config.sendingInterval) { return; }

        const actions = this._mainPlayer.getShip().getUsedActions();
        this._socket.send({
            type: 'update',
            actions: actions
        });

        this._lastTimeSend = now;
    }
}
