import dgl from '2gl';
import P from '../physic';

export default class Body {
    constructor({state}) {
        this.body = new P.Body();
        this.mesh = new dgl.Object3D();

        this.setState(state);
    }

    setPosition(x, y) {
        this.body.position[0] = x;
        this.body.position[1] = y;
    }

    setState(state) {
        if (state.id !== undefined) {
            this.id = state.id;
        }

        if (state.body !== undefined) {
            this.body.setState(state.body);
        }
    }

    update() {
        this.mesh.position[0] = this.body.position[0];
        this.mesh.position[1] = this.body.position[1];
        dgl.quat.setAxisAngle(this.mesh.quaternion, this._rotateAxis, this.body.angle);
        this.mesh.updateLocalMatrix();
    }

    updateActions() {}
}
