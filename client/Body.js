import dgl from '2gl';
import P from '../physic';

let idCounter = 0;

export default class Body {
    constructor() {
        this.id = idCounter++;

        this.body = new P.Body();
        this.mesh = new dgl.Object3D();
    }

    update(dt) {}
}
