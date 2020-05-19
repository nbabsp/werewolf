import { LitElement, html, css} from 'lit-element'
import './BaseCard'

class BasePlayer extends LitElement {
    static get properties() {
        return {
            player: { type: Object },
            role: { type: String }
        }
    }

    static get styles() {
        return css`
        :host {
            display: inline-block;
            margin: 10px;
        }

        .cardWrapper {
            background-color: #777777;
            display: block;
            margin: auto;
            height: 157px;
            width: 100px;
        }

        .name {
            width: 100px;
            height: 20px;
            background-color: #36393E;
            color: #FFFFFF;
            display: block;
            text-align: center;
        }
        `
    }

    constructor() {
        super()
        this.player = {}
        this.role = null
    }

    handleClick(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: this.player.id }))
    }

    render() {
        return html`
            <div id='basePlayer'>
                <div class='cardWrapper'>
                    <base-card .role=${ this.role } @clicked=${ this.handleClick }></base-card>
                </div>
                <div class='name'>${ this.player.name }</div>
            </div>
        `
    }
}

customElements.define('base-player', BasePlayer)
