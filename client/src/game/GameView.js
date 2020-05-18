import PlayerGrid from './PlayerGrid'
import CenterCardGrid from './CenterCardGrid'
import './LowerBox'
import './GameView.css'

class GameView {
    constructor(game, interaction) {
        let main = document.createElement('div')
        main.className = 'main'
        this.playerGrid = new PlayerGrid(game, interaction)
        this.centerCardGrid = new CenterCardGrid(game, interaction)
        this.lowerBox = document.createElement('lower-box')

        main.appendChild(this.playerGrid.element)
        main.appendChild(this.centerCardGrid.element)
        main.appendChild(this.lowerBox)
        this.element = main

        this.lowerBox.role = game.player.startRole

        game.observeTime((time) => this.lowerBox.time = time)
    }
}

export default GameView
