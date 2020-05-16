import { LitElement, html, css} from 'lit-element'
import '../components/NameList'
import '../components/CTAButton'

class ManagerLobby extends LitElement {
    static get properties() {
        return {
            name: { type: String }
        }
    }

    static get styles() {
        return css`
            .lobby {
                box-sizing: border-box;
                padding-top: 200px;
                width: 100%;
                height: 100%;
                background-color: #dddddd;
                font-size: 14px;
                font-family: arial, sans-serif;
                font-weight: 100;
                line-height: 18px;
                color: #000000;
            }
        `
    }

    constructor() {
        super()
        this.name = ''
        this.startCallback = null
    }

    set players(players) {
        let nameList = this.shadowRoot.getElementById('manager-lobby-names')
        if (nameList) nameList.names = players.map(player => player.name)
    }

    handleClick(event) {
        if (this.startCallback) this.startCallback()
    }

    render() {
        return html`
            <div class='lobby'>
                <name-list id='manager-lobby-names'></name-list>
                <cta-button text='START GAME' @click=${ this.handleClick }></cta-button>
            </div>
        `
    }
}

customElements.define('manager-lobby', ManagerLobby)
