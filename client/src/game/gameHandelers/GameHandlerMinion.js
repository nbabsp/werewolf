import GameHandler from './GameHandler'
import StaticRequestor from '../../common/StaticRequestor'

let GameMasterRequestor = {
    minionP: (gameId, playerId) => StaticRequestor.getP(`/games/${gameId}/players/${playerId}/minion`),
}

class GameHandlerMinion extends GameHandler {
    constructor(game) {
        super(game)
        this._werewolfIds = []
    }

    async _startNightP() {
        this._werewolfIds = await GameMasterRequestor.minionP(this._game.id, this._player.id)
        this._werewolfIds.forEach(id => this._exposeStartRole(id))
    }

    async _endNightP() {
        this._werewolfIds.forEach(id => this._hideRole(id))
    }
}

export default GameHandlerMinion
