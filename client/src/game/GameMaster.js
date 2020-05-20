import Requestor from '../common/Requestor'
import GameHandler from './gameHandelers/GameHandler'
import GameHandlerWerewolf from './gameHandelers/GameHandlerWerewolf'
import GameHandlerMinion from './gameHandelers/GameHandlerMinion'
import GameHandlerMason from './gameHandelers/GameHandlerMason'
import GameHandlerSeer from './gameHandelers/GameHandlerSeer'
import GameHandlerInsomniac from './gameHandelers/GameHandlerInsomniac'
import GameHandlerVillager from './gameHandelers/GameHandlerVillager'
import GameHandlerTanner from './gameHandelers/GameHandlerTanner'
import GameHandlerHunter from './gameHandelers/GameHandlerHunter'


let host = 'localhost'
let port = 9615

let GameRequestor = {
    werewolfP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/werewolf`),
    minionP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/minion`),
    masonP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/mason`),
    seerP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/seer`),
    robberP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/robber`),
    troublemakerP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/troublemaker`),
    drunkP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/drunk`),
    insomniacP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/insomniac`)
}

let GameMasterRequestor = {
    statusP: (gameId) => Requestor.getP(host, port, `/games/${gameId}/status`),
    
    werewolfP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/werewolf`),
    minionP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/minion`),
}

class GameMaster {
    constructor (game, interaction) {
        this._game = game
        switch (this._game.player.startRole) {
            case 'werewolf':
                this._handler = new GameHandlerWerewolf(this._game)
                break
            case 'minion':
                this._handler = new GameHandlerMinion(this._game)
                break
            case 'mason':
                this._handler = new GameHandlerMason(this._game)
                break
            case 'seer':
                this._handler = new GameHandlerSeer(this._game)
                break    
            case 'insomniac':
                this._handler = new GameHandlerInsomniac(this._game)
                break
            case 'villager':
                this._handler = new GameHandlerVillager(this._game)
                break
            case 'tanner':
                this._handler = new GameHandlerTanner(this._game)
                break
            case 'hunter':
                this._handler = new GameHandlerHunter(this._game)
                break    
            default:
                this._handler = new GameHandler(this._game)
                break
        }
        interaction.observeClick(id => this._handler.onClick(id))
    }

    async playP() {
        return this._handler.playP()
    }
}

export default GameMaster
