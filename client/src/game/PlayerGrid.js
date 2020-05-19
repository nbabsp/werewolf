import { LitElement, html, css} from 'lit-element'
import './BasePlayer'

class PlayerGrid extends LitElement {
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
        this.players = []
    }

    handleClick(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: event.detail }))
    }

    render() {
        return html`
            <div>${this.players.map(player => html`<base-player .player=${ player } @clicked=${ this.handleClick }/>`)}</div>
        `
    }
}

customElements.define('player-grid', PlayerGrid)
