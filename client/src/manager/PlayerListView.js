import './PlayerListView.css'

class PlayerListView {
    constructor() {
        this.element = document.createElement('div')
        this.element.className = 'playerList'
        this._listWrapper = document.createElement('div')
    }
    set players(players) {
        this._listWrapper.remove()
        this._listWrapper = document.createElement('div')
        players.forEach((player) => {
            let text = document.createElement('div')
            text.className = 'playerListText'
            text.appendChild(document.createTextNode(player.name))
            this._listWrapper.appendChild(text)
        })
        this.element.appendChild(this._listWrapper)
    }
}

export default PlayerListView