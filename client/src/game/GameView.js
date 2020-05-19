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
        this.playerGrid.addEventListener('clicked', (event) => console.log('clicked player:', event.detail))
        // need to handle disclosing players: playerView.onClick = () => interaction.onClick(player.id)
        // need to handle disclosing players: game.observeRole(player.id, (role) => playerView.role = role ? role : 'back')
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
