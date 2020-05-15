import PlayerListView from './PlayerListView'
import Button from '../common/Button'
import './LobbyView.css'

class LobbyView {
    constructor(startCallback) {
        let startButton = new Button('START GAME', () => startCallback())
        this.nameList = new PlayerListView([])
        this.element = document.createElement('div')
        this.element.className = 'lobby'
        this.element.appendChild(this.nameList.element)
        this.element.appendChild(startButton.element)
    }

    set players(players) {
        this.nameList.players = players
    }
}

export default LobbyView
