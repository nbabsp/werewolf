import GameHandler from './GameHandler'

class GameHandlerHunter extends GameHandler {
    constructor(game) {
        super(game)
    }

    async _startNightP() {}
    async _endNightP() {
        this._hideRole(this._player.id)
    }
}

export default GameHandlerHunter
