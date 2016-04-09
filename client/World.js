import dgl from '2gl';
import P from '../physic';

export default class World {
    constructor() {
        this.world = new P.World();

        this.renderer = new dgl.Renderer({
            canvas: 'canvas'
        });
        this.renderer.setSize(window.offsetWidth, window.offsetHeight);

        this.scene = new dgl.Scene();

        this.camera = new dgl.PerspectiveCamera();

        this.bodies = {};

        this._loop = this._loop.bind(this);

        this._lastTimeUpdate = Date.now();

        this._loop();
    }

    addBody(body) {
        this.world.addBody(body.body);
        this.scene.add(body.mesh);
    }

    _loop() {
        requestAnimationFrame(this._loop);

        const now = Date.now();
        const dt = this._lastTimeUpdate - now;

        this.world.step(dt);

        for (const id in this._bodies) {
            this._bodies[id].update(dt);
        }

        this.renderer.render(this.scene, this.camera);

        this._lastTimeUpdate = now;
    }
}
