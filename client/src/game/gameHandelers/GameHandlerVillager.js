import GameHandler from './GameHandler'

class GameHandlerVillager extends GameHandler {
    constructor(game) {
        super(game)
    }

    async _startNightP() {}
    async _endNightP() {}
}

export default GameHandlerVillager
