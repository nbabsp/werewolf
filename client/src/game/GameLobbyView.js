import PlayerListView from '../manager/PlayerListView'
import './GameLobbyView.css'

class GameLobbyView {
    constructor() {
        this.nameList = new PlayerListView([])
        this.element = document.createElement('div')
        this.element.className = 'gamelobby'
        this.element.appendChild(this.nameList.element)
    }

    set players(players) {
        this.nameList.players = players
    }
}

export default GameLobbyView
