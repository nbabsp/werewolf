import './PlayerGrid.css'
import PlayerView from './PlayerView'

class PlayerGrid {
    constructor(game, interaction) {
        this.element = document.createElement('div')
        this.element.className = 'playerGrid'
        this._gridWrapper = document.createElement('div')
        game.players.forEach((player) => {
            let playerView = new PlayerView(player.name, () => interaction.onClick(player.id))
            this._gridWrapper.appendChild(playerView.element)
            game.observeRole(player.id, (role) => playerView.role = role)
        })
        this.element.appendChild(this._gridWrapper)
    }
}

export default PlayerGrid
