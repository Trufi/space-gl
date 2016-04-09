import EventEmitter from 'events';
import dgl from '2gl';
import P from '../physic';

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
        requestAnimationFrame(this._loop);

        const now = Date.now();
        const dt = now - this._lastTimeUpdate;

        this.emit('update', {now: now, dt: dt});

        this.world.step(dt);

        for (const id in this.bodies) {
            this.bodies[id].update(dt);
        }

        this.renderer.render(this.scene, this.camera);

        this._lastTimeUpdate = now;
    }
}
