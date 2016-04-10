import dgl from '2gl';
import P from '../physic';
import Thrust from './actions/Thrust';
import Reverse from './actions/Reverse';
import Left from './actions/Left';
import Right from './actions/Right';
import StrafeLeft from './actions/StrafeLeft';
import StrafeRight from './actions/StrafeRight';

let idCounter = 0;

export default class Body {
    constructor() {
        this.id = idCounter++;

        this.actions = {
            thrust: new Thrust(this),
            reverse: new Reverse(this),
            left: new Left(this),
            right: new Right(this),
            strafeLeft: new StrafeLeft(this),
            strafeRight: new StrafeRight(this)
        };

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

        this._rotateAxis = dgl.vec3.fromValues(0, 0, -1);

        this.thrustForce = 0.0003;
        this.rotateForce = 0.0002;
    }

    update(dt) {
        this.mesh.position[0] = this.body.position[0];
        this.mesh.position[1] = this.body.position[1];
        dgl.quat.setAxisAngle(this.mesh.quaternion, this._rotateAxis, this.body.angle);
        this.mesh.updateLocalMatrix();
    }

    updateActions(now) {
        for (const name in this.actions) {
            this.actions[name].update(now);
        }
    }

    useAction(name) {
        this.actions[name].use();
    }

    thrust() {
        this.body.force[0] = this.thrustForce * Math.sin(this.body.angle);
        this.body.force[1] = this.thrustForce * Math.cos(this.body.angle);
    }

    reverse() {
        this.body.force[0] = -this.thrustForce * Math.sin(this.body.angle);
        this.body.force[1] = -this.thrustForce * Math.cos(this.body.angle);
    }

    left() {
        this.body.angularForce = this.rotateForce;
    }

    right() {
        this.body.angularForce = -this.rotateForce;
    }
}
