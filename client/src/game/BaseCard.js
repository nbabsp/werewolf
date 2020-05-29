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
                margin: auto;
                height: 137px;
                width: 100px;
                object-fit: contain;
                cursor: pointer;
                z-index: 1;
            }
        `
    }

    constructor() {
        super()
        this.role = null
    }

    handleClick(event) {
        this.dispatchEvent(new Event('clicked'))
    }

    render() {
        return html`
            <img @click=${ this.handleClick } src=${ `${ host }/WerewolfImages/Werewolf/${ this.role || 'back' }.png` }></img>
        `
    }
}

customElements.define('base-card', BaseCard)
