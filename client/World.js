import dgl from '2gl';
import P from '../physic';

export default class World {
    constructor() {
        this.world = new P.World();

        this.renderer = new dgl.Renderer({
            canvas: 'canvas'
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

    _loop() {
        requestAnimationFrame(this._loop);

        const now = Date.now();
        const dt = now - this._lastTimeUpdate;

        this.world.step(dt);

        for (const id in this.bodies) {
            this.bodies[id].update(dt);
        }

        this.renderer.render(this.scene, this.camera);

        this._lastTimeUpdate = now;
    }
}
