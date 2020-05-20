import GameHandler from './GameHandler'
import Requestor from '../../common/Requestor'
let host = 'localhost'
let port = 9615

let GameMasterRequestor = {
    masonP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/mason`),
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
