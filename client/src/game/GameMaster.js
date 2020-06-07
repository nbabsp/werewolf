import GameHandler from './gameHandelers/GameHandler'
import GameHandlerWerewolf from './gameHandelers/GameHandlerWerewolf'
import GameHandlerMinion from './gameHandelers/GameHandlerMinion'
import GameHandlerMason from './gameHandelers/GameHandlerMason'
import GameHandlerSeer from './gameHandelers/GameHandlerSeer'
import GameHandlerRobber from './gameHandelers/GameHandlerRobber'
import GameHandlerTroublemaker from './gameHandelers/GameHandlerTroublemaker'
import GameHandlerDrunk from './gameHandelers/GameHandlerDrunk'
import GameHandlerInsomniac from './gameHandelers/GameHandlerInsomniac'
import GameHandlerVillager from './gameHandelers/GameHandlerVillager'
import GameHandlerTanner from './gameHandelers/GameHandlerTanner'
import GameHandlerHunter from './gameHandelers/GameHandlerHunter'

class GameMaster {
    constructor (game, interaction) {
        this._game = game
        console.log('startrole: ', this._game.player.startRole)
        switch (this._game.player.startRole) {
            case 'werewolf':
                console.log('hi')
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
            case 'robber':
                this._handler = new GameHandlerRobber(this._game)
                break
            case 'troublemaker':
                this._handler = new GameHandlerTroublemaker(this._game)
                break
            case 'drunk':
                this._handler = new GameHandlerDrunk(this._game)
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
