import { LitElement, html, css} from 'lit-element'

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
    discussion: 'Discuss the night phase',
    blank: ''
}

class DescriptionBox extends LitElement {
    static get properties() {
        return {
            role: { type: String }
        }
    }

    static get styles() {
        return css`
        :host {
            display: block;
            height: 50%;
            width: 100%;
            border-width: 1px;
            border-color: #000000;
            border-top-style: solid;
            border-right-style: solid;
            box-sizing: border-box;
            padding-top: 8%;
        }
        `
    }

    constructor() {
        super()
        this.role = null
    }

    render() {
        return html`
            <div>${ descriptions[this.role || 'blank'] }</div>
        `
    }
}

customElements.define('description-box', DescriptionBox)
