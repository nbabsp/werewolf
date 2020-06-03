import GameHandler from './GameHandler'
import StaticRequestor from '../../common/StaticRequestor'

let GameMasterRequestor = {    
    drunkP: (gameId, playerId, swapIds) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/drunk/${JSON.stringify(swapIds)}`),
}

class GameHandlerDrunk extends GameHandler {
    constructor(game) {
        super(game)
        this._swapIds = []
        this._doneLooking = false
    }

    async _nightClick(id) {
        if (!this._doneLooking && (id == 'left' || id == 'center' || id == 'right')) {
            this._midClick = true
            this._doneLooking = true
            this._swapIds = [this._player.id, id]
            this._exposeRole(this._player.id)
            let waitP = (sec) => new Promise(resolve => setTimeout(resolve, sec*1000))
            await waitP(2)
            let tempRole = this._player.role
            this._player.role = this._game.center[id]
            this._game.center[id] = tempRole
            this._exposeRole(id)
            this._hideRole(this._player.id)
            GameMasterRequestor.drunkP(this._game.id, this._player.id, this._swapIds)
            await waitP(2)
            this._midClick = false
        }
    }

    async _startNightP() {
    }

    async _endNightP() {
        this._swapIds.forEach(id => this._hideRole(id))
        this._hideRole(this._player.id)
    }
}

export default GameHandlerDrunk