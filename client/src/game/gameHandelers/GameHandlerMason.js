import GameHandler from './GameHandler'
import StaticRequestor from '../../common/StaticRequestor'

let GameMasterRequestor = {
    masonP: (gameId, playerId) => StaticRequestor.getP(`/games/${gameId}/players/${playerId}/mason`),
}

class GameHandlerMason extends GameHandler {
    constructor(game) {
        super(game)
        this._masonIds = []
    }

    async _startNightP() {
        this._masonIds = await GameMasterRequestor.masonP(this._game.id, this._player.id)
        this._masonIds.forEach(id => this._exposeStartRole(id))
    }

    async _endNightP() {
        this._masonIds.forEach(id => this._hideRole(id))
    }
}

export default GameHandlerMason
