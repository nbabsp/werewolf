import { LitElement, html, css} from 'lit-element'

let host = 'http://localhost:9615'

class BaseCard extends LitElement {
    static get properties() {
        return {
            role: { type: String }
        }
    }

    static get styles() {
        return css`
            img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: contain;
                cursor: pointer;
            }
        `
    }

    constructor() {
        super()
        this.role = 'back'
    }

    render() {
        return html`
            <img src=${ `${ host }/WerewolfImages/Werewolf/${ this.role || 'back' }.png` }></img>
        `
    }
}

customElements.define('base-card', BaseCard)
