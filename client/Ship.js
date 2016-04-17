import dgl from '2gl';

import Body from './Body';
import Thrust from './actions/Thrust';
import Reverse from './actions/Reverse';
import Left from './actions/Left';
import Right from './actions/Right';
import StrafeLeft from './actions/StrafeLeft';
import StrafeRight from './actions/StrafeRight';

export default class Ship extends Body {
    constructor(options) {
        super(options);

        this.actions = {
            thrust: new Thrust(this),
            reverse: new Reverse(this),
            left: new Left(this),
            right: new Right(this),
            strafeLeft: new StrafeLeft(this),
            strafeRight: new StrafeRight(this)
        };

        this.body.mass = 10;

        const positions = new Float32Array([
            0, 0, 0,
            2, 0, 0,
            1, 3, 0
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

        this.mesh.add(mesh);

        this._rotateAxis = dgl.vec3.fromValues(0, 0, -1);

        this.thrustForce = 0.0003;
        this.rotateForce = 0.0002;

        this._usedActions = [];
    }

    updateActions(now) {
        for (const name in this.actions) {
            this.actions[name].update(now);
        }
    }

    useAction(name) {
        if (this.actions[name].isUsed()) { return; }

        this.actions[name].use();
        this._usedActions.push(name);
    }

    getUsedActions() {
        const result = this._usedActions;
        this._usedActions = [];
        return result;
    }
}
