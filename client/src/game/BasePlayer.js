import { LitElement, html, css} from 'lit-element'
import './BaseCard'

let descriptions = {
    werewolf: 'Look for other Werewolves',
    minion: 'Look for the Werewolves',
    mason: 'Look for other Masons',
    seer: 'Look at another player\'s card or two center cards',
    robber: 'Swap your card with another player\'s card',
    troublemaker: 'Swap two other player\'s cards',
    drunk: 'Swap your card with one of the center cards',
    insomniac: 'Look at your card at the end of the night phase',
    villager: 'Listen carefully',
    tanner: 'Don\'t die... or well... do die',
    blank: ''
}

class BasePlayer extends LitElement {
    static get properties() {
        return {
            name: { type: String },
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

        .nameLabel {
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
        this.name = null
        this.role = 'back'
        this.onClick = null
    }

    set onClick(onClick) {
        let player = this.shadowRoot.getElementById('basePlayer')
        if(player) player.onClick = onClick
    }

    render() {
        return html`
            <div id='basePlayer'>
                <div class='cardWrapper'>
                    <base-card role=${ this.role }></base-card>
                </div>
                <div class='nameLabel'>${ this.name }</div>
            </div>
        `
    }
}

customElements.define('base-player', BasePlayer)
