import { LitElement, html, css} from 'lit-element'
import './BasePlayer'

class PlayerGrid extends LitElement {
    static get properties() {
        return {
            players: { type: Array },
            i: { type: Number }
        }
    }

    static get styles() {
        return css`
        :host {
            background-color: #777777;
            display: block;
            width: 96%;
            margin: auto;
            padding: 2%;
        }
        `
    }

    constructor() {
        super()
        this.players = []
        this.i = -1
    }

    exposePlayer(id, role) {
        let basePlayer = this.shadowRoot.getElementById(id)
        basePlayer.role = role
    }

    deadPlayer(id, dead) {
        let basePlayer = this.shadowRoot.getElementById(id)
        basePlayer.dead = dead
    }

    setVotes(id, votes) {
        let basePlayer = this.shadowRoot.getElementById(id)
        basePlayer.votes = votes
    }

    playerClicked(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: event.detail }))
    }

    render() {
        return html`
            <div style='height:min(${ Math.ceil(this.players.length / 3) * 205 }px, ${48.1 * Math.ceil(this.players.length / 3)}vw)'>${this.players.map(player => {
                    this.i += 1
                    return html`<base-player id=${ player.id } .num=${ this.i } .player=${ player } @clicked=${ this.playerClicked }/>`
                })
            }</div>
        `
    }
}

customElements.define('player-grid', PlayerGrid)
