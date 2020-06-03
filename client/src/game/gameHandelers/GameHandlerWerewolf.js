import GameHandler from './GameHandler'
import StaticRequestor from '../../common/StaticRequestor'

let GameMasterRequestor = {    
    werewolfP: (gameId, playerId) => StaticRequestor.getP(`/games/${gameId}/players/${playerId}/werewolf`),
}

class GameHandlerWerewolf extends GameHandler {
    constructor(game) {
        super(game)
        this._werewolfIds = []
        this._loneWolf = false
        this._peekedId = null
        this._peekedRole = null
    }

    async _nightClick(id) {
        if (this._loneWolf && !this._peekedId && (id == 'left' || id == 'center' || id == 'right')) {
            this._peekedId = id
            this._exposeRole(id)
        }
    }

    async _startNightP() {
        this._werewolfIds = await GameMasterRequestor.werewolfP(this._game.id, this._player.id)
        this._werewolfIds.forEach(id => this._exposeRole(id))
        this._loneWolf = this._werewolfIds.length == 1
    }

    async _endNightP() {
        this._werewolfIds.forEach(id => this._hideRole(id))
        if (this._peekedId) this._hideRole(this._peekedId)
        this._hideRole(this._player.id)
    }
}

export default GameHandlerWerewolf
