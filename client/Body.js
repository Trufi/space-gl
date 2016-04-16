import dgl from '2gl';
import P from '../physic';

let idCounter = 0;

export default class Body {
    constructor() {
        this.id = idCounter++;

        this.body = new P.Body();
        this.mesh = new dgl.Object3D();
    }

    setPosition(x, y) {
        this.body.position[0] = x;
        this.body.position[1] = y;
    }

    update() {
        this.mesh.position[0] = this.body.position[0];
        this.mesh.position[1] = this.body.position[1];
        dgl.quat.setAxisAngle(this.mesh.quaternion, this._rotateAxis, this.body.angle);
        this.mesh.updateLocalMatrix();
    }

    updateActions() {}
}
