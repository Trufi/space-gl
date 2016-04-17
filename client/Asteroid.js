import dgl from '2gl';

import Body from './Body';

export default class Asteroid extends Body {
    constructor(options) {
        super(options);

        this.body.mass = 1000;

        const positions = new Float32Array([
            0, 0, 0,
            5, 5, 0,
            0, 5, 0,

            0, 0, 0,
            5, 0, 0,
            5, 5, 0
        ]);

        const positionBuffer = new dgl.Buffer(positions, 3);
        const geometry = new dgl.Geometry();
        geometry.setBuffer('position', positionBuffer);

        const program = new dgl.BasicMeshProgram();
        program.color = [0.7, 0.7, 0.7];
        const mesh = new dgl.Mesh(geometry, program);
        mesh.position[0] = -2.5;
        mesh.position[1] = -2.5;
        mesh.updateLocalMatrix();

        this.mesh.add(mesh);

        this._rotateAxis = dgl.vec3.fromValues(0, 0, -1);
    }
}
