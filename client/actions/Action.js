import time from '../utils/time';

export default class Action {
    constructor() {
        this.cooldown = 20;
        this.duration = 20;

        this._lastUsedTime = 0;
    }

    use() {
        const now = time();

        if (this.isUsed()) { return; }

        this._lastUsedTime = now;
    }

    isUsed() {
        const now = time();

        return now - this._lastUsedTime < this.duration;
    }

    update(now) {
        if (this.isUsed(now)) {
            this._do();
        }
    }
}
