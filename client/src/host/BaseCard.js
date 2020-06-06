import { LitElement, html, css} from 'lit-element'

let host = 'http://localhost:9615'

class BaseCard extends LitElement {
    static get properties() {
        return {
            role: { type: String },
            selected: { type: Boolean }
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

            .selected {
                width: 100px;
                height: 137px;
                z-index: 8;
                position: absolute;
            }
    
        `
    }

    constructor() {
        super()
        this.role = null
        this.selected = false
    }

    handleClick(event) {
        this.dispatchEvent(new Event('clicked'))
    }

    render() {
        return html`
            <img @click=${ this.handleClick } src=${ `${ host }/WerewolfImages/Werewolf/${ this.role || 'back' }.png` }></img>
            ${ (this.selected) ? html`<img class='selected' src='${ host }/WerewolfImages/Werewolf/dead.png'></img>` : ''}
        `
    }
}

customElements.define('base-card', BaseCard)
