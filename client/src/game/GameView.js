import './PlayerGrid'
import CenterCardGrid from './CenterCardGrid'
import './LowerBox'
import './GameView.css'

class GameView {
    constructor(game, interaction) {
        let main = document.createElement('div')
        main.className = 'main'
        this.playerGrid = document.createElement('player-grid')
        this.playerGrid.players = game.players
        this.playerGrid.addEventListener('clicked', event => interaction.onClick(event.detail))
        game.players.forEach(player => game.observeRole(player.id, role => this.playerGrid.exposePlayer(player.id, role)))
        this.centerCardGrid = new CenterCardGrid(game, interaction)
        this.lowerBox = document.createElement('lower-box')

        main.appendChild(this.playerGrid)
        main.appendChild(this.centerCardGrid.element)
        main.appendChild(this.lowerBox)
        this.element = main

        this.lowerBox.role = game.player.startRole

        game.observeTime((time) => this.lowerBox.time = time)
    }
}

export default GameView
