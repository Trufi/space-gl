import dgl from '2gl';
import P from '../physic';

let idCounter = 0;

export default class Body {
    constructor() {
        this.id = idCounter++;

        this.body = new P.Body();

        const positions = new Float32Array([
            0, 0, 0,
            2, 3, 0,
            0, 3, 0,

            0, 0, 0,
            2, 0, 0,
            2, 3, 0
        ]);

        const positionBuffer = new dgl.Buffer(positions, 3);
        const geometry = new dgl.Geometry();
        geometry.setBuffer('position', positionBuffer);

        const program = new dgl.BasicMeshProgram();
        program.color = [0.7, 0.2, 0];
        const mesh = new dgl.Mesh(geometry, program);
        mesh.position[0] = -1;
        mesh.position[1] = -1.5;
        mesh.updateLocalMatrix();

        this.mesh = new dgl.Object3D();
        this.mesh.add(mesh);

        this._rotateAxis = dgl.vec3.fromValues(0, 0, 1);
    }

    update(dt) {
        this.mesh.position[0] = this.body.position[0];
        this.mesh.position[1] = this.body.position[1];
        dgl.quat.setAxisAngle(this.mesh.quaternion, this._rotateAxis, this.body.angle);
        this.mesh.updateLocalMatrix();
    }

    thrust() {
        const d = 1;
        this.body.velocity[0] += d * Math.cos(this.body.angle);
        this.body.velocity[1] += d * Math.sin(this.body.angle);
    }

    reverse() {
        const d = 1;
        this.body.velocity[0] -= d * Math.cos(this.body.angle);
        this.body.velocity[1] -= d * Math.sin(this.body.angle);
    }

    left() {
        this.body.angularVelocity -= 1;
    }

    right() {
        this.body.angularVelocity += 1;
    }
}
