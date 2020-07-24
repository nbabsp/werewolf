import GameHandler from './GameHandler'
import StaticRequestor from '../../common/StaticRequestor'

let GameMasterRequestor = {    
    robberP: (gameId, playerId, swapIds) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/robber/${JSON.stringify(swapIds)}`),
}

class GameHandlerRobber extends GameHandler {
    constructor(game) {
        super(game)
        this._swapIds = []
        this._doneLooking = false
    }

    async _nightClick(id) {
        let foundPlayer = this._game.players.find(player => player.id == id)
        if (!this._doneLooking && this._player.id != id && foundPlayer) {
            this._midClick = true
            this._doneLooking = true
            this._swapIds = [this._player.id, id]
            this._exposeRole(id)
            this._exposeRole(this._player.id)
            let waitP = (sec) => new Promise(resolve => setTimeout(resolve, sec*1000))
            await waitP(2)
            this._game.swapAnimate(this._swapIds)
            GameMasterRequestor.robberP(this._game.id, this._player.id, this._swapIds)
            await waitP(5)
            this._midClick = false
        }
    }

    async _startNightP() {
    }

    async _endNightP() {
        this._swapIds.forEach(id => this._hideRole(id))
        this._hideRole(this._player.id)
        this._game.swapDeanimate()
    }
}

export default GameHandlerRobber