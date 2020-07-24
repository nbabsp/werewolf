import './components/PlayerGrid'
import './components/CenterCardGrid'
import './components/LowerBox'
import './components/CardGrid'
import './GameView.css'

class GameView {
    constructor(game, interaction) {
        let main = document.createElement('div')
        main.className = 'main'
        
        this.playerGrid = document.createElement('player-grid')
        this.playerGrid.players = game.players
        this.playerGrid.addEventListener('clicked', event => interaction.onClick(event.detail))
        game.players.forEach(player => game.observeRole(player.id, role => this.playerGrid.exposePlayer(player.id, role)))
        game.players.forEach(player => game.observeDeath(player.id, dead => this.playerGrid.deadPlayer(player.id, dead)))
        game.players.forEach(player => game.observeVotes(player.id, votes => this.playerGrid.setVotes(player.id, votes)))

        this.centerCardGrid = document.createElement('center-card-grid')
        this.centerCardGrid.addEventListener('clicked',  event => interaction.onClick(event.detail))
        game.observeRole('left', role => this.centerCardGrid.exposeCard('left', role))
        game.observeRole('center', role => this.centerCardGrid.exposeCard('center', role))
        game.observeRole('right', role => this.centerCardGrid.exposeCard('right', role))
        this.centerCardGrid.num = this.playerGrid.players.length + 3 - this.playerGrid.players.length % 3

        this.lowerBox = document.createElement('lower-box')
        this.lowerBox.addEventListener('clicked',  event => interaction.onClick(event.detail))
        game.observeTimerStatus(status => this.lowerBox.changeTimerStatus(status))
        this.lowerBox.role = game.player.startRole

        this.cardGrid = document.createElement('card-grid')
        this.cardGrid.cards = game.cards

        main.appendChild(this.playerGrid)
        main.appendChild(this.centerCardGrid)
        main.appendChild(this.lowerBox)
        main.appendChild(this.cardGrid)
        this.element = main

        game.observeTime((time) => this.lowerBox.time = time)
        game.observeRole('lower', role => this.lowerBox.exposeCard(role))
        game.observeDescription(role => this.lowerBox.changeDescription(role))
        game.observeSwapAnimate(ids => this.swap(ids))
        game.observeSwapDeanimate(() => this.unswap())
    }

    swap(ids) {
        let arr = ['left', 'center', 'right']
        let card1 = !arr.includes(ids[0]) ? this.playerGrid.shadowRoot.getElementById(ids[0]) : this.centerCardGrid.shadowRoot.getElementById(ids[0])
        let card2 = !arr.includes(ids[1]) ? this.playerGrid.shadowRoot.getElementById(ids[1]) : this.centerCardGrid.shadowRoot.getElementById(ids[1])
        card1.animate(card2.num)
        card2.animate(card1.num)
    }

    unswap() {
        this.playerGrid.players.forEach(player => this.playerGrid.shadowRoot.getElementById(player.id).deanimate())
        this.centerCardGrid.shadowRoot.getElementById('left').deanimate()
        this.centerCardGrid.shadowRoot.getElementById('center').deanimate()
        this.centerCardGrid.shadowRoot.getElementById('right').deanimate()
    }

}

export default GameView
