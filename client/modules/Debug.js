import Stats from 'stats.js';

export default class Debug {
    constructor(game) {
        this._game = game;

        this._html = document.getElementById('debug');

        this._statsHtml = document.createElement('div');
        this._html.appendChild(this._statsHtml);

        this._pingHtml = document.createElement('div');
        this._html.appendChild(this._pingHtml);

        window.debug = this;

        this._stats = new Stats();

        this._game.on('frameStart', () => {
            this._stats.frameStart();
        });

        this._game.on('frameEnd', () => {
            this._stats.frameEnd();
        });

        this._game.on('update', () => {
            // this._statsHtml.innerHTML = this._stats.getHtmlText();
            this._statsHtml.innerHTML = this._stats.get('fps').getLast() + 'fps';
            this._pingHtml.innerHTML = 'Ping: ' + this._game._ping.getPing() + ' dvt: ' +
                this._game._ping._stats.get('ping').getDeviation() + '<br />Delta: ' + this._game._ping.getDelta();
        });
    }
}
