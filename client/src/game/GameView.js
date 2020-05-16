import PlayerGrid from './PlayerGrid'
import CenterCardGrid from './CenterCardGrid'
import LowerBox from './LowerBox'

let descriptions = {
    werewolf: 'Look for other Werewolves',
    minion: 'Look for the Werewolves',
    mason: 'Look for other Masons',
    seer: 'Look at another player\'s card or two center cards',
    robber: 'Swap your card with another player\'s card',
    troublemaker: 'Swap two other player\'s cards',
    drunk: 'Swap your card with one of the center cards',
    insomniac: 'Look at your card at the end of the night phase',
    villager: 'Listen carefully',
    tanner: 'Don\'t die... or well... do die'
}

class GameView {
    constructor(game, interaction) {
        let main = document.createElement('div')
        main.className = 'main'
        this.playerGrid = new PlayerGrid(game, interaction)
        this.centerCardGrid = new CenterCardGrid(game, interaction)
        this.lowerBox = new LowerBox()

        main.appendChild(this.playerGrid.element)
        main.appendChild(this.centerCardGrid.element)
        main.appendChild(this.lowerBox.element)
        this.element = main

        this.lowerBox.description = descriptions[game.player.startRole]
        this.lowerBox.role = game.player.startRole

        game.observeTime((time) => this.lowerBox.time = time)
    }
}

export default GameView
