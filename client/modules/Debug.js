import Stats from 'stats.js';

export default class Debug {
    constructor(player) {
        this._player = player;

        this._onAddGame = this._onAddGame.bind(this);
        player.on('addGame', this._onAddGame);

        this._html = document.getElementById('debug');

        this._statsHtml = document.createElement('div');
        this._html.appendChild(this._statsHtml);

        window.debug = this;
    }

    _onAddGame() {
        this._game = this._player._game;
        this._stats = new Stats();

        this._game.on('frameStart', () => {
            this._stats.frameStart();
        });

        this._game.on('frameEnd', () => {
            this._stats.frameEnd();
        });

        this._game.on('render', () => {
            // this._statsHtml.innerHTML = this._stats.getHtmlText();
            this._statsHtml.innerHTML = this._stats.get('fps').getLast() + 'fps';
        });
    }
}
