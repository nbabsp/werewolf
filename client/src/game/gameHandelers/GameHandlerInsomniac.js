import GameHandler from './GameHandler'

class GameHandlerInsomniac extends GameHandler {
    constructor(game) {
        super(game)
    }

    async _startNightP() {}
    async _endNightP() {
        this._exposeRole(this._player.id)
    }
}

export default GameHandlerInsomniac
