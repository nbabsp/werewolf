import { LitElement, html, css} from 'lit-element'

let descriptions = {
    werewolf: 'Look for other Werewolves',
    loneWerewolf: 'Look at a center card',
    minion: 'Look for the Werewolves',
    mason: 'Look for other Masons',
    seer: 'Look at another player\'s card or two center cards',
    robber: 'Swap your card with another player\'s card',
    troublemaker: 'Swap two other player\'s cards',
    drunk: 'Swap your card with one of the center cards',
    insomniac: 'Look at your card at the end of the night phase',
    villager: 'Listen carefully',
    hunter: 'Do nothing at night. If you die, who ever you point at also dies.',
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
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50%;
            width: 100%;
            border-width: 1px;
            border-color: #000000;
            border-top-style: solid;
            box-sizing: border-box;
            font-size: clamp(12px, 3.8vw, 20px);
            line-height: clamp(10px, 3.8vw, 20px);
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
