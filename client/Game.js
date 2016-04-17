import EventEmitter from 'events';
import dgl from '2gl';
import P from '../physic';
import time from './utils/time';
import Socket from './modules/Socket';

export default class Game extends EventEmitter {
    constructor() {
        super();

        this._socket = new Socket();

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

        this._loop = this._loop.bind(this);

        this._lastTimeUpdate = time();

        this._loop();
    }

    addBody(body) {
        this._world.addBody(body.body);
        this._scene.add(body.mesh);
        this._bodies[body.id] = body;
    }

    addPlayer(player) {
        this._player = player;
        player.addGame(this);
    }

    _updateSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this._renderer.setSize(width, height);
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
    }

    _loop() {
        this.emit('frameStart');

        requestAnimationFrame(this._loop);

        const now = time();
        const dt = now - this._lastTimeUpdate;

        for (const id in this._bodies) {
            this._bodies[id].updateActions(now);
        }

        this.emit('update', {now: now, dt: dt});

        this._world.step(dt);

        for (const id in this._bodies) {
            this._bodies[id].update(dt);
        }

        this._updateCamera();

        this._renderer.render(this._scene, this._camera);

        this.emit('render', {now: now, dt: dt});

        this._lastTimeUpdate = now;

        this.emit('frameEnd');
    }

    _updateCamera() {
        if (this._player && this._player._ship) {
            const position = this._player._ship.body.position;

            this._camera.position[0] = position[0];
            this._camera.position[1] = position[1];
            this._camera.updateLocalMatrix();
        }
    }
}
