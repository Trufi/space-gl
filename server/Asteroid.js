import P from '../physic';
import {bodyType} from '../physic/enums';

import Body from './Body';

export default class Asteroid extends Body {
    constructor() {
        super();

        this.body = new P.Body();
        this.body.mass = 1000;
        this.type = bodyType.ASTEROID;
    }
}
