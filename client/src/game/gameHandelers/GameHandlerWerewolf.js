import GameHandler from './GameHandler'
import Requestor from '../../common/Requestor'
let host = 'localhost'
let port = 9615

let GameMasterRequestor = {    
    werewolfP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/werewolf`),
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
            this._exposeStartRole(id)
        }
    }

    async _startNightP() {
        this._werewolfIds = await GameMasterRequestor.werewolfP(this._game.id, this._player.id)
        this._werewolfIds.forEach(id => this._exposeStartRole(id))
        this._loneWolf = this._werewolfIds.length == 1
    }

    async _endNightP() {
        this._werewolfIds.forEach(id => this._hideRole(id))
        if (this._peekedId) this._hideRole(this._peekedId)
    }
}

export default GameHandlerWerewolf
