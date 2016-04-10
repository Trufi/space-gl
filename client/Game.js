import EventEmitter from 'events';
import dgl from '2gl';
import P from '../physic';
import time from './utils/time';

export default class Game extends EventEmitter {
    constructor() {
        super();

        this.world = new P.World();

        this.renderer = new dgl.Renderer({
            canvas: 'canvas',
            clearColor: [0, 0, 0, 1]
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new dgl.Scene();

        this.camera = new dgl.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
        this.camera.position[2] = 50;
        this.camera.updateProjectionMatrix();

        this.bodies = {};

        this._loop = this._loop.bind(this);

        this._lastTimeUpdate = Date.now();

        this._loop();
    }

    addBody(body) {
        this.world.addBody(body.body);
        this.scene.add(body.mesh);
        this.bodies[body.id] = body;
    }

    addPlayer(player) {
        this._player = player;
        player.addGame(this);
    }

    _loop() {
        this.emit('frameStart');

        requestAnimationFrame(this._loop);

        const now = time();
        const dt = now - this._lastTimeUpdate;

        for (const id in this.bodies) {
            this.bodies[id].updateActions(now);
        }

        this.emit('update', {now: now, dt: dt});

        this.world.step(dt);

        for (const id in this.bodies) {
            this.bodies[id].update(dt);
        }

        this.renderer.render(this.scene, this.camera);

        this.emit('render', {now: now, dt: dt});

        this._lastTimeUpdate = now;

        this.emit('frameEnd');
    }
}
