import { LitElement, html, css} from 'lit-element'
import './SelectCard'

class SelectionGrid extends LitElement {
    static get properties() {
        return {
            cards: { type: Array },
            selected: { type: Array }
        }
    }

    static get styles() {
        return css`
        :host {
            background-color: #777777;
            display: block;
            width: 492px;
            margin: auto;
            overflow: scroll;
            z-index: 9;
        }
        `
    }

    constructor() {
        super()
        this.cards = [
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
        ],
        this.selected = []
    }

    selectedCard(id, selected) {
        let basePlayer = this.shadowRoot.getElementById(id)
        basePlayer.selected = selected
    }

    cardClicked(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: event.detail }))
    }

    render() {
        return html`
            <div styles='height:${ 182 * (this.cards.length % 4 + 1) }px'>${this.cards.map(card => html`<select-card id=${ card.id } .role=${ card.role } .id=${ card.id } .selected=${ this.selected.includes(card.id)} @clicked=${ this.cardClicked }/>`)}</div>
        `
    }
}

customElements.define('selection-grid', SelectionGrid)
