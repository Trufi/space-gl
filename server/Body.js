import P from '../physic';

let idCounter = 0;

export default class Body {
    constructor() {
        this.id = idCounter++;

        this.body = new P.Body();

        this.type = 0;
    }

    setPosition(x, y) {
        this.body.position[0] = x;
        this.body.position[1] = y;
    }

    updateActions() {}

    getState() {
        return {
            id: this.id,
            body: this.body.getState()
        };
    }

    getAllState() {
        return {
            id: this.id,
            type: this.type,
            body: this.body.getAllState()
        };
    }
}
