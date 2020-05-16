import { html } from 'lit-element'
import '../components/CTAButton'
import BaseLobby from '../components/BaseLobby'

class ManagerLobby extends BaseLobby {

    constructor() {
        super()
        this.startCallback = null
    }

    handleClick(event) {
        if (this.startCallback) this.startCallback()
    }

    render() {
        return html`
            <div class='lobby'>
                <name-list id='lobby-names'></name-list>
                <cta-button text='START GAME' @click=${ this.handleClick }></cta-button>
            </div>
        `
    }
}

customElements.define('manager-lobby', ManagerLobby)
