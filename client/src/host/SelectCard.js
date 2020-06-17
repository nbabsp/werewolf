import { LitElement, html, css} from 'lit-element'
import StaticRequestor from '../common/StaticRequestor'

class SelectCard extends LitElement {
    static get properties() {
        return {
            id: { type: String },
            role: { type: String },
            selected: { type: Boolean }
        }
    }

    static get styles() {
        return css`
            .wrapper {
                position: relative;
                display: inline-block;
                margin: auto;
                object-fit: contain;
                cursor: pointer;
                margin: 10px;
                height: 137px;
                width: 100px;
            }

            img {
                position: absolute;
                height: 100%;
                width: 100%;
                z-index: 1;
            }

            .selected {
                position: absolute;
                height: 100$;
                width: 100%;
                z-index: 8;
            }
        `
    }

    constructor() {
        super()
        this.id = null
        this.role = null
        this.selected = false
    }

    handleClick(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: {id: this.id, role: this.role} }))
    }

    render() {
        return html`
            <div class='wrapper' @click=${ this.handleClick }>
                <img src=${ `${ StaticRequestor.basePath }/WerewolfImages/Werewolf/${ this.role || 'back' }.png` }></img>
                ${ (this.selected) ? html`<img class='selected' style='opacity:0.9' src='${ StaticRequestor.basePath }/WerewolfImages/Werewolf/check.png'></img>` : ''}
            </div>
        `
    }
}

customElements.define('select-card', SelectCard)
