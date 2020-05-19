import './PlayerGrid.css'
import './BasePlayer.js'

class PlayerGrid {
    constructor(game, interaction) {
        this.element = document.createElement('div')
        this.element.className = 'playerGrid'
        this._gridWrapper = document.createElement('div')
        game.players.forEach((player) => {

            let playerView = document.createElement('base-player')
            playerView.name = player.name
            playerView.onClick = () => interaction.onClick(player.id)
            this._gridWrapper.appendChild(playerView)
            game.observeRole(player.id, (role) => playerView.role = role ? role : 'back')
            })
        this.element.appendChild(this._gridWrapper)
    }
}

export default PlayerGrid
