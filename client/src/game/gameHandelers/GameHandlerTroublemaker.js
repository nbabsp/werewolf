import GameHandler from './GameHandler'
import StaticRequestor from '../../common/StaticRequestor'

let GameMasterRequestor = {    
    troublemakerP: (gameId, playerId, swapIds) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/troublemaker/${JSON.stringify(swapIds)}`),
}

class GameHandlerTroublemaker extends GameHandler {
    constructor(game) {
        super(game)
        this._swapIds = []
        this._selectedOneId = null
        this._doneSelecting = false
    }

    async _nightClick(id) {
        let foundPlayer = this._game.players.find(player => player.id == id)
        if (!this._doneSelecting && this._player.id != id && this._selectedOneId != id && foundPlayer) {
            if (this._selectedOneId) this._doneSelecting = true
            this._selectedOneId = id
            this._game.setRole(id, 'selected')
            this._swapIds.push(id)
            if (this._doneSelecting) {
                GameMasterRequestor.troublemakerP(this._game.id, this._player.id, this._swapIds)
                this._game.swapAnimate(this._swapIds)
            }
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

export default GameHandlerTroublemaker