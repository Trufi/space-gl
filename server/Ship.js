import P from '../physic';
import {bodyType} from '../physic/enums';

import Body from './Body';
import Thrust from './actions/Thrust';
import Reverse from './actions/Reverse';
import Left from './actions/Left';
import Right from './actions/Right';
import StrafeLeft from './actions/StrafeLeft';
import StrafeRight from './actions/StrafeRight';

export default class Ship extends Body {
    constructor() {
        super();

        this.actions = {
            thrust: new Thrust(this),
            reverse: new Reverse(this),
            left: new Left(this),
            right: new Right(this),
            strafeLeft: new StrafeLeft(this),
            strafeRight: new StrafeRight(this)
        };

        this.body = new P.Body();
        this.body.mass = 10;

        this.type = bodyType.SHIP;

        this.thrustForce = 0.0003;
        this.rotateForce = 0.0002;
    }

    updateActions(now) {
        for (const name in this.actions) {
            this.actions[name].update(now);
        }
    }

    useAction(name) {
        this.actions[name].use();
    }
}
