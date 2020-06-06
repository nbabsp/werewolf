import { LitElement, html, css} from 'lit-element'
import './BaseCard'

class SelectionGrid extends LitElement {
    static get properties() {
        return {
            players: { type: Array }
        }
    }

    static get styles() {
        return css`
        :host {
            background-color: #777777;
            display: block;
            width: 480px;
            margin: auto;
        }
        `
    }

    constructor() {
        super()
        this.players = [
            {id: 'werewolf1', role: 'werewolf'},
            {id: 'werewolf2', role: 'werewolf'},
            {id: 'minion', role: 'minion'},
            {id: 'mason1', role: 'mason'},
            {id: 'mason2', role: 'mason'},
            {id: 'seer', role: 'seer'},
            {id: 'robber', role: 'robber'},
            {id: 'troublemaker', role: 'troublemaker'},
            {id: 'drunk', role: 'drunk'},
            {id: 'insomniac', role: 'insomniac'},
            {id: 'villager1', role: 'villager'},
            {id: 'villager2', role: 'villager'},
            {id: 'villager3', role: 'villager'},
            {id: 'hunter', role: 'hunter'},
            {id: 'tanner', role: 'tanner'},
        ]
    }

    selectedPlayer(id, selected) {
        let basePlayer = this.shadowRoot.getElementById(id)
        basePlayer.selected = selected
    }


    playerClicked(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: event.detail }))
    }

    render() {
        return html`
            <div styles='height:${ 182 * (this.players.length % 4 + 1) }px'>${this.players.map(player => html`<base-card id=${ player.id } .player=${ player } @clicked=${ this.playerClicked }/>`)}</div>
        `
    }
}

customElements.define('selection-grid', SelectionGrid)
